import type { ReactNode } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { IconButton } from './IconButton';
import { Spinner } from './Spinner';

export type PdfViewerVariant = 'panel' | 'page';

export interface PdfViewerProps {
  /** Endereço do PDF (URL comum ou `blob:`). Sem ele, mostra o carregando. */
  src?: string | null;
  /** Nome do documento para leitores de tela (ex.: "Prévia do documento"). */
  title: string;
  /**
   * `panel` (padrão): quadro cinza com cabeçalho, toolbar pequena e o PDF num
   * `iframe` de 420px — a prévia ao lado do editor.
   * `page`: card que ocupa a altura da tela, com `object` e o link de
   * download como alternativa para navegador sem leitor de PDF embutido.
   */
  variant?: PdfViewerVariant;
  /** Variante `panel`: texto do cabeçalho. Padrão: "Como o documento vai ficar". */
  heading?: ReactNode;
  /** Força o carregando (ex.: gerando o PDF de novo). */
  loading?: boolean;
  /** Mensagem de erro no lugar do PDF. */
  error?: ReactNode;
  /** Com erro, mostra "Tentar de novo". */
  onRetry?: () => void;
  /** Mostra o botão de atualizar na toolbar. */
  onRefresh?: () => void;
  /**
   * Baixar: com esta função, o botão chama ela; sem ela, o botão é um link
   * `download` para o `src`.
   */
  onDownload?: () => void;
  /** Nome do arquivo baixado (ex.: "portaria-12-2026.pdf"). */
  downloadName?: string;
  /** Esconde a barra do leitor de PDF do navegador (`#toolbar=0`). Padrão: `true` no `panel`. */
  hideNativeToolbar?: boolean;
  /** Botões extras na toolbar (variante `panel`). */
  actions?: ReactNode;
  /** Texto de quando o navegador não mostra PDF (variante `page`). */
  fallbackMessage?: ReactNode;
  downloadLabel?: string;
  refreshLabel?: string;
  retryLabel?: string;
  loadingLabel?: string;
}

function comFragmento(src: string, esconder: boolean): string {
  if (!esconder || src.includes('#')) return src;
  return `${src}#toolbar=0&navpanes=0`;
}

/** Visualizador de PDF embutido, com carregando, erro e alternativa de download. */
export function PdfViewer({
  src,
  title,
  variant = 'panel',
  heading = 'Como o documento vai ficar',
  loading = false,
  error,
  onRetry,
  onRefresh,
  onDownload,
  downloadName,
  hideNativeToolbar,
  actions,
  fallbackMessage = 'Seu navegador não exibe PDF embutido.',
  downloadLabel = 'Baixar PDF',
  refreshLabel = 'Atualizar prévia',
  retryLabel = 'Tentar de novo',
  loadingLabel = 'Carregando o PDF…',
}: PdfViewerProps) {
  const temErro = error != null && error !== '';
  const carregando = loading || (!temErro && !src);
  const url = !carregando && !temErro && src ? src : null;
  const pronto = url != null;

  const erroBox = temErro && (
    <div role="alert" className="rounded-xs border border-warning-border bg-warning-soft px-3 py-4 text-center">
      <p className="text-xs text-warning-deep">{error}</p>
      {onRetry != null && (
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring mt-2 rounded-xs text-xs font-medium text-warning-text underline"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );

  if (variant === 'page') {
    if (temErro) return <div className="card p-5">{erroBox}</div>;
    if (url == null) {
      return (
        <div className="card flex min-h-editor-frame items-center justify-center p-12">
          <Spinner size="lg" label={loadingLabel} />
        </div>
      );
    }
    return (
      <div className="card overflow-hidden p-0">
        <object
          data={comFragmento(url, hideNativeToolbar ?? false)}
          type="application/pdf"
          aria-label={title}
          className="h-[calc(100vh-14rem)] min-h-editor-frame w-full"
        >
          <p className="p-6 text-sm text-body">
            {fallbackMessage}{' '}
            <a href={url} download={downloadName ?? true} className="text-accent underline">
              {downloadLabel}
            </a>
          </p>
        </object>
      </div>
    );
  }

  return (
    <div className="rounded-control border border-border-subtle bg-surface-hover p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-label">
          <FileText className="h-3.5 w-3.5 text-subtle" aria-hidden />
          {heading}
        </p>
        <div className="flex items-center gap-1">
          {actions}
          {onRefresh != null && (
            <IconButton
              size="xs"
              icon={<RefreshCw />}
              aria-label={refreshLabel}
              onClick={onRefresh}
              loading={loading}
            />
          )}
          {onDownload != null ? (
            <IconButton size="xs" icon={<Download />} aria-label={downloadLabel} onClick={onDownload} disabled={!pronto} />
          ) : (
            url != null && (
              <a
                href={url}
                download={downloadName ?? true}
                aria-label={downloadLabel}
                title={downloadLabel}
                className="focus-ring inline-flex h-6 w-6 items-center justify-center rounded-xs text-subtle transition hover:bg-surface-muted hover:text-body"
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
              </a>
            )
          )}
        </div>
      </div>

      {temErro ? (
        erroBox
      ) : (
        <div className="overflow-hidden rounded-xs border border-border bg-surface">
          {url != null ? (
            <iframe src={comFragmento(url, hideNativeToolbar ?? true)} title={title} className="block min-h-editor w-full" />
          ) : (
            <div className="flex min-h-editor items-center justify-center">
              <Spinner size="md" tone="muted" label={loadingLabel} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
