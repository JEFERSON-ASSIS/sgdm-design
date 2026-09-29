# Changelog

Todas as mudanças do `@sgdm/design`. O pacote segue o [versionamento semântico](https://semver.org/lang/pt-BR/): enquanto estiver em `0.x`, uma versão menor pode trazer mudança visível.

## 0.2.1 — 28/09/2026

Correção de acessibilidade: quem não usa roda do mouse (trackpad sem inércia, tela de toque) não conseguia rolar `AppLayout`, `Sidebar` e `Modal`, porque a barra vinha escondida (`scrollbar-none`).

- **Barra de rolagem fina e visível por padrão**, em toda a aplicação: `--sd-color-scrollbar-thumb` (`#cbd5e1`) e `--sd-color-scrollbar-thumb-hover` (`#94a3b8`), 10px, cantos arredondados, afastada da borda (`background-clip: content-box`). `scrollbar-width: thin` no Firefox.
- **Variante escura**, para superfícies como o menu lateral: classe `.scrollbar-on-dark`, com `--sd-color-scrollbar-thumb-on-dark` (`#334155`) e `--sd-color-scrollbar-thumb-on-dark-hover` (`#475569`).
- `AppLayout` (conteúdo) e `Modal` (corpo) perderam o `scrollbar-none`; o `Sidebar` (menu) trocou `scrollbar-none` por `scrollbar-on-dark`.
- `.scrollbar-none` continua no pacote, para quem quiser esconder a rolagem de propósito — só não é mais usada pelos componentes.

## 0.2.0 — 28/09/2026

A versão 2 cobre o SGDM inteiro. Um levantamento comparou todas as telas de `SGDM/apps/web` com o pacote. Tudo o que as telas repetiam à mão virou token ou componente. O detalhe de cada item está em `docs/checklist-v2.md`, e o README tem a tabela "padrão do SGDM → componente do pacote".

### Tokens e preset

- **Sucesso em esmeralda e informação em azul**, como o SGDM usa de fato. O ciano virou a família `cyan`, que o gráfico usa.
- **Oito degraus iguais por tom**: base, `-soft`, `-tint`, `-border`, `-strong`, `-hover`, `-text` e `-deep`. Valem para os quatro tons de feedback e para as famílias `cyan`, `indigo`, `rose`, `violet`, `purple`, `orange`, `teal` e `sky`.
- **Tema por perfil**: `--sd-color-profile-*` e `shadow-profile-*` para rh, secretaria, prefeito, gabinete e plataforma.
- **Neutros novos**: `border-strong`, `skeleton` e `overlay-strong`, além do texto sobre fundo escuro (`on-dark-*`).
- **Gráfico**: a cor sky e as cores de reserva, de grade e de barra.
- **Impressão**: `print-ink`, `print-paper` e `print-border` (#999).
- **Fontes**: `text-2xs` (10px), `text-xs2` (11px), a escala do editor (`text-doc-10` a `text-doc-18`) e a da impressão.
- **Raios**: `xs`, `marker`, `panel`, `callout` e `tile`.
- **Sombras**: `brand-strong`, `inner`, `dropdown` e as sombras de perfil.
- **Camadas (z-index)** numa escala única, de `dropdown` (20) a `progress` (110).
- **Tempo**: `fast`, `normal` e `slow`, com easing padrão.
- **Medidas de layout**: menu, cabeçalho, padding da página, modal, tooltip, dropdown, editor, folha de impressão, coluna do kanban, formulário do login e página pública.
- **Os valores que o JavaScript precisa** estão em `src/tokens.ts`: `BREAKPOINT_LG`, `Z_INDEX`, `DURATION_MS`, `EDITOR_FONT_SIZES` e `PROFILES`. Um teste confere que batem com o CSS.
- **O `cn` conhece as escalas do preset**: não confunde `text-xs2` com cor.

### Componentes novos

- **Avisos e carregamento**: `Alert` (`Callout`), `Spinner`, `LoadingState`, `Skeleton` e `PageSkeleton`.
- **Rótulos**: `Eyebrow` (`Overline`), `Chip` (`Tag`), `IconTile`, `InlineCode`, `Mono` e `CounterBadge`.
- **Botões e formulário**:
  - `IconButton`;
  - `Button` com as variantes link, success e danger-outline, o tamanho `lg`, `href` e `asChild`;
  - `Checkbox`, `CheckboxCard` e `CheckboxGroup`;
  - `PasswordInput`;
  - `Input` com ícones, prefixo e sufixo;
  - `FileUpload`, `FileButton`, `SearchInput` e `FilterBar`.
- **Dados e navegação**: `DescriptionList`, `KeyValue`, `Timeline`, `NumberedSteps`, `ProcessStepper`, `FlowChips`, `SegmentedControl`, `Tabs variant="pill"`, `SelectableList` e `WizardStepper`. O `WizardStepper` ganhou os modos `tiles`, `bare` e com links.
- **Menus**: `Popover`, `Dropdown` e `NotificationBell`.
- **Documento**: `PdfViewer`, `StickyAside`, `EditorFrame`, `EditorToolbar`, `EditorToolbarButton`, `EditorToolbarSeparator`, `EditorFontSizeSelect` e `DocumentContent`.
- **O CSS de `.documento`** substitui o `prose`, que não funciona no SGDM.
- **Páginas**: `AuthLayout`, `AuthCard`, `AuthMessage`, `PublicLayout` e `ErrorPage`. Os campos, o `Button link` e o `ErrorInline` ganharam a variante `onDark`, por prop ou pela área `<OnDark>`.
- **Painel**: `DashboardHero` por perfil, `QuickActions`, `QueueCard`, `CountList`, `MiniStat` e `MiniCalendar`.
- **Kanban**: `KanbanBoard`, `KanbanColumn` e `KanbanCard`. É só de leitura, sem arrastar.
- **Gráficos**: `ChartCard` e `ChartLegend`.
  - `chartProps`, `toChartData`, `chartColor` e `getChartTheme` montam as props do recharts.
  - O recharts é peer dependency **opcional**, e o pacote nunca o importa.
- **Impressão**:
  - `@sgdm/design/print.css` monta a folha A4 com margens de 20mm × 18mm e traz as classes `.nao-imprimir`, `.quebra-pagina`, `.folha-processo` e `.peca-impressa`;
  - `PrintSheet`, `PrintCover`, `PrintSection` e `NoPrint`;
  - o `AppLayout` sai da frente no papel.

### Componentes completados

- **`Table`**: linha de total, seleção de linhas com "selecionar todas", `density="compact"`, cabeçalho em caixa-alta e `bare`.
- **`Card`**: `tone` e `padding`.
- **`StatusBadge`**:
  - `size`, `case` e `variant="outline"`;
  - os mapas de numeração, licitação, situação, fase e peça.
- **`StatCard`**: todos os tons.
- **`CollapsibleCard`**: modo controlado. Entrou também o `Accordion`.
- **`Tooltip`**: quatro posições.
- **`EmptyState`**: `variant="dashed"`.
- **`Select`**: `size="compact"` e ícone.

### O que pode mudar para quem já usava a 0.1

- **`success` agora é esmeralda, e `info` é azul** (antes eram verde e ciano). Quem precisa do ciano usa `tone="cyan"`.
- **Os z-index fixos viraram a escala** (`z-modal`, `z-toast`, `z-tooltip`…). Os números continuam os do SGDM.
- **Card, Modal e Popover** envolvem o conteúdo num `<OnDark value={false}>`. Isso não muda nada fora das telas escuras.

## 0.1.0 — 28/09/2026

Primeira versão, com o visual atual do SGDM:

- **Tokens** em variáveis CSS, com a fonte Inter dentro do pacote;
- **Preset do Tailwind**, com as classes `.card`, `.btn-*`, `.input` e `.nav-item`;
- **Componentes**: Button, Card, Input, Textarea, Select, FormField, FormSection, Modal, ConfirmModal, PageHeader, StatusBadge, StatCard, Table, Tabs, Toast, EmptyState, ErrorState, WizardStepper, Tooltip, CollapsibleCard, AppLayout, Sidebar, Header e NavigationProgress;
- **Catálogo Vite**.
