import { useId, type ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

/** Pede um motivo em texto antes de confirmar (o antigo MotivoModal). */
export interface ConfirmReason {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  /** Erro vindo da operação (ex.: resposta da API). */
  error?: ReactNode;
}

export interface ConfirmModalProps {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  /** O que vai acontecer, em uma ou duas frases. */
  message?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** `danger` para ação destrutiva (substituir, excluir). */
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  loadingLabel?: ReactNode;
  /** Com `reason`, a janela pede um motivo e só confirma com ele preenchido. */
  reason?: ConfirmReason;
}

/**
 * Confirmação de ação no padrão visual do sistema, no lugar do `window.confirm`
 * do navegador — que aparece com a moldura do navegador e destoa da aplicação.
 */
export function ConfirmModal({
  open,
  title,
  subtitle,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onClose,
  loading = false,
  loadingLabel = 'Processando…',
  reason,
}: ConfirmModalProps) {
  const motivoId = useId();
  const semMotivo = reason != null && !reason.value.trim();

  return (
    <Modal
      open={open}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={semMotivo}
            loading={loading}
            loadingLabel={loadingLabel}
            autoFocus={reason == null}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      {message != null && <div className="text-sm leading-relaxed text-body">{message}</div>}
      {reason != null && (
        <div className={message != null ? 'mt-4' : undefined}>
          <label htmlFor={motivoId} className="mb-1 block text-sm font-medium text-label">
            {reason.label ?? 'Motivo'}
          </label>
          <textarea
            id={motivoId}
            className="input min-h-[100px] w-full resize-y"
            placeholder={reason.placeholder ?? 'Descreva o motivo...'}
            value={reason.value}
            onChange={(e) => reason.onChange(e.target.value)}
            aria-invalid={reason.error != null || undefined}
            autoFocus
          />
          {reason.error != null && (
            <p role="alert" className="mt-2 rounded-control bg-danger-soft px-3 py-2 text-sm text-danger-text">
              {reason.error}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
