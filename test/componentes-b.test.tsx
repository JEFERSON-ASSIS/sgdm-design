import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertTriangle, FileText, Plus, Tag as TagIcon, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Alert,
  Button,
  Callout,
  Chip,
  EmptyState,
  Eyebrow,
  IconButton,
  IconTile,
  LoadingState,
  Overline,
  PageSkeleton,
  Skeleton,
  Spinner,
  StatCard,
  Tag,
  TONES,
} from '../src';

describe('B1. Alert / Callout', () => {
  it.each([
    ['info', 'border-info-border', 'bg-info-soft', 'text-info-deep'],
    ['warning', 'border-warning-border', 'bg-warning-soft', 'text-warning-deep'],
    ['success', 'border-success-border', 'bg-success-soft', 'text-success-deep'],
    ['danger', 'border-danger-border', 'bg-danger-soft', 'text-danger-text'],
    ['violet', 'border-violet-border', 'bg-violet-soft', 'text-violet-deep'],
    ['neutral', 'border-border', 'bg-surface-hover', 'text-label'],
  ] as const)('tom %s', (tone, borda, fundo, texto) => {
    render(<Alert tone={tone}>Aviso</Alert>);
    const el = screen.getByText('Aviso').closest('[data-tone]')!;
    expect(el).toHaveClass('rounded-callout', 'border', 'px-4', 'py-3', 'text-sm', borda, fundo, texto);
  });

  it('danger anuncia como alert; os demais são nota fixa', () => {
    render(
      <>
        <Alert tone="danger">Erro</Alert>
        <Alert tone="warning">Cuidado</Alert>
        <Alert tone="success" role="status">
          Salvo
        </Alert>
      </>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Erro');
    expect(screen.getByRole('note')).toHaveTextContent('Cuidado');
    expect(screen.getByRole('status')).toHaveTextContent('Salvo');
  });

  it('ícone, título, ações e fechar', async () => {
    const fechar = vi.fn();
    render(
      <Alert tone="warning" icon={AlertTriangle} title="Sem temporalidade" actions={<a href="#x">Cadastrar</a>} onClose={fechar}>
        Documentos desses tipos não ficam elegíveis.
      </Alert>,
    );
    const nota = screen.getByRole('note');
    expect(nota.querySelector('svg')).toHaveClass('h-5', 'w-5');
    expect(within(nota).getByText('Sem temporalidade')).toHaveClass('font-medium');
    expect(within(nota).getByRole('link', { name: 'Cadastrar' })).toBeInTheDocument();
    await userEvent.click(within(nota).getByRole('button', { name: 'Fechar aviso' }));
    expect(fechar).toHaveBeenCalledOnce();
  });

  it('variante stage: título em negrito na mesma linha do texto', () => {
    render(
      <Callout variant="stage" title="Etapa 3 — Elaboração.">
        Preencha os campos e redija o texto oficial.
      </Callout>,
    );
    const nota = screen.getByRole('note');
    expect(nota).toHaveAttribute('data-variant', 'stage');
    const p = nota.querySelector('p')!;
    expect(p.querySelector('strong')).toHaveTextContent('Etapa 3 — Elaboração.');
    expect(p).toHaveTextContent('Etapa 3 — Elaboração. Preencha os campos');
  });

  it('size sm é compacto', () => {
    render(
      <Alert tone="danger" size="sm">
        Falhou
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveClass('rounded-control', 'px-3', 'py-2');
  });
});

describe('B2. Spinner e LoadingState', () => {
  it.each([
    ['xs', 'h-3.5'],
    ['sm', 'h-4'],
    ['md', 'h-6'],
    ['lg', 'h-8'],
  ] as const)('Spinner %s', (size, classe) => {
    const { container } = render(<Spinner size={size} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('animate-spin', classe, 'text-accent');
    expect(svg).toHaveAttribute('aria-hidden');
  });

  it('Spinner com label vira status', () => {
    render(<Spinner label="Salvando" tone="current" />);
    expect(screen.getByRole('status')).toHaveTextContent('Salvando');
  });

  it('LoadingState bloco: spinner grande, texto só para leitor de tela', () => {
    render(<LoadingState />);
    const st = screen.getByRole('status');
    expect(st).toHaveClass('py-16');
    expect(st.querySelector('svg')).toHaveClass('h-8', 'w-8');
    expect(within(st).getByText('Carregando…')).toHaveClass('sr-only');
  });

  it('LoadingState inline: texto visível e configurável', () => {
    render(<LoadingState mode="inline" label="Carregando histórico…" />);
    const st = screen.getByRole('status');
    expect(within(st).getByText('Carregando histórico…')).not.toHaveClass('sr-only');
    expect(st).toHaveClass('text-sm', 'text-muted');
  });

  it('LoadingState bloco com showLabel', () => {
    render(<LoadingState showLabel label="Buscando" />);
    expect(screen.getByText('Buscando')).toHaveClass('text-sm', 'text-muted');
  });
});

describe('B3. Skeleton', () => {
  it('formas linha, título, bloco e card, com o token de skeleton', () => {
    const { container } = render(
      <>
        <Skeleton />
        <Skeleton shape="title" />
        <Skeleton shape="block" height="md" />
        <Skeleton shape="card" />
      </>,
    );
    const [linha, titulo, bloco, card] = Array.from(container.querySelectorAll('[data-shape]'));
    expect(linha).toHaveClass('h-4', 'w-full', 'animate-pulse', 'bg-surface-muted');
    expect(titulo).toHaveClass('h-8', 'w-48', 'rounded-control', 'bg-skeleton');
    expect(bloco).toHaveClass('h-32', 'rounded-card', 'bg-skeleton');
    expect(card).toHaveClass('h-32', 'rounded-card');
    for (const el of [linha, titulo, bloco, card]) expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('várias linhas, a última mais curta', () => {
    const { container } = render(<Skeleton lines={3} />);
    const linhas = container.querySelectorAll('[data-shape="line"] > div');
    expect(linhas).toHaveLength(3);
    expect(linhas[2]).toHaveClass('w-2/3');
  });

  it('PageSkeleton anuncia o carregamento', () => {
    const { container } = render(<PageSkeleton cards={2} />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando…');
    expect(container.querySelectorAll('[data-shape="card"]')).toHaveLength(2);
  });
});

describe('B4. Eyebrow / Overline', () => {
  it('11px, caixa-alta, espaçado e cinza', () => {
    render(<Eyebrow>Identificação</Eyebrow>);
    expect(screen.getByText('Identificação')).toHaveClass('text-xs2', 'uppercase', 'tracking-wide', 'text-muted');
  });

  it('tamanho, peso, tom e elemento', () => {
    render(
      <Overline as="h3" size="md" weight="semibold" tone="subtle">
        Grupo
      </Overline>,
    );
    const el = screen.getByRole('heading', { name: 'Grupo' });
    expect(el.tagName).toBe('H3');
    expect(el).toHaveClass('text-xs', 'font-semibold', 'text-subtle');
  });
});

describe('B5. Chip / Tag', () => {
  it('todas as famílias em preenchido, suave e contorno', () => {
    for (const tone of TONES) {
      const { unmount } = render(
        <>
          <Chip tone={tone}>f</Chip>
          <Chip tone={tone} variant="soft">
            s
          </Chip>
          <Chip tone={tone} variant="outline">
            o
          </Chip>
        </>,
      );
      const [f, s, o] = ['f', 's', 'o'].map((t) => screen.getByText(t).parentElement!);
      expect(f!.className).toMatch(/bg-\S+/);
      expect(s!.className).toMatch(/bg-\S+/);
      expect(o).toHaveClass('border');
      expect(f).toHaveClass('rounded-pill');
      expect(o).toHaveClass('rounded-tag');
      unmount();
    }
  });

  it('cores do tom', () => {
    render(
      <>
        <Chip tone="indigo">a</Chip>
        <Chip tone="amber" variant="outline">
          b
        </Chip>
      </>,
    );
    expect(screen.getByText('a').parentElement).toHaveClass('bg-indigo-tint', 'text-indigo-text');
    expect(screen.getByText('b').parentElement).toHaveClass('border-warning-border', 'bg-warning-soft', 'text-warning-text');
  });

  it('tamanhos xs e sm, ícone e mono', () => {
    const { container } = render(
      <>
        <Tag size="xs">pequeno</Tag>
        <Tag icon={<TagIcon />}>com ícone</Tag>
        <Tag mono>licitacao.editar</Tag>
      </>,
    );
    expect(screen.getByText('pequeno').parentElement).toHaveClass('text-2xs', 'px-2');
    expect(screen.getByText('com ícone').parentElement).toHaveClass('text-xs', 'px-2.5');
    expect(container.querySelector('svg')!.parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('licitacao.editar').parentElement).toHaveClass('font-mono', 'rounded-tag');
  });
});

describe('B6. IconTile', () => {
  it('quadrado suave por padrão, decorativo', () => {
    const { container } = render(<IconTile icon={FileText} tone="teal" />);
    const tile = container.firstElementChild!;
    expect(tile).toHaveClass('h-10', 'w-10', 'rounded-tile', 'bg-teal-soft', 'text-teal-strong');
    expect(tile).toHaveAttribute('aria-hidden', 'true');
  });

  it('círculo, tint, solid e rótulo', () => {
    render(
      <>
        <IconTile icon={FileText} tone="info" shape="circle" variant="tint" size="xl" label="Envio" />
        <IconTile icon={FileText} tone="rose" variant="solid" size="sm" label="Plataforma" />
      </>,
    );
    expect(screen.getByRole('img', { name: 'Envio' })).toHaveClass('h-12', 'rounded-pill', 'bg-info-tint', 'text-info-strong');
    expect(screen.getByRole('img', { name: 'Plataforma' })).toHaveClass('h-8', 'bg-rose-strong', 'text-on-primary');
  });

  it('StatCard e EmptyState usam o IconTile', () => {
    const { container } = render(
      <>
        <StatCard title="Docs" value={1} icon={FileText} tone="violet" />
        <EmptyState title="Vazio" tone="success" />
      </>,
    );
    const tiles = container.querySelectorAll('[data-variant="soft"]');
    expect(tiles[0]).toHaveClass('h-11', 'w-11', 'rounded-tile', 'bg-violet-soft');
    expect(tiles[1]).toHaveClass('h-12', 'w-12', 'rounded-pill', 'bg-success-soft');
  });
});

describe('B7. Button: variantes novas, lg, href e asChild', () => {
  it.each([
    ['success', 'btn-success'],
    ['danger-outline', 'btn-danger-outline'],
    ['link', 'btn-link'],
  ] as const)('variante %s aplica %s', (variant, classe) => {
    render(<Button variant={variant}>Ok</Button>);
    expect(screen.getByRole('button', { name: 'Ok' })).toHaveClass(classe);
  });

  it('tamanho lg usa py-3; no link, o tamanho mexe só na fonte', () => {
    render(
      <>
        <Button size="lg">Entrar</Button>
        <Button variant="link" size="sm">
          Ver todas
        </Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Entrar' })).toHaveClass('py-3');
    const link = screen.getByRole('button', { name: 'Ver todas' });
    expect(link).toHaveClass('text-xs');
    expect(link).not.toHaveClass('px-3');
  });

  it('href renderiza <a>, com componente de link opcional', () => {
    function MeuLink(props: { href: string; className?: string; children?: ReactNode }) {
      return <a data-roteador="" {...props} />;
    }
    render(
      <>
        <Button href="/novo" icon={<Plus />}>
          Novo
        </Button>
        <Button href="/lista" linkComponent={MeuLink} variant="secondary">
          Lista
        </Button>
      </>,
    );
    const novo = screen.getByRole('link', { name: 'Novo' });
    expect(novo.tagName).toBe('A');
    expect(novo).toHaveAttribute('href', '/novo');
    expect(novo).toHaveClass('btn-primary');
    expect(novo).not.toHaveAttribute('type');
    const lista = screen.getByRole('link', { name: 'Lista' });
    expect(lista).toHaveAttribute('data-roteador');
    expect(lista).toHaveClass('btn-secondary');
  });

  it('link desabilitado perde o href e sai da ordem do Tab', () => {
    render(
      <Button href="/x" disabled>
        Bloqueado
      </Button>,
    );
    const el = screen.getByText('Bloqueado');
    expect(el).not.toHaveAttribute('href');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveAttribute('tabindex', '-1');
  });

  it('asChild aplica o visual ao filho e mantém as props dele', async () => {
    const clique = vi.fn();
    render(
      <Button asChild variant="success" icon={<Plus />}>
        <a href="/assinar" onClick={(e) => { e.preventDefault(); clique(); }}>
          Assinar
        </a>
      </Button>,
    );
    const a = screen.getByRole('link', { name: 'Assinar' });
    expect(a).toHaveAttribute('href', '/assinar');
    expect(a).toHaveClass('btn-success');
    expect(a.querySelector('svg')).not.toBeNull();
    await userEvent.click(a);
    expect(clique).toHaveBeenCalledOnce();
  });

  it('as variantes da v1 continuam iguais', () => {
    render(<Button variant="danger" size="sm">Excluir</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger', 'px-3', 'py-1.5', 'text-xs');
  });
});

describe('B8. IconButton', () => {
  it('aria-label é o nome acessível e vira a dica', async () => {
    const clique = vi.fn();
    render(<IconButton icon={<Trash2 />} aria-label="Excluir anexo" variant="danger" size="sm" onClick={clique} />);
    const b = screen.getByRole('button', { name: 'Excluir anexo' });
    expect(b).toHaveAttribute('title', 'Excluir anexo');
    expect(b).toHaveAttribute('type', 'button');
    expect(b).toHaveClass('h-8', 'w-8', 'rounded-control', 'hover:text-danger-strong');
    b.focus();
    await userEvent.keyboard('{Enter}');
    expect(clique).toHaveBeenCalledOnce();
  });

  it('variantes ghost e secondary, tamanho md e loading', () => {
    render(
      <>
        <IconButton icon={<Plus />} aria-label="A" />
        <IconButton icon={<Plus />} aria-label="B" variant="secondary" loading />
      </>,
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('h-9', 'w-9', 'text-subtle');
    const b = screen.getByRole('button', { name: 'B' });
    expect(b).toHaveClass('border', 'bg-surface');
    expect(b).toBeDisabled();
    expect(b.querySelector('svg')).toHaveClass('animate-spin');
  });

  it('o tipo exige aria-label', () => {
    // @ts-expect-error aria-label é obrigatório
    const el = <IconButton icon={<Plus />} />;
    expect(el).toBeTruthy();
  });
});
