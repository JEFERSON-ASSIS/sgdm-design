# @sgdm/design

O visual do SGDM empacotado para os sistemas novos nascerem com a mesma aparência: tokens em variáveis CSS, um preset do Tailwind e componentes React.

- **Tokens** (`tokens.css`): cores, fontes, raios e sombras com nomes de papel (`--sd-color-primary`, `--sd-radius-control`). A fonte Inter vem dentro do pacote, sem CDN.
- **Preset do Tailwind** (`tailwind-preset`): expõe os tokens como `bg-primary`, `text-muted`, `rounded-control` e `shadow-card`, e injeta as classes `.card`, `.btn-*`, `.input`, `.nav-item`… do SGDM.
- **Componentes**: Button, Card, Input, Textarea, Select, FormField, FormSection, Modal, ConfirmModal, PageHeader, StatusBadge, StatCard, Table, Tabs, Toast (`ToastProvider` + `useToast`), EmptyState, ErrorState, WizardStepper, Tooltip (DicaInfo), CollapsibleCard, AppLayout, Sidebar, Header e NavigationProgress.

Para ver tudo funcionando, rode `npm run catalogo` neste repositório.

## Instalação (pelo git)

O pacote não é publicado no npm. Ele é instalado direto do repositório:

```bash
npm install github:<usuario>/sgdm-design
# ou uma versão fixa (tag ou commit)
npm install github:<usuario>/sgdm-design#v0.1.0
```

Na instalação, o npm roda o script `prepare`, que gera o `dist/`. Precisa de Node 18 ou mais novo.

Dependências que o sistema já deve ter (peer dependencies):

| Pacote | Versão |
| --- | --- |
| `react` / `react-dom` | 18 ou 19 |
| `tailwindcss` | 3.4 |
| `lucide-react` | qualquer versão recente |

## Configurar o Tailwind

Em `tailwind.config.ts` (ou `.js`), use o preset e inclua o `dist` do pacote em `content`. Sem isso, o Tailwind não gera as classes que os componentes usam.

```ts
import type { Config } from 'tailwindcss';
import sgdm from '@sgdm/design/tailwind-preset';

export default {
  presets: [sgdm],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@sgdm/design/dist/**/*.{js,cjs}',
  ],
} satisfies Config;
```

Com CommonJS, use `presets: [require('@sgdm/design/tailwind-preset')]`.

O preset coloca as classes de componente (`.card`, `.btn-primary`…) na camada `components` do Tailwind, na mesma ordem do `globals.css` do SGDM. Por isso não é preciso importar o `components.css`. Um utilitário sempre vence a classe de componente, então `className="btn-primary px-6"` continua funcionando nas telas antigas.

## Importar o CSS

Importe os tokens **uma vez**, antes do CSS do Tailwind.

Next.js (`app/layout.tsx`):

```tsx
import '@sgdm/design/tokens.css';
import './globals.css'; // o arquivo com @tailwind base/components/utilities
```

Vite (`main.tsx`) funciona do mesmo jeito. Outra forma é colocar no topo do CSS de entrada:

```css
@import '@sgdm/design/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Com isso, o `globals.css` do sistema não precisa mais do `@import` do Google Fonts nem do bloco `:root` com as cores.

`@sgdm/design/components.css` é o fonte das classes de componente, em sintaxe do Tailwind (`@layer`/`@apply`). Ele vai no pacote para consulta. Quem usa o preset não precisa dele.

## Uso

```tsx
import { Plus } from 'lucide-react';
import {
  Button, Input, Select, Modal, ConfirmModal, PageHeader, Table, StatusBadge,
  EmptyState, ErrorState, ToastProvider, useToast,
} from '@sgdm/design';

export function Secretarias({ dados, isLoading, error }) {
  const toast = useToast();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <PageHeader
        title="Secretarias"
        description="Órgãos da prefeitura"
        action={<Button icon={<Plus />} onClick={() => setAberto(true)}>Nova</Button>}
      />

      <ErrorState error={error} />

      <Table
        caption="Secretarias"
        loading={isLoading}
        rows={dados}
        columns={[
          { key: 'nome', header: 'Nome', emphasis: true },
          { key: 'sigla', header: 'Sigla' },
          { key: 'ativo', header: 'Status', render: (s) => <StatusBadge active={s.ativo} /> },
        ]}
        empty={<EmptyState title="Nenhuma secretaria cadastrada" />}
      />

      <Modal
        open={aberto}
        title="Nova secretaria"
        onClose={() => setAberto(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
            <Button onClick={() => toast.success('Secretaria salva')}>Salvar</Button>
          </>
        }
      >
        <Input label="Nome" required error={erros.nome} />
        <Select label="Tipo" placeholder="Selecione…" options={[{ value: 'adm', label: 'Administração' }]} />
      </Modal>
    </>
  );
}

