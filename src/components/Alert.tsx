import type { ComponentType, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../cn';
import { TONE_BG_SOFT, TONE_BORDER, TONE_TEXT, TONE_TEXT_DEEP } from './tones';

export type AlertTone = 'info' | 'warning' | 'success' | 'danger' | 'violet' | 'purple' | 'neutral';

export interface AlertProps {
  /**
   * Cor do aviso. `info` (azul, padrão), `warning` (âmbar), `success`
   * (esmeralda), `danger` (vermelho), `violet`/`purple` (aguardando
   * assinatura) e `neutral` (cinza, modo consulta).
   */
  tone?: AlertTone;
  /** Componente de ícone à esquerda (ex.: `AlertTriangle` do lucide-react). */
  icon?: ComponentType<{ className?: string }>;
  /**
   * Título. Na variante `default` fica numa linha própria, em peso médio; na
   * `stage` abre o parágrafo em negrito ("Etapa 3 — Elaboração.").
   */
  title?: ReactNode;
  children?: ReactNode;
  /** Botões ou links abaixo do texto. */
  actions?: ReactNode;
  /** Mostra o botão de fechar e chama esta função ao clicar. */
  onClose?: () => void;
  closeLabel?: string;
  /**
   * `default`: título em cima e texto embaixo.
   * `stage`: o aviso de etapa do documento — título em negrito na mesma
   * linha do texto (DocumentoEditorPanel do SGDM).
   */
  variant?: 'default' | 'stage';
  /** `md` (padrão): 16×12px de espaço e raio de 12px. `sm`: compacto, para dentro de formulário. */
  size?: 'sm' | 'md';
  /**
   * Papel ARIA. Padrão: `alert` no tom `danger` (erro que acabou de
   * acontecer) e `note` nos demais (orientação fixa da tela). Use `status`
   * para um aviso que aparece depois de uma ação e não é erro.
   */
  role?: 'alert' | 'status' | 'note';
}

const ESPACO = {
  sm: 'rounded-control px-3 py-2',
  md: 'rounded-callout px-4 py-3',
} as const;

/** Texto do corpo: 900 nos avisos, 800 no erro (red-800 é o do SGDM). */
function corDoTexto(tone: AlertTone): string {
  return tone === 'danger' ? TONE_TEXT.danger : TONE_TEXT_DEEP[tone];
}

/** Aviso em caixa colorida (callout): orientação, alerta, sucesso ou erro. */
export function Alert({
  tone = 'info',
  icon: Icon,
  title,
  children,
  actions,
  onClose,
  closeLabel = 'Fechar aviso',
  variant = 'default',
  size = 'md',
  role,
}: AlertProps) {
  const papel = role ?? (tone === 'danger' ? 'alert' : 'note');
  const temTitulo = title != null && title !== false && title !== '';
  const iconeGrande = temTitulo && variant === 'default' && size === 'md';

  const corpo =
    variant === 'stage' ? (
      <p>
        {temTitulo && (
          <>
            <strong>{title}</strong>{' '}
          </>
        )}
        {children}
      </p>
    ) : (
      <>
        {temTitulo && <p className="font-medium">{title}</p>}
        {children != null && <div className={cn(temTitulo && 'mt-1')}>{children}</div>}
      </>
    );

  return (
    <div
      role={papel}
      data-tone={tone}
      data-variant={variant}
      className={cn(
        'flex items-start gap-3 border text-sm',
        size === 'sm' && 'gap-2',
        ESPACO[size],
        TONE_BORDER[tone],
        TONE_BG_SOFT[tone],
        corDoTexto(tone),
      )}
    >
      {Icon != null && (
        <Icon className={cn('mt-0.5 shrink-0', iconeGrande ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        {corpo}
        {actions != null && <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {onClose != null && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="focus-ring -mr-1 -mt-0.5 shrink-0 rounded-xs p-0.5 opacity-70 transition hover:opacity-100"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

/** Mesmo componente, com o nome usado nos guias de design. */
export const Callout = Alert;
export type CalloutProps = AlertProps;
