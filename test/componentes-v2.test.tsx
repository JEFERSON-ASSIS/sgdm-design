import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Building2, FileText, Home, Paperclip } from 'lucide-react';
import { useState, type Key } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  AppLayout,
  BREAKPOINT_LG,
  Card,
  CollapsibleCard,
  EmptyState,
  Header,
  LICITACAO_FASE_COLORS,
  LICITACAO_SITUACAO_COLORS,
  LICITACAO_STATUS_COLORS,
  LICITACAO_STATUS_LABELS,
  Modal,
  NavigationProgress,
  NUMERACAO_STATUS_COLORS,
  PECA_ESTADO_COLORS,
  PECA_STATUS_COLORS,
  Select,
  Sidebar,
  StatCard,
  StatusBadge,
  Table,
  TONES,
  ToastProvider,
  Tooltip,
  isDesktopViewport,
  useToast,
  type Tone,
} from '../src';

function larguraDaJanela(px: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: px });
}

describe('A11–A13 nos componentes', () => {
  it('Modal usa z-modal e max-w-modal-md', () => {
    render(
      <Modal open title="X" onClose={() => {}}>
        x
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-modal-md');
    expect(dialog.parentElement).toHaveClass('z-modal');
  });

  it('NavigationProgress e Tooltip usam z-progress e z-tooltip', () => {
    render(
      <>
        <NavigationProgress active />
        <Tooltip text="Dica" />
      </>,
    );
    expect(screen.getByRole('progressbar')).toHaveClass('z-progress');
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('z-tooltip', 'w-tooltip');
  });

  it('Toast fica em z-toast', async () => {
    function Botao() {
      const t = useToast();
      return <button onClick={() => t.success('Salvo')}>ok</button>;
    }
    render(
      <ToastProvider>
        <Botao />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('ok'));
    expect(screen.getByRole('status').parentElement).toHaveClass('z-toast');
  });

  it('isDesktopViewport segue BREAKPOINT_LG', () => {
    const antes = window.innerWidth;
    try {
      larguraDaJanela(BREAKPOINT_LG - 1);
      expect(isDesktopViewport()).toBe(false);
      larguraDaJanela(BREAKPOINT_LG);
      expect(isDesktopViewport()).toBe(true);
    } finally {
      larguraDaJanela(antes);
    }
  });

  it('abaixo do breakpoint o botão do Header abre a gaveta; ao crescer a tela, ela fecha', async () => {
    const antes = window.innerWidth;
    try {
      larguraDaJanela(BREAKPOINT_LG - 200);
      render(
        <AppLayout
          sidebar={<Sidebar brand={{ name: 'S' }} sections={[{ items: [{ href: '/', label: 'Início', icon: Home }] }]} />}
          header={<Header title="T" />}
        >
          x
        </AppLayout>,
      );
      const gaveta = () => document.querySelector('aside.fixed')!;
      expect(gaveta()).toHaveClass('invisible');
      await userEvent.click(screen.getByRole('button', { name: 'Alternar menu' }));
      expect(gaveta()).toHaveClass('visible', 'z-modal', 'w-sidebar');

      larguraDaJanela(BREAKPOINT_LG + 100);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      expect(gaveta()).toHaveClass('invisible');
    } finally {
      larguraDaJanela(antes);
    }
  });

  it('AppLayout usa o padding de página e o Header a altura do token', () => {
    render(
      <AppLayout sidebar={null} header={<Header title="T" />}>
        x
      </AppLayout>,
    );
    expect(screen.getByRole('main')).toHaveClass('p-page-sm', 'lg:p-page-md', 'xl:p-page-lg');
    expect(screen.getByRole('banner')).toHaveClass('h-header');
  });
});

describe('C1. Table', () => {
  type Item = { id: number; descricao: string; total: string };
  const itens: Item[] = [
    { id: 1, descricao: 'Papel A4', total: 'R$ 100,00' },
    { id: 2, descricao: 'Toner', total: 'R$ 300,00' },
    { id: 3, descricao: 'Grampo', total: 'R$ 10,00' },
  ];
  const colunas = [
    { key: 'descricao', header: 'Descrição' },
    { key: 'un', header: 'Un.' },
    { key: 'total', header: 'Total', align: 'right' as const },
  ];

  it('linha de total no tfoot, com rótulo até a coluna do valor', () => {
    render(
      <Table
        columns={colunas}
        rows={itens}
        footer={{ label: 'Valor estimado do processo', values: { total: 'R$ 410,00' } }}
      />,
    );
    const rodape = document.querySelector('tfoot')!;
    const celulas = within(rodape).getAllByRole('cell');
    expect(celulas).toHaveLength(2);
    expect(celulas[0]).toHaveAttribute('colspan', '2');
    expect(celulas[0]).toHaveTextContent('Valor estimado do processo');
    expect(celulas[0]).toHaveClass('uppercase', 'text-right');
    expect(celulas[1]).toHaveTextContent('R$ 410,00');
  });

  it('density compact, cabeçalho upper e bare', () => {
    const { container } = render(<Table columns={colunas} rows={itens} density="compact" headerCase="upper" bare />);
    expect(container.firstChild).not.toHaveClass('card');
    expect(screen.getAllByRole('columnheader')[0]).toHaveClass('px-3', 'py-2');
    expect(screen.getAllByRole('cell')[0]).toHaveClass('px-3', 'py-2');
    expect(screen.getAllByRole('row')[0]).toHaveClass('uppercase', 'text-xs');
  });

  it('sem bare continua dentro do card', () => {
    const { container } = render(<Table columns={colunas} rows={itens} />);
    expect(container.firstChild).toHaveClass('card');
    expect(screen.getAllByRole('cell')[0]).toHaveClass('px-4', 'py-3');
  });

  it('seleciona linhas, marca todas e mostra o estado indeterminado', async () => {
    const onSelectedChange = vi.fn();
    const onRowClick = vi.fn();
    render(
      <Table
        columns={colunas}
        rows={itens}
        selectable
        onSelectedChange={onSelectedChange}
        onRowClick={onRowClick}
        selectRowLabel={(r) => `Selecionar ${r.descricao}`}
      />,
    );
    const todas = screen.getByRole('checkbox', { name: 'Selecionar todas' });
    expect(todas).not.toBeChecked();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Toner' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith([2]);
    expect(onRowClick).not.toHaveBeenCalled();
    expect(todas).toBePartiallyChecked();
    expect(screen.getByRole('checkbox', { name: 'Selecionar Toner' }).closest('tr')).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(todas);
    expect(onSelectedChange).toHaveBeenLastCalledWith([2, 1, 3]);
    expect(todas).toBeChecked();

    await userEvent.click(todas);
    expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    expect(todas).not.toBeChecked();
  });

  it('seleção controlada', async () => {
    function Controlada() {
      const [sel, setSel] = useState<Key[]>([1]);
      return (
        <>
          <span data-testid="sel">{sel.join(',')}</span>
          <Table columns={colunas} rows={itens} selectable selected={sel} onSelectedChange={setSel} />
        </>
      );
    }
    render(<Controlada />);
    expect(screen.getByRole('checkbox', { name: 'Selecionar linha 1' })).toBeChecked();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Selecionar linha 3' }));
    expect(screen.getByTestId('sel')).toHaveTextContent('1,3');
  });
});

describe('C2. Card', () => {
  it.each([
    ['sm', 'p-4'],
    ['md', 'card-body'],
    ['lg', 'p-6'],
  ] as const)('padding %s aplica %s', (padding, classe) => {
    render(<Card padding={padding}>corpo</Card>);
    expect(screen.getByText('corpo')).toHaveClass(classe);
  });

  it('tone tinge fundo e borda', () => {
    const { container } = render(<Card tone="warning">aviso</Card>);
    expect(container.firstChild).toHaveClass('card', 'bg-warning-soft', 'border-warning-border');
    expect(container.firstChild).toHaveAttribute('data-tone', 'warning');
  });
});

describe('C3. StatusBadge', () => {
  it('size sm e case normal: o estilo da licitação', () => {
    render(
      <StatusBadge status="EM_PLANEJAMENTO" colors={LICITACAO_STATUS_COLORS} labels={LICITACAO_STATUS_LABELS} size="sm" case="normal" />,
    );
    const selo = screen.getByText('Em planejamento');
    expect(selo).toHaveClass('text-xs', 'font-medium', 'bg-indigo-100', 'text-indigo-800', 'rounded-pill');
    expect(selo).not.toHaveClass('text-2xs');
  });

  it('case normal sem rótulo formata o código', () => {
    render(<StatusBadge status="EM_ANDAMENTO" colors={LICITACAO_SITUACAO_COLORS} case="normal" />);
    expect(screen.getByText('Em Andamento')).toBeInTheDocument();
  });

  it('padrão continua xs e em caixa-alta', () => {
    render(<StatusBadge status="EM_ANALISE" labels={{ EM_ANALISE: 'Em análise' }} />);
    expect(screen.getByText('EM ANÁLISE')).toHaveClass('text-2xs', 'font-bold');
  });

  it('variante outline para a fase', () => {
    render(
      <StatusBadge variant="outline" size="sm" case="normal" status="ATIVA" colors={LICITACAO_FASE_COLORS}>
        Planejamento da contratação
      </StatusBadge>,
    );
    const selo = screen.getByText('Planejamento da contratação');
    expect(selo).toHaveClass('border', 'rounded-tag', 'border-blue-200', 'bg-blue-50');
    expect(selo).toHaveAttribute('data-variant', 'outline');
  });

  it('exporta os mapas de numeração, licitação e peça', () => {
    expect(NUMERACAO_STATUS_COLORS.VINCULADO_DOCUMENTO).toBe('bg-sky-100 text-sky-800');
    expect(LICITACAO_STATUS_COLORS.EM_ANALISE_JURIDICA).toBe('bg-violet-100 text-violet-800');
    expect(LICITACAO_SITUACAO_COLORS.SUSPENSA).toBe('bg-amber-100 text-amber-800');
    expect(PECA_STATUS_COLORS.DEVOLVIDA).toBe('bg-amber-100 text-amber-800');
    expect(PECA_ESTADO_COLORS.NAO_INICIADA).toContain('border-dashed');
  });

  it('ativo usa o token de sucesso (esmeralda)', () => {
    render(<StatusBadge active />);
    expect(screen.getByText('Ativo')).toHaveClass('bg-success-soft', 'text-success-hover');
  });
});

describe('C4. StatCard', () => {
  it.each([
    ['violet', 'bg-violet-soft text-violet-strong'],
    ['emerald', 'bg-success-soft text-success-strong'],
    ['teal', 'bg-teal-soft text-teal-strong'],
    ['sky', 'bg-sky-soft text-sky-strong'],
    ['amber', 'bg-warning-soft text-warning-strong'],
    ['purple', 'bg-purple-soft text-purple-strong'],
    ['orange', 'bg-orange-soft text-orange-strong'],
    ['indigo', 'bg-indigo-soft text-indigo-strong'],
  ] as const)('tone %s', (tone, classes) => {
    const { container } = render(<StatCard title="X" value={1} icon={FileText} tone={tone} />);
    expect(container.querySelector(`.${classes.split(' ').join('.')}`)).not.toBeNull();
  });

  it('todos os tons têm estilo', () => {
    for (const t of TONES) {
      const { container, unmount } = render(<StatCard title={t} value={1} icon={FileText} tone={t as Tone} />);
      expect(container.querySelector('.rounded-tile')!.className, t).toMatch(/bg-(?:\S+-soft|surface-muted)/);
      unmount();
    }
  });
});

describe('C5. CollapsibleCard controlado e Accordion', () => {
  it('CollapsibleCard controlado só muda pelo dono', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <CollapsibleCard title="Assinatura" open={false} onOpenChange={onOpenChange}>
        <p>form</p>
      </CollapsibleCard>,
    );
    const botao = screen.getByRole('button', { name: /Assinatura/ });
    await userEvent.click(botao);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('form')).not.toBeInTheDocument();
    rerender(
      <CollapsibleCard title="Assinatura" open onOpenChange={onOpenChange}>
        <p>form</p>
      </CollapsibleCard>,
    );
    expect(screen.getByText('form')).toBeInTheDocument();
    expect(botao).toHaveAttribute('aria-expanded', 'true');
  });

  const linhas = [
    { id: 'etp', title: 'ETP', description: 'Art. 18', meta: '4 seções', content: <p>corpo ETP</p> },
    { id: 'tr', title: 'Termo de referência', content: <p>corpo TR</p> },
  ];

  it('Accordion abre uma linha por vez', async () => {
    render(<Accordion items={linhas} />);
    const etp = screen.getByRole('button', { name: /ETP/ });
    expect(screen.getByText('4 seções')).toBeInTheDocument();
    await userEvent.click(etp);
    expect(etp).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('corpo ETP')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Termo/ }));
    expect(screen.queryByText('corpo ETP')).not.toBeInTheDocument();
    expect(screen.getByText('corpo TR')).toBeInTheDocument();
    expect(etp.parentElement).toHaveClass('rounded-panel');
  });

  it('Accordion multiple e controlado', async () => {
    const onOpenChange = vi.fn();
    render(<Accordion items={linhas} multiple defaultOpen={['etp']} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Termo/ }));
    expect(onOpenChange).toHaveBeenLastCalledWith(['etp', 'tr']);
    expect(screen.getByText('corpo ETP')).toBeInTheDocument();
    expect(screen.getByText('corpo TR')).toBeInTheDocument();
  });
});

