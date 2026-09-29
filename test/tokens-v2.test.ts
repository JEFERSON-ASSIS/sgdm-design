// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import {
  BREAKPOINT_LG,
  BREAKPOINTS,
  CHART_BAR_COLOR,
  CHART_COLOR_VARS,
  CHART_EXTRA_COLOR,
  CHART_FALLBACK_COLOR,
  CHART_GRID_COLOR,
  DURATION_MS,
  EDITOR_FONT_SIZES,
  MEDIA_QUERY_LG,
  PRINT_FONT_SIZES,
  PROFILES,
  Z_INDEX,
  cn,
} from '../src';
import { PRESET_SCALES } from '../src/cn';

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

const DEGRAUS = ['', '-soft', '-tint', '-border', '-strong', '-hover', '-text', '-deep'];

describe('A1–A4. Tons e famílias', () => {
  it('A1. success é esmeralda (50 a 900)', () => {
    const esmeralda = ['#10b981', '#ecfdf5', '#d1fae5', '#a7f3d0', '#059669', '#047857', '#065f46', '#064e3b'];
    DEGRAUS.forEach((d, i) => expect(valor(`color-success${d}`), d).toBe(canais(esmeralda[i]!)));
  });

  it('A2. info é azul e o ciano continua como família', () => {
    expect(valor('color-info')).toBe(canais('#3b82f6'));
    expect(valor('color-info-soft')).toBe(canais('#eff6ff'));
    expect(valor('color-info-border')).toBe(canais('#bfdbfe'));
    expect(valor('color-info-deep')).toBe(canais('#1e3a8a'));
    expect(valor('color-cyan')).toBe(canais('#06b6d4'));
  });

  it('A3. tom 900 (-deep) para warning, success, info, danger e violet', () => {
    expect(valor('color-warning-deep')).toBe(canais('#78350f'));
    expect(valor('color-success-deep')).toBe(canais('#064e3b'));
    expect(valor('color-info-deep')).toBe(canais('#1e3a8a'));
    expect(valor('color-danger-deep')).toBe(canais('#7f1d1d'));
    expect(valor('color-violet-deep')).toBe(canais('#4c1d95'));
  });

  it('A4. toda família tem os oito degraus', () => {
    const familias = ['success', 'warning', 'danger', 'info', 'cyan', 'indigo', 'rose', 'violet', 'purple', 'orange', 'teal', 'sky'];
    for (const f of familias) for (const d of DEGRAUS) expect(valor(`color-${f}${d}`), `${f}${d}`).toMatch(/^\d+ \d+ \d+$/);
    expect(valor('color-indigo-strong')).toBe(canais('#4f46e5'));
    expect(valor('color-rose-text')).toBe(canais('#9f1239'));
    expect(valor('color-purple-tint')).toBe(canais('#f3e8ff'));
    expect(valor('color-orange-strong')).toBe(canais('#ea580c'));
    expect(valor('color-teal-soft')).toBe(canais('#f0fdfa'));
    expect(valor('color-sky-strong')).toBe(canais('#0284c7'));
  });

  it('A4. o preset expõe as famílias e o danger-hover da v1', async () => {
    const css = await gerar('bg-indigo-soft text-rose-deep border-teal-border bg-sky/50 bg-danger-hover text-warning-deep');
    expect(css).toContain('rgb(var(--sd-color-indigo-soft)');
    expect(css).toContain('rgb(var(--sd-color-rose-deep)');
    expect(css).toContain('rgb(var(--sd-color-teal-border)');
    expect(css).toContain('rgb(var(--sd-color-sky) / 0.5)');
    expect(css).toContain('rgb(var(--sd-color-danger-hover)');
    expect(css).toContain('rgb(var(--sd-color-warning-deep)');
  });
});

