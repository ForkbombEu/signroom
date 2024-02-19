import type { ServicesRecord, ServicesResponse } from '$lib/pocketbase/types';
import { zencode_exec } from 'zenroom';
//@ts-ignore
import { Slangroom } from '@slangroom/core';
//@ts-ignore
import { qrcode } from '@slangroom/qrcode';
import type { Service } from '../../routes/my/organizations/[id]/services/[serviceId]/+page';

const slangroom = new Slangroom(qrcode);

export const generateQr = async (service: Service) => {
	const qr = await slangroom.execute(
		`
Rule unknown ignore

Given I send text 'text' and create qr code and output into 'qrcode'
Given I have a 'string' named 'qrcode'
Then print data
`,
		{
			data: {
				text: JSON.stringify({
					id: service.id,
					authorization_server: service.expand?.authorization_server.endpoint,
					issuer: service.expand?.issuer.endpoint,
					relying_party: service.expand?.relying_party.endpoint
				})
			}
		}
	);
	return qr;
};
