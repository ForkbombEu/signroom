import { z } from 'zod';

//

export const CertificateSchema = z.object({
	value: z.string(),
	algorithm: z.string()
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
