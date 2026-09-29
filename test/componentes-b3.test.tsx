import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell, Mail, MoreHorizontal, Pencil, Shield, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  CounterBadge,
  Dropdown,
  FilterBar,
  FlowChips,
  IconButton,
  InlineCode,
  Mono,
  NotificationBell,
  NumberedSteps,
  PdfViewer,
  Popover,
  ProcessStepper,
  SearchInput,
  SegmentedControl,
  SelectableList,
  Select,
  StickyAside,
  Tabs,
  Timeline,
  WizardStepper,
  formatCount,
} from '../src';

describe('B14. Timeline', () => {
  it('icon: círculo tingido, linha entre itens, autor, data e IP', () => {
    render(
      <Timeline
        label="Movimentações"
        tone="purple"
        items={[
          {
            id: '1',
            title: 'Documento assinado',
            subtitle: 'Aguardando assinatura → Assinado',
            detail: 'Assinado pelo prefeito',
            author: { name: 'Maria', role: 'Prefeita' },
            date: '12/09/2026 14:30',
            meta: 'IP 10.0.0.1',
            icon: Pencil,
          },
          { id: '2', title: 'Criado', tone: 'info' },
        ]}
      />,
    );
    const lista = screen.getByRole('list', { name: 'Movimentações' });
    expect(lista.tagName).toBe('OL');
    const [primeiro, segundo] = within(lista).getAllByRole('listitem');
    expect(primeiro).toHaveClass('group', 'pb-8', 'last:pb-0');
    expect(primeiro!.querySelector('.rounded-pill')).toHaveClass('h-9', 'w-9', 'bg-purple-tint');
    expect(primeiro!.querySelector('svg')).toHaveClass('text-purple-strong');
    expect(primeiro!.querySelector('.w-px')).toHaveClass('bg-border', 'group-last:hidden');
    expect(within(primeiro!).getByText('Maria')).toHaveClass('font-medium');
    expect(within(primeiro!).getByText('— Prefeita')).toHaveClass('text-subtle');
    expect(within(primeiro!).getByText('IP 10.0.0.1')).toHaveClass('font-mono');
    expect(segundo!.querySelector('.rounded-pill')).toHaveClass('bg-info-tint');
  });

  it('dots: borda à esquerda e ponto centrado nela', () => {
    render(<Timeline variant="dots" items={[{ id: '1', title: 'Enviado', subtitle: 'Em análise — 12/09' }]} />);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('border-l-2', 'border-info-border', 'pl-5');
    expect(item.querySelector('[aria-hidden]')).toHaveClass('-left-px', '-translate-x-1/2', 'h-2', 'w-2', 'bg-info-strong');
    expect(screen.getByText('Em análise — 12/09')).toHaveClass('text-xs', 'text-muted');
  });

  it('phases: concluída, devolvida, atual e pendente', () => {
    render(
      <Timeline
        variant="phases"
        items={[
          { id: 'a', title: 'Planejamento', status: 'done' },
          { id: 'b', title: 'Jurídico', status: 'returned' },
          { id: 'c', title: 'Cotação', status: 'current', aside: 'SECAD' },
          { id: 'd', title: 'Contrato' },
        ]}
      />,
    );
    const itens = screen.getAllByRole('listitem');
    expect(itens.map((i) => i.dataset.status)).toEqual(['done', 'returned', 'current', 'pending']);
    expect(itens[0]!.querySelector('.border-2')).toHaveClass('bg-success');
    expect(itens[0]!.querySelector('.w-0\\.5')).toHaveClass('bg-success-border');
    expect(itens[1]!.querySelector('.border-2')).toHaveClass('bg-warning');
    expect(itens[2]).toHaveAttribute('aria-current', 'step');
    expect(itens[2]!.querySelector('.border-2')).toHaveClass('bg-accent');
    expect(within(itens[2]!).getByText('SECAD')).toHaveClass('text-xs');
    expect(itens[3]!.querySelector('.w-0\\.5')).toBeNull();
    expect(within(itens[1]!).getByText('(devolvida)')).toHaveClass('sr-only');
  });

  it('vazio', () => {
    render(<Timeline items={[]} empty="Nenhuma movimentação registrada." />);
    expect(screen.getByText('Nenhuma movimentação registrada.')).toHaveClass('text-subtle');
  });
});

