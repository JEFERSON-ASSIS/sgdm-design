/** Seções do catálogo para os itens B1–B13 da versão 2. */
import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  Building2,
  Calendar,
  Edit3,
  Eye,
  FileText,
  Hash,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Sparkles,
  Tag as TagIcon,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
  Chip,
  DescriptionList,
  Eyebrow,
  FileButton,
  FileUpload,
  IconButton,
  IconTile,
  Input,
  KeyValue,
  LoadingState,
  PageSkeleton,
  PasswordInput,
  Skeleton,
  Spinner,
  TONES,
  type AlertTone,
  type ChipVariant,
} from '../../src';

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-28 shrink-0 font-mono text-xs text-muted">{rotulo}</span>
      {children}
    </div>
  );
}

/* ---------- B7 e B8: botões ---------- */

function LinkDeRoteador(props: { href: string; className?: string; children?: ReactNode }) {
  return <a {...props} onClick={(e) => e.preventDefault()} />;
}

export function BotoesNovos() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Tamanhos, href e asChild">
        <div className="space-y-4">
          <Linha rotulo='size="lg"'>
            <div className="w-72">
              <Button size="lg" fullWidth>
                Entrar
              </Button>
            </div>
          </Linha>
          <Linha rotulo="sm · md · lg">
            <Button size="sm">Pequeno</Button>
            <Button>Médio</Button>
            <Button size="lg">Grande</Button>
          </Linha>
          <Linha rotulo="href">
            <Button href="#botoes" icon={<Plus />}>
              Link com cara de botão
            </Button>
            <Button href="#botoes" variant="secondary" disabled>
              Link desabilitado
            </Button>
          </Linha>
          <Linha rotulo="linkComponent">
            <Button href="#botoes" linkComponent={LinkDeRoteador} variant="ghost">
              Com o Link do roteador
            </Button>
          </Linha>
          <Linha rotulo="asChild">
            <Button asChild variant="success" icon={<BadgeCheck />}>
              <a href="#botoes">Filho vestido de botão</a>
            </Button>
          </Linha>
        </div>
      </Card>
      <Card title="IconButton" description="aria-label obrigatório; vira a dica do mouse">
        <div className="space-y-4">
          {(['ghost', 'secondary', 'danger'] as const).map((v) => (
            <Linha key={v} rotulo={v}>
              <IconButton variant={v} icon={<Edit3 />} aria-label="Editar" />
              <IconButton variant={v} icon={<Trash2 />} aria-label="Excluir" />
              <IconButton variant={v} icon={<MoreHorizontal />} aria-label="Mais ações" size="sm" />
              <IconButton variant={v} icon={<X />} aria-label="Fechar" size="sm" disabled />
              <IconButton variant={v} icon={<Save />} aria-label="Salvando" loading />
            </Linha>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- B1, B2 e B3: avisos e carregamento ---------- */

const TONS_AVISO: AlertTone[] = ['info', 'warning', 'success', 'danger', 'violet', 'purple', 'neutral'];

export function AvisosECarregamento() {
  const [fechado, setFechado] = useState(false);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {TONS_AVISO.map((t) => (
          <Alert key={t} tone={t}>
            Aviso <strong>tone="{t}"</strong>: orientação curta para quem está na tela.
          </Alert>
        ))}
        <Alert tone="warning" icon={AlertTriangle} title="3 tipos documentais sem temporalidade" actions={<Button size="sm" variant="secondary">Cadastrar temporalidade</Button>}>
          Documentos desses tipos são arquivados sem prazo de guarda calculado.
        </Alert>
        <Alert tone="success" icon={BadgeCheck} title="Assinado eletronicamente por Maria da Silva">
          Em 28/09/2026 14:32 · código <code className="font-mono font-semibold">A1B2-C3D4</code>
        </Alert>
        {!fechado ? (
          <Alert tone="info" icon={Sparkles} onClose={() => setFechado(true)} role="status">
            Aviso com botão de fechar (onClose).
          </Alert>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setFechado(false)}>
            Mostrar de novo o aviso fechado
          </Button>
        )}
        <Alert tone="danger" size="sm">
          size="sm": erro compacto dentro de formulário.
        </Alert>
      </div>
      <Card title='variant="stage"' description="O aviso de etapa do documento">
        <div className="space-y-3">
          <Alert variant="stage" title="Etapa 3 — Elaboração.">
            Preencha os campos e redija o texto oficial. Depois salve e, na aba <strong>Workflow</strong>, envie
            para assinatura.
          </Alert>
          <Alert variant="stage" tone="purple" icon={Eye} title="Etapa 4 — Aguardando assinatura.">
            O documento já foi enviado e <strong>não pode mais ser editado</strong>.
          </Alert>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Spinner">
          <div className="space-y-3">
            <Linha rotulo="xs sm md lg">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </Linha>
            <Linha rotulo="muted">
              <Spinner tone="muted" />
            </Linha>
            <Linha rotulo="current">
              <span className="text-danger-strong">
                <Spinner tone="current" label="Excluindo" />
              </span>
            </Linha>
          </div>
        </Card>
        <Card title="LoadingState" padding="none">
          <LoadingState />
          <div className="border-t border-border-subtle p-5">
            <LoadingState mode="inline" label="Carregando histórico…" />
          </div>
        </Card>
        <Card title="Skeleton">
          <div className="space-y-3">
            <Skeleton shape="title" />
            <Skeleton lines={3} />
            <Skeleton shape="block" height="sm" />
            <Skeleton shape="card" width="md" />
          </div>
        </Card>
      </div>
      <Card title="PageSkeleton" description="O loading.tsx do painel do SGDM">
        <PageSkeleton />
      </Card>
    </div>
  );
}

/* ---------- B4, B5 e B6: rótulos, chips e ícones ---------- */

const VARIANTES_CHIP: ChipVariant[] = ['filled', 'soft', 'outline'];
const ICONES = [FileText, Users, Bell, Calendar, Building2, Hash, Sparkles];

export function RotulosEIcones() {
  return (
    <div className="space-y-6">
      <Card title="Eyebrow / Overline">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Eyebrow>Padrão (11px, muted)</Eyebrow>
            <p className="text-lg font-semibold text-title">Portaria nº 12/2026</p>
          </div>
          <div>
            <Eyebrow weight="semibold" tone="subtle">
              semibold · subtle
            </Eyebrow>
            <p className="text-sm font-medium text-title">Rótulo de dado</p>
          </div>
          <div>
            <Eyebrow size="md" weight="semibold" icon={<Users />} as="h3">
              md · com ícone
            </Eyebrow>
            <p className="text-sm text-body">Cabeçalho de grupo</p>
          </div>
          <div className="flex flex-col gap-1">
            <Eyebrow size="md" weight="semibold" tone="accent">
              accent
            </Eyebrow>
            <Eyebrow size="md" weight="semibold" tone="warning">
              warning
            </Eyebrow>
          </div>
        </div>
      </Card>
      <Card title="Chip / Tag" description="Todos os tons em filled, soft e outline; tamanhos xs e sm">
        <div className="space-y-3">
          {VARIANTES_CHIP.map((v) => (
            <Linha key={v} rotulo={v}>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <Chip key={t} tone={t} variant={v}>
                    {t}
                  </Chip>
                ))}
              </div>
            </Linha>
          ))}
          <Linha rotulo='size="xs"'>
            <Chip size="xs" tone="info">
              12 itens
            </Chip>
            <Chip size="xs" tone="success" variant="soft">
              concluída
            </Chip>
            <Chip size="xs" tone="warning" uppercase>
              Novo
            </Chip>
            <Chip size="xs" tone="indigo" uppercase>
              IA
            </Chip>
          </Linha>
          <Linha rotulo="icon · mono">
            <Chip icon={<TagIcon />} tone="violet">
              Com ícone
            </Chip>
            <Chip mono>licitacao.editar</Chip>
            <Chip mono size="xs">
              PORT-2026-0042
            </Chip>
          </Linha>
        </div>
      </Card>
      <Card title="IconTile" description="Tamanhos, formas e variantes soft, tint e solid">
        <div className="space-y-4">
          <Linha rotulo="sm → 2xl">
            {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((s) => (
              <IconTile key={s} icon={FileText} size={s} />
            ))}
          </Linha>
          <Linha rotulo="square · rounded · circle">
            <IconTile icon={Users} tone="indigo" shape="square" />
            <IconTile icon={Users} tone="indigo" shape="rounded" />
            <IconTile icon={Users} tone="indigo" shape="circle" />
          </Linha>
          {(['soft', 'tint', 'solid'] as const).map((v) => (
            <Linha key={v} rotulo={v}>
              {TONES.slice(0, 15).map((t, i) => (
                <IconTile key={t} icon={ICONES[i % ICONES.length]!} tone={t} variant={v} size="sm" />
              ))}
            </Linha>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- B9: lista de dados ---------- */

const DADOS = [
  { label: 'Documento', value: 'Portaria nº 42/2026' },
  { label: 'Protocolo', value: 'SGDM-2026-000042', mono: true },
  { label: 'Órgão', value: 'Secretaria Municipal de Saúde' },
  { label: 'Assinado por', value: 'Maria da Silva' },
  { label: 'Observação', value: '' },
];

export function ListasDeDados() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title='variant="rows"' description="Rótulo de 160px; a página de validação" padding="none">
        <DescriptionList variant="rows" items={DADOS} />
      </Card>
      <Card title='variant="grid" (padrão)'>
        <DescriptionList
          items={[
            { label: 'Rito', value: 'Licitação' },
            { label: 'Modalidade', value: 'Pregão eletrônico' },
            { label: 'Objeto', value: 'Aquisição de material de expediente para as escolas', fullWidth: true },
            { label: 'Valor estimado', value: 'R$ 4.936,00' },
            { label: 'Responsável' },
          ]}
        />
      </Card>
      <Card title='variant="tiles"' description="O painel de dados do documento">
        <DescriptionList
          variant="tiles"
          columns={2}
          items={[
            { label: 'Tipo documental', value: 'Portaria', icon: FileText },
            { label: 'Número', value: 'PORT 042/2026', icon: Hash },
            { label: 'Solicitante', value: 'João Souza', icon: User },
            { label: 'Data', value: '28/09/2026', icon: Calendar },
          ]}
        />
      </Card>
      <Card title='variant="compact" e KeyValue'>
        <div className="space-y-5">
          <DescriptionList
            variant="compact"
            items={[
              { label: 'Objeto', value: 'Material de expediente' },
              { label: 'Rito', value: 'Dispensa' },
              { label: 'Lei de regência', value: 'Lei 14.133/2021' },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <KeyValue label="Servidor" value="Maria da Silva" />
            <KeyValue label="Hash" value="9f2c…a41b" layout="inline" mono />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------- B10 a B13: formulário ---------- */

const PERMISSOES = [
  {
    modulo: 'Licitações',
    opcoes: [
      { value: 'licitacao.ver', label: 'Ver processos', meta: 'licitacao.ver' },
      { value: 'licitacao.editar', label: 'Editar processos', meta: 'licitacao.editar', description: 'Altera dados e peças enquanto não aprovadas.' },
      { value: 'licitacao.excluir', label: 'Excluir rascunhos', meta: 'licitacao.excluir' },
    ],
  },
  {
    modulo: 'Documentos',
    opcoes: [
      { value: 'documento.ver', label: 'Ver documentos', meta: 'documento.ver' },
      { value: 'documento.assinar', label: 'Assinar', meta: 'documento.assinar', disabled: true, description: 'Só para o perfil do prefeito.' },
    ],
  },
];

export function FormulariosNovos() {
  const [permissoes, setPermissoes] = useState<string[]>(['licitacao.ver', 'documento.ver']);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [escolhido, setEscolhido] = useState<string>('');
  const [aceito, setAceito] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Input com ícone, prefixo e sufixo; PasswordInput">
          <div className="space-y-4">
            <Input label="Usuário" leftIcon={<User />} placeholder="seu.usuario" />
            <Input label="E-mail" leftIcon={<Mail />} rightIcon={<BadgeCheck />} defaultValue="maria@prefeitura.gov.br" />
            <Input aria-label="Buscar" leftIcon={<Search />} placeholder="Buscar por número ou assunto…" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Valor estimado" prefix="R$" inputMode="decimal" placeholder="0,00" />
              <Input label="Desconto" suffix="%" inputMode="numeric" defaultValue="12" />
            </div>
            <PasswordInput label="Senha" leftIcon={<Lock />} hint="Volta a ocultar sozinha em 10 segundos" />
            <PasswordInput label="Senha com erro" defaultValue="123" error="Senha incorreta" />
          </div>
        </Card>
        <Card title="Checkbox e CheckboxCard">
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <Checkbox label="Perfil ativo" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
              <Checkbox label="Com descrição" description="A descrição fica ligada à caixa por aria-describedby." defaultChecked />
              <Checkbox label="Indeterminado" indeterminate readOnly />
              <Checkbox label="Desabilitado" disabled />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <CheckboxCard label="Enviar por e-mail" meta="notificacao.email" description="Aviso a cada mudança de etapa." defaultChecked />
              <CheckboxCard label="Resumo diário" description="Um e-mail por dia, às 8h." />
            </div>
          </div>
        </Card>
      </div>
      <Card title="CheckboxGroup — matriz de permissões" description={`${permissoes.length} permissão(ões) marcada(s)`}>
        <div className="space-y-4">
          {PERMISSOES.map((g) => (
            <CheckboxGroup
              key={g.modulo}
              title={g.modulo}
              selectAllLabel="Selecionar módulo"
              options={g.opcoes}
              value={permissoes}
              onChange={setPermissoes}
            />
          ))}
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="FileUpload">
          <FileUpload files={arquivos} onChange={setArquivos} maxFiles={3} />
        </Card>
        <Card title="FileButton" description="Um <button> sobre um input escondido">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <FileButton accept="application/pdf,.pdf" variant="primary" onFiles={(f) => setEscolhido(f[0]?.name ?? '')}>
                Carregar assinado
              </FileButton>
              <FileButton multiple onFiles={(f) => setEscolhido(f.map((a) => a.name).join(', '))}>
                Vários arquivos
              </FileButton>
              <FileButton onFiles={() => {}} loading loadingLabel="Conferindo arquivo…">
                Carregar
              </FileButton>
            </div>
            <p className="text-sm text-muted">Escolhido: {escolhido || '—'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
