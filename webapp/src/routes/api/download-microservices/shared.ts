import type { TemplatesResponse } from '$lib/pocketbase/types';
import type AdmZip from 'adm-zip';

//

export const DEFAULT_LOCALE = 'en-US';

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

export function addCustomCode(
	zip: AdmZip,
	microservice: MicroserviceFolder,
	credential_type_name: string,
	template: TemplatesResponse
) {
	const { zencode_data, zencode_script } = template;
	const CUSTOM_CODE_FOLDER = 'custom_code';
	const basePath = `/${microservice}/${CUSTOM_CODE_FOLDER}/${credential_type_name}`;
	zip.addFile(`${basePath}.zen`, Buffer.from(zencode_script));
	zip.addFile(`${basePath}.data.json`, Buffer.from(zencode_data));
}