describe('B15. Tabs pill e SegmentedControl', () => {
  it('Tabs pill: barra com borda e aba ativa preenchida na cor da aba', async () => {
    render(
      <Tabs
        variant="pill"
        label="Documento"
        items={[
          { id: 'dados', label: 'Dados', content: <p>dados</p> },
          { id: 'analise', label: 'Análise', tone: 'indigo', content: <p>análise</p> },
          { id: 'correcao', label: 'Correção', tone: 'warning', content: <p>correção</p> },
        ]}
      />,
    );
    expect(screen.getByRole('tablist')).toHaveClass('rounded-panel', 'border', 'bg-surface', 'p-1', 'overflow-x-auto');
    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveClass('bg-accent', 'text-on-primary', 'px-5', 'py-2.5');
    await userEvent.click(screen.getByRole('tab', { name: 'Análise' }));
    expect(screen.getByRole('tab', { name: 'Análise' })).toHaveClass('bg-indigo-strong', 'shadow-card');
    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveClass('text-body');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Correção' })).toHaveClass('bg-warning-strong');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('correção');
  });

  it('SegmentedControl: grupo de rádio com setas', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Filtrar numerações"
        onChange={onChange}
        options={[
          { value: 'todos', label: 'Todos' },
          { value: 'pend', label: 'Pendentes', disabled: true },
          { value: 'lib', label: 'Liberados' },
        ]}
      />,
    );
    const grupo = screen.getByRole('radiogroup', { name: 'Filtrar numerações' });
    expect(grupo).toHaveClass('card', 'p-1');
    const todos = screen.getByRole('radio', { name: 'Todos' });
    expect(todos).toHaveAttribute('aria-checked', 'true');
    expect(todos).toHaveClass('px-3', 'py-1.5', 'bg-accent');
    expect(todos).toHaveAttribute('tabindex', '0');
    todos.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('lib');
    expect(screen.getByRole('radio', { name: 'Liberados' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Liberados' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: 'Todos' }));
    expect(onChange).toHaveBeenLastCalledWith('todos');
  });
});

describe('B16. FilterBar e SearchInput', () => {
  it('FilterBar: marco de busca com título, grade e limpar', async () => {
    const limpar = vi.fn();
    render(
      <FilterBar onClear={limpar} columns={3}>
        <Select aria-label="Tipo" options={[{ value: '', label: 'Todos os tipos' }]} />
        <SearchInput />
      </FilterBar>,
    );
    const busca = screen.getByRole('search', { name: 'Filtros' });
    expect(busca).toHaveClass('card', 'p-4');
    expect(busca.querySelector('.grid')).toHaveClass('gap-3', 'sm:grid-cols-2', 'lg:grid-cols-3');
    await userEvent.click(within(busca).getByRole('button', { name: 'Limpar filtros' }));
    expect(limpar).toHaveBeenCalledOnce();
  });

  it('SearchInput: lupa, limpar pelo botão e pelo Esc, Enter busca', async () => {
    const buscar = vi.fn();
    const limpar = vi.fn();
    render(<SearchInput onSearch={buscar} onClear={limpar} />);
    const campo = screen.getByRole('searchbox', { name: 'Buscar' });
    expect(campo).toHaveAttribute('placeholder', 'Buscar…');
    expect(campo).toHaveClass('pl-10');
    expect(screen.queryByRole('button', { name: 'Limpar busca' })).toBeNull();
    await userEvent.type(campo, 'portaria{Enter}');
    expect(buscar).toHaveBeenCalledWith('portaria');
    await userEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));
    expect(campo).toHaveValue('');
    expect(campo).toHaveFocus();
    expect(limpar).toHaveBeenCalledTimes(1);
    await userEvent.type(campo, 'x{Escape}');
    expect(campo).toHaveValue('');
    expect(limpar).toHaveBeenCalledTimes(2);
  });

  it('SearchInput controlado e com rótulo', async () => {
    function Controlado() {
      const [v, setV] = useState('abc');
      return <SearchInput label="Buscar documento" value={v} onValueChange={setV} />;
    }
    render(<Controlado />);
    const campo = screen.getByRole('searchbox', { name: 'Buscar documento' });
    expect(campo).toHaveValue('abc');
    await userEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));
    expect(campo).toHaveValue('');
  });
});

