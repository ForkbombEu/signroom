// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { z } from 'zod';

//

export const rsaAlgorithmNames = ['RSASSA-PKCS1-v1_5', 'RSA-PSS'] as const;
export const ecAlgorithmNames = ['ECDSA', 'Ed25519'] as const;
export const algorithmNames = [ ...rsaAlgorithmNames, ...ecAlgorithmNames ] as const;

// TODO: check all possible RSA identifier that can be used
export const algorithmIdentifiers = {
	[ecAlgorithmNames[0]]: [ '1.2.840.10045.2.1', '1.2.840.10045.3.1.7' ],
	[ecAlgorithmNames[1]]: [ '1.3.101.112' ],
	[rsaAlgorithmNames[0]]: [ '1.2.840.113549.1.1.1' ],
	[rsaAlgorithmNames[1]]: [ '1.2.840.113549.1.1.10' ]
} as const;

export const algorithmSupportedCurves = {
	[ecAlgorithmNames[0]]: 'P-256'
} as const;

export type AlgorithmName = keyof typeof algorithmIdentifiers;

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
