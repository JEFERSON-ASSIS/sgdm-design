import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Tempo na tela em ms. `0` mantém até fechar. Padrão: 5000. */
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, 'variant' | 'duration'>> {
  id: number;
  title: ReactNode;
  description?: ReactNode;
}

export interface ToastApi {
  /** Mostra um aviso e devolve o id dele. */
  toast: (options: ToastOptions) => number;
  success: (title: ReactNode, description?: ReactNode) => number;
  error: (title: ReactNode, description?: ReactNode) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const ESTILO: Record<ToastVariant, { icone: typeof Info; cor: string }> = {
  success: { icone: CheckCircle2, cor: 'text-success-strong' },
  error: { icone: AlertCircle, cor: 'text-danger-strong' },
  warning: { icone: AlertTriangle, cor: 'text-warning-strong' },
  info: { icone: Info, cor: 'text-info-strong' },
};

function ToastView({ item, onDismiss, closeLabel }: { item: ToastItem; onDismiss: () => void; closeLabel: string }) {
  const { icone: Icone, cor } = ESTILO[item.variant];
  const fechar = useRef(onDismiss);
  fechar.current = onDismiss;

  useEffect(() => {
    if (item.duration <= 0) return;
    const t = setTimeout(() => fechar.current(), item.duration);
    return () => clearTimeout(t);
  }, [item.duration]);

  return (
    <div
      role={item.variant === 'error' ? 'alert' : 'status'}
      data-variant={item.variant}
      className="pointer-events-auto flex w-full items-start gap-3 rounded-callout border border-border bg-surface px-4 py-3 shadow-popover animate-toast-in"
    >
      <Icone className={cn('mt-0.5 h-5 w-5 shrink-0', cor)} aria-hidden />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold text-title">{item.title}</p>
        {item.description != null && <p className="mt-0.5 text-muted">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={closeLabel}
        className="focus-ring -m-1 rounded-control p-1 text-subtle transition hover:bg-surface-muted hover:text-body"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Máximo de avisos simultâneos; os mais antigos saem primeiro. */
  max?: number;
  closeLabel?: string;
}

/** Envolve a aplicação uma vez; os componentes chamam `useToast()`. */
export function ToastProvider({ children, max = 4, closeLabel = 'Fechar aviso' }: ToastProviderProps) {
  const [itens, setItens] = useState<ToastItem[]>([]);
  const proximoId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItens((atual) => atual.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = 5000 }: ToastOptions) => {
      const id = proximoId.current++;
      setItens((atual) => [...atual, { id, title, description, variant, duration }].slice(-max));
      return id;
    },
    [max],
  );

  const api = useMemo<ToastApi>(
    () => ({
      toast,
      dismiss,
      success: (title, description) => toast({ title, description, variant: 'success' }),
      error: (title, description) => toast({ title, description, variant: 'error' }),
    }),
    [toast, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-toast flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
      >
        {itens.map((item) => (
          <ToastView key={item.id} item={item} onDismiss={() => dismiss(item.id)} closeLabel={closeLabel} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>.');
  return ctx;
}