describe('A5. Tema por perfil', () => {
  it('cada perfil tem destaque, fundo, borda, título e sombra', () => {
    for (const p of PROFILES) {
      for (const d of ['', '-soft', '-tint', '-border', '-icon', '-text', '-title']) {
        expect(valor(`color-profile-${p}${d}`), `${p}${d}`).toBeDefined();
      }
      expect(valor(`shadow-profile-${p}`)).toContain(`--sd-color-profile-${p}-border`);
    }
    expect(valor('color-profile-rh')).toBe('var(--sd-color-indigo-strong)');
    expect(valor('color-profile-secretaria-soft')).toBe('var(--sd-color-info-soft)');
    expect(valor('color-profile-prefeito-border')).toBe('var(--sd-color-violet-border)');
    expect(valor('color-profile-gabinete')).toBe('var(--sd-color-orange-strong)');
    expect(valor('color-profile-plataforma-title')).toBe(canais('#4c0519'));
  });

  it('o preset gera bg-profile-* e shadow-profile-*', async () => {
    const css = await gerar('bg-profile-rh-soft text-profile-prefeito-title shadow-profile-gabinete');
    expect(css).toContain('rgb(var(--sd-color-profile-rh-soft)');
    expect(css).toContain('rgb(var(--sd-color-profile-prefeito-title)');
    expect(css).toContain('var(--sd-shadow-profile-gabinete)');
  });
});

describe('A6–A7. Neutros e gráficos', () => {
  it('A6. borda forte, skeleton, overlay escuro e texto sobre fundo escuro', () => {
    expect(valor('color-border-strong')).toBe(canais('#cbd5e1'));
    expect(valor('color-skeleton')).toBe(canais('#e2e8f0'));
    expect(valor('color-overlay')).toBe(canais('#000000'));
    expect(valor('color-overlay-strong')).toBe(canais('#0f172a'));
    expect(valor('color-on-dark-label')).toBe(canais('#cbd5e1'));
    expect(valor('color-on-dark-error')).toBe(canais('#f87171'));
    expect(valor('color-on-dark-link')).toBe(canais('#60a5fa'));
  });

  it('A6. o preset gera bg-overlay-strong/70 e text-on-dark-*', async () => {
    const css = await gerar('bg-overlay-strong/70 bg-overlay/40 text-on-dark-label text-on-dark-error border-border-strong bg-skeleton');
    expect(css).toContain('rgb(var(--sd-color-overlay-strong) / 0.7)');
    expect(css).toContain('rgb(var(--sd-color-overlay) / 0.4)');
    expect(css).toContain('rgb(var(--sd-color-on-dark-label)');
    expect(css).toContain('rgb(var(--sd-color-border-strong)');
    expect(css).toContain('rgb(var(--sd-color-skeleton)');
  });

  it('A7. sky, fallback, grade e barra batem com as constantes em hex', () => {
    expect(valor('color-chart-13')).toBe(canais(CHART_EXTRA_COLOR));
    expect(valor('color-chart-fallback')).toBe(canais(CHART_FALLBACK_COLOR));
    expect(valor('color-chart-grid')).toBe(canais(CHART_GRID_COLOR));
    expect(valor('color-chart-bar')).toBe(canais(CHART_BAR_COLOR));
    expect(CHART_EXTRA_COLOR).toBe('#0EA5E9');
    expect(CHART_COLOR_VARS).toHaveLength(13);
    expect(CHART_COLOR_VARS[12]).toBe('rgb(var(--sd-color-chart-13))');
  });
});

describe('A8–A10. Fonte, raio e sombra', () => {
  it('A8. 10px e 11px nomeados, escala do editor e da impressão', () => {
    expect(valor('font-size-2xs')).toBe('10px');
    expect(valor('font-size-xs2')).toBe('11px');
    for (const t of EDITOR_FONT_SIZES) expect(valor(`font-size-doc-${t.replace('pt', '')}`)).toBe(t);
    expect(valor('font-size-print-body')).toBe(PRINT_FONT_SIZES.body);
    expect(valor('font-size-print-table')).toBe(PRINT_FONT_SIZES.table);
  });

  it('A8. o preset gera text-2xs, text-xs2 e text-doc-*', async () => {
    const css = await gerar('text-2xs text-xs2 text-doc-14 text-print-table');
    expect(css).toContain('font-size: var(--sd-font-size-2xs)');
    expect(css).toContain('font-size: var(--sd-font-size-xs2)');
    expect(css).toContain('font-size: var(--sd-font-size-doc-14)');
    expect(css).toContain('font-size: var(--sd-font-size-print-table)');
  });

  it('A9. raios xs, marker, panel, callout e tile', () => {
    expect(valor('radius-xs')).toBe('4px');
    expect(valor('radius-marker')).toBe('2px');
    expect(valor('radius-panel')).toBe('12px');
    expect(valor('radius-callout')).toBe('12px');
    expect(valor('radius-tile')).toBe('12px');
    expect(valor('radius-tag')).toBe('6px');
  });

  it('A10. sombras brand-strong, inner e dropdown', () => {
    expect(valor('shadow-brand-strong')).toContain('rgb(30 58 138 / 0.5)');
    expect(valor('shadow-inner')).toMatch(/^inset /);
    expect(valor('shadow-dropdown')).toContain('0 20px 25px -5px');
  });
});

