/**
 * Os tokens que o JavaScript precisa ler. Os valores são os mesmos de
 * tokens.css (um teste confere); use-os onde CSS não alcança: media query no
 * JS, z-index de biblioteca externa, opções do seletor de fonte do editor.
 */

/** Larguras mínimas de cada faixa de tela, em px (as do Tailwind). */
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

/** A partir daqui o menu lateral fica fixo; abaixo, vira gaveta. */
export const BREAKPOINT_LG = BREAKPOINTS.lg;

/** Media query da faixa `lg` para `window.matchMedia`. */
export const MEDIA_QUERY_LG = `(min-width: ${BREAKPOINT_LG}px)`;

/** A tela atual está na faixa do desktop (`lg` ou maior)? Falso no servidor. */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function') return window.matchMedia(MEDIA_QUERY_LG).matches;
  return window.innerWidth >= BREAKPOINT_LG;
}

/** Escala de camadas (--sd-z-*). */
export const Z_INDEX = {
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  tooltip: 100,
  progress: 110,
} as const;

/** Durações em milissegundos (--sd-duration-*). */
export const DURATION_MS = { fast: 150, normal: 200, slow: 300, progress: 1000 } as const;

/** Tamanhos oferecidos no seletor de fonte do editor (--sd-font-size-doc-*). */
export const EDITOR_FONT_SIZES = ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt'] as const;

/** Tamanhos da impressão (--sd-font-size-print-*). */
export const PRINT_FONT_SIZES = { body: '12pt', table: '10pt' } as const;

/** Perfis com tema próprio (--sd-color-profile-*, --sd-shadow-profile-*). */
export const PROFILES = ['rh', 'secretaria', 'prefeito', 'gabinete', 'plataforma'] as const;
export type Profile = (typeof PROFILES)[number];
