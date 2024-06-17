import type { TemplatesResponse } from '$lib/pocketbase/types';
import type AdmZip from 'adm-zip';
import { getZipRootFolder } from './utils/zip';

//

export type WellKnown = Record<string, unknown> & { readonly brand: unique symbol };

//

const microservicesFolderNames = ['authz_server', 'credential_issuer', 'relying_party'] as const;
type MicroserviceFolder = (typeof microservicesFolderNames)[number];

export function getFoldersToDelete(microserviceToKeep: MicroserviceFolder): string[] {
	const ROOT_NAME = 'DIDroom_microservices-main';
	const PUBLIC_FOLDER = 'public';

	return microservicesFolderNames
		.filter((name) => name != microserviceToKeep)
		.flatMap((name) => [`${ROOT_NAME}/${name}`, `${ROOT_NAME}/${PUBLIC_FOLDER}/${name}`]);
}

//

export function getCredentialCustomCodePath(
	zip: AdmZip,
	microservice: MicroserviceFolder,
	credential_type_name: string
) {
	const CUSTOM_CODE_FOLDER = 'custom_code';
	const zipRoot = getZipRootFolder(zip);
	return `${zipRoot}${microservice}/${CUSTOM_CODE_FOLDER}/${credential_type_name}`;
}

export function addCustomCode(
	zip: AdmZip,
	microservice: MicroserviceFolder,
	credential_type_name: string,
	template: TemplatesResponse
) {
	const { zencode_data, zencode_script } = template;
	const basePath = getCredentialCustomCodePath(zip, microservice, credential_type_name);
	zip.addFile(`${basePath}.zen`, Buffer.from(zencode_script));
	zip.addFile(`${basePath}.keys.json`, Buffer.from(zencode_data));
	zip.addFile(`${basePath}.metadata.json`, Buffer.from(JSON.stringify({ hidden: true })));
}
