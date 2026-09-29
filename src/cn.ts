import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Nomes que o preset acrescenta ao Tailwind e que o tailwind-merge não conhece
 * sozinho. Sem isto, `text-xs2` seria tomado por cor (e sumiria diante de
 * `text-muted`) e `shadow-card` não disputaria com `shadow-modal`. Um teste
 * confere que estas listas batem com o tailwind-preset.cjs.
 */
export const PRESET_SCALES = {
  'font-size': ['2xs', 'xs2', 'doc-10', 'doc-11', 'doc-12', 'doc-14', 'doc-16', 'doc-18', 'print-body', 'print-table'],
  rounded: ['card', 'panel', 'callout', 'tile', 'control', 'popover', 'tag', 'xs', 'marker', 'pill'],
  shadow: [
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
    'profile-rh',
    'profile-secretaria',
    'profile-prefeito',
    'profile-gabinete',
    'profile-plataforma',
  ],
  z: ['raised', 'dropdown', 'sticky', 'overlay', 'modal', 'toast', 'tooltip', 'progress'],
  duration: ['fast', 'normal', 'slow'],
  ease: ['standard', 'out'],
  w: ['sidebar', 'sidebar-collapsed', 'tooltip', 'dropdown'],
  h: ['header'],
  'max-w': ['modal-md', 'modal-lg', 'tooltip', 'dropdown', 'print-sheet'],
  'min-h': ['textarea', 'editor', 'editor-frame'],
  p: ['page-sm', 'page-md', 'page-lg'],
} as const;

const PREFIXO: Record<keyof typeof PRESET_SCALES, string> = {
  'font-size': 'text',
  rounded: 'rounded',
  shadow: 'shadow',
  z: 'z',
  duration: 'duration',
  ease: 'ease',
  w: 'w',
  h: 'h',
  'max-w': 'max-w',
  'min-h': 'min-h',
  p: 'p',
};

const grupos = Object.fromEntries(
  (Object.keys(PRESET_SCALES) as (keyof typeof PRESET_SCALES)[]).map((g) => [
    g,
    [{ [PREFIXO[g]]: [...PRESET_SCALES[g]] }],
  ]),
);

const padding = [...PRESET_SCALES.p];
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      ...grupos,
      px: [{ px: padding }],
      py: [{ py: padding }],
    },
  },
});

/** Junta classes e resolve conflitos do Tailwind (a última vence). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
