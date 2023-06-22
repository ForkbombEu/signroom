import { ClientResponseError } from 'pocketbase';

export function formatUnknownException(
	e: unknown,
	fallbackStatus: number,
	fallbackMessage = 'Unknown error'
) {
	let status = fallbackStatus;
	let message = fallbackMessage;
	if (e instanceof ClientResponseError) {
		status = e.status;
		message = e.message;
	} else if (e instanceof Error) {
		message = e.message;
	} else {
		message = JSON.stringify(e);
	}
	return { status, message };
}
