import type { ComponentType, ReactNode } from 'react';
import { cn } from '../../cn';
import { Button } from '../Button';
import { IconTile } from '../IconTile';

export interface ErrorPageProps {
  /** Título. Padrão: "Algo deu errado". */
  title?: ReactNode;
  /**
   * O erro capturado (o `error` do `error.tsx` do Next). A mensagem dele é
   * mostrada; sem mensagem, vale `description`.
   */
  error?: Error | string | null;
  /** Texto quando o erro não traz mensagem. Padrão: "Ocorreu um erro inesperado.". */
  description?: ReactNode;
  /** Mostra o botão de tentar de novo (o `reset` do Next). */
  onRetry?: () => void;
  /** Rótulo do botão. Padrão: "Tentar novamente". */
  retryLabel?: ReactNode;
  /** Outras ações (ex.: link para o início). Ficam ao lado do botão. */
  actions?: ReactNode;
  /** Ícone opcional acima do título, num círculo vermelho claro. */
  icon?: ComponentType<{ className?: string }>;
  /**
   * `true` (padrão): ocupa a tela inteira (o `app/error.tsx`). `false`: só a
   * área de conteúdo, dentro do `AppLayout`.
   */
  fullScreen?: boolean;
}

/**
 * Página inteira de erro (o `app/error.tsx` do SGDM). Para erro de uma
 * consulta dentro de uma tela, use o `ErrorState`.
 */
export function ErrorPage({
  title = 'Algo deu errado',
  error,
  description = 'Ocorreu um erro inesperado.',
  onRetry,
  retryLabel = 'Tentar novamente',
  actions,
  icon,
  fullScreen = true,
}: ErrorPageProps) {
  const mensagem = typeof error === 'string' ? error : error?.message;
  // Dentro do AppLayout já existe um <main>.
  const Tag = fullScreen ? 'main' : 'div';
  return (
    <Tag
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-6',
        fullScreen ? 'min-h-screen bg-surface-hover' : 'py-16',
      )}
    >
      {icon != null && <IconTile icon={icon} tone="danger" shape="circle" size="xl" />}
      {/* Anunciado ao aparecer: no Next, o error.tsx troca a tela sem recarregar. */}
      <div role="alert" className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold text-title">{title}</h1>
        <p className="max-w-form text-center text-sm text-muted">{mensagem || description}</p>
      </div>
      {(onRetry != null || actions != null) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {onRetry != null && <Button onClick={onRetry}>{retryLabel}</Button>}
          {actions}
        </div>
      )}
    </Tag>
  );
}