describe('A11–A13. Camadas, tempo e medidas', () => {
  it('A11. z-index em CSS e em JS são os mesmos, na ordem da escala', () => {
    for (const [nome, z] of Object.entries(Z_INDEX)) expect(valor(`z-${nome}`), nome).toBe(String(z));
    expect(Z_INDEX).toMatchObject({ dropdown: 20, sticky: 30, overlay: 40, modal: 50, toast: 60, tooltip: 100, progress: 110 });
  });

  it('A12. durações e easing', async () => {
    for (const [nome, ms] of Object.entries(DURATION_MS)) expect(valor(`duration-${nome}`), nome).toBe(`${ms}ms`);
    expect(valor('ease-standard')).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    const css = await gerar('transition duration-normal ease-standard z-modal');
    expect(css).toContain('transition-duration: var(--sd-duration-fast)');
    expect(css).toContain('transition-duration: var(--sd-duration-normal)');
    expect(css).toContain('transition-timing-function: var(--sd-ease-standard)');
    expect(css).toContain('z-index: var(--sd-z-modal)');
  });

  it('A13. medidas de layout', () => {
    expect(valor('size-sidebar')).toBe('256px');
    expect(valor('size-sidebar-collapsed')).toBe('72px');
    expect(valor('size-header')).toBe('56px');
    expect([valor('space-page-sm'), valor('space-page-md'), valor('space-page-lg')]).toEqual(['16px', '24px', '32px']);
    expect(valor('size-modal-md')).toBe('512px');
    expect(valor('size-modal-lg')).toBe('768px');
    expect(valor('size-tooltip')).toBe('288px');
    expect(valor('size-dropdown')).toBe('384px');
    expect(valor('size-editor-min')).toBe('420px');
    expect(valor('size-editor-frame-min')).toBe('480px');
    expect(valor('size-print-sheet')).toBe('820px');
    expect(valor('size-kanban-column-min')).toBe('280px');
    expect(valor('size-kanban-column-max')).toBe('320px');
  });

  it('A13. o breakpoint é o mesmo no CSS, no preset e no JS', () => {
    expect(valor('breakpoint-lg')).toBe(`${BREAKPOINT_LG}px`);
    expect(preset.theme.extend.screens.lg).toBe(`${BREAKPOINTS.lg}px`);
    expect(MEDIA_QUERY_LG).toBe('(min-width: 1024px)');
  });

  it('A13. o preset gera as classes de medida', async () => {
    const css = await gerar('w-sidebar w-sidebar-collapsed h-header p-page-md max-w-modal-lg w-tooltip min-h-editor max-w-print-sheet w-kanban-column');
    expect(css).toContain('width: var(--sd-size-sidebar)');
    expect(css).toContain('width: var(--sd-size-sidebar-collapsed)');
    expect(css).toContain('height: var(--sd-size-header)');
    expect(css).toContain('padding: var(--sd-space-page-md)');
    expect(css).toContain('max-width: var(--sd-size-modal-lg)');
    expect(css).toContain('min-height: var(--sd-size-editor-min)');
    expect(css).toContain('max-width: var(--sd-size-print-sheet)');
    expect(css).toMatch(/\.w-kanban-column \{[^}]*min-width: var\(--sd-size-kanban-column-min\)/);
  });
});

