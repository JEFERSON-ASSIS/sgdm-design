// @vitest-environment node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { CHART_AXIS_COLOR, CHART_CURSOR_COLOR, cn } from '../src';

const require = createRequire(import.meta.url);
const raiz = join(__dirname, '..');
const tokens = readFileSync(join(raiz, 'src/styles/tokens.css'), 'utf8');
const preset = require('../tailwind-preset.cjs');

function canais(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function valor(nome: string): string | undefined {
  return new RegExp(`--sd-${nome}:\\s*([^;]+);`).exec(tokens)?.[1]?.trim();
}

async function gerar(classes: string): Promise<string> {
  const resultado = await postcss([
    tailwindcss({
      presets: [preset],
      content: [{ raw: `<div class="${classes}"></div>`, extension: 'html' }],
      corePlugins: { preflight: false },
    }),
  ]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
  return resultado.css;
}

describe('tokens da v2, lote 4 (B22–B30)', () => {
  it('B22. sucesso sobre fundo escuro e larguras do login e da página pública', async () => {
    expect(valor('color-on-dark-success')).toBe(canais('#34d399'));
    expect(valor('size-form')).toBe('448px');
    expect(valor('size-public-sm')).toBe('512px');
    expect(valor('size-public-md')).toBe('768px');
    const css = await gerar('text-on-dark-success bg-on-dark-success/10 max-w-form max-w-public-sm max-w-public-md');
    expect(css).toContain('rgb(var(--sd-color-on-dark-success) / 0.1)');
    expect(css).toContain('max-width: var(--sd-size-form)');
    expect(css).toContain('max-width: var(--sd-size-public-md)');
    expect(cn('max-w-form', 'max-w-public-md')).toBe('max-w-public-md');
  });

  it('B28. cores de eixo e cursor do gráfico batem com os tokens', () => {
    expect(valor('color-text-muted')).toBe(canais(CHART_AXIS_COLOR));
    expect(valor('color-surface-muted')).toBe(canais(CHART_CURSOR_COLOR));
  });

  it('B30. papel, tinta e borda de impressão', async () => {
    expect(valor('color-print-ink')).toBe(canais('#000000'));
    expect(valor('color-print-paper')).toBe(canais('#ffffff'));
    expect(valor('color-print-border')).toBe(canais('#999999'));
    const css = await gerar('border-print-border text-print-ink print:bg-print-paper print:hidden');
    expect(css).toContain('rgb(var(--sd-color-print-border)');
    expect(css).toMatch(/@media print \{[^}]*\.print\\:hidden/);
  });
});
