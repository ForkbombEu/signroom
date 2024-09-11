// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { cleanUrl, createSlug } from './strings';
import type {
	AuthorizationServersResponse,
	IssuersResponse,
	RelyingPartiesResponse
} from '$lib/pocketbase/types';

enum msTypes {
	authz_server,
	credential_issuer,
	relying_party
}

export function setupDockerCompose(
	dockerComposeFiles: { dockerCompose: string; caddyfile: string },
	ms: AuthorizationServersResponse | IssuersResponse | RelyingPartiesResponse,
	msType: msTypes
): void {
	const msName = createSlug(ms.name);
	const msUrl = cleanUrl(ms.endpoint);
	const dockerCompose = dockerComposeTemplate(msName, msUrl, msType);
	dockerComposeFiles.dockerCompose += dockerCompose;
	const [protocol, _, host] = msUrl.split('/');
	const msBaseUrl = protocol + '//' + host;
	const caddyfile = caddyfileTemplate(msName, msBaseUrl, msType);
	dockerComposeFiles.caddyfile += caddyfile;
}

export function startDockerCompose(): string {
	return `
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
`;
}

export function endDockerCompose(): string {
	return `
volumes:
  caddy_data:
  caddy_config:
`;
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
      volumes:
        - type: bind
          source: ./${msName}/${msType}
          target: /app/${msType}
        - type: bind
          source: ./${msName}/public
          target: /app/public
`;
}

function caddyfileTemplate(msName: string, msBaseUrl: string, msType: msTypes): string {
	return `
${msBaseUrl} {
  handle_path /${msType}/* {
    uri strip_prefix /${msType}
    reverse_proxy ${msName}:3000
  }
  reverse_proxy ${msName}:3000
}}
`;
}
