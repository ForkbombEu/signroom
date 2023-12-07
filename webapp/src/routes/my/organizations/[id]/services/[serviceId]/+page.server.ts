import type { Actions } from './$types';
import AdmZip from 'adm-zip';

const didroom_microservices_url =
	'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';

export const actions: Actions = {
	downloadCredentialIssuer: async ({ fetch }) => {
		console.log('running');
		// const res = await fetch(didroom_microservices_url);
		// // const unzipStream = Parse();

		// if (!res.body) return;

		modifyAndRezip(fetch);

		// unzipStream(res.body)

		// res.body.pipeThrough()
		// .on('entry', entry => {
		//   const fileName = entry.path;
		//   const type = entry.type; // 'Directory' or 'File'

		//   if (type === 'File') {
		//     // Here, you can decide what to do with the extracted files
		//     // For example, you can save them, or process them in memory
		//     entry.autodrain(); // Use this to discard file contents
		//   } else {
		//     entry.autodrain();
		//   }
		// })
		// .on('error', err => console.error('Error unzipping:', err))
		// .on('finish', () => console.log('Unzipping completed.'));
		// console.log(zip);
	}
};

//

async function modifyAndRezip(fetchFn = fetch) {
	try {
		const DIDROOM_MICROSERVICES_URL =
			'https://github.com/ForkbombEu/DIDroom_microservices/archive/refs/heads/main.zip';
		const CREDENTIAL_ISSUER_FILE_NAME = 'openid-credential-issuer';

		const response = await fetchFn(DIDROOM_MICROSERVICES_URL);
		const buffer = Buffer.from(await response.arrayBuffer());
		const zip = new AdmZip(buffer);

		const credentialIssuerFile = zip
			.getEntries()
			.find((entry) => entry.name === CREDENTIAL_ISSUER_FILE_NAME);
		if (!credentialIssuerFile) return undefined;

		const credentialIssuerFileJSON = JSON.parse(zip.readAsText(credentialIssuerFile.entryName));
		console.log(zip.readAsText(credentialIssuerFile.entryName));
	} catch (e) {
		console.log(e);
	}

	// zip.updateFile(credentialIssuerFile.entryName, )

	// const zip = body.getReader()
	// for await (const entry of zip) {
	//   const fileName = entry.path;
	//   const type = entry.type; // 'Directory' or 'File'
	//   const size = entry.vars.uncompressedSize; // There is also compressedSize;
	//   if (fileName === "this IS the file I'm looking for") {
	//     entry.pipe(fs.createWriteStream('output/path'));
	//   } else {
	//     entry.autodrain();
	//   }
	// const directory = await unzipper.Open.buffer(await response.buffer());

	// // Prepare to re-zip
	// // const output = fs.createWriteStream('path/to/modified.zip');
	// const archive = archiver('zip', { zlib: { level: 9 } });

	// archive.pipe(output);

	// // Step 2 & 3: Iterate through files and re-zip
	// for (const file of directory.files) {
	//   if (file.type === 'File') {
	//     const content = await file.buffer();
	//     let modifiedContent = content;

	//     // Modify the specific file as needed
	//     if (file.path === 'path/to/the/file/to/edit.txt') {
	//       modifiedContent = editFile(content); // Your custom edit function
	//     }

	//     // Append file to the archive
	//     archive.append(modifiedContent, { name: file.path });
	//   }
	// }

	// // Finalize the archive
	// await archive.finalize();

	// Step 4: Handle the newly created zip (e.g., serve it, save it, etc.)
}
