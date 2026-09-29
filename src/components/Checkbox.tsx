import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { Check } from 'lucide-react';
import { cn } from '../cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'type' | 'size'> {
  /** Texto ao lado da caixa. Sem ele, passe `aria-label`. */
  label?: ReactNode;
  /** Explicação abaixo do rótulo, ligada ao campo por `aria-describedby`. */
  description?: ReactNode;
  /**
   * Estado "alguns marcados" (traço na caixa), do "marcar todos". Anunciado
   * como `aria-checked="mixed"`.
   */
  indeterminate?: boolean;
  invalid?: boolean;
}

/** A caixa em si: a do SGDM (`h-4 w-4 rounded border-slate-300`), na cor de destaque. */
const CAIXA =
  'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-xs border-border-strong accent-accent focus-ring disabled:cursor-not-allowed';

/** Junta a ref de fora com a de dentro (a de dentro liga o `indeterminate`). */
function useRefs<T>(externa: Ref<T> | undefined) {
  const interna = useRef<T | null>(null);
  const setter = useCallback(
    (el: T | null) => {
      interna.current = el;
      if (typeof externa === 'function') externa(el);
      else if (externa != null) (externa as { current: T | null }).current = el;
    },
    [externa],
  );
  return [interna, setter] as const;
}

function useIndeterminado(indeterminate: boolean | undefined, externa: Ref<HTMLInputElement> | undefined) {
  const [interna, setter] = useRefs<HTMLInputElement>(externa);
  useEffect(() => {
    if (interna.current) interna.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate, interna]);
  return setter;
}

/** Caixa de marcar simples, com rótulo e descrição opcionais. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate, invalid, id, disabled, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const setRef = useIndeterminado(indeterminate, ref);
  const gerado = useId();
  const campoId = id ?? `sd-check-${gerado}`;
  const rotuloId = `${campoId}-rotulo`;
  const descricaoId = description != null ? `${campoId}-descricao` : undefined;

  const caixa = (
    <input
      ref={setRef}
      id={campoId}
      type="checkbox"
      disabled={disabled}
      aria-checked={indeterminate ? 'mixed' : undefined}
      aria-invalid={invalid || undefined}
      aria-labelledby={label != null && description != null ? rotuloId : undefined}
      aria-describedby={[describedBy, descricaoId].filter(Boolean).join(' ') || undefined}
      className={cn(CAIXA, invalid && 'outline outline-1 outline-danger')}
      {...rest}
    />
  );

  if (label == null) return caixa;

  return (
    <label
      htmlFor={campoId}
      className={cn('inline-flex items-start gap-2', disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer')}
    >
      {caixa}
      <span className="min-w-0">
        <span id={rotuloId} className="block text-sm text-label">
          {label}
        </span>
        {description != null && (
          <span id={descricaoId} className="mt-0.5 block text-xs text-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  );
});

export interface CheckboxCardProps extends Omit<CheckboxProps, 'label'> {
  /** Título do cartão (nome acessível da caixa). */
  label: ReactNode;
  /** Código ou detalhe em fonte monoespaçada (ex.: `licitacao.editar`). */
  meta?: ReactNode;
  /** Mostra o ✓ verde à direita quando marcado (padrão: sim). */
  checkIcon?: boolean;
}

/** Opção em cartão com borda: título, código e descrição; fica azul quando marcada. */
export const CheckboxCard = forwardRef<HTMLInputElement, CheckboxCardProps>(function CheckboxCard(
  { label, description, meta, checkIcon = true, indeterminate, invalid, id, disabled, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const setRef = useIndeterminado(indeterminate, ref);
  const gerado = useId();
  const campoId = id ?? `sd-check-${gerado}`;
  const rotuloId = `${campoId}-rotulo`;
  const descricaoId = description != null ? `${campoId}-descricao` : undefined;

  return (
    <label
      htmlFor={campoId}
      className={cn(
        'group flex items-start gap-3 rounded-panel border border-border bg-surface px-4 py-3 transition',
        'has-[:checked]:border-primary-light has-[:checked]:bg-primary-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-ring',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-surface-hover',
        invalid && 'border-danger',
      )}
    >
      <input
        ref={setRef}
        id={campoId}
        type="checkbox"
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        aria-invalid={invalid || undefined}
        aria-labelledby={rotuloId}
        aria-describedby={[describedBy, descricaoId].filter(Boolean).join(' ') || undefined}
        className={CAIXA}
        {...rest}
      />
      <span className="min-w-0 flex-1">
        <span id={rotuloId} className="block text-sm font-medium text-title">
          {label}
        </span>
        {meta != null && <span className="block font-mono text-xs text-subtle">{meta}</span>}
        {description != null && (
          <span id={descricaoId} className="mt-1 block text-xs text-muted">
            {description}
          </span>
        )}
      </span>
      {checkIcon && (
        <Check
          className="invisible h-4 w-4 shrink-0 text-success-strong group-has-[:checked]:visible"
          aria-hidden
        />
      )}
    </label>
  );
});

export interface CheckboxGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  /** Código em fonte monoespaçada (ex.: o código da permissão). */
  meta?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** Título do grupo (ex.: o módulo "Licitações"). */
  title: ReactNode;
  options: CheckboxGroupOption[];
  /** Valores marcados (modo controlado). */
  value?: string[];
  /** Valores marcados no início (modo não controlado). */
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Rótulo do "marcar todos" no cabeçalho. Padrão: "Selecionar todos". */
  selectAllLabel?: ReactNode;
  /** Esconde o "marcar todos". */
  hideSelectAll?: boolean;
  /** Linha abaixo do título. Padrão: "3 de 8 ativas". */
  countLabel?: (checked: number, total: number) => ReactNode;
  /** `name` dos inputs, para envio de formulário. */
  name?: string;
  disabled?: boolean;
}

