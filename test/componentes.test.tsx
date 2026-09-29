import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileText, Home, Users } from 'lucide-react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  AppLayout,
  Button,
  Card,
  CollapsibleCard,
  ConfirmModal,
  EmptyState,
  ErrorInline,
  ErrorState,
  FormField,
  FormSection,
  Header,
  Input,
  Modal,
  NavigationProgress,
  PageHeader,
  Select,
  Sidebar,
  StatCard,
  StatusBadge,
  STATUS_COLORS,
  Table,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
  WizardStepper,
  isNavItemActive,
  cn,
} from '../src';

describe('cn', () => {
  it('resolve conflitos do Tailwind', () => {
    expect(cn('px-4 py-2', false && 'hidden', 'px-2')).toBe('py-2 px-2');
  });
});

describe('Button', () => {
  it.each([
    ['primary', 'btn-primary'],
    ['secondary', 'btn-secondary'],
    ['danger', 'btn-danger'],
    ['ghost', 'btn-ghost'],
    ['govbr', 'btn-govbr'],
  ] as const)('variante %s aplica %s', (variant, classe) => {
    render(<Button variant={variant}>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveClass(classe);
  });

  it('tamanho sm reduz o espaçamento', () => {
    render(<Button size="sm">Ok</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-xs');
  });

  it('é type="button" por padrão e tem foco visível', () => {
    render(<Button>Ok</Button>);
    const b = screen.getByRole('button');
    expect(b).toHaveAttribute('type', 'button');
    expect(b).toHaveClass('focus-ring');
  });

  it('loading desabilita, marca aria-busy e troca o rótulo', async () => {
    const onClick = vi.fn();
    render(
      <Button loading loadingLabel="Salvando…" onClick={onClick}>
        Salvar
      </Button>,
    );
    const b = screen.getByRole('button');
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(b).toHaveTextContent('Salvando…');
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('mostra o ícone', () => {
    render(<Button icon={<FileText data-testid="icone" />}>Novo</Button>);
    expect(screen.getByTestId('icone')).toBeInTheDocument();
  });
});

describe('Card, PageHeader, FormSection', () => {
  it('Card renderiza cabeçalho, corpo e rodapé', () => {
    const { container } = render(
      <Card title="Dados" description="Resumo" action={<Button>Ação</Button>} footer={<span>rodapé</span>}>
        corpo
      </Card>,
    );
    expect(container.firstChild).toHaveClass('card');
    expect(screen.getByRole('heading', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByText('corpo')).toHaveClass('card-body');
    expect(screen.getByText('rodapé')).toBeInTheDocument();
  });

  it('Card sem padding para tabelas', () => {
    render(<Card padding="none">corpo</Card>);
    expect(screen.getByText('corpo')).not.toHaveClass('card-body');
  });

  it('PageHeader mostra título, descrição e ação', () => {
    render(<PageHeader title="Secretarias" description="Cadastro" action={<Button>Nova</Button>} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Secretarias' })).toBeInTheDocument();
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nova' })).toBeInTheDocument();
  });

  it('FormSection agrupa campos', () => {
    render(
      <FormSection title="Endereço" description="Onde fica">
        <span>campo</span>
      </FormSection>,
    );
    expect(screen.getByRole('heading', { name: 'Endereço' })).toBeInTheDocument();
  });
});

describe('Campos de formulário', () => {
  it('Input com label fica associado ao rótulo', () => {
    render(<Input label="Nome" hint="Nome completo" />);
    const campo = screen.getByLabelText('Nome');
    expect(campo).toHaveClass('input');
    expect(campo).toHaveAccessibleDescription('Nome completo');
  });

  it('Input com erro fica inválido e descreve o erro', () => {
    render(<Input label="E-mail" error="E-mail inválido" required />);
    const campo = screen.getByLabelText(/E-mail/);
    expect(campo).toHaveAttribute('aria-invalid', 'true');
    expect(campo).toHaveAttribute('aria-required', 'true');
    expect(campo).toHaveClass('input-error');
    expect(campo).toHaveAccessibleDescription('E-mail inválido');
  });

  it('FormField repassa o id ao campo de dentro', () => {
    render(
      <FormField label="CPF" error="Obrigatório">
        <Input />
      </FormField>,
    );
    const campo = screen.getByLabelText('CPF');
    expect(campo).toHaveAttribute('aria-invalid', 'true');
    expect(campo).toHaveAccessibleDescription('Obrigatório');
  });

  it('FormField respeita htmlFor explícito', () => {
    render(
      <FormField label="Código" htmlFor="codigo">
        <input id="codigo" />
      </FormField>,
    );
    expect(screen.getByLabelText('Código')).toHaveAttribute('id', 'codigo');
  });

  it('Textarea com label', () => {
    render(<Textarea label="Observação" />);
    const campo = screen.getByLabelText('Observação');
    expect(campo.tagName).toBe('TEXTAREA');
    expect(campo).toHaveClass('input', 'resize-y');
  });

  it('Select com opções declarativas e placeholder', async () => {
    const onChange = vi.fn();
    render(
      <Select
        label="Secretaria"
        placeholder="Selecione…"
        options={[
          { value: 'saude', label: 'Saúde' },
          { value: 'educacao', label: 'Educação' },
        ]}
        onChange={(e) => onChange(e.target.value)}
      />,
    );
    const campo = screen.getByLabelText('Secretaria');
    expect(within(campo).getAllByRole('option')).toHaveLength(3);
    await userEvent.selectOptions(campo, 'educacao');
    expect(onChange).toHaveBeenCalledWith('educacao');
  });
});

describe('Modal', () => {
  function ModalDeTeste({ onClose }: { onClose: () => void }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Abrir</button>
        <Modal
          open={open}
          title="Nova secretaria"
          subtitle="Preencha os dados"
          onClose={() => {
            onClose();
            setOpen(false);
          }}
          footer={<Button>Salvar</Button>}
        >
          <p>conteúdo</p>
        </Modal>
      </>
    );
  }

  it('abre com role="dialog", título e foco dentro', async () => {
    render(<ModalDeTeste onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Abrir'));
    const dialog = screen.getByRole('dialog', { name: 'Nova secretaria' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Preencha os dados');
    expect(dialog).toHaveClass('rounded-card', 'shadow-modal');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('fecha pelo botão, pelo Esc e pelo fundo, devolvendo o foco', async () => {
    const onClose = vi.fn();
    render(<ModalDeTeste onClose={onClose} />);
    const abrir = screen.getByText('Abrir');

    await userEvent.click(abrir);
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(abrir).toHaveFocus();

    await userEvent.click(abrir);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(abrir);
    await userEvent.click(screen.getByTestId('modal-fundo'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('size lg usa a largura maior', () => {
    render(
      <Modal open title="Largo" onClose={() => {}} size="lg">
        x
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-modal-lg');
  });
});

describe('ConfirmModal', () => {
  it('confirma e cancela', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmModal
        open
        title="Excluir modelo?"
        message="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Excluir modelo?' });
    const confirmar = within(dialog).getByRole('button', { name: 'Excluir' });
    expect(confirmar).toHaveClass('btn-danger');
    expect(confirmar).toHaveFocus();
    await userEvent.click(confirmar);
    expect(onConfirm).toHaveBeenCalledOnce();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('com loading bloqueia os botões', () => {
    render(<ConfirmModal open title="Enviar?" onConfirm={() => {}} onClose={() => {}} loading />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Processando/ })).toBeDisabled();
  });

  it('com motivo só confirma depois de preenchido', async () => {
    const onConfirm = vi.fn();
    function ComMotivo() {
      const [motivo, setMotivo] = useState('');
      return (
        <ConfirmModal
          open
          title="Devolver"
          confirmLabel="Devolver"
          onConfirm={onConfirm}
          onClose={() => {}}
          reason={{ value: motivo, onChange: setMotivo, label: 'Motivo da devolução', error: 'Falhou' }}
        />
      );
    }
    render(<ComMotivo />);
    const confirmar = screen.getByRole('button', { name: 'Devolver' });
    expect(confirmar).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Motivo da devolução'), 'Faltou anexo');
    expect(confirmar).toBeEnabled();
    await userEvent.click(confirmar);
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou');
  });
});

describe('StatusBadge', () => {
  it('usa o STATUS_COLORS do SGDM por padrão', () => {
    render(<StatusBadge status="EM_ANALISE" />);
    const selo = screen.getByText('EM ANALISE');
    for (const c of STATUS_COLORS.EM_ANALISE!.split(' ')) expect(selo).toHaveClass(c);
  });

  it('aceita mapa e rótulos próprios, com fallback', () => {
    render(
      <>
        <StatusBadge status="PAGO" colors={{ PAGO: 'bg-green-100 text-green-800' }} labels={{ PAGO: 'Pago' }} />
        <StatusBadge status="DESCONHECIDO" colors={{}} />
      </>,
    );
    expect(screen.getByText('PAGO')).toHaveClass('bg-green-100', 'text-green-800');
    expect(screen.getByText('DESCONHECIDO')).toHaveClass('bg-slate-100', 'text-slate-700');
  });

  it('atalho ativo/inativo', () => {
    render(
      <>
        <StatusBadge active />
        <StatusBadge active={false} />
      </>,
    );
    expect(screen.getByText('Ativo')).toHaveClass('bg-success-soft');
    expect(screen.getByText('Inativo')).toHaveClass('bg-surface-muted');
  });
});

describe('StatCard', () => {
  it('mostra valor, título, tom e link', () => {
    const { container } = render(
      <StatCard title="Publicados" value={42} icon={FileText} tone="success" href="/publicados" />,
    );
    expect(container.firstChild).toHaveClass('stat-card');
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver todas/ })).toHaveAttribute('href', '/publicados');
    expect(container.querySelector('.bg-success-soft.text-success-strong')).not.toBeNull();
  });

  it('usa o componente de link do roteador', () => {
    const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
      <a href={href} className={className} data-roteador="sim">
        {children}
      </a>
    );
    render(<StatCard title="X" value={1} icon={FileText} href="/x" linkComponent={Link} />);
    expect(screen.getByRole('link')).toHaveAttribute('data-roteador', 'sim');
  });
});

describe('Table', () => {
  type Linha = { id: number; nome: string; sigla?: string };
  const colunas = [
    { key: 'nome', header: 'Nome', emphasis: true },
    { key: 'sigla', header: 'Sigla' },
    { key: 'acoes', header: 'Ações', align: 'right' as const, render: (l: Linha) => <Button size="sm">Editar {l.nome}</Button> },
  ];

  it('renderiza linhas e colunas', () => {
    render(<Table columns={colunas} rows={[{ id: 1, nome: 'Saúde', sigla: 'SMS' }, { id: 2, nome: 'Obras' }]} caption="Secretarias" />);
    const tabela = screen.getByRole('table', { name: 'Secretarias' });
    expect(within(tabela).getAllByRole('columnheader')).toHaveLength(3);
    expect(within(tabela).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar Saúde' })).toBeInTheDocument();
  });

  it('mostra o estado vazio', () => {
    render(<Table columns={colunas} rows={[]} empty={<EmptyState title="Nenhuma secretaria cadastrada" />} />);
    expect(screen.getByText('Nenhuma secretaria cadastrada')).toBeInTheDocument();
  });

  it('mostra a mensagem vazia padrão', () => {
    render(<Table columns={colunas} rows={undefined} />);
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument();
  });

  it('mostra o carregando', () => {
    render(<Table columns={colunas} rows={[{ id: 1, nome: 'Saúde' }]} loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando…');
    expect(screen.queryByText('Saúde')).not.toBeInTheDocument();
  });

  it('clique na linha', async () => {
    const onRowClick = vi.fn();
    render(<Table columns={colunas.slice(0, 1)} rows={[{ id: 1, nome: 'Saúde' }]} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Saúde'));
    expect(onRowClick).toHaveBeenCalledWith({ id: 1, nome: 'Saúde' });
  });
});

describe('Tabs', () => {
  const abas = [
    { id: 'a', label: 'Aguardando', content: <p>lista A</p> },
    { id: 'b', label: 'Vencidos', content: <p>lista B</p> },
    { id: 'c', label: 'Bloqueada', content: <p>lista C</p>, disabled: true },
  ];

  it('troca de aba pelo clique', async () => {
    const onChange = vi.fn();
    render(<Tabs items={abas} label="Arquivamento" onChange={onChange} />);
    expect(screen.getByRole('tablist', { name: 'Arquivamento' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Aguardando' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('lista A');

    await userEvent.click(screen.getByRole('tab', { name: 'Vencidos' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: 'Vencidos' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Vencidos' })).toHaveClass('border-accent', 'text-accent-text');
    expect(screen.getByRole('tabpanel', { name: 'Vencidos' })).toHaveTextContent('lista B');
  });

  it('troca de aba pelas setas, pulando a desabilitada', async () => {
    render(<Tabs items={abas} />);
    screen.getByRole('tab', { name: 'Aguardando' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Vencidos' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Aguardando' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('lista B');
  });

  it('modo controlado', async () => {
    const onChange = vi.fn();
    render(<Tabs items={abas} value="b" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Aguardando' }));
    expect(onChange).toHaveBeenCalledWith('a');
    expect(screen.getByRole('tab', { name: 'Vencidos' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('Toast', () => {
  function Disparador({ duration }: { duration?: number }) {
    const { toast, error } = useToast();
    return (
      <>
        <button onClick={() => toast({ title: 'Salvo', description: 'Tudo certo', variant: 'success', duration })}>
          ok
        </button>
        <button onClick={() => error('Falhou')}>erro</button>
      </>
    );
  }

  it('aparece e some sozinho depois do tempo', () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <Disparador duration={3000} />
        </ToastProvider>,
      );
      act(() => screen.getByText('ok').click());
      const aviso = screen.getByRole('status');
      expect(aviso).toHaveTextContent('Salvo');
      expect(aviso).toHaveAttribute('data-variant', 'success');
      act(() => vi.advanceTimersByTime(2999));
      expect(screen.getByText('Salvo')).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(1));
      expect(screen.queryByText('Salvo')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('fecha pelo botão e usa role="alert" para erro', async () => {
    render(
      <ToastProvider>
        <Disparador duration={0} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('erro'));
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou');
    await userEvent.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(screen.queryByText('Falhou')).not.toBeInTheDocument();
  });

  it('useToast fora do provider avisa', () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Disparador />)).toThrow(/ToastProvider/);
    erro.mockRestore();
  });
});

describe('Estados', () => {
  it('EmptyState com ação', () => {
    render(<EmptyState title="Nada aqui" description="Cadastre o primeiro" action={<Button>Cadastrar</Button>} />);
    expect(screen.getByText('Nada aqui')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument();
  });

  it('ErrorState mostra a mensagem do erro e some sem erro', () => {
    const { rerender } = render(<ErrorState error={new Error('Timeout da API')} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar os dados');
    expect(screen.getByRole('alert')).toHaveTextContent('Timeout da API');
    rerender(<ErrorState error={null} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('ErrorState usa a descrição quando o erro não tem mensagem', () => {
    render(<ErrorState error={true} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Verifique sua conexão');
  });

  it('ErrorInline', () => {
    render(<ErrorInline />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao carregar.');
  });
});

describe('WizardStepper', () => {
  it('marca passos concluídos, atual e pendentes', () => {
    render(
      <WizardStepper
        current={2}
        steps={[{ title: 'Dados' }, { title: 'Documentos', description: 'Anexos' }, { title: 'Revisão' }]}
      />,
    );
    const itens = screen.getAllByRole('listitem');
    expect(itens.map((i) => i.dataset.state)).toEqual(['done', 'active', 'pending']);
    expect(itens[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('navigation', { name: 'Progresso' })).toHaveClass('card');
  });
});

describe('Tooltip e CollapsibleCard', () => {
  it('Tooltip padrão é o ícone "i" com rótulo', () => {
    render(<Tooltip text="Explicação curta" />);
    expect(screen.getByRole('button', { name: 'Explicação curta' })).toHaveClass('focus-ring');
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Explicação curta');
  });

  it('Tooltip com gatilho próprio usa aria-describedby', () => {
    render(
      <Tooltip text="Ajuda">
        <button>?</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: '?' })).toHaveAccessibleDescription('Ajuda');
  });

  it('CollapsibleCard abre e fecha', async () => {
    render(
      <CollapsibleCard title="Assinatura" badge={<StatusBadge active />}>
        <p>formulário</p>
      </CollapsibleCard>,
    );
    const botao = screen.getByRole('button', { name: /Assinatura/ });
    expect(botao).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('formulário')).not.toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    await userEvent.click(botao);
    expect(botao).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('formulário')).toBeInTheDocument();
  });
});

describe('Layout', () => {
  const secoes = [
    { label: 'Principal', items: [{ href: '/dashboard', label: 'Dashboard', icon: Home }] },
    {
      label: 'Cadastros',
      items: [
        { href: '/cadastros/usuarios', label: 'Usuários', icon: Users },
        { href: '/documentos', label: 'Documentos', icon: FileText },
      ],
    },
  ];

  it('isNavItemActive considera subpáginas', () => {
    const item = { href: '/documentos', label: 'D', icon: FileText };
    expect(isNavItemActive(item, '/documentos/12')).toBe(true);
    expect(isNavItemActive({ ...item, exact: true }, '/documentos/12')).toBe(false);
    expect(isNavItemActive(item, '/documentosx')).toBe(false);
    expect(isNavItemActive({ ...item, active: true }, '/outra')).toBe(true);
  });

  it('AppLayout monta menu, cabeçalho e conteúdo; o botão recolhe o menu', async () => {
    const onLogout = vi.fn();
    render(
      <AppLayout
        navigating
        sidebar={
          <Sidebar
            brand={{ name: 'Sistema X', subtitle: 'Prefeitura' }}
            sections={secoes}
            currentPath="/cadastros/usuarios/3"
            onLogout={onLogout}
          />
        }
        header={<Header title="Usuários" user={{ name: 'Maria da Silva', subtitle: 'Administradora' }} actions={<span>sino</span>} />}
      >
        <p>tela</p>
      </AppLayout>,
    );
    expect(screen.getByRole('progressbar', { name: 'Carregando página' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('tela');
    expect(screen.getByRole('heading', { name: 'Usuários' })).toBeInTheDocument();
    expect(screen.getByText('MD')).toBeInTheDocument();
    expect(screen.getByText('sino')).toBeInTheDocument();

    const menus = screen.getAllByRole('navigation', { name: 'Menu principal' });
    const desktop = menus[0]!;
    const ativo = within(desktop).getByRole('link', { name: 'Usuários' });
    expect(ativo).toHaveClass('nav-item', 'nav-item-active');
    expect(ativo).toHaveAttribute('aria-current', 'page');
    expect(within(desktop).getByRole('link', { name: 'Dashboard' })).toHaveClass('nav-item-inactive');
    expect(within(desktop).getByText('Principal')).toHaveClass('section-label');

    const aside = desktop.closest('aside')!;
    expect(aside).toHaveClass('w-sidebar');
    await userEvent.click(screen.getByRole('button', { name: 'Alternar menu' }));
    expect(aside).toHaveClass('w-sidebar-collapsed');
    expect(within(desktop).queryByText('Principal')).not.toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button', { name: 'Sair' })[0]!);
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('NavigationProgress some quando inativo', () => {
    render(<NavigationProgress active={false} />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