describe('coerência entre tokens.css, preset e cn', () => {
  it('toda var(--sd-*) usada no preset e nos próprios tokens existe', () => {
    const definidas = new Set([...tokens.matchAll(/(--sd-[\w-]+):/g)].map((m) => m[1]));
    const fontes = [readFileSync(join(raiz, 'tailwind-preset.cjs'), 'utf8'), tokens];
    const usadas = fontes.flatMap((f) => [...f.matchAll(/var\((--sd-[\w-]+)\)/g)].map((m) => m[1]!));
    // O preset monta nomes com template string; confere os montados também.
    const css = JSON.stringify(preset.theme.extend);
    usadas.push(...[...css.matchAll(/var\((--sd-[\w-]+)\)/g)].map((m) => m[1]!));
    expect(usadas.length).toBeGreaterThan(100);
    for (const u of usadas) expect(definidas.has(u), u).toBe(true);
  });

  it('as escalas que o cn conhece são as do preset', () => {
    const t = preset.theme.extend;
    const semDefault = (o: object) => Object.keys(o).filter((k) => k !== 'DEFAULT').sort();
    expect([...PRESET_SCALES['font-size']].sort()).toEqual(semDefault(t.fontSize));
    expect([...PRESET_SCALES.rounded].sort()).toEqual(semDefault(t.borderRadius));
    expect([...PRESET_SCALES.shadow].sort()).toEqual(semDefault(t.boxShadow));
    expect([...PRESET_SCALES.z].sort()).toEqual(semDefault(t.zIndex));
    expect([...PRESET_SCALES.duration].sort()).toEqual(semDefault(t.transitionDuration));
    expect([...PRESET_SCALES.ease].sort()).toEqual(semDefault(t.transitionTimingFunction));
    expect([...PRESET_SCALES.w].sort()).toEqual(semDefault(t.width));
    expect([...PRESET_SCALES.h].sort()).toEqual(semDefault(t.height));
    expect([...PRESET_SCALES['max-w']].sort()).toEqual(semDefault(t.maxWidth));
    expect([...PRESET_SCALES['min-h']].sort()).toEqual(semDefault(t.minHeight));
    expect([...PRESET_SCALES.p].sort()).toEqual(semDefault(t.padding));
  });

  it('cn resolve conflitos das escalas novas sem confundir tamanho com cor', () => {
    expect(cn('text-xs2', 'text-muted')).toBe('text-xs2 text-muted');
    expect(cn('text-doc-12', 'text-doc-14')).toBe('text-doc-14');
    expect(cn('shadow-card', 'shadow-modal')).toBe('shadow-modal');
    expect(cn('rounded-card', 'rounded-xs')).toBe('rounded-xs');
    expect(cn('z-dropdown', 'z-modal')).toBe('z-modal');
    expect(cn('w-sidebar', 'w-sidebar-collapsed')).toBe('w-sidebar-collapsed');
    expect(cn('p-page-sm', 'p-page-md')).toBe('p-page-md');
  });
});

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });
}

describe('componentes usam as escalas, não números soltos', () => {
  it('sem z-index, tamanho de fonte, raio, largura de layout ou duração fixos', () => {
    for (const arquivo of arquivos(join(raiz, 'src/components'))) {
      const fonte = readFileSync(arquivo, 'utf8');
      expect(fonte, arquivo).not.toMatch(/\bz-(?:\d|\[)/);
      expect(fonte, arquivo).not.toMatch(/\btext-\[\d/);
      expect(fonte, arquivo).not.toMatch(/\brounded-\[/);
      expect(fonte, arquivo).not.toMatch(/\bduration-(?:\d|\[)/);
      expect(fonte, arquivo).not.toMatch(/\b(?:max-)?w-(?:\[\d+px\]|64|72|96)\b/);
      expect(fonte, arquivo).not.toMatch(/\bmax-w-(?:lg|3xl)\b/);
      expect(fonte, arquivo).not.toMatch(/innerWidth\s*<\s*\d/);
    }
  });
});