/**
 * Grupo de caixas num card, com cabeçalho "marcar todos" (que fica
 * indeterminado quando só alguns estão marcados). Vários grupos, um por
 * módulo, formam a matriz de permissões do SGDM.
 */
export function CheckboxGroup({
  title,
  options,
  value,
  defaultValue = [],
  onChange,
  selectAllLabel = 'Selecionar todos',
  hideSelectAll = false,
  countLabel = (n, total) => `${n} de ${total} ativas`,
  name,
  disabled = false,
}: CheckboxGroupProps) {
  const [interno, setInterno] = useState<string[]>(defaultValue);
  const marcados = value ?? interno;
  const tituloId = `sd-grupo-${useId()}`;

  const habilitadas = options.filter((o) => !o.disabled).map((o) => o.value);
  const qtd = options.filter((o) => marcados.includes(o.value)).length;
  const todos = options.length > 0 && qtd === options.length;
  const alguns = qtd > 0 && !todos;

  function mudar(proximo: string[]) {
    if (value === undefined) setInterno(proximo);
    onChange?.(proximo);
  }

  function alternarTodos(marcar: boolean) {
    mudar(
      marcar
        ? [...marcados, ...habilitadas.filter((v) => !marcados.includes(v))]
        : marcados.filter((v) => !habilitadas.includes(v)),
    );
  }

  return (
    <div role="group" aria-labelledby={tituloId} className="card overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-hover px-4 py-3">
        <div className="min-w-0">
          <h4 id={tituloId} className="text-sm font-semibold text-title">
            {title}
          </h4>
          <p className="text-xs text-muted">{countLabel(qtd, options.length)}</p>
        </div>
        {!hideSelectAll && options.length > 0 && (
          <label
            className={cn(
              'flex shrink-0 items-center gap-2 text-xs font-medium text-body',
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            )}
          >
            <Checkbox
              checked={todos}
              indeterminate={alguns}
              disabled={disabled || habilitadas.length === 0}
              onChange={(e) => alternarTodos(e.target.checked)}
            />
            {selectAllLabel}
          </label>
        )}
      </div>
      <ul className="divide-y divide-border-subtle">
        {options.map((o) => {
          const marcado = marcados.includes(o.value);
          const bloqueado = disabled || o.disabled;
          return (
            <li key={o.value}>
              <GrupoItem
                option={o}
                name={name}
                checked={marcado}
                disabled={bloqueado}
                onToggle={() =>
                  mudar(marcado ? marcados.filter((v) => v !== o.value) : [...marcados, o.value])
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GrupoItem({
  option,
  name,
  checked,
  disabled,
  onToggle,
}: {
  option: CheckboxGroupOption;
  name?: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const id = `sd-opcao-${useId()}`;
  const descricaoId = option.description != null ? `${id}-descricao` : undefined;
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-start gap-3 px-4 py-3 transition',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-surface-hover',
      )}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value={option.value}
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        aria-labelledby={`${id}-rotulo`}
        aria-describedby={descricaoId}
        className={CAIXA}
      />
      <span className="min-w-0 flex-1">
        <span id={`${id}-rotulo`} className="block text-sm font-medium text-title">
          {option.label}
        </span>
        {option.meta != null && <span className="font-mono text-xs text-subtle">{option.meta}</span>}
        {option.description != null && (
          <span id={descricaoId} className="mt-1 block text-xs text-muted">
            {option.description}
          </span>
        )}
      </span>
      {checked && <Check className="h-4 w-4 shrink-0 text-success-strong" aria-hidden />}
    </label>
  );
}
