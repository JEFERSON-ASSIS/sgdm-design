import { useId, type ComponentType, type ElementType, type ReactNode } from 'react';
import { Bell, Check, Loader2, X } from 'lucide-react';
import { cn } from '../cn';
import { CounterBadge } from './CounterBadge';
import { classePainel, montarGatilho, usePopoverCore, type PopoverAlign } from './Popover';

export interface NotificationItem {
  id: string;
  title: ReactNode;
  /** Texto da notificação (cortado em duas linhas). */
  message?: ReactNode;
  /** Referência em destaque (ex.: o protocolo do documento). */
  meta?: ReactNode;
  /** Quando, já formatado (ex.: "há 5 min"). */
  time?: ReactNode;
  read?: boolean;
  /** Ícone do tipo de notificação. Padrão: o sino. */
  icon?: ComponentType<{ className?: string }>;
  /** Com `href`, o item é um link. */
  href?: string;
}

export interface NotificationBellProps {
  /** Quantas não lidas. Mostra a bolinha ("9+" acima de 9). */
  count: number;
  items?: NotificationItem[];
  /** Nome do botão. Padrão: "Notificações". */
  label?: string;
  /** Título do painel. Padrão: o `label`. */
  title?: ReactNode;
  /** Ícone do botão (ex.: `Mail` para mensagens). Padrão: `Bell`. */
  icon?: ComponentType<{ className?: string }>;
  /** Máximo antes do "+" na bolinha. Padrão: 9. */
  max?: number;
  loading?: boolean;
  /** Mensagem de erro ao carregar a lista. */
  error?: ReactNode;
  /** Com erro, mostra "Tentar novamente". */
  onRetry?: () => void;
  /** Erro de uma ação (marcar como lida), numa faixa acima da lista. */
  actionError?: ReactNode;
  /** Chamado ao clicar num item (ex.: marcar como lida). O painel fecha. */
  onItemClick?: (item: NotificationItem) => void;
  /** Com esta função e não lidas, aparece "Marcar todas como lidas". */
  onMarkAllRead?: () => void;
  markAllLoading?: boolean;
  markAllLabel?: string;
  emptyMessage?: ReactNode;
  /** Link do rodapé (ex.: "/notificacoes"). */
  footerHref?: string;
  footerLabel?: string;
  /** Componente de link do roteador para itens e rodapé. Padrão: `<a>`. */
  linkComponent?: ElementType;
  /** Aberto (modo controlado) — útil para carregar a lista só ao abrir. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopoverAlign;
  /** Texto lido para a contagem. Padrão: "N não lidas". */
  countLabel?: (count: number) => string;
}

/**
 * Sino de notificações do cabeçalho: bolinha com a contagem, painel com
 * título, "marcar todas como lidas", lista com ponto de não lida e link para
 * ver todas. Não busca nada: os dados e as ações chegam por prop.
 */
