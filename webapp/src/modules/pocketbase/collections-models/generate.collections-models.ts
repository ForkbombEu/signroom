import PocketBase from 'pocketbase';
import fs from 'fs';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import prettier from 'prettier';
import { formatCode, GENERATED, initAdminPocketbase, logCodegenResult } from '@/utils/codegen';

//

const pb = await initAdminPocketbase();
const models = await pb.collections.getFullList();
const code = `export default ${JSON.stringify(models, null, 2)} as const`;
const formattedCode = await formatCode(code);
const filePath = path.resolve(import.meta.dirname, `collections-models.${GENERATED}.ts`);
fs.writeFileSync(filePath, formattedCode);
logCodegenResult('collections models', filePath);
