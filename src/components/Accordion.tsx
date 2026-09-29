import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../cn';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  /** Segunda linha do cabeçalho (ex.: fundamento legal). */
  description?: ReactNode;
  /** Texto curto à direita, antes do selo (ex.: "4 seções"). */
  meta?: ReactNode;
  /** Selo à direita, visível mesmo fechado. */
  badge?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Permite mais de uma linha aberta ao mesmo tempo. Padrão: só uma. */
  multiple?: boolean;
  /** Linhas abertas no início (modo não controlado). */
  defaultOpen?: string[];
  /** Linhas abertas vindas de fora (modo controlado). */
  open?: string[];
  onOpenChange?: (open: string[]) => void;
}

/**
 * Lista de linhas que abrem e fecham, cada uma com borda própria — o padrão
 * das listas de peças e de prompts do SGDM (components/configuracoes/PromptsIa.tsx).
 * Para um card inteiro que recolhe, use CollapsibleCard.
 */
export function Accordion({ items, multiple = false, defaultOpen = [], open, onOpenChange }: AccordionProps) {
  const base = useId();
  const [interno, setInterno] = useState<string[]>(defaultOpen);
  const abertos = open ?? interno;

  function alternar(id: string) {
    const jaAberto = abertos.includes(id);
    const proximo = jaAberto
      ? abertos.filter((a) => a !== id)
      : multiple
        ? [...abertos, id]
        : [id];
    if (open === undefined) setInterno(proximo);
    onOpenChange?.(proximo);
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const aberto = abertos.includes(item.id);
        const corpoId = `${base}-${item.id}`;
        return (
          <div key={item.id} className="overflow-hidden rounded-panel border border-border" data-open={aberto}>
            <button
              type="button"
              onClick={() => alternar(item.id)}
              disabled={item.disabled}
              aria-expanded={aberto}
              aria-controls={corpoId}
              className="focus-ring flex w-full items-center gap-3 bg-surface-hover px-4 py-3 text-left transition hover:bg-surface-muted focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronDown
                aria-hidden
                className={cn('h-4 w-4 shrink-0 text-muted transition-transform', aberto && 'rotate-180')}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                {item.description != null && <p className="text-xs text-muted">{item.description}</p>}
              </div>
              {item.meta != null && <span className="shrink-0 text-xs text-muted">{item.meta}</span>}
              {item.badge != null && <span className="shrink-0">{item.badge}</span>}
            </button>
            {aberto && (
              <div id={corpoId} className="space-y-4 border-t border-border p-4">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