describe('C6. Tooltip', () => {
  it.each([
    ['top', 'bottom-full'],
    ['bottom', 'top-full'],
    ['left', 'right-full'],
    ['right', 'left-full'],
  ] as const)('placement %s', (placement, classe) => {
    render(<Tooltip text="Dica" placement={placement} />);
    const balao = screen.getByRole('tooltip', { hidden: true });
    expect(balao).toHaveClass(classe);
    expect(balao).toHaveAttribute('data-placement', placement);
  });
});

describe('C7. EmptyState dashed', () => {
  it('caixa tracejada com ícone e ação', () => {
    const { container } = render(
      <EmptyState variant="dashed" icon={Paperclip} title="Nenhum anexo" action={<button>Anexar</button>} />,
    );
    expect(container.firstChild).toHaveClass('border-dashed', 'border-border-strong', 'rounded-panel');
    expect(screen.getByText('Nenhum anexo')).toHaveClass('text-muted');
    expect(screen.getByRole('button', { name: 'Anexar' })).toBeInTheDocument();
  });
});

describe('C8. Select compacto com ícone', () => {
  it('compact com ícone à esquerda e seta própria', () => {
    const { container } = render(
      <Select
        aria-label="Prefeitura em gestão"
        size="compact"
        icon={<Building2 data-testid="icone" />}
        options={[{ value: '1', label: 'Prefeitura A' }]}
      />,
    );
    const campo = screen.getByRole('combobox', { name: 'Prefeitura em gestão' });
    expect(campo).toHaveClass('input', 'appearance-none', 'text-xs', 'py-1.5');
    expect(campo).toHaveAttribute('data-size', 'compact');
    expect(screen.getByTestId('icone')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('md com ícone e o size numérico nativo da v1', () => {
    render(
      <>
        <Select label="Secretaria" icon={<Building2 />} options={[{ value: 'a', label: 'A' }]} />
        <Select aria-label="Lista" size={3} options={[{ value: 'a', label: 'A' }]} />
      </>,
    );
    expect(screen.getByLabelText('Secretaria')).toHaveAttribute('data-size', 'md');
    expect(screen.getByRole('listbox', { name: 'Lista' })).toHaveAttribute('size', '3');
  });

  it('continua funcionando como select', () => {
    const onChange = vi.fn();
    render(
      <Select
        aria-label="P"
        size="compact"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        onChange={(e) => onChange(e.target.value)}
      />,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
