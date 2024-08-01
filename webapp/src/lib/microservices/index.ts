export function getRandomMicroservicePort() {
	const MIN_PORT = 33000;
	const MAX_PORT = 65000;
	return MIN_PORT + Math.floor(Math.random() * (MAX_PORT - MIN_PORT));
}
