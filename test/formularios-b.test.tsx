import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lock, Mail, Search } from 'lucide-react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
  FileButton,
  FileUpload,
  fileMatchesAccept,
  formatFileSize,
  Input,
  PasswordInput,
} from '../src';

describe('B10. Checkbox, CheckboxCard e CheckboxGroup', () => {
  it('Checkbox com rótulo associado e descrição', async () => {
    const mudou = vi.fn();
    render(<Checkbox label="Perfil ativo" description="Usuários vinculados perdem o acesso" onChange={mudou} />);
    const cb = screen.getByRole('checkbox', { name: 'Perfil ativo' });
    expect(cb).toHaveAccessibleDescription('Usuários vinculados perdem o acesso');
    expect(cb).toHaveClass('h-4', 'w-4', 'rounded-xs', 'border-border-strong', 'accent-accent');
    await userEvent.click(screen.getByText('Perfil ativo'));
    expect(cb).toBeChecked();
    cb.focus();
    await userEvent.keyboard(' ');
    expect(cb).not.toBeChecked();
    expect(mudou).toHaveBeenCalledTimes(2);
  });

  it('indeterminado: propriedade do DOM e aria-checked="mixed"', () => {
    const { rerender } = render(<Checkbox aria-label="Todos" indeterminate checked={false} onChange={() => {}} />);
    const cb = screen.getByRole('checkbox', { name: 'Todos' }) as HTMLInputElement;
    expect(cb.indeterminate).toBe(true);
    expect(cb).toHaveAttribute('aria-checked', 'mixed');
    rerender(<Checkbox aria-label="Todos" checked onChange={() => {}} />);
    expect(cb.indeterminate).toBe(false);
    expect(cb).not.toHaveAttribute('aria-checked');
  });

  it('encaminha a ref junto com a interna', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} aria-label="x" indeterminate />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current!.indeterminate).toBe(true);
  });

  it('CheckboxCard: nome é o título, código e descrição à parte', async () => {
    render(<CheckboxCard label="Editar licitação" meta="licitacao.editar" description="Altera dados do processo" />);
    const cb = screen.getByRole('checkbox', { name: 'Editar licitação' });
    expect(cb).toHaveAccessibleDescription('Altera dados do processo');
    const cartao = cb.closest('label')!;
    expect(cartao).toHaveClass('rounded-panel', 'border', 'has-[:checked]:bg-primary-soft');
    expect(screen.getByText('licitacao.editar')).toHaveClass('font-mono');
    await userEvent.click(screen.getByText('Altera dados do processo'));
    expect(cb).toBeChecked();
  });

  it('CheckboxGroup: marcar todos, indeterminado e contagem', async () => {
    function Grupo() {
      const [v, setV] = useState<string[]>(['ver']);
      return (
        <CheckboxGroup
          title="Licitações"
          selectAllLabel="Selecionar módulo"
          value={v}
          onChange={setV}
          options={[
            { value: 'ver', label: 'Ver', meta: 'licitacao.ver' },
            { value: 'editar', label: 'Editar', description: 'Altera dados' },
            { value: 'excluir', label: 'Excluir' },
          ]}
        />
      );
    }
    render(<Grupo />);
    const grupo = screen.getByRole('group', { name: 'Licitações' });
    const todos = within(grupo).getByRole('checkbox', { name: 'Selecionar módulo' }) as HTMLInputElement;
    expect(within(grupo).getByText('1 de 3 ativas')).toBeInTheDocument();
    expect(todos.indeterminate).toBe(true);
    expect(todos).toHaveAttribute('aria-checked', 'mixed');

    await userEvent.click(todos);
    expect(within(grupo).getByText('3 de 3 ativas')).toBeInTheDocument();
    expect(todos).toBeChecked();
    expect(todos.indeterminate).toBe(false);
    expect(within(grupo).getByRole('checkbox', { name: 'Excluir' })).toBeChecked();

    await userEvent.click(todos);
    expect(within(grupo).getByText('0 de 3 ativas')).toBeInTheDocument();

    await userEvent.click(within(grupo).getByRole('checkbox', { name: 'Editar' }));
    expect(within(grupo).getByRole('checkbox', { name: 'Editar' })).toHaveAccessibleDescription('Altera dados');
    expect(within(grupo).getByText('1 de 3 ativas')).toBeInTheDocument();
  });

  it('CheckboxGroup não controlado; "todos" não marca opção desabilitada', async () => {
    const mudou = vi.fn();
    render(
      <CheckboxGroup
        title="Docs"
        onChange={mudou}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Selecionar todos' }));
    expect(mudou).toHaveBeenLastCalledWith(['a']);
    expect(screen.getByRole('checkbox', { name: 'A' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'B' })).not.toBeChecked();
  });
});

