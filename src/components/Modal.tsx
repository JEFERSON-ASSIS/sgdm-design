import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../cn';
import { OnDark } from './OnDark';

export interface ModalProps {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  /** Botões do rodapé. Ficam alinhados à direita. */
  footer?: ReactNode;
  /** `lg` para formulários largos (o `wide` do SGDM). */
  size?: 'md' | 'lg';
  /** Rótulo do botão de fechar, para leitores de tela. */
  closeLabel?: string;
}

const FOCAVEIS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Janela modal do SGDM (antigo CadastroModal). Fecha com Esc e com clique no
 * fundo, prende o Tab dentro dela e devolve o foco a quem a abriu.
 */
export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = 'md',
  closeLabel = 'Fechar',
}: ModalProps) {
  const tituloId = useId();
  const subtituloId = useId();
  const caixa = useRef<HTMLDivElement>(null);
  const aoFechar = useRef(onClose);
  aoFechar.current = onClose;

  useEffect(() => {
    if (!open) return;
    const anterior = document.activeElement as HTMLElement | null;

    // Respeita o autoFocus de quem está dentro; senão foca a própria janela.
    const el = caixa.current;
    if (el && !el.contains(document.activeElement)) el.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        aoFechar.current();
        return;
      }
      if (e.key === 'Tab' && caixa.current) {
        const itens = Array.from(caixa.current.querySelectorAll<HTMLElement>(FOCAVEIS));
        if (itens.length === 0) return;
        const primeiro = itens[0]!;
        const ultimo = itens[itens.length - 1]!;
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      anterior?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-overlay/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
        data-testid="modal-fundo"
      />
      <div
        ref={caixa}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={subtitle != null ? subtituloId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-modal outline-none',
          size === 'lg' ? 'max-w-modal-lg' : 'max-w-modal-md',
        )}
      >
        <div className="flex items-start justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h2 id={tituloId} className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            {subtitle != null && (
              <p id={subtituloId} className="mt-0.5 text-sm text-muted">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-control p-1.5 text-subtle transition hover:bg-surface-muted hover:text-body"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {/* A janela é clara mesmo aberta sobre o login. */}
        <OnDark value={false}>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer != null && (
            <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle bg-surface-hover/80 px-5 py-4">
              {footer}
            </div>
          )}
        </OnDark>
      </div>
    </div>
  );
}
