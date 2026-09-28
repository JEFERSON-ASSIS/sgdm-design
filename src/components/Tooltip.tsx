import { useId, type ReactElement, cloneElement, isValidElement } from 'react';
import { Info } from 'lucide-react';

export interface TooltipProps {
  /** Explicação curta mostrada no balão. */
  text: string;
  /**
   * Gatilho próprio (precisa ser focável, ex.: um botão). Sem ele, aparece o
   * ícone "i" do SGDM (DicaInfo).
   */
  children?: ReactElement<{ 'aria-describedby'?: string }>;
}

/**
 * Balão de dica que abre ao passar o mouse ou ao focar (teclado e toque).
 * Fica fora do <label> para o clique não marcar o checkbox.
 */
export function Tooltip({ text, children }: TooltipProps) {
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
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-72 -translate-x-1/2 rounded-popover bg-surface-inverse px-3 py-2 text-xs font-normal leading-relaxed text-on-inverse shadow-popover group-focus-within:block group-hover:block"
      >
        {text}
      </span>
    </span>
  );
}

/** Nome usado no SGDM. */
export const DicaInfo = ({ texto }: { texto: string }) => <Tooltip text={texto} />;
