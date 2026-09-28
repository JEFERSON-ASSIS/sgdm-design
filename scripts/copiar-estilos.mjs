// Copia os estilos (tokens, componentes e fontes) para dist/ depois do tsup.
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'src', 'styles');
const destino = join(raiz, 'dist');

mkdirSync(destino, { recursive: true });
cpSync(join(origem, 'tokens.css'), join(destino, 'tokens.css'));
cpSync(join(origem, 'components.css'), join(destino, 'components.css'));
cpSync(join(origem, 'fonts'), join(destino, 'fonts'), { recursive: true });
console.log('estilos copiados para dist/');
