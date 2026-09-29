import type { ComponentType, ReactNode } from 'react';
import { Check, Circle, CircleDot, Undo2, User } from 'lucide-react';
import { cn } from '../cn';
import { TONE_BG_STRONG, TONE_BG_TINT, TONE_BORDER, TONE_TEXT_STRONG, type Tone } from './tones';

export type TimelineVariant = 'icon' | 'dots' | 'phases';
export type TimelineStatus = 'done' | 'current' | 'returned' | 'pending';

export interface TimelineItem {
  id: string;
  /** Linha principal: a ação ("Documento assinado") ou o nome da fase. */
  title: ReactNode;
  /** Segunda linha, em corpo de texto (ex.: "Em análise → Numeração liberada"). */
  subtitle?: ReactNode;
  /** Observação curta, em cinza. */
  detail?: ReactNode;
  /** Quem agiu. Aparece com o ícone de pessoa, separado do texto da ação. */
  author?: { name: ReactNode; role?: ReactNode };
  /** Data já formatada (ex.: "12/09/2026 14:30" ou "Início: 01/09 · Fim: 05/09"). */
  date?: ReactNode;
  /** Dado técnico discreto ao lado da data, em fonte mono (ex.: "IP 10.0.0.1"). */
  meta?: ReactNode;
  /** Variante `icon`: ícone do item. Padrão: o `icon` do Timeline. */
  icon?: ComponentType<{ className?: string }>;
  /** Variantes `icon` e `dots`: cor do item. Padrão: o `tone` do Timeline. */
  tone?: Tone;
  /** Variante `phases`: situação da fase. Padrão: `pending`. */
  status?: TimelineStatus;
  /** Variante `phases`: texto ao lado do título (ex.: o setor responsável). */
  aside?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  /**
   * `icon` (padrão): ícone em círculo ligado por uma linha — o histórico do documento.
   * `dots`: lista de pontos numa borda à esquerda — a timeline curta do workflow.
   * `phases`: fases de um processo, com concluída, atual, devolvida e pendente.
   */
  variant?: TimelineVariant;
  /** Cor padrão dos itens (`icon` e `dots`). Padrão: `info`. */
  tone?: Tone;
  /** Ícone padrão dos itens na variante `icon`. Padrão: círculo com ponto. */
  icon?: ComponentType<{ className?: string }>;
  /** Mostrado quando não há itens (ex.: "Nenhuma movimentação registrada."). */
  empty?: ReactNode;
  /** Nome da lista para leitores de tela. */
  label?: string;
  /** Texto lido pelo leitor de tela para cada situação da fase. */
  statusLabels?: Partial<Record<TimelineStatus, string>>;
}

const ROTULOS_PADRAO: Record<TimelineStatus, string> = {
  done: 'concluída',
  current: 'fase atual',
  returned: 'devolvida',
  pending: 'pendente',
};

function Autor({ author }: { author: NonNullable<TimelineItem['author']> }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
      <User className="h-3 w-3 shrink-0 text-subtle" aria-hidden />
      <span className="font-medium">{author.name}</span>
      {author.role != null && <span className="text-subtle">— {author.role}</span>}
    </p>
  );
}

function Data({ date, meta }: { date?: ReactNode; meta?: ReactNode }) {
  if (date == null && meta == null) return null;
  return (
    <p className="mt-1.5 text-xs text-subtle">
      {date}
      {meta != null && <span className={cn('font-mono text-border-strong', date != null && 'ml-2')}>{meta}</span>}
    </p>
  );
}

const BOLINHA_FASE: Record<TimelineStatus, string> = {
  done: 'border-success bg-success text-on-primary',
  returned: 'border-warning bg-warning text-on-primary',
  current: 'border-accent bg-accent text-on-primary',
  pending: 'border-border bg-surface text-subtle',
};

