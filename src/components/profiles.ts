/**
 * Classes do tema por perfil (--sd-color-profile-*), escritas por extenso
 * para o Tailwind achá-las no dist. Usadas pelo DashboardHero e pelo
 * QuickActions.
 */
import type { Profile } from '../tokens';

/** Moldura do destaque: borda e gradiente do fundo claro para o branco. */
export const PROFILE_HERO: Record<Profile, string> = {
  rh: 'border-profile-rh-border bg-gradient-to-br from-profile-rh-soft via-surface to-profile-rh-soft/30',
  secretaria:
    'border-profile-secretaria-border bg-gradient-to-br from-profile-secretaria-soft via-surface to-profile-secretaria-soft/30',
  prefeito:
    'border-profile-prefeito-border bg-gradient-to-br from-profile-prefeito-soft via-surface to-profile-prefeito-soft/30',
  gabinete:
    'border-profile-gabinete-border bg-gradient-to-br from-profile-gabinete-soft via-surface to-profile-gabinete-soft/30',
  plataforma:
    'border-profile-plataforma-border bg-gradient-to-br from-profile-plataforma-soft via-surface to-profile-plataforma-soft/30',
};

/** Quadrado do ícone claro: fundo 100 e ícone 700. */
export const PROFILE_ICON_TINT: Record<Profile, string> = {
  rh: 'bg-profile-rh-tint text-profile-rh-icon',
  secretaria: 'bg-profile-secretaria-tint text-profile-secretaria-icon',
  prefeito: 'bg-profile-prefeito-tint text-profile-prefeito-icon',
  gabinete: 'bg-profile-gabinete-tint text-profile-gabinete-icon',
  plataforma: 'bg-profile-plataforma-tint text-profile-plataforma-icon',
};

/** Quadrado do ícone cheio: fundo 600, ícone branco e sombra colorida. */
export const PROFILE_ICON_SOLID: Record<Profile, string> = {
  rh: 'bg-profile-rh text-on-primary shadow-profile-rh',
  secretaria: 'bg-profile-secretaria text-on-primary shadow-profile-secretaria',
  prefeito: 'bg-profile-prefeito text-on-primary shadow-profile-prefeito',
  gabinete: 'bg-profile-gabinete text-on-primary shadow-profile-gabinete',
  plataforma: 'bg-profile-plataforma text-on-primary shadow-profile-plataforma',
};

/** Título (950). */
export const PROFILE_TITLE: Record<Profile, string> = {
  rh: 'text-profile-rh-title',
  secretaria: 'text-profile-secretaria-title',
  prefeito: 'text-profile-prefeito-title',
  gabinete: 'text-profile-gabinete-title',
  plataforma: 'text-profile-plataforma-title',
};

/** Descrição (800 a 90%). */
export const PROFILE_DESCRIPTION: Record<Profile, string> = {
  rh: 'text-profile-rh-text/90',
  secretaria: 'text-profile-secretaria-text/90',
  prefeito: 'text-profile-prefeito-text/90',
  gabinete: 'text-profile-gabinete-text/90',
  plataforma: 'text-profile-plataforma-text/90',
};

/** Faixa do cabeçalho cheia (700), como a das ações rápidas. */
export const PROFILE_HEADER: Record<Profile, string> = {
  rh: 'bg-profile-rh-icon',
  secretaria: 'bg-profile-secretaria-icon',
  prefeito: 'bg-profile-prefeito-icon',
  gabinete: 'bg-profile-gabinete-icon',
  plataforma: 'bg-profile-plataforma-icon',
};

/** Quadrado pequeno de ícone de lista: fundo 50 e ícone 600. */
export const PROFILE_ICON_SOFT: Record<Profile, string> = {
  rh: 'bg-profile-rh-soft text-profile-rh',
  secretaria: 'bg-profile-secretaria-soft text-profile-secretaria',
  prefeito: 'bg-profile-prefeito-soft text-profile-prefeito',
  gabinete: 'bg-profile-gabinete-soft text-profile-gabinete',
  plataforma: 'bg-profile-plataforma-soft text-profile-plataforma',
};
