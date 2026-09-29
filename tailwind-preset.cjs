/**
 * @sgdm/design — preset do Tailwind
 *
 * Expõe os tokens de tokens.css como nomes do Tailwind (bg-primary,
 * rounded-control, shadow-card, font-document, z-modal, duration-fast,
 * w-sidebar…) e injeta as classes de components.css (.card, .btn-primary,
 * .input…) na camada "components".
 *
 * Nenhum valor visual mora aqui: tudo aponta para var(--sd-*). Quem muda o
 * visual é o tokens.css. A única exceção é screens.lg, porque media query não
 * lê variável CSS; o valor é o mesmo de --sd-breakpoint-lg e de BREAKPOINT_LG.
 */
const fs = require('node:fs');
const path = require('node:path');
const plugin = require('tailwindcss/plugin');

/** Cor com suporte a opacidade do Tailwind (bg-primary/80). */
const cor = (nome) => `rgb(var(--sd-color-${nome}) / <alpha-value>)`;

/** Os oito degraus de um tom (ver ESQUEMA DE NOMES em tokens.css). */
const DEGRAUS = ['soft', 'tint', 'border', 'strong', 'hover', 'text', 'deep'];
const tom = (nome) => ({
  DEFAULT: cor(nome),
  ...Object.fromEntries(DEGRAUS.map((d) => [d, cor(`${nome}-${d}`)])),
});

const FAMILIAS = ['cyan', 'indigo', 'rose', 'violet', 'purple', 'orange', 'teal', 'sky'];
const PERFIS = ['rh', 'secretaria', 'prefeito', 'gabinete', 'plataforma'];

const perfil = (nome) => ({
  DEFAULT: cor(`profile-${nome}`),
  ...Object.fromEntries(
    ['soft', 'tint', 'border', 'icon', 'text', 'title'].map((d) => [d, cor(`profile-${nome}-${d}`)]),
  ),
});

const chart = {
  ...Object.fromEntries(Array.from({ length: 13 }, (_, i) => [String(i + 1), cor(`chart-${i + 1}`)])),
  fallback: cor('chart-fallback'),
  grid: cor('chart-grid'),
  bar: cor('chart-bar'),
};

/** { nome: 'var(--sd-<prefixo>-nome)' } para uma lista de nomes. */
const vars = (prefixo, nomes) => Object.fromEntries(nomes.map((n) => [n, `var(--sd-${prefixo}-${n})`]));

const Z = ['raised', 'dropdown', 'sticky', 'overlay', 'modal', 'toast', 'tooltip', 'progress'];

/**
 * Lê components.css com o mesmo postcss que o Tailwind do projeto usa. No
 * repositório (catálogo, testes) vale o de src/styles; instalado, só existe o
 * de dist/.
 */
function lerComponentes() {
  const candidatos = [
    path.join(__dirname, 'src', 'styles', 'components.css'),
    path.join(__dirname, 'dist', 'components.css'),
  ];
  const arquivo = candidatos.find((c) => fs.existsSync(c));
  if (!arquivo) {
    throw new Error('@sgdm/design: components.css não encontrado. Rode "npm run build" no pacote.');
  }
  const tailwindDir = path.dirname(require.resolve('tailwindcss/package.json'));
  const postcss = require(require.resolve('postcss', { paths: [tailwindDir] }));
  const raiz = postcss.parse(fs.readFileSync(arquivo, 'utf8'), { from: arquivo });

  const camadas = { components: [], utilities: [] };
  raiz.each((no) => {
    if (no.type === 'atrule' && no.name === 'layer' && camadas[no.params]) {
      no.each((filho) => {
        if (filho.type !== 'comment') camadas[no.params].push(filho.clone());
      });
    }
  });
  return camadas;
}

