import { execa } from 'execa';

export const newkey = async () => {
	const ssl = await execa(
		'openssl',
		'req -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -keyout chiave -subj /C=/ST=/L=/O=/OU=/CN='.split(
			' '
		)
	);
	const cert = ssl.stdout;
	const { stdout: pem } = await execa('cat', ['chiave']);

	return {
		cert: cert.split('\n').slice(1, -1).join('\n'),
		pem
	};
};

export const digest = async (raw) => {
	const { stdout: dgst } = await execa('openssl', 'dgst -sha256 -sign chiave -hex'.split(' '), {
		input: Buffer.from(raw, 'base64').toString()
	});
	const hexOutput = dgst.replace("SHA2-256(stdin)= ", "");
	return Buffer.from(hexOutput, 'hex').toString('base64');
};
