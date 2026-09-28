/**
 * @sgdm/design — preset do Tailwind
 *
 * Expõe os tokens de tokens.css como nomes do Tailwind (bg-primary,
 * rounded-control, shadow-card, font-document…) e injeta as classes de
 * components.css (.card, .btn-primary, .input…) na camada "components".
 *
 * Nenhum valor visual mora aqui: tudo aponta para var(--sd-*). Quem muda o
 * visual é o tokens.css.
 */
const fs = require('node:fs');
const path = require('node:path');
const plugin = require('tailwindcss/plugin');

/** Cor com suporte a opacidade do Tailwind (bg-primary/80). */
const cor = (nome) => `rgb(var(--sd-color-${nome}) / <alpha-value>)`;

/** Tom de feedback: base, soft, border, strong e text. */
const tom = (nome) => ({
  DEFAULT: cor(nome),
  soft: cor(`${nome}-soft`),
  border: cor(`${nome}-border`),
  strong: cor(`${nome}-strong`),
  text: cor(`${nome}-text`),
});

const chart = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [String(i + 1), cor(`chart-${i + 1}`)]),
);

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
        overlay: cor('overlay'),
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
        border: {
          DEFAULT: cor('border'),
          subtle: cor('border-subtle'),
        },
        success: tom('success'),
        warning: tom('warning'),
        danger: { ...tom('danger'), hover: cor('danger-hover') },
        info: tom('info'),
        highlight: cor('highlight'),
        govbr: cor('govbr'),
        chart,
      },
      fontFamily: {
        sans: ['var(--sd-font-sans)'],
        document: ['var(--sd-font-document)'],
      },
      borderRadius: {
        card: 'var(--sd-radius-card)',
        control: 'var(--sd-radius-control)',
        tile: 'var(--sd-radius-tile)',
        popover: 'var(--sd-radius-popover)',
        pill: 'var(--sd-radius-pill)',
      },
      boxShadow: {
        card: 'var(--sd-shadow-card)',
        'card-hover': 'var(--sd-shadow-card-hover)',
        popover: 'var(--sd-shadow-popover)',
        modal: 'var(--sd-shadow-modal)',
        'nav-active': 'var(--sd-shadow-nav-active)',
        brand: 'var(--sd-shadow-brand)',
        step: 'var(--sd-shadow-step)',
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
        'nav-progress': 'nav-progress 1s ease-in-out infinite',
        'toast-in': 'sd-toast-in 150ms ease-out',
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
      addUtilities(camadas.utilities);
    }),
  ],
};