/** Histórico em ordem: movimentações, trilha de auditoria ou fases de um processo. */
export function Timeline({
  items,
  variant = 'icon',
  tone = 'info',
  icon: IconePadrao = CircleDot,
  empty,
  label,
  statusLabels,
}: TimelineProps) {
  if (items.length === 0) {
    return empty != null ? <p className="text-sm text-subtle">{empty}</p> : null;
  }

  if (variant === 'dots') {
    return (
      <ol aria-label={label} data-variant="dots" className="space-y-4">
        {items.map((item) => {
          const t = item.tone ?? tone;
          return (
            <li key={item.id} className={cn('relative border-l-2 pb-1 pl-5', TONE_BORDER[t])}>
              <span
                className={cn('absolute -left-px top-1.5 h-2 w-2 -translate-x-1/2 rounded-pill', TONE_BG_STRONG[t])}
                aria-hidden
              />
              <p className="text-sm font-medium text-title">{item.title}</p>
              {item.subtitle != null && <p className="mt-0.5 text-xs text-muted">{item.subtitle}</p>}
              {item.detail != null && <p className="mt-0.5 text-xs text-muted">{item.detail}</p>}
              {item.author != null && <Autor author={item.author} />}
              {(item.date != null || item.meta != null) && (
                <p className="mt-0.5 text-xs text-muted">
                  {item.date}
                  {item.meta != null && <span className="ml-2 font-mono text-subtle">{item.meta}</span>}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  if (variant === 'phases') {
    const rotulos = { ...ROTULOS_PADRAO, ...statusLabels };
    return (
      <ol aria-label={label} data-variant="phases">
        {items.map((item, i) => {
          const status = item.status ?? 'pending';
          const ultimo = i === items.length - 1;
          const Icone = status === 'done' ? Check : status === 'returned' ? Undo2 : Circle;
          return (
            <li
              key={item.id}
              data-status={status}
              aria-current={status === 'current' ? 'step' : undefined}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border-2',
                    BOLINHA_FASE[status],
                  )}
                >
                  <Icone className={status === 'done' || status === 'returned' ? 'h-3.5 w-3.5' : 'h-3 w-3'} aria-hidden />
                </div>
                {!ultimo && (
                  <div
                    className={cn('min-h-6 w-0.5 flex-1', status === 'done' ? 'bg-success-border' : 'bg-border')}
                    aria-hidden
                  />
                )}
              </div>
              <div className={cn('min-w-0 pb-5', status !== 'current' && 'opacity-80')}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-title">{item.title}</span>
                  <span className="sr-only">({rotulos[status]})</span>
                  {item.aside != null && <span className="text-xs text-muted">{item.aside}</span>}
                </div>
                {item.subtitle != null && <p className="mt-0.5 text-sm text-body">{item.subtitle}</p>}
                {item.date != null && <p className="mt-1 text-xs text-subtle">{item.date}</p>}
                {item.detail != null && <p className="mt-1 text-xs text-muted">{item.detail}</p>}
                {item.author != null && <Autor author={item.author} />}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol aria-label={label} data-variant="icon">
      {items.map((item) => {
        const t = item.tone ?? tone;
        const Icone = item.icon ?? IconePadrao;
        return (
          // `group` + `last:` desenham a linha só entre os itens (não fura o card).
          <li key={item.id} className="group relative flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center self-stretch">
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-pill', TONE_BG_TINT[t])}>
                <Icone className={cn('h-4 w-4', TONE_TEXT_STRONG[t])} aria-hidden />
              </div>
              <div className="mt-1 w-px flex-1 bg-border group-last:hidden" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-title">{item.title}</p>
              {item.subtitle != null && <p className="mt-0.5 text-sm text-body">{item.subtitle}</p>}
              {item.detail != null && <p className="mt-1 text-xs text-muted">{item.detail}</p>}
              {item.author != null && <Autor author={item.author} />}
              <Data date={item.date} meta={item.meta} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
