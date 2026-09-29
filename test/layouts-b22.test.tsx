import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckCircle2, Lock, ServerCrash } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import {
  AuthCard,
  AuthLayout,
  AuthMessage,
  Button,
  Card,
  Checkbox,
  ErrorInline,
  ErrorPage,
  Input,
  Modal,
  OnDark,
  PasswordInput,
  PublicLayout,
  Select,
  Textarea,
} from '../src';

describe('B22. AuthLayout e a variante onDark', () => {
  it('formulário no fundo escuro, com a marca e o painel de foto com gradiente', () => {
    render(
      <AuthLayout
        title="SGDM"
        description="Sistema de Gestão Documental Municipal"
        image={{ src: '/foto.png' }}
        headline="Gestão, controle e transparência em um só lugar."
        tagline="Rastreabilidade e auditoria."
      >
        <form aria-label="Entrar">
          <Input label="Usuário ou e-mail" error="E-mail inválido" />
        </form>
      </AuthLayout>,
    );
    const principal = screen.getByRole('main');
    expect(principal).toHaveClass('bg-sidebar', 'lg:w-1/2');
    expect(screen.getByRole('heading', { level: 1, name: 'SGDM' })).toHaveClass('text-sidebar-foreground');
    expect(screen.getByText('Sistema de Gestão Documental Municipal')).toHaveClass('text-on-dark-muted');
    expect(principal.querySelector('.shadow-brand-strong')).toHaveClass('rounded-card', 'bg-accent', 'h-16', 'w-16');

    // Painel da direita: foto decorativa, gradiente e frase.
    const foto = document.querySelector('img')!;
    expect(foto).toHaveAttribute('src', '/foto.png');
    expect(foto).toHaveAttribute('alt', '');
    expect(screen.getByTestId('auth-gradiente')).toHaveClass(
      'bg-gradient-to-t',
      'from-overlay-strong/85',
      'via-overlay-strong/30',
      'via-60%',
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão, controle');
    expect(screen.getByText('Rastreabilidade e auditoria.')).toHaveClass('text-on-dark-label');

    // Campo dentro do layout: rótulo e erro nas cores de fundo escuro.
    expect(screen.getByText('Usuário ou e-mail')).toHaveClass('text-on-dark-label');
    expect(screen.getByText('E-mail inválido')).toHaveClass('text-on-dark-error');
    expect(screen.getByLabelText('Usuário ou e-mail')).toHaveClass('input');
  });

  it('sem foto e sem frase, não há painel e o formulário ocupa a largura', () => {
    render(
      <AuthLayout title="SGDM" footer="v2.0">
        <p>form</p>
      </AuthLayout>,
    );
    expect(screen.getByRole('main')).not.toHaveClass('lg:w-1/2');
    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByText('v2.0')).toHaveClass('text-on-dark-muted');
  });

  it('link, senha, checkbox, select, textarea e erro geral mudam no escuro', () => {
    render(
      <OnDark>
        <PasswordInput label="Senha" hint="Mínimo de 6" />
        <Select label="Perfil" options={[{ value: 'a', label: 'A' }]} />
        <Textarea label="Obs." required />
        <Checkbox label="Lembrar de mim" description="Neste computador" />
        <Button variant="link">Esqueci minha senha</Button>
        <Button>Entrar</Button>
        <ErrorInline size="sm" message="Usuário ou senha inválidos" />
      </OnDark>,
    );
    expect(screen.getByText('Senha')).toHaveClass('text-on-dark-label');
    expect(screen.getByText('Mínimo de 6')).toHaveClass('text-on-dark-muted');
    expect(screen.getByText('Perfil')).toHaveClass('text-on-dark-label');
    expect(screen.getByText('*')).toHaveClass('text-on-dark-error');
    expect(screen.getByText('Lembrar de mim')).toHaveClass('text-on-dark-label');
    expect(screen.getByText('Neste computador')).toHaveClass('text-on-dark-muted');
    expect(screen.getByRole('button', { name: 'Esqueci minha senha' })).toHaveClass(
      'text-on-dark-link',
      'hover:text-on-dark-link-hover',
    );
    // As outras variantes não mudam.
    expect(screen.getByRole('button', { name: 'Entrar' })).not.toHaveClass('text-on-dark-link');
    const erro = screen.getByRole('alert');
    expect(erro).toHaveClass('text-sm', 'text-on-dark-error');
    // Nenhum atributo desconhecido chega ao DOM.
    expect(document.querySelector('[ondark]')).toBeNull();
  });

  it('a prop explícita vence o contexto, e Card e Modal voltam ao claro', () => {
    render(
      <>
        <Input label="Fora" onDark />
        <OnDark>
          <Input label="Dentro, forçado claro" onDark={false} />
          <Card title="Card">
            <Input label="No card" />
          </Card>
          <Modal open title="Esqueci a senha" onClose={() => {}}>
            <Input label="No modal" />
          </Modal>
        </OnDark>
      </>,
    );
    expect(screen.getByText('Fora')).toHaveClass('text-on-dark-label');
    expect(screen.getByText('Dentro, forçado claro')).toHaveClass('text-label');
    expect(screen.getByText('No card')).toHaveClass('text-label');
    expect(screen.getByText('No modal')).toHaveClass('text-label');
  });

  it('ErrorInline fora do escuro continua como antes', () => {
    render(<ErrorInline />);
    expect(screen.getByRole('alert')).toHaveClass('text-xs', 'text-danger-hover');
  });
});

