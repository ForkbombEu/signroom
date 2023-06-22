import PocketBase from 'pocketbase';
import fs from 'fs';
import 'dotenv/config';

const { PB_ADMIN_USER, PB_ADMIN_PASS, PUBLIC_POCKETBASE_URL } = process.env;
const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

await pb.admins.authWithPassword(PB_ADMIN_USER, PB_ADMIN_PASS);

// after the above you can also access the auth data from the authStore
const getSchema = async () => {
	return JSON.stringify(await pb.collections.getFullList(), null, 4);
};

fs.writeFileSync('./src/lib/schema/pb_schema.json', await getSchema());
