import tokensCss from '../../src/styles/tokens.css?raw';
import { Card } from '../../src';

interface Token {
  nome: string;
  valor: string;
  nota: string;
}

/** Lê todas as variáveis --sd-* do tokens.css, com o comentário da linha. */
function lerTokens(): Token[] {
  const re = /(--sd-[\w-]+):\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g;
  const saida: Token[] = [];
  for (const m of tokensCss.matchAll(re)) {
    saida.push({ nome: m[1]!, valor: m[2]!.replace(/\s+/g, ' ').trim(), nota: m[3] ?? '' });
  }
  return saida;
}

const TOKENS = lerTokens();
const grupo = (prefixo: string) => TOKENS.filter((t) => t.nome.startsWith(prefixo));

function Amostra({ t }: { t: Token }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded-control border border-border"
        style={{ background: `rgb(var(${t.nome}))` }}
      />
      <div className="min-w-0 text-xs">
        <p className="truncate font-mono font-semibold text-title">{t.nome.replace('--sd-color-', '')}</p>
        <p className="truncate text-muted">{t.nota || t.valor}</p>
      </div>
    </div>
  );
}

export function Tokens() {
  const cores = grupo('--sd-color-').filter((t) => !t.nome.includes('chart'));
  const graficos = grupo('--sd-color-chart');
  return (
    <div className="space-y-6">
      <Card title="Cores" description={`${cores.length} papéis. Clique em "Cor principal" no topo para ver a troca ao vivo.`}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cores.map((t) => (
            <Amostra key={t.nome} t={t} />
          ))}
        </div>
      </Card>

      <Card title="Gráficos" description="As 12 cores de CHART_COLORS">
        <div className="flex h-10 overflow-hidden rounded-control">
          {graficos.map((t) => (
            <div key={t.nome} className="flex-1" title={t.nota} style={{ background: `rgb(var(${t.nome}))` }} />
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Fontes">
          <div className="space-y-4">
            {grupo('--sd-font-').map((t) => (
              <div key={t.nome}>
                <p className="font-mono text-xs text-muted">{t.nome}</p>
                <p className="text-lg text-foreground" style={{ fontFamily: `var(${t.nome})` }}>
                  Prefeitura Municipal — Ofício nº 123/2026
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Raios">
          <div className="grid grid-cols-3 gap-4">
            {grupo('--sd-radius-').map((t) => (
              <div key={t.nome} className="text-center text-xs">
                <div
                  className="mx-auto h-14 w-14 border-2 border-accent bg-primary-soft"
                  style={{ borderRadius: `var(${t.nome})` }}
                />
                <p className="mt-1 font-mono text-title">{t.nome.replace('--sd-radius-', '')}</p>
                <p className="text-muted">{t.valor}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Sombras">
          <div className="grid grid-cols-2 gap-4 bg-background p-3">
            {grupo('--sd-shadow-').map((t) => (
              <div
                key={t.nome}
                className="rounded-control bg-surface p-3 text-center font-mono text-xs text-title"
                style={{ boxShadow: `var(${t.nome})` }}
              >
                {t.nome.replace('--sd-shadow-', '')}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
