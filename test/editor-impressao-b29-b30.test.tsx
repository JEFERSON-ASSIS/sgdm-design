import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bold, Italic, Undo } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import {
  AppLayout,
  Button,
  DocumentContent,
  EDITOR_FONT_SIZES,
  EditorFontSizeSelect,
  EditorFrame,
  EditorToolbar,
  EditorToolbarButton,
  EditorToolbarSeparator,
  Header,
  NoPrint,
  PrintCover,
  PrintSection,
  PrintSheet,
} from '../src';

const raiz = join(__dirname, '..');
const componentesCss = readFileSync(join(raiz, 'src/styles/components.css'), 'utf8');

describe('B29. DocumentContent e EditorFrame', () => {
  it('conteúdo de documento em modo leitura, com as classes .documento', () => {
    render(<DocumentContent html="<h1>PORTARIA</h1><p>Texto</p>" padding="page" minHeight justify />);
    const doc = screen.getByRole('heading', { level: 1 }).parentElement!;
    expect(doc).toHaveClass('documento', 'px-8', 'py-6', 'min-h-editor', 'text-justify');
    expect(screen.getByText('Texto').tagName).toBe('P');
  });

  it('o CSS de .documento devolve títulos, listas, citação e tabela', () => {
    expect(componentesCss).toMatch(/\.documento h1 \{\s*@apply text-center text-doc-14 font-bold;/);
    expect(componentesCss).toMatch(/\.documento ul \{\s*list-style: disc;/);
    expect(componentesCss).toMatch(/\.documento ol \{\s*list-style: decimal;/);
    expect(componentesCss).toContain('.documento blockquote');
    expect(componentesCss).toMatch(/\.documento td \{\s*@apply border border-border-strong/);
    expect(componentesCss).toMatch(/\.editor-document-page \.ProseMirror \{\s*@apply min-h-editor px-8 py-6/);
  });

  it('carregando, edição e leitura', () => {
    const { rerender } = render(<EditorFrame loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando editor…');
    expect(screen.getByRole('status')).toHaveClass('min-h-editor-frame', 'rounded-panel', 'text-subtle');

    rerender(
      <EditorFrame label="Texto da portaria" toolbar={<EditorToolbar><EditorToolbarSeparator /></EditorToolbar>}>
        <div data-testid="tiptap" />
      </EditorFrame>,
    );
    const moldura = screen.getByRole('group', { name: 'Texto da portaria' });
    expect(moldura).toHaveClass('overflow-hidden', 'rounded-panel', 'border-border', 'bg-surface');
    expect(within(moldura).getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('tiptap').parentElement).toHaveClass('editor-document-page', 'documento');

    rerender(<EditorFrame toolbar={<EditorToolbar><span /></EditorToolbar>} html="<p>Assinado</p>" />);
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(screen.getByText('Assinado').parentElement).toHaveClass('documento', 'min-h-editor', 'px-8');
  });
});

describe('B29. EditorToolbar', () => {
  it('botões de alternar e de comando, separador e tamanho', async () => {
    const negrito = vi.fn();
    const tamanho = vi.fn();
    render(
      <EditorToolbar>
        <EditorFontSizeSelect value="12pt" onChange={tamanho} />
        <EditorToolbarSeparator />
        <EditorToolbarButton label="Negrito" icon={<Bold />} active onClick={negrito} />
        <EditorToolbarButton label="Itálico" icon={<Italic />} active={false} onClick={() => {}} />
        <EditorToolbarButton label="Título 1" onClick={() => {}}>
          H1
        </EditorToolbarButton>
        <EditorToolbarButton label="Desfazer" icon={<Undo />} disabled onClick={() => {}} />
      </EditorToolbar>,
    );
    const barra = screen.getByRole('toolbar', { name: 'Formatação' });
    expect(barra).toHaveClass('border-b', 'border-border', 'bg-surface-hover', 'px-2', 'py-1.5');

    const b = screen.getByRole('button', { name: 'Negrito' });
    expect(b).toHaveAttribute('aria-pressed', 'true');
    expect(b).toHaveAttribute('title', 'Negrito');
    expect(b).toHaveClass('rounded-xs', 'p-1.5', 'bg-primary-ring', 'text-accent-text');
    expect(screen.getByRole('button', { name: 'Itálico' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Itálico' })).toHaveClass('text-body', 'hover:bg-border');
    expect(screen.getByRole('button', { name: 'Título 1' })).not.toHaveAttribute('aria-pressed');
    expect(screen.getByText('H1')).toHaveClass('text-xs', 'font-bold');
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeDisabled();

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByRole('separator')).toHaveClass('mx-1', 'h-5', 'w-px', 'bg-border-strong');

    await userEvent.click(b);
    expect(negrito).toHaveBeenCalledOnce();

    const select = screen.getByRole('combobox', { name: 'Tamanho da fonte' });
    expect(select).toHaveClass('rounded-xs', 'text-xs');
    const opcoes = within(select).getAllByRole('option');
    expect(opcoes.map((o) => o.textContent)).toEqual(['Tamanho', ...EDITOR_FONT_SIZES.map((t) => t.replace('pt', ''))]);
    await userEvent.selectOptions(select, '14pt');
    expect(tamanho).toHaveBeenCalledWith('14pt');
  });

  it('setas, Home e End andam entre os controles, pulando os desabilitados', async () => {
    render(
      <EditorToolbar>
        <EditorToolbarButton label="A" onClick={() => {}}>A</EditorToolbarButton>
        <EditorToolbarButton label="B" onClick={() => {}} disabled>B</EditorToolbarButton>
        <EditorToolbarButton label="C" onClick={() => {}}>C</EditorToolbarButton>
        <EditorToolbarButton label="D" onClick={() => {}}>D</EditorToolbarButton>
      </EditorToolbar>,
    );
    screen.getByRole('button', { name: 'A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'C' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'D' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'D' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
  });
});

describe('B30. print.css', () => {
  const print = readFileSync(join(raiz, 'src/styles/print.css'), 'utf8');
  const tokens = readFileSync(join(raiz, 'src/styles/tokens.css'), 'utf8');

  it('A4 com margens de 20mm e 18mm, dentro de @media print', () => {
    expect(print).toMatch(/@media print \{\s*@page \{\s*size: A4;\s*margin: 20mm 18mm;/);
  });

  it('as classes do SGDM', () => {
    for (const c of ['.nao-imprimir', '.quebra-pagina', '.folha-processo', '.peca-impressa h2']) expect(print).toContain(c);
    expect(print).toMatch(/\.quebra-pagina \{\s*break-before: page;/);
    expect(print).toMatch(/display: none !important;/);
  });

  it('vale em qualquer ordem de import: a folha perde largura, sombra e margem no papel', () => {
    expect(print).toMatch(/\.folha-processo \{\s*max-width: none !important;\s*padding: 0 !important;\s*margin: 0 !important;\s*box-shadow: none !important;/);
    expect(print).toMatch(/font-family: var\(--sd-font-document\) !important;/);
  });

  it('tabela com borda #999 e 10pt, por token, sem cor fixa', () => {
    expect(print).toMatch(/border: 1px solid rgb\(var\(--sd-color-print-border\)\)( !important)?;/);
    expect(print).toMatch(/font-size: var\(--sd-font-size-print-table\)( !important)?;/);
    expect(print).toMatch(/font-size: var\(--sd-font-size-print-body\)( !important)?;/);
    expect(tokens).toMatch(/--sd-color-print-border: 153 153 153;/);
    expect(print).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(print).not.toContain('@apply');
    for (const v of print.matchAll(/var\((--sd-[\w-]+)\)/g)) expect(tokens, v[1]).toContain(`${v[1]}:`);
  });

  it('é exportado no package.json e copiado para o dist', () => {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    expect(pkg.exports['./print.css']).toBe('./dist/print.css');
    expect(readFileSync(join(raiz, 'scripts/copiar-estilos.mjs'), 'utf8')).toContain("'print.css'");
  });
});

describe('B30. PrintSheet', () => {
  it('folha, barra só da tela, capa, seção e peça', () => {
    render(
      <PrintSheet label="Processo 12/2026" toolbar={<Button onClick={() => window.print()}>Imprimir</Button>}>
        <PrintCover organization="Prefeitura de Exemplo" location="Passo Fundo — RS" title="Processo de Contratação" code="12/2026" />
        <PrintSection title="Identificação">
          <p>dados</p>
        </PrintSection>
        <PrintSection piece title="Estudo Técnico Preliminar" subtitle="Art. 18" code="ETP-2026-0001" aside="Fls. 2">
          <p>texto</p>
        </PrintSection>
      </PrintSheet>,
    );
    const folha = screen.getByRole('article', { name: 'Processo 12/2026' });
    expect(folha).toHaveClass('folha-processo', 'mx-auto', 'max-w-print-sheet', 'bg-surface', 'px-10', 'py-8', 'shadow-card');
    expect(screen.getByRole('button', { name: 'Imprimir' }).parentElement).toHaveClass('nao-imprimir');

    const capa = within(folha).getByRole('heading', { level: 1, name: 'Processo de Contratação' }).parentElement!;
    expect(capa).toHaveClass('border-b-2', 'border-title', 'text-center');
    expect(within(capa).getByText('12/2026')).toHaveClass('font-mono', 'text-lg');

    const secao = screen.getByRole('region', { name: 'Identificação' });
    expect(secao).toHaveClass('mb-8');
    expect(secao).not.toHaveClass('quebra-pagina', 'peca-impressa');
    expect(within(secao).getByRole('heading')).toHaveClass('text-sm', 'uppercase', 'tracking-wide');

    const peca = screen.getByRole('region', { name: 'Estudo Técnico Preliminar' });
    expect(peca).toHaveClass('peca-impressa', 'quebra-pagina', 'border-t', 'border-border-strong', 'pt-6');
    expect(within(peca).getByRole('heading')).toHaveClass('text-base', 'uppercase');
    expect(within(peca).getByText('ETP-2026-0001')).toHaveClass('font-mono');
    expect(within(peca).getByText('Fls. 2')).toHaveClass('whitespace-nowrap');
  });

  it('NoPrint e quebra de página numa seção comum', () => {
    render(
      <>
        <NoPrint>aviso</NoPrint>
        <PrintSection title="Anexos" breakBefore />
      </>,
    );
    expect(screen.getByText('aviso')).toHaveClass('nao-imprimir');
    expect(screen.getByRole('region', { name: 'Anexos' })).toHaveClass('quebra-pagina', 'border-t');
  });

  it('o AppLayout sai da frente na impressão', () => {
    render(
      <AppLayout sidebar={<aside />} header={<Header title="Processo" />}>
        <p>conteúdo</p>
      </AppLayout>,
    );
    const principal = screen.getByRole('main');
    expect(principal).toHaveClass('print:overflow-visible', 'print:p-0');
    expect(principal.parentElement).toHaveClass('print:block', 'print:overflow-visible');
    expect(principal.parentElement!.parentElement).toHaveClass('print:h-auto', 'print:overflow-visible');
    expect(screen.getByRole('banner')).toHaveClass('print:hidden');
  });
});
