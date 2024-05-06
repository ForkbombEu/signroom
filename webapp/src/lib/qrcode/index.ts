import { Slangroom } from '@slangroom/core';
import { qrcode } from '@slangroom/qrcode';

const slangroom = new Slangroom(qrcode);

export const generateQr = async (text: string) => {
	const qr = await slangroom.execute(
		`
Rule unknown ignore

Given I send text 'text' and create qr code and output into 'qrcode'
Given I have a 'string' named 'qrcode'
Then print data
`,
		{ data: { text } }
	);
	return qr;
};
