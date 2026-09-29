import { Children, useId, type ComponentType, type ElementType, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../cn';
import type { Profile } from '../tokens';
import { Button } from './Button';
import {
  PROFILE_DESCRIPTION,
  PROFILE_HEADER,
  PROFILE_HERO,
  PROFILE_ICON_SOFT,
  PROFILE_ICON_SOLID,
  PROFILE_ICON_TINT,
  PROFILE_TITLE,
} from './profiles';
import { TONE_BG_BASE, TONE_BG_SOFT, TONE_TEXT_STRONG, type Tone } from './tones';

type Icone = ComponentType<{ className?: string }>;

/** Foco de item encostado na borda do card: anel por dentro, que o `overflow-hidden` não corta. */
const FOCO_INTERNO =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light';

/* ------------------------------------------------------------------ */
/* DashboardHero                                                       */
/* ------------------------------------------------------------------ */

export type DashboardHeroVariant = 'soft' | 'solid';

export interface DashboardHeroProps {
  /** Perfil do usuário: define as cores (rh, secretaria, prefeito, gabinete, plataforma). */
  profile: Profile;
  title: ReactNode;
  description?: ReactNode;
  icon: Icone;
  /**
   * `soft` (padrão): o `DashboardRoleHero` — ícone claro, título e texto na
   * cor do perfil. `solid`: o destaque do painel da plataforma — ícone cheio
   * com sombra colorida, título escuro e texto em cinza.
   */
  variant?: DashboardHeroVariant;
  /** Nível do título. Padrão `h1` (é o topo do painel). */
  headingLevel?: 'h1' | 'h2';
  /** Conteúdo extra abaixo da descrição (ex.: botões). */
  children?: ReactNode;
}

/** Faixa de boas-vindas do painel inicial, na cor do perfil. */
export function DashboardHero({
  profile,
  title,
  description,
  icon: Icon,
  variant = 'soft',
  headingLevel: Titulo = 'h1',
  children,
}: DashboardHeroProps) {
  if (variant === 'solid') {
    return (
      <div
        data-profile={profile}
        className={cn('overflow-hidden rounded-card border p-6 shadow-card', PROFILE_HERO[profile])}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-tile', PROFILE_ICON_SOLID[profile])}
            aria-hidden
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <Titulo className="text-lg font-semibold text-foreground">{title}</Titulo>
            {description != null && (
              <p className="mt-1 max-w-prose text-sm leading-relaxed text-body">{description}</p>
            )}
            {children != null && <div className="mt-3">{children}</div>}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      data-profile={profile}
      className={cn('rounded-card border px-5 py-4 sm:flex sm:items-center sm:gap-4', PROFILE_HERO[profile])}
    >
      <div
        className={cn('mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-tile sm:mb-0', PROFILE_ICON_TINT[profile])}
        aria-hidden
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <Titulo className={cn('text-base font-semibold sm:text-lg', PROFILE_TITLE[profile])}>{title}</Titulo>
        {description != null && <p className={cn('mt-0.5 text-sm', PROFILE_DESCRIPTION[profile])}>{description}</p>}
        {children != null && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* QuickActions                                                        */
/* ------------------------------------------------------------------ */

export interface QuickAction {
  id?: string;
  label: ReactNode;
  icon: Icone;
  href?: string;
  onClick?: () => void;
}

export interface QuickActionsProps {
  /** Título da faixa (ex.: "Ações rápidas — Secretaria"). */
  title: ReactNode;
  actions: QuickAction[];
  /** Cor da faixa e dos ícones. Sem perfil, usa a cor principal. */
  profile?: Profile;
  /** Ícone da faixa. Padrão: `Plus`. */
  icon?: Icone;
  /** Componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
}

/** Card de atalhos do painel: faixa colorida e lista de links com ícone. */
export function QuickActions({ title, actions, profile, icon: IconeFaixa = Plus, linkComponent }: QuickActionsProps) {
  const idTitulo = useId();
  return (
    <section aria-labelledby={idTitulo} className="card overflow-hidden" data-profile={profile}>
      <div className={cn('flex items-center gap-2 px-5 py-4 text-on-primary', profile ? PROFILE_HEADER[profile] : 'bg-primary')}>
        <IconeFaixa className="h-5 w-5" aria-hidden />
        <h2 id={idTitulo} className="font-semibold">
          {title}
        </h2>
      </div>
      <ul role="list" className="divide-y divide-border-subtle">
        {actions.map((a, i) => {
          const Tag: ElementType = a.href != null ? (linkComponent ?? 'a') : 'button';
          const Icon = a.icon;
          return (
            <li key={a.id ?? a.href ?? i}>
              <Tag
                href={a.href}
                onClick={a.onClick}
                type={a.href == null ? 'button' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm text-label transition hover:bg-surface-hover',
                  FOCO_INTERNO,
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-control',
                    profile ? PROFILE_ICON_SOFT[profile] : 'bg-primary-soft text-accent',
                  )}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                {a.label}
              </Tag>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* QueueCard                                                           */
/* ------------------------------------------------------------------ */

export interface QueueCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon: Icone;
  /** Cor do cabeçalho (fundo claro). Padrão: `primary`. */
  tone?: Tone;
  /** Destino do link do cabeçalho. */
  href?: string;
  /** Texto do link. Padrão: "Ver todas". */
  hrefLabel?: ReactNode;
  /** Componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
  /** A lista da fila. Sem filhos, mostra `empty`. */
  children?: ReactNode;
  /** Texto da fila vazia. Padrão: "Nada na fila.". */
  empty?: ReactNode;
}

/**
 * Card de fila do painel (`DashboardFilaCard` do SGDM): cabeçalho tingido com
 * ícone, título, subtítulo e "ver todas", e a lista de itens abaixo.
 */
export function QueueCard({
  title,
  subtitle,
  icon: Icon,
  tone = 'primary',
  href,
  hrefLabel = 'Ver todas',
  linkComponent,
  children,
  empty = 'Nada na fila.',
}: QueueCardProps) {
  const idTitulo = useId();
  const vazio = Children.toArray(children).length === 0;
  const LinkTag: ElementType = linkComponent ?? 'a';
  return (
    <section aria-labelledby={idTitulo} className="card overflow-hidden" data-tone={tone}>
      <div className={cn('flex items-start justify-between gap-3 px-5 py-4', TONE_BG_SOFT[tone])}>
        <div className="flex min-w-0 gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile bg-surface/80 shadow-card"
            aria-hidden
          >
            <Icon className="h-5 w-5 text-label" />
          </div>
          <div className="min-w-0">
            <h2 id={idTitulo} className="font-semibold text-foreground">
              {title}
            </h2>
            {subtitle != null && <p className="mt-0.5 text-xs text-body">{subtitle}</p>}
          </div>
        </div>
        {href != null && (
          <LinkTag
            href={href}
            className="focus-ring shrink-0 rounded-xs text-xs font-semibold text-accent-text hover:underline"
          >
            {hrefLabel}
          </LinkTag>
        )}
      </div>
      <div className="px-5 pb-5 pt-2">
        {vazio ? <p className="py-6 text-center text-sm text-muted">{empty}</p> : children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CountList                                                           */
/* ------------------------------------------------------------------ */

export interface CountListItem {
  id: string;
  label: ReactNode;
  count: number;
  /** Cor do ponto à esquerda. Padrão: `neutral`. */
  tone?: Tone;
  href?: string;
  onClick?: () => void;
}

export interface CountListProps {
  title: ReactNode;
  items: CountListItem[];
  /** Link "Ver todas" do cabeçalho. */
  href?: string;
  hrefLabel?: ReactNode;
  /** Componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
  /** Texto sem itens. Padrão: "Nenhuma pendência no momento". */
  empty?: ReactNode;
}

/** Lista de contagens do painel (`PendingList` do SGDM): ponto colorido, rótulo e número. */
export function CountList({
  title,
  items,
  href,
  hrefLabel = 'Ver todas',
  linkComponent,
  empty = 'Nenhuma pendência no momento',
}: CountListProps) {
  const idTitulo = useId();
  return (
    <section aria-labelledby={idTitulo} className="card">
      <div className="card-header flex items-center justify-between gap-3">
        <h2 id={idTitulo} className="font-semibold text-title">
          {title}
        </h2>
        {href != null && (
          <Button variant="link" size="sm" href={href} linkComponent={linkComponent}>
            {hrefLabel}
          </Button>
        )}
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <p className="py-2 text-sm text-subtle">{empty}</p>
        ) : (
          <ul role="list" className="space-y-2">
            {items.map((item) => {
              const Tag: ElementType =
                item.href != null ? (linkComponent ?? 'a') : item.onClick != null ? 'button' : 'div';
              const clicavel = Tag !== 'div';
              return (
                <li key={item.id}>
                  <Tag
                    href={item.href}
                    onClick={item.onClick}
                    type={Tag === 'button' ? 'button' : undefined}
                    className={cn(
                      'flex w-full items-center justify-between rounded-control px-2 py-2 text-left text-sm',
                      clicavel && 'focus-ring transition hover:bg-surface-hover',
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn('h-2 w-2 shrink-0 rounded-pill', TONE_BG_BASE[item.tone ?? 'neutral'])}
                        aria-hidden
                      />
                      <span className="truncate text-body">{item.label}</span>
                    </span>
                    <span className="ml-2 shrink-0 rounded-pill bg-surface-muted px-2 py-0.5 text-xs font-bold tabular-nums text-title">
                      {item.count}
                    </span>
                  </Tag>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MiniStat                                                            */
/* ------------------------------------------------------------------ */

export type MiniStatVariant = 'default' | 'dashed';

export interface MiniStatProps {
  label: ReactNode;
  /** Número em destaque. Omitido na variante `dashed`, que é só um lembrete. */
  value?: ReactNode;
  /** Linha pequena abaixo do rótulo. */
  description?: ReactNode;
  icon?: Icone;
  /** Cor do ícone. Padrão: `primary`. */
  tone?: Tone;
  /**
   * `default`: card branco com ícone, número e rótulo (o indicador pequeno do
   * painel da plataforma). `dashed`: borda tracejada e fundo cinza, para um
   * lembrete que não é número.
   */
  variant?: MiniStatVariant;
  /** Mostra "…" no lugar do número e marca o card como ocupado. */
  loading?: boolean;
  href?: string;
  /** Componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
}

/**
 * Indicador pequeno: ícone solto (sem quadrado), número e rótulo. Mais leve
 * que o `StatCard`, para grades de quatro ou mais.
 */
export function MiniStat({
  label,
  value,
  description,
  icon: Icon,
  tone = 'primary',
  variant = 'default',
  loading = false,
  href,
  linkComponent,
}: MiniStatProps) {
  const tracejado = variant === 'dashed';
  const Tag: ElementType = href != null ? (linkComponent ?? 'a') : 'div';
  return (
    <Tag
      href={href}
      aria-busy={loading || undefined}
      data-tone={tone}
      data-variant={variant}
      className={cn(
        'stat-card',
        tracejado && 'border-dashed border-border bg-surface-hover/50 hover:shadow-card',
        href != null && 'focus-ring',
      )}
    >
      {Icon != null && <Icon className={cn('h-5 w-5', tracejado ? 'text-subtle' : TONE_TEXT_STRONG[tone])} aria-hidden />}
      {value != null && !tracejado && (
        <p className="text-2xl font-bold tabular-nums text-foreground">{loading ? '…' : value}</p>
      )}
      <p className={tracejado ? 'text-sm font-medium text-body' : 'text-sm text-muted'}>{label}</p>
      {description != null && <p className="text-xs text-subtle">{description}</p>}
    </Tag>
  );
}
