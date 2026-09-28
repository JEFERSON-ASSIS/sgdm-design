import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../cn';

export interface TabItem {
  id: string;
  label: ReactNode;
  /** Conteúdo da aba. Sem conteúdo, o Tabs funciona só como barra de abas. */
  content?: ReactNode;
  disabled?: boolean;
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
}

/** Abas sublinhadas do SGDM, com navegação por setas do teclado. */
export function Tabs({ items, value, defaultValue, onChange, label }: TabsProps) {
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
      <div role="tablist" aria-label={label} className="flex gap-1 border-b border-border" onKeyDown={aoTeclar}>
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
              className={cn(
                'focus-ring -mb-px border-b-2 px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
                selecionada
                  ? 'border-accent text-accent-text'
                  : 'border-transparent text-muted hover:text-label',
              )}
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