// Uma vez, na raiz da aplicação:
<ToastProvider><App /></ToastProvider>
```

Os outros componentes:

```tsx
<Button variant="danger" size="sm" loading={salvando}>Excluir</Button>
<Button variant="govbr">Entrar com gov.br</Button>

<ConfirmModal open title="Excluir modelo?" message="Não pode ser desfeito."
  variant="danger" confirmLabel="Excluir" onConfirm={excluir} onClose={fechar} />

{/* Pede um motivo (o antigo MotivoModal) */}
<ConfirmModal open title="Devolver" confirmLabel="Devolver" onConfirm={devolver} onClose={fechar}
  reason={{ value: motivo, onChange: setMotivo, label: 'Motivo da devolução' }} />

<StatCard title="Publicados" value={42} icon={Newspaper} tone="success" href="/publicados" linkComponent={Link} />
<StatusBadge status="EM_ANALISE" />                 {/* mapa padrão: STATUS_COLORS do SGDM */}
<StatusBadge status="PAGO" colors={MEU_MAPA} labels={{ PAGO: 'Pago' }} />
<Tabs items={[{ id: 'a', label: 'Abertos', content: <Lista /> }, { id: 'b', label: 'Fechados', content: <Lista2 /> }]} />
<WizardStepper current={2} steps={[{ title: 'Dados' }, { title: 'Anexos' }, { title: 'Revisão' }]} />
<Tooltip text="Explicação curta" />
<CollapsibleCard title="Assinatura" badge={<StatusBadge active />}>…</CollapsibleCard>
```

### Layout

Tudo que é específico do SGDM chega por prop: nome, ícone, itens de menu, seletor de prefeitura e notificações. O menu e o cabeçalho conversam pelo `AppLayout`, sem store externa.

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LayoutDashboard, Shield } from 'lucide-react';
import { AppLayout, Header, Sidebar } from '@sgdm/design';

export function Moldura({ children }) {
  const pathname = usePathname();
  return (
    <AppLayout
      navigating={carregando}
      sidebar={
        <Sidebar
          brand={{ name: 'SGDM', subtitle: 'Gestão Documental Municipal', icon: <Shield /> }}
          currentPath={pathname}
          linkComponent={Link}
          sections={[
            { label: 'Principal', items: [
              { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
              { href: '/documentos', label: 'Documentos', icon: FileText },
            ] },
          ]}
          onLogout={sair}
        />
      }
      header={
        <Header
          title={tituloDaPagina}
          actions={<><TenantSelector /><Notificacoes /></>}
          user={{ name: usuario.nome, subtitle: usuario.cargo }}
        />
      }
    >
      {children}
    </AppLayout>
  );
}
```

Um item do menu fica ativo quando o caminho é igual ao `href` ou é uma subpágina dele. Use `exact` para exigir o caminho exato, ou `active` para decidir por conta própria.

## A regra: as telas não passam visual

As telas conhecem **só a API** dos componentes, nunca a aparência.

- Os componentes recebem props semânticas: `variant="danger"`, `tone="success"`, `size="sm"`, `error="…"`.
- Eles **não aceitam `className` nem `style`**. Os tipos já barram, de propósito.
- Para posicionar um componente (grade, margem), a tela o envolve numa `div` própria.
- Dentro do pacote, nenhuma cor é fixa. Tudo sai do preset (`bg-primary`, `text-muted`), que aponta para as variáveis `--sd-*`. Há um teste que falha se aparecer um hex num componente.
- A única exceção é o mapa de status (`bg-<cor>-100 text-<cor>-800`), que é um dado passado por prop (`colors`).

## Trocar a cor principal de um sistema

Sobrescreva as variáveis **depois** do `tokens.css`. As cores vão em canais RGB separados por espaço, e não em hex, para o Tailwind aplicar opacidade (`bg-primary/50`).

