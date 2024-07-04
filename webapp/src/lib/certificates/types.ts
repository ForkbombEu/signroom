import type { ValueOf } from '$lib/utils/types';
import { z } from 'zod';

//

const algorithmNames = ['ECDSA', 'Ed25519', 'RSASSA-PKCS1-v1_5', '1.2.840.113549.1.1.10'] as const;

// TODO: check all possible RSA identifier that can be used
export const algorithmIdentifiers = {
	'1.2.840.10045.3.1.7': algorithmNames[0],
	'1.3.101.112': algorithmNames[1],
	'1.2.840.113549.1.1.1': algorithmNames[2],
	'1.2.840.113549.1.1.10': algorithmNames[3]
} as const;

export type AlgorithmName = ValueOf<typeof algorithmIdentifiers>;
export type AlgorithmId = keyof typeof algorithmIdentifiers;

//

export const CertificateSchema = z.object({
	value: z.string(),
	algorithm: z.enum(algorithmNames)
});
export type Certificate = z.infer<typeof CertificateSchema>;

export const CertificateKeySchema = z.object({
	value: z.string(),
	zenroomValue: z.string().optional()
});
export type CertificateKey = z.infer<typeof CertificateKeySchema>;

export const CertificateDataSchema = z.object({
	certificate: CertificateSchema,
	key: CertificateKeySchema
});
export type CertificateData = z.infer<typeof CertificateDataSchema>;

export const CertificatesSchema = z.record(CertificateDataSchema);
export type Certificates = z.infer<typeof CertificatesSchema>;
