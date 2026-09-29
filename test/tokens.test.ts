// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { CHART_COLORS } from '../src';

const require = createRequire(import.meta.url);
const raiz = join(__dirname, '..');
const tokens = readFileSync(join(raiz, 'src/styles/tokens.css'), 'utf8');

function hexParaCanais(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function valor(nome: string): string | undefined {
  return new RegExp(`--sd-${nome}:\\s*([^;]+);`).exec(tokens)?.[1]?.trim();
}

describe('tokens.css', () => {
  it.each([
    ['color-primary', '#1e40af'],
    ['color-primary-light', '#3b82f6'],
    ['color-secondary', '#7c3aed'],
    ['color-background', '#f1f5f9'],
    ['color-surface', '#ffffff'],
    ['color-sidebar', '#0f172a'],
    ['color-sidebar-hover', '#1e293b'],
    ['color-sidebar-active', '#2563eb'],
    ['color-text', '#0f172a'],
    ['color-text-muted', '#64748b'],
    ['color-border', '#e2e8f0'],
    ['color-success', '#10b981'],
    ['color-warning', '#f59e0b'],
    ['color-danger', '#ef4444'],
    ['color-info', '#3b82f6'],
    ['color-govbr', '#1351b4'],
  ])('--sd-%s vale %s (valor do SGDM)', (nome, hex) => {
    expect(valor(nome)).toBe(hexParaCanais(hex));
  });

  it('fontes, raios e sombras da especificação', () => {
    expect(valor('font-sans')).toMatch(/^'Inter'/);
    expect(valor('font-document')).toMatch(/^'Times New Roman'/);
    expect(valor('radius-card')).toBe('16px');
    expect(valor('radius-control')).toBe('8px');
    expect(valor('shadow-card')).toBe('0 1px 2px 0 rgb(0 0 0 / 0.05)');
    expect(valor('shadow-modal')).toContain('0 20px 25px -5px');
  });

  it('as 12 cores de gráfico batem com CHART_COLORS', () => {
    Object.values(CHART_COLORS).forEach((hex, i) => {
      expect(valor(`color-chart-${i + 1}`)).toBe(hexParaCanais(hex));
    });
  });

  it('não usa CDN', () => {
    expect(tokens).not.toMatch(/https?:\/\//);
  });
});

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });
}

describe('fronteira token/componente', () => {
  it('componentes não têm cor fixa (hex, rgb ou var solta)', () => {
    for (const arquivo of arquivos(join(raiz, 'src/components'))) {
      const fonte = readFileSync(arquivo, 'utf8');
      expect(fonte, arquivo).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(fonte, arquivo).not.toMatch(/-\[(?:var|rgb|#)/);
    }
  });

  it('components.css só usa cores do preset', () => {
    const css = readFileSync(join(raiz, 'src/styles/components.css'), 'utf8');
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\b(?:slate|blue|red|gray)-\d{2,3}\b/);
  });
});

describe('preset do Tailwind', () => {
  async function gerar(classes: string): Promise<string> {
    const preset = require('../tailwind-preset.cjs');
    const resultado = await postcss([
      tailwindcss({
        presets: [preset],
        content: [{ raw: `<div class="${classes}"></div>`, extension: 'html' }],
        corePlugins: { preflight: false },
      }),
    ]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
    return resultado.css;
  }

  it('cores, raios, sombras e fontes apontam para os tokens', async () => {
    const css = await gerar('bg-primary text-muted rounded-control rounded-card shadow-card font-document bg-primary/50');
    expect(css).toContain('rgb(var(--sd-color-primary) / var(--tw-bg-opacity, 1))');
    expect(css).toContain('rgb(var(--sd-color-text-muted)');
    expect(css).toContain('border-radius: var(--sd-radius-control)');
    expect(css).toContain('border-radius: var(--sd-radius-card)');
    expect(css).toContain('var(--sd-shadow-card)');
    expect(css).toContain('font-family: var(--sd-font-document)');
    expect(css).toContain('rgb(var(--sd-color-primary) / 0.5)');
  });

  it('injeta as classes de componente antes dos utilitários', async () => {
    const css = await gerar('btn-primary px-6 card stat-card input nav-item nav-item-active scrollbar-none');
    const btn = css.indexOf('.btn-primary {');
    const px6 = css.indexOf('.px-6 {');
    expect(btn).toBeGreaterThan(-1);
    expect(px6).toBeGreaterThan(btn);
    expect(css).toMatch(/\.stat-card \{[^}]*var\(--sd-radius-card\)/);
    expect(css).toContain('.scrollbar-none::-webkit-scrollbar');
    expect(css).not.toContain('@apply');
  });
});
