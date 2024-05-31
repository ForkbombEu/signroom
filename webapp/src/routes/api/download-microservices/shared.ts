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
