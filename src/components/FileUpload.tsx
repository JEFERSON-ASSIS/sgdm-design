import { useId, useRef, useState, type ReactNode } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { cn } from '../cn';
import { Button, type ButtonSize, type ButtonVariant } from './Button';
import { IconButton } from './IconButton';
import { IconTile } from './IconTile';

/** O arquivo passa no `accept` do input? (extensão, tipo exato ou `tipo/*`). */
export function fileMatchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const nome = file.name.toLowerCase();
  const tipo = (file.type || '').toLowerCase();
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((regra) => {
      if (regra.startsWith('.')) return nome.endsWith(regra);
      if (regra.endsWith('/*')) return tipo.startsWith(regra.slice(0, -1));
      return tipo === regra;
    });
}

/** 1536 → "1,5 KB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} KB`;
  return `${(kb / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}

export interface FileButtonProps {
  /** Recebe os arquivos escolhidos (lista vazia não chama). */
  onFiles: (files: File[]) => void;
  /** Tipos aceitos, como no input (ex.: `application/pdf,.pdf`). */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícone já montado (padrão: `<Upload />`). `null` tira o ícone. */
  icon?: ReactNode;
  /** `name` do input, para envio de formulário. */
  name?: string;
  children: ReactNode;
}

/**
 * Botão que abre o seletor de arquivos (o "Carregar assinado" do SGDM). É um
 * `<button>` de verdade, então funciona pelo teclado; o input fica escondido.
 */
export function FileButton({
  onFiles,
  accept,
  multiple = false,
  disabled,
  loading,
  loadingLabel,
  variant = 'secondary',
  size,
  icon = <Upload />,
  name,
  children,
}: FileButtonProps) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled || loading}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => {
          const lista = Array.from(e.target.files ?? []);
          // Limpa para que escolher o mesmo arquivo de novo dispare o change.
          e.target.value = '';
          if (lista.length) onFiles(lista);
        }}
      />
      <Button
        variant={variant}
        size={size}
        icon={icon ?? undefined}
        disabled={disabled}
        loading={loading}
        loadingLabel={loadingLabel}
        onClick={() => input.current?.click()}
      >
        {children}
      </Button>
    </>
  );
}

export interface FileUploadProps {
  /** Arquivos escolhidos (controlado). */
  files: File[];
  onChange: (files: File[]) => void;
  /** Tipos aceitos. Padrão: o do SGDM (PDF, DOC e imagens). */
  accept?: string;
  /** Máximo de arquivos (padrão 5). Os que passam disso são ignorados. */
  maxFiles?: number;
  /** Título da área. Padrão: "Arraste arquivos ou clique para selecionar". */
  title?: ReactNode;
  /** Linha de ajuda. Padrão: "PDF, DOC ou imagens — máx. 5 arquivo(s)". */
  hint?: ReactNode;
  /** Texto do botão. Padrão: "Selecionar arquivos". */
  buttonLabel?: ReactNode;
  /** Nome do botão de remover, por arquivo. Padrão: "Remover <nome>". */
  removeLabel?: (file: File) => string;
  /** Mostra o tamanho de cada arquivo na lista (padrão: sim). */
  showSize?: boolean;
  /** Chamado com os arquivos soltos que não batem com `accept`. */
  onReject?: (files: File[]) => void;
  disabled?: boolean;
  /** Mensagem de erro abaixo da área. */
  error?: ReactNode;
}

/** Área de arrastar e soltar, com botão de seleção, lista de arquivos e remoção. */
export function FileUpload({
  files,
  onChange,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxFiles = 5,
  title = 'Arraste arquivos ou clique para selecionar',
  hint,
  buttonLabel = 'Selecionar arquivos',
  removeLabel = (f) => `Remover ${f.name}`,
  showSize = true,
  onReject,
  disabled = false,
  error,
}: FileUploadProps) {
  const [arrastando, setArrastando] = useState(false);
  const base = useId();
  const tituloId = `sd-upload-${base}`;
  const dicaId = `${tituloId}-dica`;
  const erroId = `${tituloId}-erro`;
  const cheio = files.length >= maxFiles;
  const temErro = error != null && error !== false && error !== '';

  function adicionar(novos: File[]) {
    if (disabled || !novos.length) return;
    const aceitos = novos.filter((f) => fileMatchesAccept(f, accept));
    const recusados = novos.filter((f) => !fileMatchesAccept(f, accept));
    if (recusados.length) onReject?.(recusados);
    if (!aceitos.length) return;
    onChange([...files, ...aceitos].slice(0, maxFiles));
  }

  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-labelledby={tituloId}
        aria-describedby={temErro ? `${dicaId} ${erroId}` : dicaId}
        data-dragging={arrastando || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          adicionar(Array.from(e.dataTransfer?.files ?? []));
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-panel border-2 border-dashed px-6 py-8 text-center transition',
          arrastando
            ? 'border-primary-light bg-primary-soft'
            : temErro
              ? 'border-danger-border bg-danger-soft/40'
              : 'border-border bg-surface-hover/50 hover:border-primary-light/60 hover:bg-primary-soft/30',
          disabled && 'opacity-60',
        )}
      >
        <IconTile icon={Upload} tone="info" variant="tint" shape="circle" size="xl" />
        <p id={tituloId} className="mt-3 text-sm font-medium text-label">
          {title}
        </p>
        <p id={dicaId} className="mt-1 text-xs text-subtle">
          {hint ?? `PDF, DOC ou imagens — máx. ${maxFiles} arquivo(s)`}
        </p>
        <div className="mt-4">
          <FileButton accept={accept} multiple={maxFiles > 1} disabled={disabled || cheio} onFiles={adicionar} icon={null}>
            {buttonLabel}
          </FileButton>
        </div>
      </div>

      {temErro && (
        <p id={erroId} className="text-xs text-danger-strong">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="space-y-2" aria-label="Arquivos selecionados">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-2 rounded-control border border-border bg-surface py-1 pl-3 pr-1 text-sm"
            >
              <FileText className="h-4 w-4 shrink-0 text-subtle" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-label">{file.name}</span>
              {showSize && <span className="shrink-0 text-xs text-subtle">{formatFileSize(file.size)}</span>}
              <IconButton
                icon={<X />}
                aria-label={removeLabel(file)}
                variant="danger"
                size="sm"
                disabled={disabled}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
