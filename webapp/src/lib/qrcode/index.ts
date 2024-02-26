import type { ServicesRecord } from '$lib/pocketbase/types';
//@ts-ignore
import { Slangroom } from '@slangroom/core';
//@ts-ignore
import { qrcode } from '@slangroom/qrcode';

const scriptCreate = `Rule unknown ignore

Given I send text 'text' and create qr code and output into 'qrcode'
Given I have a 'string' named 'qrcode'
Then print data
`;
const slangroom = new Slangroom(qrcode);

export const generateQr = async (service: ServicesRecord) => {
	const qr = await slangroom.execute(`
Rule unknown ignore

Given I send text 'text' and create qr code and output into 'qrcode'
Given I have a 'string' named 'qrcode'
Then print data
`, {
		data: {
			text:JSON.stringify(service),
		}
	});
    console.log(qr);
    return qr
};
