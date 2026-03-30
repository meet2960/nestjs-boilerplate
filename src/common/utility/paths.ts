import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// assuming this file lives under src/utils
export const DIST_PROJECT_ROOT = path.resolve(__dirname, '../../'); // dist
export const TOP_LEVEL_PROJECT_ROOT = path.resolve(__dirname, '../../../'); // top level project directory
