import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));

const mainPage = path.join(dir, 'main')

export {
    mainPage
}