describe('B17. Passos', () => {
  it('NumberedSteps: número em círculo cinza, descrição e ação', () => {
    render(
      <NumberedSteps
        label="Como assinar"
        steps={[
          { title: 'Baixe o PDF', content: <Button size="sm">Baixar</Button>, status: 'done' },
          { title: 'Assine o arquivo', description: 'Com gov.br ou ICP-Brasil.' },
        ]}
      />,
    );
    const itens = within(screen.getByRole('list', { name: 'Como assinar' })).getAllByRole('listitem');
    expect(itens[0]!.querySelector('[aria-hidden]')).toHaveClass('bg-success-tint');
    expect(within(itens[0]!).getByText('(concluído)')).toHaveClass('sr-only');
    expect(within(itens[0]!).getByRole('button', { name: 'Baixar' })).toBeInTheDocument();
    const numero = itens[1]!.querySelector('[aria-hidden]')!;
    expect(numero).toHaveTextContent('2');
    expect(numero).toHaveClass('h-6', 'w-6', 'rounded-pill', 'bg-surface-muted', 'text-label');
    expect(within(itens[1]!).getByText('Com gov.br ou ICP-Brasil.')).toHaveClass('text-xs', 'text-muted');
  });

  it('ProcessStepper: concluídos em verde, atual em azul com a marca', () => {
    render(<ProcessStepper current={3} steps={[{ label: 'Solicitação' }, { label: 'Análise' }, { label: 'Elaboração' }, { label: 'Assinatura' }]} />);
    expect(screen.getByText('Onde você está no processo')).toHaveClass('font-semibold');
    const itens = screen.getAllByRole('listitem');
    expect(itens.map((i) => i.dataset.status)).toEqual(['done', 'done', 'current', 'pending']);
    expect(itens[0]).toHaveClass('text-success-hover');
    expect(itens[2]).toHaveClass('font-semibold', 'text-accent-text');
    expect(itens[2]).toHaveAttribute('aria-current', 'step');
    expect(itens[2]).toHaveTextContent('Elaboração ← etapa atual');
    expect(itens[3]!.querySelector('[aria-hidden]')).toHaveClass('bg-border', 'text-muted', 'text-2xs');
  });

  it('WizardStepper tiles com links e aria-current no link', () => {
    function Link(props: { href: string; className?: string; children?: ReactNode }) {
      return <a data-roteador {...props} />;
    }
    render(
      <WizardStepper
        variant="tiles"
        label="Ordem dos cadastros"
        current={2}
        linkComponent={Link}
        steps={[
          { title: 'Secretarias', description: 'as unidades', href: '/secretarias' },
          { title: 'Usuários', description: 'as pessoas', href: '/usuarios' },
          { title: 'Setores', href: '/setores' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Ordem dos cadastros' });
    expect(nav).not.toHaveClass('card');
    const atual = screen.getByRole('link', { name: /Usuários/ });
    expect(atual).toHaveAttribute('aria-current', 'step');
    expect(atual).toHaveAttribute('data-roteador');
    expect(atual).toHaveClass('bg-primary-soft', 'rounded-control');
    expect(screen.getByRole('link', { name: /Secretarias/ }).querySelector('svg')).toHaveAttribute('aria-label', 'concluído');
    expect(screen.getAllByRole('listitem').map((i) => i.dataset.state)).toEqual(['done', 'active', 'pending']);
  });

  it('WizardStepper circles sem card e com link', () => {
    render(<WizardStepper bare current={1} steps={[{ title: 'Dados', href: '#dados' }, { title: 'Revisão' }]} />);
    expect(screen.getByRole('navigation', { name: 'Progresso' })).not.toHaveClass('card');
    expect(screen.getByRole('link', { name: /Dados/ })).toHaveAttribute('aria-current', 'step');
    expect(screen.getAllByRole('listitem')[0]).not.toHaveAttribute('aria-current');
  });
});

describe('B18. SelectableList', () => {
  const perfis = [
    { id: 'rh', title: 'RH', description: '3 usuários' },
    { id: 'sec', title: 'Secretaria', description: '12 usuários', badge: <span>Inativo</span> },
    { id: 'pref', title: 'Prefeito' },
  ];

  it('destaca o item ativo com aria-current e troca pelo clique', async () => {
    const onChange = vi.fn();
    render(<SelectableList label="Perfis" icon={Shield} items={perfis} onChange={onChange} />);
    const lista = screen.getByRole('list', { name: 'Perfis' });
    expect(lista).toHaveClass('card', 'divide-y');
    const rh = screen.getByRole('button', { name: /RH/ });
    expect(rh).toHaveAttribute('aria-current', 'true');
    expect(rh).toHaveClass('bg-primary-soft');
    expect(rh.querySelector('svg')).toHaveClass('text-accent-text');
    await userEvent.click(screen.getByRole('button', { name: /Secretaria/ }));
    expect(onChange).toHaveBeenCalledWith('sec');
    expect(screen.getByRole('button', { name: /Secretaria/ })).toHaveAttribute('aria-current', 'true');
    expect(rh).not.toHaveAttribute('aria-current');
  });

  it('setas andam entre os itens', async () => {
    render(<SelectableList label="Perfis" items={perfis} bare />);
    expect(screen.getByRole('list')).not.toHaveClass('card');
    screen.getByRole('button', { name: /RH/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /Secretaria/ })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('button', { name: /Prefeito/ })).toHaveFocus();
  });
});

describe('B19. Popover, Dropdown e NotificationBell', () => {
  it('Popover abre como diálogo, fecha com Esc e devolve o foco', async () => {
    render(
      <Popover label="Filtros avançados" trigger={<Button variant="secondary">Mais filtros</Button>}>
        <button type="button">Aplicar</button>
      </Popover>,
    );
    const gatilho = screen.getByRole('button', { name: 'Mais filtros' });
    expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    expect(gatilho).toHaveAttribute('aria-haspopup', 'dialog');
    await userEvent.click(gatilho);
    const painel = screen.getByRole('dialog', { name: 'Filtros avançados' });
    expect(gatilho).toHaveAttribute('aria-expanded', 'true');
    expect(gatilho).toHaveAttribute('aria-controls', painel.id);
    expect(painel).toHaveFocus();
    expect(painel).toHaveClass('z-dropdown', 'shadow-dropdown', 'rounded-panel', 'right-0');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(gatilho).toHaveFocus();
  });

  it('Popover fecha com clique fora', async () => {
    const onOpenChange = vi.fn();
    render(
      <>
        <p>fora</p>
        <Popover label="Ajuda" defaultOpen onOpenChange={onOpenChange} trigger={<Button>Ajuda</Button>}>
          {({ close }) => (
            <button type="button" onClick={close}>
              Entendi
            </button>
          )}
        </Popover>
      </>,
    );
    expect(screen.getByRole('dialog', { name: 'Ajuda' })).toBeInTheDocument();
    await userEvent.click(screen.getByText('fora'));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('Popover fecha pelo close de dentro', async () => {
    render(
      <Popover label="Ajuda" trigger={<Button>Ajuda</Button>} initialFocus="first">
        {({ close }) => (
          <button type="button" onClick={close}>
            Entendi
          </button>
        )}
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Ajuda' }));
    expect(screen.getByRole('button', { name: 'Entendi' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Entendi' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  const acoes = [
    { id: 'editar', label: 'Editar', icon: Pencil, onSelect: vi.fn() },
    { id: 'off', label: 'Arquivar', disabled: true },
    { id: 's', separator: true as const },
    { id: 'excluir', label: 'Excluir', icon: Trash2, tone: 'danger' as const, onSelect: vi.fn() },
  ];

  it('Dropdown: menu com setas, escolha fecha e devolve o foco', async () => {
    render(<Dropdown label="Ações" items={acoes} trigger={<IconButton icon={<MoreHorizontal />} aria-label="Ações" />} />);
    const gatilho = screen.getByRole('button', { name: 'Ações' });
    expect(gatilho).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(gatilho);
    const menu = screen.getByRole('menu', { name: 'Ações' });
    const itens = within(menu).getAllByRole('menuitem');
    expect(itens).toHaveLength(3);
    expect(itens[0]).toHaveFocus();
    expect(within(menu).getByRole('separator')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}');
    expect(within(menu).getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
    expect(within(menu).getByRole('menuitem', { name: 'Excluir' })).toHaveClass('text-danger-strong');
    await userEvent.keyboard('{ArrowDown}');
    expect(itens[0]).toHaveFocus();
    await userEvent.keyboard('{End}{Enter}');
    expect(acoes[3]!.onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(gatilho).toHaveFocus();
  });

  it('Dropdown: seta para cima no gatilho abre no último; Esc e clique fora fecham', async () => {
    render(
      <>
        <p>fora</p>
        <Dropdown items={acoes} trigger={<Button>Mais</Button>} />
      </>,
    );
    const gatilho = screen.getByRole('button', { name: 'Mais' });
    gatilho.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(gatilho).toHaveFocus();

    await userEvent.click(gatilho);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText('fora'));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('Dropdown: item desabilitado não dispara', async () => {
    const arquivar = vi.fn();
    render(
      <Dropdown
        defaultOpen
        items={[{ id: 'a', label: 'Arquivar', disabled: true, onSelect: arquivar }]}
        trigger={<Button>Mais</Button>}
      />,
    );
    const item = screen.getByRole('menuitem', { name: 'Arquivar' });
    expect(item).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(item);
    expect(arquivar).not.toHaveBeenCalled();
  });

  it('NotificationBell: 9+, lista com não lida, marcar todas, rodapé', async () => {
    const marcar = vi.fn();
    const clicar = vi.fn();
    render(
      <NotificationBell
        count={12}
        onMarkAllRead={marcar}
        onItemClick={clicar}
        footerHref="/notificacoes"
        items={[
          { id: '1', title: 'Numeração liberada', message: 'Portaria 12/2026', meta: 'DOC-2026-0012', time: 'há 5 min', href: '#doc-1' },
          { id: '2', title: 'Publicado', read: true, icon: Mail },
        ]}
      />,
    );
    const botao = screen.getByRole('button', { name: 'Notificações (12 não lidas)' });
    expect(within(botao).getByText('9+')).toHaveClass('bg-danger', 'text-2xs', 'min-w-4');
    await userEvent.click(botao);
    const painel = screen.getByRole('dialog', { name: 'Notificações' });
    expect(painel).toHaveClass('w-dropdown');
    await userEvent.click(within(painel).getByRole('button', { name: 'Marcar todas como lidas' }));
    expect(marcar).toHaveBeenCalledOnce();
    const [naoLida, lida] = within(painel).getAllByRole('listitem');
    expect(naoLida).toHaveAttribute('data-read', 'false');
    expect(within(naoLida!).getByText('não lida')).toHaveClass('sr-only');
    expect(within(lida!).queryByText('não lida')).toBeNull();
    expect(within(painel).getByRole('link', { name: 'Ver todas as notificações' })).toHaveAttribute('href', '/notificacoes');
    await userEvent.click(within(naoLida!).getByRole('link'));
    expect(clicar).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('NotificationBell: vazio, carregando, erro; fecha pelo X e pelo Esc', async () => {
    const tentar = vi.fn();
    const { rerender } = render(<NotificationBell count={0} defaultOpen />);
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument();
    expect(screen.getByText('Nenhuma notificação ainda.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Marcar todas como lidas' })).toBeNull();
    rerender(<NotificationBell count={0} defaultOpen loading />);
    expect(within(screen.getByRole('dialog')).getByRole('status')).toHaveTextContent('Carregando…');
    rerender(<NotificationBell count={0} defaultOpen error="Não foi possível carregar." onRetry={tentar} />);
    expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveTextContent('Não foi possível carregar.');
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(tentar).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Notificações' })).toHaveFocus();
  });

  it('NotificationBell anuncia a contagem em região viva', () => {
    const { container, rerender } = render(<NotificationBell count={0} icon={Bell} />);
    const viva = container.querySelector('[aria-live="polite"]')!;
    expect(viva).toHaveTextContent('');
    rerender(<NotificationBell count={1} icon={Bell} />);
    expect(viva).toHaveTextContent('Notificações: 1 não lida');
  });
});

describe('B20. CounterBadge', () => {
  it('formatCount e o limite', () => {
    expect(formatCount(3)).toBe('3');
    expect(formatCount(10)).toBe('9+');
    expect(formatCount(120, 99)).toBe('99+');
  });

  it('sobre um ícone, inline, zero e rótulo acessível', () => {
    const { container, rerender } = render(
      <CounterBadge count={4} label={(n) => `${n} pendências`}>
        <Bell />
      </CounterBadge>,
    );
    const bolinha = container.querySelector('[data-tone]')!;
    expect(bolinha).toHaveClass('absolute', 'h-4', 'rounded-pill', 'bg-danger', 'text-on-primary');
    expect(screen.getByText('4 pendências')).toHaveClass('sr-only');
    rerender(<CounterBadge count={0} />);
    expect(container.querySelector('[data-tone]')).toBeNull();
    rerender(<CounterBadge count={0} showZero tone="neutral" live />);
    expect(container.querySelector('[data-tone]')).toHaveClass('inline-flex', 'bg-surface-muted');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('0');
  });
});

describe('B21. PdfViewer', () => {
  it('panel: iframe com título, toolbar e download pelo link', async () => {
    const atualizar = vi.fn();
    render(<PdfViewer src="blob:x" title="Prévia do documento" onRefresh={atualizar} downloadName="portaria.pdf" />);
    const quadro = screen.getByTitle('Prévia do documento');
    expect(quadro.tagName).toBe('IFRAME');
    expect(quadro).toHaveAttribute('src', 'blob:x#toolbar=0&navpanes=0');
    expect(quadro).toHaveClass('min-h-editor');
    expect(screen.getByText('Como o documento vai ficar')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Baixar PDF' })).toHaveAttribute('download', 'portaria.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Atualizar prévia' }));
    expect(atualizar).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Atualizar prévia' })).toHaveClass('h-6', 'w-6', 'rounded-xs');
  });

  it('panel: carregando e erro com tentar de novo', async () => {
    const tentar = vi.fn();
    const { rerender } = render(<PdfViewer title="Prévia" />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando o PDF…');
    rerender(<PdfViewer title="Prévia" error="Não foi possível gerar a prévia." onRetry={tentar} />);
    const alerta = screen.getByRole('alert');
    expect(alerta).toHaveClass('bg-warning-soft');
    await userEvent.click(within(alerta).getByRole('button', { name: 'Tentar de novo' }));
    expect(tentar).toHaveBeenCalledOnce();
  });

  it('page: object com alternativa de download', () => {
    const { container } = render(<PdfViewer variant="page" src="/doc.pdf" title="PDF do documento" downloadName="doc.pdf" />);
    const obj = container.querySelector('object')!;
    expect(obj).toHaveAttribute('data', '/doc.pdf');
    expect(obj).toHaveAttribute('type', 'application/pdf');
    expect(obj).toHaveAttribute('aria-label', 'PDF do documento');
    expect(obj).toHaveClass('min-h-editor-frame', 'w-full');
    expect(within(obj as HTMLElement).getByRole('link', { name: 'Baixar PDF' })).toHaveAttribute('download', 'doc.pdf');
  });
});

describe('B25–B27. InlineCode, FlowChips e StickyAside', () => {
  it('InlineCode e Mono', () => {
    render(
      <>
        <InlineCode size="xs" breakAll>
          a1b2c3
        </InlineCode>
        <InlineCode boxed>ABC-123</InlineCode>
        <Mono weight="semibold" size="sm" tone="default">
          2026/0042
        </Mono>
      </>,
    );
    expect(screen.getByText('a1b2c3').tagName).toBe('CODE');
    expect(screen.getByText('a1b2c3')).toHaveClass('font-mono', 'text-xs', 'break-all');
    expect(screen.getByText('ABC-123')).toHaveClass('rounded-xs', 'bg-surface-muted', 'px-1.5');
    const mono = screen.getByText('2026/0042');
    expect(mono.tagName).toBe('SPAN');
    expect(mono).toHaveClass('font-mono', 'font-semibold', 'text-sm', 'text-title');
  });

  it('FlowChips: lista ordenada com setas decorativas', () => {
    const { container } = render(<FlowChips label="Fluxo PASSO" tone="indigo" steps={['Solicitar', 'Analisar', 'Assinar']} />);
    const lista = screen.getByRole('list', { name: 'Fluxo PASSO' });
    expect(lista.tagName).toBe('OL');
    expect(within(lista).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Analisar')).toHaveClass('bg-indigo-soft', 'text-indigo-deep', 'ring-indigo-tint', 'ring-1', 'ring-inset');
    const setas = container.querySelectorAll('svg');
    expect(setas).toHaveLength(2);
    setas.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
  });

  it('StickyAside: gruda no topo, cabeçalho tingido e nome pelo título', () => {
    render(
      <StickyAside title="Conteúdo mínimo" description="Art. 18 da Lei 14.133" tone="warning" icon={Shield}>
        <p>falta o valor</p>
      </StickyAside>,
    );
    const aside = screen.getByRole('complementary', { name: 'Conteúdo mínimo' });
    expect(aside).toHaveClass('card', 'sticky', 'top-6', 'overflow-hidden');
    expect(aside.querySelector('header')).toHaveClass('bg-warning-soft');
    expect(screen.getByText('Conteúdo mínimo')).toHaveClass('text-warning-deep');
    expect(screen.getByText('Art. 18 da Lei 14.133')).toHaveClass('text-xs2', 'text-warning-hover');
    expect(screen.getByText('falta o valor').parentElement).toHaveClass('p-5');
  });

  it('StickyAside sem título usa o label', () => {
    render(
      <StickyAside label="Resumo" offset="sm" padding="none">
        <p>x</p>
      </StickyAside>,
    );
    expect(screen.getByRole('complementary', { name: 'Resumo' })).toHaveClass('top-4');
  });
});
