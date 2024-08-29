// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import AdmZip from 'adm-zip';
import { cleanUrl, createSlug } from './strings';
import type {
	AuthorizationServersResponse,
	IssuersResponse,
	RelyingPartiesResponse
} from '$lib/pocketbase/types';

type dockerFiles = {
	dockerCompose: string;
	caddyfile: JSON;
};

enum msTypes {
	authz_server,
	credential_issuer,
	relying_party
}

export function startDockerCompose(): dockerFiles {
	return {
		dockerCompose: `
services:
  # this define caddy server, everythhing is handled by the Caddyfile
  caddy:
    container_name: caddy
    image: caddy:alpine
    restart: unless-stopped
    ports:
      - 80:80
      - 443:443
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./site:/srv
      - caddy_data:/data
      - caddy_config:/config
`,
		caddyfile: {}
	}
}

export function endDockerCompose(zip: AdmZip, dockerComposeFiles: dockerFiles): void {
	dockerComposeFiles.dockerCompose += `
volumes:
  caddy_data:
  caddy_config:
`;
	let caddyfileString = '';
	for (const [key, value] of Object.entries(dockerComposeFiles.caddyfile)) {
		caddyfileString += `${key} {${value}}\n`;
	}
	zip.addFile('docker-compose.yaml', Buffer.from(dockerComposeFiles.dockerCompose, 'utf-8'));
	zip.addFile('Caddyfile', Buffer.from(caddyfileString, 'utf-8'));
}

export function setupDockerCompose(
	dockerComposeFiles: dockerFiles,
	ms: AuthorizationServersResponse | IssuersResponse | RelyingPartiesResponse,
	msType: msTypes
): void {
	const msName = createSlug(ms.name);
	const msUrl = cleanUrl(ms.endpoint);
	const dockerCompose = dockerComposeTemplate(msName, msUrl, msType);
	dockerComposeFiles.dockerCompose += dockerCompose;
	const [protocol, _, host] = msUrl.split('/');
	const msBaseUrl = protocol + '//' + host;
	if (!dockerComposeFiles.caddyfile[msBaseUrl])
		dockerComposeFiles.caddyfile[msBaseUrl] = caddyfileTemplate(msName, msType);
	else
		dockerComposeFiles.caddyfile[msBaseUrl] += caddyfileTemplate(msName, msType);
}

function dockerComposeTemplate(msName: string, msUrl: string, msType: msTypes): string {
	return `
  ${msName}:
      container_name: ${msName}
      image: ghcr.io/forkbombeu/didroom_microservices:latest
      environment:
        MS_URL: ${msUrl}
        MS_NAME: ${msName}
        ZENCODE_DIR: /app/${msType}
        PUBLIC_DIR: /app/public/${msType}
        BASEPATH: /${msType}
      volumes:
        - type: bind
          source: ./${msName}/${msType}
          target: /app/${msType}
        - type: bind
          source: ./${msName}/public
          target: /app/public
`;
}

function caddyfileTemplate(msName: string, msType: msTypes): string {
	return `
	reverse_proxy /${msType}/* ${msName}:3000
`;
}