describe('B11. PasswordInput', () => {
  it('mostra e oculta pelo botão, com rótulo associado', async () => {
    render(<PasswordInput label="Senha" />);
    const campo = screen.getByLabelText('Senha');
    expect(campo).toHaveAttribute('type', 'password');
    expect(campo).toHaveClass('pr-11');
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(campo).toHaveAttribute('type', 'text');
    await userEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(campo).toHaveAttribute('type', 'password');
  });

  it('volta a ocultar sozinha depois do tempo', () => {
    vi.useFakeTimers();
    try {
      render(<PasswordInput aria-label="Senha" autoHideSeconds={10} />);
      const campo = screen.getByLabelText('Senha');
      fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
      expect(campo).toHaveAttribute('type', 'text');
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(campo).toHaveAttribute('type', 'password');
    } finally {
      vi.useRealTimers();
    }
  });

  it('encaminha a ref e marca erro', () => {
    const ref = createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} label="Senha" error="Senha incorreta" leftIcon={<Lock />} />);
    expect(ref.current).toBe(screen.getByLabelText('Senha'));
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
    expect(ref.current).toHaveClass('pl-10', 'input-error');
  });
});

describe('B12. Input com ícones, prefixo e sufixo', () => {
  it('ícone à esquerda e à direita', () => {
    const { container } = render(<Input label="E-mail" leftIcon={<Mail />} rightIcon={<Search />} />);
    const campo = screen.getByLabelText('E-mail');
    expect(campo).toHaveClass('input', 'pl-10', 'pr-10');
    const icones = container.querySelectorAll('svg');
    expect(icones).toHaveLength(2);
    expect(icones[0]!.parentElement).toHaveClass('left-3', 'pointer-events-none');
    expect(icones[0]!.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('prefixo e sufixo de texto viram descrição do campo', () => {
    render(
      <>
        <Input label="Valor" prefix="R$" />
        <Input label="Desconto" suffix="%" hint="Até 30" />
      </>,
    );
    const valor = screen.getByLabelText('Valor');
    expect(valor).toHaveClass('pl-10');
    expect(valor).toHaveAccessibleDescription('R$');
    const desconto = screen.getByLabelText('Desconto');
    expect(desconto).toHaveClass('pr-10');
    expect(desconto).toHaveAccessibleDescription('% Até 30');
  });

  it('sem enfeite, o Input da v1 não ganha wrapper', () => {
    const { container } = render(<Input aria-label="Nome" />);
    expect(container.firstElementChild!.tagName).toBe('INPUT');
  });
});

describe('B13. FileUpload e FileButton', () => {
  const pdf = () => new File(['%PDF'], 'oficio.pdf', { type: 'application/pdf' });
  const exe = () => new File(['MZ'], 'virus.exe', { type: 'application/x-msdownload' });

  function Upload(props: { max?: number; onReject?: (f: File[]) => void }) {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload files={files} onChange={setFiles} maxFiles={props.max} onReject={props.onReject} />;
  }

  it('aceita pelo botão e remove da lista', async () => {
    const { container } = render(<Upload />);
    const botao = screen.getByRole('button', { name: 'Selecionar arquivos' });
    expect(screen.getByRole('group', { name: 'Arraste arquivos ou clique para selecionar' })).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('tabindex', '-1');
    const clique = vi.spyOn(input, 'click');
    await userEvent.click(botao);
    expect(clique).toHaveBeenCalled();

    await userEvent.upload(input, pdf());
    const lista = screen.getByRole('list', { name: 'Arquivos selecionados' });
    expect(within(lista).getByText('oficio.pdf')).toBeInTheDocument();
    await userEvent.click(within(lista).getByRole('button', { name: 'Remover oficio.pdf' }));
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('arrastar e soltar, filtrando pelo accept e pelo máximo', () => {
    const recusou = vi.fn();
    render(<Upload max={1} onReject={recusou} />);
    const area = screen.getByRole('group');
    fireEvent.dragOver(area);
    expect(area).toHaveAttribute('data-dragging', 'true');
    expect(area).toHaveClass('border-primary-light', 'bg-primary-soft');
    fireEvent.drop(area, { dataTransfer: { files: [pdf(), exe(), pdf()] } });
    expect(area).not.toHaveAttribute('data-dragging');
    expect(recusou).toHaveBeenCalledWith([expect.objectContaining({ name: 'virus.exe' })]);
    expect(screen.getAllByText('oficio.pdf')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Selecionar arquivos' })).toBeDisabled();
  });

  it('FileButton é um botão de teclado e entrega os arquivos', async () => {
    const recebeu = vi.fn();
    const { container } = render(
      <FileButton accept="application/pdf,.pdf" onFiles={recebeu} variant="primary">
        Carregar assinado
      </FileButton>,
    );
    const botao = screen.getByRole('button', { name: 'Carregar assinado' });
    expect(botao).toHaveClass('btn-primary');
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', 'application/pdf,.pdf');
    expect(input).toHaveClass('sr-only');
    await userEvent.upload(input, pdf());
    expect(recebeu).toHaveBeenCalledWith([expect.objectContaining({ name: 'oficio.pdf' })]);
  });

  it('fileMatchesAccept e formatFileSize', () => {
    expect(fileMatchesAccept(pdf(), '.pdf')).toBe(true);
    expect(fileMatchesAccept(pdf(), 'application/*')).toBe(true);
    expect(fileMatchesAccept(exe(), '.pdf,image/*')).toBe(false);
    expect(fileMatchesAccept(exe())).toBe(true);
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1536)).toBe('1,5 KB');
  });
});
