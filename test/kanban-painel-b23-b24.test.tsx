import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileSignature, Hash, Shield, Users } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import {
  CountList,
  DashboardHero,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  MiniCalendar,
  MiniStat,
  QueueCard,
  QuickActions,
  StatusBadge,
  monthWeeks,
} from '../src';

describe('B23. Kanban', () => {
  it('quadro rolável pelo teclado, colunas com contagem e cartões', () => {
    render(
      <KanbanBoard label="Processos por fase">
        <KanbanColumn title="Planejamento" subtitle="SECAD">
          <KanbanCard
            code="12/2026"
            title="Aquisição de merenda escolar"
            badge={<StatusBadge status="EM_ANALISE" />}
            meta="R$ 12.400,00"
            footer="Em: SECAD"
            href="/licitacoes/1"
          />
          <KanbanCard title="Reforma da escola" onClick={() => {}} />
        </KanbanColumn>
        <KanbanColumn title="Jurídico" count={0} />
      </KanbanBoard>,
    );
    const quadro = screen.getByRole('region', { name: 'Processos por fase' });
    expect(quadro).toHaveAttribute('tabindex', '0');
    expect(quadro).toHaveClass('flex', 'gap-4', 'overflow-x-auto');

    const coluna = screen.getByRole('region', { name: 'Planejamento' });
    expect(coluna).toHaveClass('w-kanban-column', 'shrink-0', 'rounded-panel', 'bg-surface-hover/80');
    expect(within(coluna).getByText('SECAD · 2 processo(s)')).toHaveClass('text-xs', 'text-muted');
    const cartoes = within(coluna).getAllByRole('listitem');
    expect(cartoes).toHaveLength(2);

    const link = within(cartoes[0]!).getByRole('link');
    expect(link).toHaveAttribute('href', '/licitacoes/1');
    expect(link).toHaveClass('rounded-control', 'border-border', 'shadow-card', 'hover:border-primary-light/60');
    expect(within(link).getByText('12/2026')).toHaveClass('font-mono', 'text-xs', 'text-muted');
    expect(within(link).getByText('Aquisição de merenda escolar')).toHaveClass('line-clamp-2', 'text-sm');
    expect(within(link).getByText('R$ 12.400,00')).toHaveClass('whitespace-nowrap');
    expect(within(link).getByText('Em: SECAD')).toHaveClass('text-xs2', 'text-subtle');

    expect(within(cartoes[1]!).getByRole('button', { name: 'Reforma da escola' })).toHaveAttribute('type', 'button');

    const vazia = screen.getByRole('region', { name: 'Jurídico' });
    expect(within(vazia).getByText('0 processo(s)')).toBeInTheDocument();
    expect(within(vazia).getByText('Vazio')).toHaveClass('text-center', 'text-subtle');
    expect(within(vazia).queryByRole('list')).toBeNull();
  });

  it('cartão sem destino não é clicável; contagem personalizada', () => {
    render(
      <KanbanColumn title="Fase" countLabel={(n) => `${n} peça(s)`} emptyLabel="Nada aqui">
        <KanbanCard title="Só leitura" />
      </KanbanColumn>,
    );
    expect(screen.getByText('1 peça(s)')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Só leitura').parentElement).not.toHaveClass('focus-ring');
  });
});

describe('B24. DashboardHero', () => {
  it('soft: gradiente, ícone claro e textos na cor do perfil', () => {
    render(<DashboardHero profile="rh" title="Painel do RH" description="Numerações e arquivamento" icon={Users} />);
    const titulo = screen.getByRole('heading', { level: 1, name: 'Painel do RH' });
    expect(titulo).toHaveClass('text-profile-rh-title');
    const faixa = titulo.closest('[data-profile]')!;
    expect(faixa).toHaveClass('rounded-card', 'border-profile-rh-border', 'bg-gradient-to-br', 'from-profile-rh-soft', 'via-surface');
    expect(faixa.querySelector('[aria-hidden]')).toHaveClass('bg-profile-rh-tint', 'text-profile-rh-icon', 'rounded-tile');
    expect(screen.getByText('Numerações e arquivamento')).toHaveClass('text-profile-rh-text/90');
  });

  it('solid: ícone cheio com sombra colorida, título escuro, h2', () => {
    render(
      <DashboardHero profile="plataforma" variant="solid" headingLevel="h2" title="Dono da plataforma" description="Multi-tenant" icon={Shield} />,
    );
    const titulo = screen.getByRole('heading', { level: 2 });
    expect(titulo).toHaveClass('text-foreground');
    const faixa = titulo.closest('[data-profile]')!;
    expect(faixa).toHaveClass('p-6', 'shadow-card', 'border-profile-plataforma-border');
    expect(faixa.querySelector('[aria-hidden]')).toHaveClass('bg-profile-plataforma', 'text-on-primary', 'shadow-profile-plataforma');
    expect(screen.getByText('Multi-tenant')).toHaveClass('text-body');
  });

  it.each(['rh', 'secretaria', 'prefeito', 'gabinete', 'plataforma'] as const)('perfil %s tem classes próprias', (p) => {
    render(<DashboardHero profile={p} title="T" icon={Hash} />);
    expect(screen.getByRole('heading')).toHaveClass(`text-profile-${p}-title`);
  });
});

describe('B24. QuickActions', () => {
  const acoes = [
    { href: '/documentos/novo', label: 'Nova solicitação', icon: Hash },
    { label: 'Assinar', icon: FileSignature, onClick: vi.fn() },
  ];

  it('faixa na cor principal, links e botões com ícone', async () => {
    render(<QuickActions title="Ações rápidas — Secretaria" actions={acoes} />);
    const secao = screen.getByRole('region', { name: 'Ações rápidas — Secretaria' });
    expect(within(secao).getByRole('heading').parentElement).toHaveClass('bg-primary', 'text-on-primary');
    const link = within(secao).getByRole('link', { name: 'Nova solicitação' });
    expect(link).toHaveAttribute('href', '/documentos/novo');
    expect(link).toHaveClass('px-5', 'py-3.5', 'text-label', 'hover:bg-surface-hover', 'focus-visible:ring-inset');
    expect(link.querySelector('span')).toHaveClass('h-9', 'w-9', 'rounded-control', 'bg-primary-soft', 'text-accent');
    await userEvent.click(within(secao).getByRole('button', { name: 'Assinar' }));
    expect(acoes[1]!.onClick).toHaveBeenCalledOnce();
  });

  it('com perfil: faixa 700 e ícones do perfil', () => {
    render(<QuickActions title="Prefeito" profile="prefeito" actions={acoes.slice(0, 1)} />);
    expect(screen.getByRole('heading').parentElement).toHaveClass('bg-profile-prefeito-icon');
    expect(screen.getByRole('link').querySelector('span')).toHaveClass('bg-profile-prefeito-soft', 'text-profile-prefeito');
  });
});

describe('B24. QueueCard', () => {
  it('cabeçalho tingido, ícone, subtítulo, "ver todas" e a lista', () => {
    render(
      <QueueCard title="Fila de assinatura" subtitle="Aguardando sua assinatura" icon={FileSignature} tone="violet" href="/assinaturas" hrefLabel="Ver fila completa">
        <ul>
          <li>Portaria 12/2026</li>
        </ul>
      </QueueCard>,
    );
    const secao = screen.getByRole('region', { name: 'Fila de assinatura' });
    const cabecalho = within(secao).getByRole('heading').closest('.px-5')!;
    expect(cabecalho).toHaveClass('bg-violet-soft');
    expect(secao.querySelector('.bg-surface\\/80')).toHaveClass('h-10', 'w-10', 'rounded-tile', 'shadow-card');
    expect(within(secao).getByText('Aguardando sua assinatura')).toHaveClass('text-xs', 'text-body');
    expect(within(secao).getByRole('link', { name: 'Ver fila completa' })).toHaveClass('text-accent-text', 'font-semibold');
    expect(within(secao).getByText('Portaria 12/2026')).toBeInTheDocument();
  });

  it('sem itens, mostra o texto de vazio', () => {
    render(<QueueCard title="Devolvidas" icon={Hash} empty="Nenhuma solicitação devolvida." />);
    expect(screen.getByText('Nenhuma solicitação devolvida.')).toHaveClass('text-center', 'text-muted');
    expect(screen.queryByRole('link')).toBeNull();
  });
});

describe('B24. CountList', () => {
  it('ponto colorido, rótulo, contador e "ver todas"', () => {
    render(
      <CountList
        title="Pendências"
        href="/pendencias"
        items={[
          { id: 'a', label: 'Solicitação aberta', count: 3, tone: 'warning', href: '/documentos?status=A' },
          { id: 'b', label: 'Aguardando assinatura', count: 12, tone: 'purple' },
        ]}
      />,
    );
    const secao = screen.getByRole('region', { name: 'Pendências' });
    expect(within(secao).getByRole('link', { name: 'Ver todas' })).toHaveAttribute('href', '/pendencias');
    const item = within(secao).getByRole('link', { name: /Solicitação aberta/ });
    expect(item).toHaveClass('rounded-control', 'hover:bg-surface-hover');
    expect(item.querySelector('[aria-hidden]')).toHaveClass('h-2', 'w-2', 'rounded-pill', 'bg-warning');
    expect(within(item).getByText('3')).toHaveClass('rounded-pill', 'bg-surface-muted', 'font-bold', 'text-title');
    const semLink = within(secao).getByText('Aguardando assinatura').closest('div')!;
    expect(semLink).not.toHaveClass('focus-ring');
    expect(semLink.querySelector('[aria-hidden]')).toHaveClass('bg-purple');
  });

  it('vazia', () => {
    render(<CountList title="Pendências" items={[]} />);
    expect(screen.getByText('Nenhuma pendência no momento')).toHaveClass('text-subtle');
  });
});

describe('B24. MiniStat', () => {
  it('ícone no tom, número e rótulo; com link', () => {
    render(<MiniStat label="Prefeituras ativas" value={4} icon={Shield} tone="rose" href="/prefeituras" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('stat-card', 'focus-ring');
    expect(link.querySelector('svg')).toHaveClass('h-5', 'w-5', 'text-rose-strong');
    expect(screen.getByText('4')).toHaveClass('text-2xl', 'font-bold', 'text-foreground');
    expect(screen.getByText('Prefeituras ativas')).toHaveClass('text-sm', 'text-muted');
  });

  it('carregando e tracejado', () => {
    const { rerender } = render(<MiniStat label="Total" value={9} loading />);
    expect(screen.getByText('…')).toBeInTheDocument();
    expect(screen.getByText('Total').parentElement).toHaveAttribute('aria-busy', 'true');
    rerender(<MiniStat label="Cadastros por prefeitura" description="Usuários, secretarias…" icon={Users} variant="dashed" />);
    const card = screen.getByText('Cadastros por prefeitura').parentElement!;
    expect(card).toHaveClass('border-dashed', 'bg-surface-hover/50');
    expect(card.querySelector('svg')).toHaveClass('text-subtle');
    expect(screen.getByText('Cadastros por prefeitura')).toHaveClass('font-medium', 'text-body');
    expect(screen.getByText('Usuários, secretarias…')).toHaveClass('text-xs', 'text-subtle');
  });
});

describe('B24. MiniCalendar', () => {
  const hoje = new Date(2026, 8, 28);

  it('semanas do mês com vazios antes do dia 1', () => {
    const semanas = monthWeeks(2026, 8); // setembro de 2026 começa numa terça
    expect(semanas[0]).toEqual([null, null, 1, 2, 3, 4, 5]);
    expect(semanas.every((s) => s.length === 7)).toBe(true);
    expect(semanas.flat().filter(Boolean)).toHaveLength(30);
  });

  it('tabela do mês, hoje destacado, setas trocam o mês', async () => {
    const aoMudar = vi.fn();
    render(<MiniCalendar today={hoje} onMonthChange={aoMudar} />);
    const tabela = screen.getByRole('table', { name: 'Setembro de 2026' });
    expect(within(tabela).getAllByRole('columnheader')).toHaveLength(7);
    expect(within(tabela).getByText('Domingo')).toHaveClass('sr-only');
    const dia = within(tabela).getByText('28');
    expect(dia).toHaveAttribute('aria-current', 'date');
    expect(dia).toHaveClass('bg-accent', 'font-bold', 'text-on-primary', 'rounded-control', 'h-8');
    expect(within(tabela).getByText('27')).toHaveClass('text-body');
    expect(screen.getByText('Setembro / 2026')).toHaveAttribute('aria-live', 'polite');

    await userEvent.click(screen.getByRole('button', { name: 'Próximo mês' }));
    expect(screen.getByRole('table', { name: 'Outubro de 2026' })).toBeInTheDocument();
    expect(aoMudar).toHaveBeenLastCalledWith(new Date(2026, 9, 1));
    expect(screen.queryByText('28', { selector: '[aria-current]' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Mês anterior' }));
    await userEvent.click(screen.getByRole('button', { name: 'Mês anterior' }));
    expect(screen.getByRole('table', { name: 'Agosto de 2026' })).toBeInTheDocument();
  });

  it('controlado de fora e com dias clicáveis', async () => {
    const aoClicar = vi.fn();
    render(<MiniCalendar today={hoje} month={new Date(2026, 0, 15)} onDayClick={aoClicar} title="Agenda" />);
    expect(screen.getByRole('region', { name: 'Agenda' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Janeiro de 2026' })).toBeInTheDocument();
    // Controlado: a seta avisa, mas o mês só muda se o pai mudar `month`.
    await userEvent.click(screen.getByRole('button', { name: 'Próximo mês' }));
    expect(screen.getByRole('table', { name: 'Janeiro de 2026' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '5 de Janeiro' }));
    expect(aoClicar).toHaveBeenCalledWith(new Date(2026, 0, 5));
  });
});