const camadas = lerComponentes();

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        lg: '1024px', // = --sd-breakpoint-lg = BREAKPOINT_LG
      },
      colors: {
        primary: {
          DEFAULT: cor('primary'),
          hover: cor('primary-hover'),
          light: cor('primary-light'),
          soft: cor('primary-soft'),
          ring: cor('primary-ring'),
        },
        'on-primary': cor('on-primary'),
        accent: {
          DEFAULT: cor('accent'),
          text: cor('accent-text'),
        },
        secondary: {
          DEFAULT: cor('secondary'),
          soft: cor('secondary-soft'),
        },
        background: cor('background'),
        surface: {
          DEFAULT: cor('surface'),
          hover: cor('surface-hover'),
          muted: cor('surface-muted'),
          inverse: cor('surface-inverse'),
        },
        'on-inverse': cor('on-inverse'),
        skeleton: cor('skeleton'),
        overlay: {
          DEFAULT: cor('overlay'),
          strong: cor('overlay-strong'),
        },
        sidebar: {
          DEFAULT: cor('sidebar'),
          hover: cor('sidebar-hover'),
          active: cor('sidebar-active'),
          foreground: cor('sidebar-foreground'),
          muted: cor('sidebar-muted'),
          border: cor('sidebar-border'),
        },
        foreground: cor('text'),
        title: cor('text-title'),
        label: cor('text-label'),
        body: cor('text-body'),
        muted: cor('text-muted'),
        subtle: cor('text-subtle'),
        'on-dark': {
          label: cor('on-dark-label'),
          muted: cor('on-dark-muted'),
          error: cor('on-dark-error'),
          link: cor('on-dark-link'),
          'link-hover': cor('on-dark-link-hover'),
          success: cor('on-dark-success'),
        },
        print: {
          ink: cor('print-ink'),
          paper: cor('print-paper'),
          border: cor('print-border'),
        },
        border: {
          DEFAULT: cor('border'),
          subtle: cor('border-subtle'),
          strong: cor('border-strong'),
        },
        success: tom('success'),
        warning: tom('warning'),
        danger: tom('danger'),
        info: tom('info'),
        ...Object.fromEntries(FAMILIAS.map((f) => [f, tom(f)])),
        profile: Object.fromEntries(PERFIS.map((p) => [p, perfil(p)])),
        highlight: cor('highlight'),
        govbr: cor('govbr'),
        chart,
      },
      fontFamily: {
        sans: ['var(--sd-font-sans)'],
        document: ['var(--sd-font-document)'],
      },
      fontSize: vars('font-size', [
        '2xs',
        'xs2',
        'doc-10',
        'doc-11',
        'doc-12',
        'doc-14',
        'doc-16',
        'doc-18',
        'print-body',
        'print-table',
      ]),
      borderRadius: vars('radius', [
        'card',
        'panel',
        'callout',
        'tile',
        'control',
        'popover',
        'tag',
        'xs',
        'marker',
        'pill',
      ]),
      boxShadow: {
        ...vars('shadow', [
          'card',
          'card-hover',
          'popover',
          'dropdown',
          'modal',
          'inner',
          'nav-active',
          'brand',
          'brand-strong',
          'step',
        ]),
        ...Object.fromEntries(PERFIS.map((p) => [`profile-${p}`, `var(--sd-shadow-profile-${p})`])),
      },
      zIndex: vars('z', Z),
      transitionDuration: {
        DEFAULT: 'var(--sd-duration-fast)',
        ...vars('duration', ['fast', 'normal', 'slow']),
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--sd-ease-standard)',
        ...vars('ease', ['standard', 'out']),
      },
      width: vars('size', ['sidebar', 'sidebar-collapsed', 'tooltip', 'dropdown']),
      height: vars('size', ['header']),
      maxWidth: vars('size', [
        'modal-md',
        'modal-lg',
        'tooltip',
        'dropdown',
        'print-sheet',
        'form',
        'public-sm',
        'public-md',
      ]),
      minHeight: {
        textarea: 'var(--sd-size-textarea-min)',
        editor: 'var(--sd-size-editor-min)',
        'editor-frame': 'var(--sd-size-editor-frame-min)',
      },
      padding: vars('space', ['page-sm', 'page-md', 'page-lg']),
      gridTemplateColumns: {
        // Lista de dados em linhas: rótulo de largura fixa e valor no resto.
        'label-value': 'var(--sd-size-dl-label) minmax(0, 1fr)',
      },
      keyframes: {
        'nav-progress': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        'sd-toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'nav-progress': 'nav-progress var(--sd-duration-progress) var(--sd-ease-standard) infinite',
        'toast-in': 'sd-toast-in var(--sd-duration-fast) var(--sd-ease-out)',
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents, addUtilities }) => {
      addBase({
        body: {
          color: 'rgb(var(--sd-color-text))',
          backgroundColor: 'rgb(var(--sd-color-background))',
          fontFamily: 'var(--sd-font-sans)',
        },
      });
      addComponents(camadas.components);
      addUtilities({
        // Coluna do kanban: largura entre o mínimo e o máximo do token.
        '.w-kanban-column': {
          minWidth: 'var(--sd-size-kanban-column-min)',
          maxWidth: 'var(--sd-size-kanban-column-max)',
        },
      });
      addUtilities(camadas.utilities);
    }),
  ],
};
