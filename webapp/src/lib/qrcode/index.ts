import qrcode from 'qrcode-generator';

export function generateQr(text: string, cellSize = 20) {
	const qr = qrcode(0, 'L');
	qr.addData(text);
	qr.make();
	return qr.createDataURL(cellSize);
}