```css
/* globals.css do sistema, depois de importar @sgdm/design/tokens.css */
:root {
  --sd-color-primary: 22 101 52;        /* #166534 */
  --sd-color-primary-hover: 20 83 45;   /* #14532d */
  --sd-color-primary-light: 34 197 94;  /* borda do campo em foco */
  --sd-color-primary-ring: 220 252 231; /* anel do campo em foco */
  --sd-color-primary-soft: 240 253 244; /* fundos claros */
  --sd-color-accent: 22 163 74;         /* links, passo atual, aba ativa */
  --sd-color-accent-text: 21 128 61;
  --sd-color-sidebar-active: 22 163 74; /* item ativo do menu */
}
```

No SGDM, `--sd-color-primary-hover` é igual à cor principal. No original, `hover:bg-blue-800` repetia o próprio `#1e40af`. Num sistema com outra cor, defina um tom mais escuro.

Para converter hex em canais: `#166534` → `0x16 0x65 0x34` → `22 101 52`.

Para usar um token em CSS próprio: `color: rgb(var(--sd-color-primary));`.

O catálogo tem um seletor "Cor principal" que mostra a troca ao vivo.

## Migrar para outro visual (ex.: Material Design)

O pacote foi dividido para essa troca **não tocar nas telas dos sistemas**. São três camadas, e só as duas de baixo mudam:

| Camada | Arquivo | Muda na migração? |
| --- | --- | --- |
| API dos componentes (props, nomes, comportamento) | `src/components/*.tsx`, tipos exportados | **Não.** É o contrato com as telas. |
| Estilo interno dos componentes | classes dentro dos `.tsx`, `src/styles/components.css` | Sim |
| Valores visuais | `src/styles/tokens.css` (e o mapeamento em `tailwind-preset.cjs`) | Sim |

O caminho:

1. **Tokens novos.** Reescreva o `tokens.css` com os valores do Material: cor primária, superfícies, raio de 4px, sombras de elevação e a fonte Roboto em `--sd-font-sans`. Os nomes das variáveis continuam os mesmos, porque são de papel (`primary`, `surface`, `radius-control`), não de marca. Só isso já muda boa parte da aparência.
2. **Estilo interno.** O que o Material faz diferente e não é só valor fica dentro de cada componente: botão em caixa-alta, campo com rótulo flutuante, *ripple*, abas com indicador animado. Ajuste as classes em `components.css` e nos `.tsx`. Se precisar de estrutura nova (o rótulo flutuante muda o HTML do `Input`), mude o HTML **sem mudar as props**.
3. **Tokens novos, se precisar.** Se o Material pedir um papel que ainda não existe (`--sd-color-surface-container`, `--sd-shadow-elevation-2`), acrescente a variável no `tokens.css`, o nome no preset e use no componente. Não apague os papéis existentes antes de conferir quem os usa.
4. **Conferir.** Rode `npm test`, porque os testes verificam comportamento e acessibilidade, que não podem mudar. Depois abra `npm run catalogo` e revise cada variante.
5. **Versionar.** Publique como versão maior (tag `v1.0.0`). Cada sistema atualiza a dependência quando quiser, e nenhuma tela precisa ser editada.

O que **quebra** essa garantia, e por isso é proibido nas telas:
- passar `className` ou `style` para um componente do pacote (os tipos já impedem);
- usar as classes de token (`bg-primary`, `rounded-card`) para imitar um componente em vez de usá-lo;
- depender da estrutura HTML interna de um componente (seletor CSS do tipo `.card > div`).

Classes utilitárias de layout nas próprias `div`s da tela (`grid`, `gap-4`, `mt-6`) continuam livres.

## Desenvolvimento

```bash
npm install
npm run build          # dist/ (ESM + CJS + .d.ts) e CSS/fontes copiados
npm test               # Vitest + Testing Library
npm run typecheck      # tsc --noEmit
npm run catalogo       # catálogo em http://localhost:5173
npm run catalogo:build # catálogo estático em catalogo/dist
```

Estrutura:

```
src/styles/tokens.css      variáveis --sd-* e a fonte Inter
src/styles/components.css  .card, .btn-*, .input, .nav-item… (sintaxe Tailwind)
tailwind-preset.cjs        tokens → nomes do Tailwind; injeta components.css
src/cn.ts                  clsx + tailwind-merge
src/status.ts              STATUS_COLORS e CHART_COLORS do SGDM
src/components/            componentes
catalogo/                  app Vite do catálogo
test/                      testes
```

Fora do escopo deste pacote:
- tema escuro, porque o SGDM não tem;
- estilos de impressão, que são do processo administrativo do SGDM e continuam lá.

A fonte Inter é distribuída sob a SIL Open Font License, em `src/styles/fonts/LICENSE-Inter-OFL.txt`.
