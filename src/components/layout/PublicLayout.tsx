import type { ComponentType, ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../cn';

export type PublicLayoutWidth = 'sm' | 'md';

export interface PublicLayoutProps {
  title: ReactNode;
  /** Linha abaixo do título (ex.: "Informe o código impresso no documento"). */
  description?: ReactNode;
  /** Ícone do cabeçalho. Padrão: `ShieldCheck` (o escudo da verificação). */
  icon?: ComponentType<{ className?: string }>;
  /**
   * `sm` (512px, padrão): formulário curto, como a entrada do código.
   * `md` (768px): página de resultado, com lista de dados.
   */
  width?: PublicLayoutWidth;
  /** Rodapé centralizado (ex.: a lei que ampara a assinatura). */
  footer?: ReactNode;
  children: ReactNode;
}

const LARGURA: Record<PublicLayoutWidth, string> = {
  sm: 'max-w-public-sm py-16',
  md: 'max-w-public-md py-10',
};

/**
 * Página pública, sem login e sem menu (`app/validar/*` do SGDM): coluna
 * estreita, cabeçalho com escudo, conteúdo e rodapé discreto.
 */
export function PublicLayout({ title, description, icon: Icone = ShieldCheck, width = 'sm', footer, children }: PublicLayoutProps) {
  return (
    <main className={cn('mx-auto min-h-screen w-full px-4', LARGURA[width])} data-width={width}>
      <header className="mb-8 flex items-center gap-3">
        <Icone className="h-8 w-8 shrink-0 text-accent-text" aria-hidden />
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {description != null && <p className="text-sm text-muted">{description}</p>}
        </div>
      </header>
      {children}
      {footer != null && <footer className="mt-8 text-center text-xs text-subtle">{footer}</footer>}
    </main>
  );
}
