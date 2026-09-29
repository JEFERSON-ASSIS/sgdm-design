import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../cn';
import { useOnDark } from './OnDark';

export interface ErrorStateProps {
  /** Erro da consulta. Sem erro, nada é exibido. Aceita `Error`, texto ou `true`. */
  error: Error | string | boolean | null | undefined;
  /** Título curto do bloco. */
  title?: ReactNode;
  /** Orientação exibida quando o erro não traz mensagem própria. */
  description?: ReactNode;
  /** Ação de recuperação (ex.: botão "Tentar de novo"). */
  action?: ReactNode;
}

/**
 * Bloco de erro para telas alimentadas por consulta (o QueryErrorState do SGDM).
 * Substitui o estado vazio quando a consulta falha — senão uma falha de API
 * fica indistinguível de "nenhum resultado".
 */
export function ErrorState({
  error,
  title = 'Não foi possível carregar os dados',
  description = 'Verifique sua conexão e tente novamente.',
  action,
}: ErrorStateProps) {
  if (!error) return null;
  const mensagem = typeof error === 'string' ? error : error instanceof Error ? error.message : '';

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-callout border border-danger-border bg-danger-soft px-4 py-3 text-sm text-danger-text"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-danger-hover">{mensagem || description}</p>
        {action != null && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

export interface ErrorInlineProps {
  message?: ReactNode;
  /** `xs` (padrão, 12px) ou `sm` (14px, o erro geral do formulário de login). */
  size?: 'xs' | 'sm';
  /** Sobre fundo escuro: vermelho claro (`on-dark-error`). Dentro de `AuthLayout` já vem ligado. */
  onDark?: boolean;
}

/** Variante compacta para cabeçalhos, dropdowns, seletores e o erro geral de um formulário. */
export function ErrorInline({ message = 'Falha ao carregar.', size = 'xs', onDark }: ErrorInlineProps) {
  const escuro = useOnDark(onDark);
  return (
    <span
      role="alert"
      className={cn(
        'inline-flex items-center gap-1.5',
        size === 'sm' ? 'text-sm' : 'text-xs',
        escuro ? 'text-on-dark-error' : 'text-danger-hover',
      )}
    >
      <AlertCircle className={cn('shrink-0', size === 'sm' ? 'h-4 w-4' : 'h-3.5 w-3.5')} aria-hidden />
      {message}
    </span>
  );
}
