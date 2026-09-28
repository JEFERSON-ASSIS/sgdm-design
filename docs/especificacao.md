# @sgdm/design — especificação

Data: 2026-09-28 · Decisão do usuário: opção A (visual atual do SGDM), repositório separado, migração futura para Material Design fica para depois.

## Objetivo

Um pacote único com o visual do SGDM, para que os sistemas novos nasçam com a mesma aparência. Ele é instalado direto do git, com `npm install github:<usuario>/sgdm-design`.

Fonte da verdade do visual: `SGDM/apps/web/app/globals.css` e os componentes de `SGDM/apps/web/components/{shared,forms,cadastros,layout,dashboard}`. Os valores foram levantados em 28/09/2026 e estão no documento "Design system do SGDM".

## Princípio para a migração futura

**As telas conhecem só a API dos componentes, não a aparência.**
- Cada componente tem props semânticas, por exemplo `<Button variant="primary">` e `<Input label error>`, e nunca recebe classes de visual vindas da tela.
- Toda cor, fonte, raio e sombra sai de uma **variável CSS** (token).
- Trocar para Material depois significa:
  1. um arquivo de tokens novo;
  2. trocar o estilo interno dos componentes.
- As telas dos sistemas não mudam.
- Os tokens têm nomes de papel (`--sd-color-primary`, `--sd-radius-control`), não de marca.

## Conteúdo do pacote

```
sgdm-design/
  package.json            name @sgdm/design, peerDeps react/react-dom 18|19, tailwindcss 3.4
  src/styles/tokens.css   variáveis CSS (valores do SGDM)
  src/styles/components.css  .card, .btn-*, .input, .nav-item… (compatível com o globals.css atual)
  tailwind-preset.cjs     expõe os tokens como cores/fontes/raios nomeados no Tailwind
  src/cn.ts               clsx + tailwind-merge
  src/components/         Button, Card, Input, Textarea, Select, FormField, FormSection,
                          Modal, ConfirmModal, PageHeader, StatusBadge, StatCard,
                          Table, Tabs, Toast (provider + hook), EmptyState, ErrorState,
                          WizardStepper, Tooltip (DicaInfo), CollapsibleCard,
                          AppLayout, Sidebar, Header
  src/index.ts            exporta tudo
  catalogo/               app Vite que mostra cada componente e cada token (npm run catalogo)
  README.md               instalação, uso, como trocar a cor principal, como migrar para outro visual
```

**Tokens**, com os valores atuais:
- **Cores:**
  - primary #1e40af e primary-light #3b82f6;
  - secondary #7c3aed;
  - background #f1f5f9 e surface #ffffff;
  - sidebar #0f172a, sidebar-hover #1e293b e sidebar-active #2563eb;
  - text #0f172a e text-muted #64748b;
  - border #e2e8f0;
  - success #22c55e, warning #f59e0b, danger #ef4444 e info #06b6d4;
  - govbr #1351b4.
- **Fontes:** Inter para a interface, "Times New Roman" para documentos.
- **Raios:** card 16px, control 8px.
- **Sombras:** card `shadow-sm`, modal `shadow-xl`.
- **Status:** mapa `bg-<cor>-100 text-<cor>-800`. `StatusBadge` recebe o mapa, e o padrão é o `STATUS_COLORS` do SGDM.
- **Gráficos:** as 12 cores de `CHART_COLORS`.
- **O que não entra:** tema escuro. O SGDM não tem, e a spec não inventa.

**Componentes:**
- **Os que já existem no SGDM:** mantêm as classes e o comportamento de lá (PageHeader, CadastroModal→Modal, ConfirmModal, MotivoModal→dentro de Modal/ConfirmModal, FormField, FormSection, StatCard, WizardStepper, CardRecolhivel→CollapsibleCard, DicaInfo→Tooltip, QueryErrorState→ErrorState, AppLayout/Sidebar/Header).
- **Tudo o que é do SGDM vira prop:** nome, ícone, itens de menu, seletor de prefeitura, notificações.
- **Os que faltam no SGDM e passam a existir:**
  - `Button`, com as variantes primary, secondary, danger, ghost e govbr, os tamanhos sm e md, os estados `loading` e disabled, e ícone;
  - `Table`: colunas declarativas, estado vazio e carregando;
  - `Tabs`;
  - `Toast`;
  - `EmptyState`.
- Ícones: `lucide-react` (peer dependency).

## Qualidade

- TypeScript estrito. O build usa `tsup` e gera ESM + CJS + `.d.ts`, com o CSS copiado para `dist/`.
- O script `prepare` roda o build, para que a instalação direto do git funcione.
- **Testes com Vitest + Testing Library:**
  - cada componente renderiza;
  - as variantes aplicam as classes esperadas;
  - Modal e ConfirmModal abrem, fecham e confirmam;
  - Tabs trocam de aba;
  - Table mostra o estado vazio;
  - Toast aparece e some;
  - acessibilidade básica: rótulos associados, `role="dialog"`, foco visível.
- O catálogo mostra cada componente em todas as variantes.
- Não usa CDN: o pacote traz tudo.

## Fora do escopo

- Adotar o pacote no SGDM agora. Fica para depois, num branch próprio, tela a tela.
- Visual Material Design. Fica para decisão futura, e o princípio acima deixa esse caminho aberto.
- Publicar no npm. A instalação é pelo git.
- Enviar ao GitHub. O repositório nasce local, e o envio só acontece com o ok do usuário.
