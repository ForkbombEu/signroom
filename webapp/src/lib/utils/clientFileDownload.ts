export function downloadBlob(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	URL.revokeObjectURL(url);
}

export async function imageSrcToBlob(src: string) {
	const img = new Image();
	img.src = src;

	const responsePromise = await fetch(img.src);
	const blob = await responsePromise.blob();

	return blob;
}
