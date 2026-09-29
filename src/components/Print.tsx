import { useId, type ReactNode } from 'react';
import { cn } from '../cn';

/*
 * A folha impressa do processo (`licitacoes/[id]/processo/page.tsx` do SGDM).
 * Na tela, uma folha branca de 820px com sombra; no papel (com o
 * `@sgdm/design/print.css` importado), A4 com margens de 20mm × 18mm, sem a
 * moldura da aplicação, e cada peça numa página nova.
 */

export interface NoPrintProps {
  children: ReactNode;
}

/** Aparece na tela e some no papel (classe `.nao-imprimir`). */
export function NoPrint({ children }: NoPrintProps) {
  return <div className="nao-imprimir">{children}</div>;
}

export interface PrintSheetProps {
  /** Barra acima da folha, só na tela (voltar, "Imprimir", avisos). */
  toolbar?: ReactNode;
  /** Nome da folha para leitores de tela (ex.: "Processo 12/2026"). */
  label?: string;
  children: ReactNode;
}

/** A folha: `<article class="folha-processo">`. No papel, a fonte vira a de documento (Times 12pt). */
export function PrintSheet({ toolbar, label, children }: PrintSheetProps) {
  return (
    <div className="space-y-4">
      {toolbar != null && <NoPrint>{toolbar}</NoPrint>}
      <article
        aria-label={label}
        className="folha-processo mx-auto max-w-print-sheet bg-surface px-10 py-8 text-foreground shadow-card"
      >
        {children}
      </article>
    </div>
  );
}

export interface PrintCoverProps {
  /** Órgão (ex.: "Prefeitura Municipal de Passo Fundo"). */
  organization: ReactNode;
  /** Linha abaixo do órgão (ex.: "Passo Fundo — RS"). */
  location?: ReactNode;
  /** Título da capa (ex.: "Processo de Contratação"). */
  title: ReactNode;
  /** Número do processo, em fonte mono. */
  code?: ReactNode;
}

/** Capa da folha: órgão, título em caixa-alta e número, com um traço grosso embaixo. */
export function PrintCover({ organization, location, title, code }: PrintCoverProps) {
  return (
    <header className="mb-8 border-b-2 border-title pb-6 text-center">
      <p className="text-sm uppercase tracking-wide">{organization}</p>
      {location != null && <p className="text-xs text-body">{location}</p>}
      <h1 className="mt-6 text-xl font-bold uppercase">{title}</h1>
      {code != null && <p className="mt-1 font-mono text-lg">{code}</p>}
    </header>
  );
}

export interface PrintSectionProps {
  title: ReactNode;
  /** Linha abaixo do título (ex.: o fundamento legal da peça). */
  subtitle?: ReactNode;
  /** Código em fonte mono (ex.: o protocolo da peça). */
  code?: ReactNode;
  /** À direita do título (ex.: "Fls. 3"). */
  aside?: ReactNode;
  /**
   * Uma peça do processo: título maior, traço em cima, começa numa página
   * nova e o título não fica sozinho no pé da página anterior.
   */
  piece?: boolean;
  /** Começa numa página nova no papel. Padrão: sim nas peças, não nas seções. */
  breakBefore?: boolean;
  children?: ReactNode;
}

/** Seção da folha ("Identificação", "Itens") ou peça (`piece`). */
export function PrintSection({ title, subtitle, code, aside, piece = false, breakBefore = piece, children }: PrintSectionProps) {
  const idTitulo = useId();
  return (
    <section
      aria-labelledby={idTitulo}
      className={cn(
        'mb-8',
        piece && 'peca-impressa',
        breakBefore && 'quebra-pagina',
        (piece || breakBefore) && 'border-t border-border-strong pt-6',
      )}
    >
      <div className={cn('flex items-start justify-between gap-4', piece ? 'mb-4' : 'mb-3')}>
        <div className="min-w-0">
          <h2 id={idTitulo} className={cn('font-bold uppercase', piece ? 'text-base' : 'text-sm tracking-wide')}>
            {title}
          </h2>
          {subtitle != null && <p className="text-xs text-body">{subtitle}</p>}
          {code != null && <p className="mt-0.5 font-mono text-xs text-muted">{code}</p>}
        </div>
        {aside != null && <span className="whitespace-nowrap text-xs text-muted">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
