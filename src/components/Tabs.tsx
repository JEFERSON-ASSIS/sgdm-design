import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { TONE_SOLID, type Tone } from './tones';

export type TabsVariant = 'underline' | 'pill';

export interface TabItem {
  id: string;
  label: ReactNode;
  /** Conteúdo da aba. Sem conteúdo, o Tabs funciona só como barra de abas. */
  content?: ReactNode;
  disabled?: boolean;
  /**
   * Variante `pill`: cor da aba quando ativa (ex.: `indigo` para "Análise",
   * `warning` para "Correção"). Padrão: `primary` (azul de destaque).
   */
  tone?: Tone;
}

export interface TabsProps {
  items: TabItem[];
  /** Aba ativa (modo controlado). */
  value?: string;
  /** Aba inicial (modo não controlado). */
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Nome do grupo de abas, para leitores de tela. */
  label?: string;
  /**
   * `underline` (padrão): abas sublinhadas.
   * `pill`: barra branca com borda e a aba ativa preenchida — a barra de abas
   * da tela do documento. Cada aba pode ter a própria cor (`tone`).
   */
  variant?: TabsVariant;
}

/** Aba em forma de pílula (também usada pelo SegmentedControl). */
export function classePilula(ativa: boolean, tone: Tone = 'primary', compacta = false): string {
  return cn(
    'focus-ring shrink-0 rounded-control text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
    compacta ? 'px-3 py-1.5' : 'px-5 py-2.5',
    ativa
      ? cn(TONE_SOLID[tone], 'shadow-card')
      : cn('text-body', compacta ? 'hover:bg-surface-muted' : 'hover:bg-surface-hover'),
  );
}

/** Abas do SGDM (sublinhadas ou em pílula), com navegação por setas do teclado. */
export function Tabs({ items, value, defaultValue, onChange, label, variant = 'underline' }: TabsProps) {
  const base = useId();
  const [interno, setInterno] = useState(defaultValue ?? items[0]?.id);
  const ativo = value ?? interno;
  const botoes = useRef<Record<string, HTMLButtonElement | null>>({});

  function selecionar(id: string) {
    if (value === undefined) setInterno(id);
    onChange?.(id);
  }

  function aoTeclar(e: KeyboardEvent<HTMLDivElement>) {
    const habilitados = items.filter((i) => !i.disabled);
    const atual = habilitados.findIndex((i) => i.id === ativo);
    let proximo: TabItem | undefined;
    if (e.key === 'ArrowRight') proximo = habilitados[(atual + 1) % habilitados.length];
    else if (e.key === 'ArrowLeft')
      proximo = habilitados[(atual - 1 + habilitados.length) % habilitados.length];
    else if (e.key === 'Home') proximo = habilitados[0];
    else if (e.key === 'End') proximo = habilitados[habilitados.length - 1];
    if (!proximo) return;
    e.preventDefault();
    selecionar(proximo.id);
    botoes.current[proximo.id]?.focus();
  }

  const painel = items.find((i) => i.id === ativo);

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        data-variant={variant}
        className={cn(
          'flex gap-1',
          variant === 'pill'
            ? 'w-full overflow-x-auto rounded-panel border border-border bg-surface p-1'
            : 'border-b border-border',
        )}
        onKeyDown={aoTeclar}
      >
        {items.map((t) => {
          const selecionada = t.id === ativo;
          return (
            <button
              key={t.id}
              ref={(el) => {
                botoes.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-aba-${t.id}`}
              aria-selected={selecionada}
              aria-controls={t.content !== undefined ? `${base}-painel-${t.id}` : undefined}
              tabIndex={selecionada ? 0 : -1}
              disabled={t.disabled}
              onClick={() => selecionar(t.id)}
              data-tone={variant === 'pill' ? (t.tone ?? 'primary') : undefined}
              className={
                variant === 'pill'
                  ? classePilula(selecionada, t.tone)
                  : cn(
                      'focus-ring -mb-px border-b-2 px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
                      selecionada
                        ? 'border-accent text-accent-text'
                        : 'border-transparent text-muted hover:text-label',
                    )
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {painel?.content !== undefined && (
        <div
          role="tabpanel"
          id={`${base}-painel-${painel.id}`}
          aria-labelledby={`${base}-aba-${painel.id}`}
          tabIndex={0}
          className="pt-4 outline-none"
        >
          {painel.content}
        </div>
      )}
    </div>
  );
}
