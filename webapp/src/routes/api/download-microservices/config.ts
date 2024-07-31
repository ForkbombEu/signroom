export const config = {
	folder_names: {
		custom_code: 'custom_code',
		public: 'public',
		microservices: {
			authz_server: 'authz_server',
			credential_issuer: 'credential_issuer',
			relying_party: 'relying_party'
		},
		well_known: '.well_known'
	},
	well_known_names: {
		authz_server: 'authz_server',
		credential_issuer: 'openid-credential-issuer',
		relying_party: 'openid-relying-party'
	},
	file_extensions: {
		zen: 'zen',
		keys: 'keys.json',
		metadata: 'metadata.json'
	},
	json: {
		tab_size: 4
	}
} as const;
