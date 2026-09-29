import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '../cn';
import { EDITOR_FONT_SIZES } from '../tokens';

/* ------------------------------------------------------------------ */
/* DocumentContent                                                     */
/* ------------------------------------------------------------------ */

export interface DocumentContentProps {
  /**
   * HTML do documento (a saída do editor). É inserido como está: sanitize
   * antes, se ele vier de fora. Sem `html`, vale `children`.
   */
  html?: string;
  children?: ReactNode;
  /** `page` põe a margem da folha do editor (32px × 24px). Padrão: `none`. */
  padding?: 'none' | 'page';
  /** Altura mínima da área do editor (420px), para o modo leitura ficar do tamanho da edição. */
  minHeight?: boolean;
  /** Texto justificado, como nas peças impressas. */
  justify?: boolean;
}

/**
 * Texto de documento oficial em modo leitura: Times 12pt, títulos, listas,
 * citações e tabelas com a aparência do editor. Substitui o `prose` do SGDM,
 * que não funciona lá (o plugin de tipografia não está instalado).
 */
export function DocumentContent({ html, children, padding = 'none', minHeight = false, justify = false }: DocumentContentProps) {
  const classe = cn('documento', padding === 'page' && 'px-8 py-6', minHeight && 'min-h-editor', justify && 'text-justify');
  if (html != null) return <div className={classe} dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className={classe}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* EditorFrame                                                         */
/* ------------------------------------------------------------------ */

export interface EditorFrameProps {
  /** A barra de ferramentas (`<EditorToolbar>`). Omitida em modo leitura. */
  toolbar?: ReactNode;
  /** A área editável (ex.: `<EditorContent editor={editor} />` do Tiptap). */
  children?: ReactNode;
  /** Modo leitura: mostra este HTML com os estilos de documento, sem toolbar. */
  html?: string;
  /** O editor ainda está carregando (o Tiptap monta só no cliente). */
  loading?: boolean;
  /** Padrão: "Carregando editor…". */
  loadingLabel?: ReactNode;
  /** Nome da área para leitores de tela (ex.: "Texto da portaria"). */
  label?: string;
}

/**
 * Moldura do editor de texto rico: borda, toolbar e a "folha" com a fonte de
 * documento. Não traz o Tiptap: a tela monta o editor e o põe aqui dentro.
 * O CSS de `.editor-document-page .ProseMirror` (margem, altura mínima,
 * títulos, marcadores a preencher) já vem no preset.
 */
export function EditorFrame({
  toolbar,
  children,
  html,
  loading = false,
  loadingLabel = 'Carregando editor…',
  label,
}: EditorFrameProps) {
  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-editor-frame items-center justify-center rounded-panel border border-border bg-surface text-sm text-subtle"
      >
        {loadingLabel}
      </div>
    );
  }
  const leitura = html != null;
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      data-mode={leitura ? 'read' : 'edit'}
      className="overflow-hidden rounded-panel border border-border bg-surface"
    >
      {!leitura && toolbar}
      {leitura ? (
        <DocumentContent html={html} padding="page" minHeight />
      ) : (
        <div className="editor-document-page documento bg-surface">{children}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EditorToolbar                                                       */
/* ------------------------------------------------------------------ */

export interface EditorToolbarProps {
  /** Nome da barra. Padrão: "Formatação". */
  label?: string;
  /** Botões, separadores e o seletor de tamanho. */
  children: ReactNode;
}

const FOCAVEIS_TOOLBAR = 'button:not([disabled]), select:not([disabled])';

/**
 * Barra de ferramentas do editor (`role="toolbar"`). As setas ←/→ andam entre
 * os controles, e Home/End vão ao primeiro e ao último.
 */
export function EditorToolbar({ label = 'Formatação', children }: EditorToolbarProps) {
  function aoTeclar(e: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    // Dentro do select, as setas mudam o valor; não roubar.
    if ((e.target as HTMLElement).tagName === 'SELECT' && e.key !== 'Home' && e.key !== 'End') return;
    const itens = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCAVEIS_TOOLBAR));
    if (itens.length === 0) return;
    const atual = itens.indexOf(document.activeElement as HTMLElement);
    let proximo = atual;
    if (e.key === 'Home') proximo = 0;
    else if (e.key === 'End') proximo = itens.length - 1;
    else if (e.key === 'ArrowRight') proximo = (atual + 1) % itens.length;
    else proximo = (atual - 1 + itens.length) % itens.length;
    e.preventDefault();
    itens[proximo]?.focus();
  }

  return (
    <div
      role="toolbar"
      aria-label={label}
      aria-orientation="horizontal"
      onKeyDown={aoTeclar}
      className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface-hover px-2 py-1.5"
    >
      {children}
    </div>
  );
}

export interface EditorToolbarButtonProps {
  /** Nome do comando (vira `aria-label` e dica). Ex.: "Negrito". */
  label: string;
  /** Ícone já montado (ex.: `<Bold />`). Sem ícone, use `children` (ex.: "H1"). */
  icon?: ReactNode;
  children?: ReactNode;
  /**
   * Formatação ligada na seleção (negrito ativo). Com `active` definido, o
   * botão é de alternar (`aria-pressed`); sem ele, é um comando (desfazer).
   */
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * Botão da toolbar: quadrado pequeno, raio de 4px, azul-claro quando ativo.
 * Não tira o foco do editor ao ser clicado com o mouse.
 */
export function EditorToolbarButton({ label, icon, children, active, disabled, onClick }: EditorToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'focus-ring inline-flex items-center justify-center rounded-xs p-1.5 transition disabled:cursor-not-allowed disabled:opacity-40 [&>svg]:h-4 [&>svg]:w-4',
        active ? 'bg-primary-ring text-accent-text' : 'text-body hover:bg-border',
      )}
    >
      {icon ?? <span className="px-0.5 text-xs font-bold">{children}</span>}
    </button>
  );
}

/** Traço vertical entre grupos de botões da toolbar. */
export function EditorToolbarSeparator() {
  return <span role="separator" aria-orientation="vertical" className="mx-1 h-5 w-px bg-border-strong" />;
}

export interface EditorFontSizeSelectProps {
  /** Tamanho atual (ex.: "12pt"), ou `''` quando a seleção mistura tamanhos. */
  value: string;
  onChange: (value: string) => void;
  /** Opções. Padrão: `EDITOR_FONT_SIZES` (10pt a 18pt). */
  sizes?: readonly string[];
  /** Opção vazia. Padrão: "Tamanho". */
  placeholder?: string;
  /** Nome do campo. Padrão: "Tamanho da fonte". */
  label?: string;
  disabled?: boolean;
}

/** Seletor de tamanho da fonte da toolbar; mostra os números sem o "pt". */
export function EditorFontSizeSelect({
  value,
  onChange,
  sizes = EDITOR_FONT_SIZES,
  placeholder = 'Tamanho',
  label = 'Tamanho da fonte',
  disabled,
}: EditorFontSizeSelectProps) {
  return (
    <select
      title={label}
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="mr-1 rounded-xs border border-border bg-surface px-1.5 py-1 text-xs text-label outline-none transition focus:border-primary-light focus-visible:ring-2 focus-visible:ring-primary-ring disabled:opacity-40"
    >
      <option value="">{placeholder}</option>
      {sizes.map((t) => (
        <option key={t} value={t}>
          {t.replace('pt', '')}
        </option>
      ))}
    </select>
  );
}
