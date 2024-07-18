import { getUnixTime } from 'date-fns';
import type { ExpirationMode, Expiration, ExpirationDuration, ExpirationDate } from './expiration';

//

export function expirationDataToTime(expirationData: Expiration): number {
	switch (expirationData.mode) {
		case 'date':
			return expirationDataToDate(expirationData);
		case 'duration':
			return expirationDataToDuration(expirationData);
	}
}

function expirationDataToDuration(expiration: ExpirationDuration): number {
	const DAY = 60 * 60 * 24;
	const MONTH = DAY * 30;
	const YEAR = MONTH * 12;
	return (
		expiration.duration.years * YEAR +
		expiration.duration.months * MONTH +
		expiration.duration.days * DAY
	);
}

function expirationDataToDate(expiration: ExpirationDate): number {
	return expiration.date;
}

//

export function unixNow() {
	return Math.floor(Date.now() / 1000);
}
