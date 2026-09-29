import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../cn';

export interface CollapsibleCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Ícone já montado, para o card não decidir cor nem tamanho. */
  icon?: ReactNode;
  /** Selo de estado à direita do título — visível mesmo fechado. */
  badge?: ReactNode;
  /** Configuração que se mexe uma vez costuma nascer fechada. */
  defaultOpen?: boolean;
  /** Aberto ou fechado vindo de fora (modo controlado). */
  open?: boolean;
  /** Chamado ao clicar no cabeçalho, com o próximo estado. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Card com cabeçalho clicável que esconde o conteúdo (o CardRecolhivel do SGDM).
 * O cabeçalho continua dizendo o que há ali e em que estado está, então
 * recolher não esconde informação, só o formulário.
 */
export function CollapsibleCard({
  title,
  description,
  icon,
  badge,
  defaultOpen = false,
  open,
  onOpenChange,
  children,
}: CollapsibleCardProps) {
  const [interno, setInterno] = useState(defaultOpen);
  const aberto = open ?? interno;
  const corpoId = useId();

  function alternar() {
    if (open === undefined) setInterno(!aberto);
    onOpenChange?.(!aberto);
  }

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={alternar}
        aria-expanded={aberto}
        aria-controls={corpoId}
        className="card-header focus-ring flex w-full flex-wrap items-center gap-3 text-left transition hover:bg-surface-hover focus-visible:-outline-offset-2"
      >
        {icon}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description != null && <p className="text-sm text-muted">{description}</p>}
        </div>
        {badge}
        <ChevronDown
          aria-hidden
          className={cn('h-4 w-4 shrink-0 text-subtle transition-transform', aberto && 'rotate-180')}
        />
      </button>

      {aberto && (
        <div id={corpoId} className="card-body space-y-6">
          {children}
        </div>
      )}
    </div>
  );
}