describe('B22. AuthCard e AuthMessage', () => {
  it('tela escura centralizada, com a marca e o formulário no escuro', () => {
    render(
      <AuthCard title="Redefinir senha" description="Escolha uma nova senha." icon={<Lock />}>
        <Input label="Nova senha" />
      </AuthCard>,
    );
    const principal = screen.getByRole('main');
    expect(principal).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-sidebar');
    expect(principal.firstElementChild).toHaveClass('w-full', 'max-w-form');
    expect(screen.getByRole('heading', { level: 1, name: 'Redefinir senha' })).toBeInTheDocument();
    expect(screen.getByText('Nova senha')).toHaveClass('text-on-dark-label');
  });

  it('AuthMessage de sucesso: círculo verde-claro, título e ação', () => {
    render(
      <AuthMessage
        tone="success"
        icon={CheckCircle2}
        title="Senha redefinida"
        description="Faça login com a nova senha."
        action={<Button fullWidth size="lg">Ir para o login</Button>}
      />,
    );
    const status = screen.getByRole('status');
    expect(status.querySelector('.rounded-pill')).toHaveClass('bg-on-dark-success/10', 'text-on-dark-success', 'h-14', 'w-14');
    expect(within(status).getByRole('heading', { level: 2, name: 'Senha redefinida' })).toHaveClass('text-sidebar-foreground');
    expect(within(status).getByText('Faça login com a nova senha.')).toHaveClass('text-on-dark-muted');
    expect(within(status).getByRole('button', { name: 'Ir para o login' })).toHaveClass('w-full', 'py-3');
  });
});

describe('B22. PublicLayout', () => {
  it('coluna estreita com escudo, título, descrição e rodapé', () => {
    render(
      <PublicLayout title="Verificação de assinatura" description="Informe o código" footer="Lei nº 14.063/2020.">
        <p>formulário</p>
      </PublicLayout>,
    );
    const principal = screen.getByRole('main');
    expect(principal).toHaveClass('mx-auto', 'min-h-screen', 'max-w-public-sm', 'py-16', 'px-4');
    expect(screen.getByRole('heading', { level: 1, name: 'Verificação de assinatura' })).toHaveClass('text-xl', 'font-bold');
    expect(principal.querySelector('header svg')).toHaveClass('h-8', 'w-8', 'text-accent-text');
    expect(screen.getByRole('contentinfo')).toHaveClass('text-center', 'text-xs', 'text-subtle');
  });

  it('largura md para a página de resultado', () => {
    render(
      <PublicLayout title="Resultado" width="md">
        <p />
      </PublicLayout>,
    );
    expect(screen.getByRole('main')).toHaveClass('max-w-public-md', 'py-10');
  });
});

describe('B22. ErrorPage', () => {
  it('mostra a mensagem do erro e tenta de novo', async () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('Falha na API')} onRetry={reset} />);
    const principal = screen.getByRole('main');
    expect(principal).toHaveClass('min-h-screen', 'bg-surface-hover', 'items-center', 'justify-center');
    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado');
    expect(screen.getByRole('heading', { level: 1, name: 'Algo deu errado' })).toHaveClass('text-title');
    expect(screen.getByText('Falha na API')).toHaveClass('max-w-form', 'text-muted');
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it('sem mensagem usa a descrição; dentro do layout não cria outro <main>', () => {
    render(<ErrorPage error={new Error('')} fullScreen={false} icon={ServerCrash} actions={<a href="/">Início</a>} />);
    expect(screen.queryByRole('main')).toBeNull();
    expect(screen.getByText('Ocorreu um erro inesperado.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
    expect(document.querySelector('[data-tone="danger"]')).toHaveClass('rounded-pill');
  });
});
