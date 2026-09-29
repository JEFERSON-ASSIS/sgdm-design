import { useId, type ReactElement, cloneElement, isValidElement } from 'react';
import { Info } from 'lucide-react';
import { cn } from '../cn';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Explicação curta mostrada no balão. */
  text: string;
  /**
   * Gatilho próprio (precisa ser focável, ex.: um botão). Sem ele, aparece o
   * ícone "i" do SGDM (DicaInfo).
   */
  children?: ReactElement<{ 'aria-describedby'?: string }>;
  /** Lado do gatilho em que o balão abre. Padrão: `top`, como no SGDM. */
  placement?: TooltipPlacement;
}

const POSICAO: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

/**
 * Balão de dica que abre ao passar o mouse ou ao focar (teclado e toque).
 * Fica fora do <label> para o clique não marcar o checkbox.
 */
export function Tooltip({ text, children, placement = 'top' }: TooltipProps) {
  const id = useId();
  const gatilho =
    children && isValidElement(children) ? (
      cloneElement(children, { 'aria-describedby': id })
    ) : (
      <button
        type="button"
        aria-label={text}
        className="focus-ring rounded-pill text-subtle hover:text-body focus:text-body"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
    );

  return (
    <span className="group relative inline-flex">
      {gatilho}
      <span
        id={id}
        role="tooltip"
        data-placement={placement}
        className={cn(
          'pointer-events-none absolute z-tooltip hidden w-tooltip rounded-popover bg-surface-inverse px-3 py-2 text-xs font-normal leading-relaxed text-on-inverse shadow-popover group-focus-within:block group-hover:block',
          POSICAO[placement],
        )}
      >
        {text}
      </span>
    </span>
  );
}

/** Nome usado no SGDM. */
export const DicaInfo = ({ texto }: { texto: string }) => <Tooltip text={texto} />;