export function NotificationBell({
  count,
  items = [],
  label = 'Notificações',
  title,
  icon: Icone = Bell,
  max = 9,
  loading = false,
  error,
  onRetry,
  actionError,
  onItemClick,
  onMarkAllRead,
  markAllLoading = false,
  markAllLabel = 'Marcar todas como lidas',
  emptyMessage = 'Nenhuma notificação ainda.',
  footerHref,
  footerLabel = 'Ver todas as notificações',
  linkComponent: LinkTag = 'a',
  open,
  defaultOpen,
  onOpenChange,
  align = 'end',
  countLabel = (n) => `${n} não ${n === 1 ? 'lida' : 'lidas'}`,
}: NotificationBellProps) {
  const nucleo = usePopoverCore({ open, defaultOpen, onOpenChange });
  const base = useId();
  const painelId = `sd-notificacoes-${base}`;
  const tituloId = `sd-notificacoes-titulo-${base}`;
  const nomeBotao = count > 0 ? `${label} (${countLabel(count)})` : label;

  function clicarItem(item: NotificationItem) {
    onItemClick?.(item);
    nucleo.fechar(false);
  }

  const gatilho = (
    <button
      type="button"
      aria-label={nomeBotao}
      title={label}
      className={cn(
        'focus-ring relative rounded-control p-2 text-body transition hover:bg-surface-muted',
        nucleo.aberto && 'bg-surface-muted',
      )}
    >
      <Icone className="h-5 w-5" aria-hidden />
      <span aria-hidden>
        <CounterBadge count={count} max={max} placement="corner" />
      </span>
    </button>
  );

  return (
    <div ref={nucleo.raiz} className="relative inline-block" onBlur={nucleo.aoPerderFoco}>
      <span ref={nucleo.ancora} className="inline-flex">
        {montarGatilho(gatilho, nucleo, painelId, 'dialog', 'panel')}
      </span>
      {/* Anuncia quando chegam notificações novas, sem depender do foco. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {count > 0 ? `${label}: ${countLabel(count)}` : ''}
      </span>

      {nucleo.aberto && (
        <div
          ref={nucleo.painel}
          id={painelId}
          role="dialog"
          aria-labelledby={tituloId}
          tabIndex={-1}
          className={classePainel(align, 'bottom', 'md')}
        >
          <div className="flex items-center justify-between border-b border-border-subtle bg-surface-hover/80 px-4 py-3">
            <h3 id={tituloId} className="text-sm font-semibold text-foreground">
              {title ?? label}
            </h3>
            <button
              type="button"
              onClick={() => nucleo.fechar(true)}
              aria-label="Fechar"
              className="focus-ring rounded-xs p-1 text-subtle transition hover:bg-border hover:text-body"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {count > 0 && onMarkAllRead != null && (
            <div className="flex justify-end border-b border-border-subtle px-3 py-2">
              <button
                type="button"
                onClick={onMarkAllRead}
                disabled={markAllLoading}
                className="focus-ring inline-flex items-center gap-1 rounded-xs text-xs font-medium text-accent hover:underline disabled:opacity-50"
              >
                {markAllLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                ) : (
                  <Check className="h-3 w-3" aria-hidden />
                )}
                {markAllLabel}
              </button>
            </div>
          )}

          {actionError != null && actionError !== '' && (
            <p role="alert" className="border-b border-danger-tint bg-danger-soft px-4 py-2 text-xs text-danger-hover">
              {actionError}
            </p>
          )}

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p role="status" className="px-4 py-8 text-center text-sm text-muted">
                Carregando…
              </p>
            ) : error != null && error !== '' ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <p role="alert" className="text-sm text-danger-strong">
                  {error}
                </p>
                {onRetry != null && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="focus-ring rounded-xs text-xs font-medium text-accent hover:underline"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">{emptyMessage}</p>
            ) : (
              <ul>
                {items.map((n) => {
                  const TipoIcone = n.icon ?? Bell;
                  const lida = n.read === true;
                  const conteudo = (
                    <>
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-pill',
                          lida ? 'bg-surface-muted' : 'bg-primary-soft',
                        )}
                        aria-hidden
                      >
                        <TipoIcone className={cn('h-4 w-4', lida ? 'text-subtle' : 'text-accent')} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-sm leading-snug',
                            lida ? 'text-body' : 'font-medium text-foreground',
                          )}
                        >
                          {n.title}
                        </span>
                        {n.message != null && (
                          <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{n.message}</span>
                        )}
                        {n.meta != null && <span className="mt-1 block text-xs font-medium text-accent">{n.meta}</span>}
                        {n.time != null && <span className="mt-1 block text-2xs text-subtle">{n.time}</span>}
                      </span>
                      {!lida && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-pill bg-primary-light">
                          <span className="sr-only">não lida</span>
                        </span>
                      )}
                    </>
                  );
                  const classe = cn(
                    'flex w-full gap-3 px-4 py-3 text-left transition hover:bg-surface-hover',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light',
                    !lida && 'bg-primary-soft/30',
                  );
                  return (
                    <li key={n.id} data-read={lida}>
                      {n.href != null ? (
                        <LinkTag href={n.href} className={classe} onClick={() => clicarItem(n)}>
                          {conteudo}
                        </LinkTag>
                      ) : (
                        <button type="button" className={classe} onClick={() => clicarItem(n)}>
                          {conteudo}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {footerHref != null && (
            <div className="border-t border-border-subtle bg-surface-hover/50 px-4 py-2.5 text-center">
              <LinkTag
                href={footerHref}
                onClick={() => nucleo.fechar(false)}
                className="focus-ring rounded-xs text-xs font-medium text-accent hover:underline"
              >
                {footerLabel}
              </LinkTag>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
