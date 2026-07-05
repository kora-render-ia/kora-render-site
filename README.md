# Kora Render — Landing Page

Reescrita completa da aplicação: mesma missão, mesmo conteúdo, mesmos dados e as mesmas
funcionalidades — arquitetura, identidade visual e nomenclatura totalmente reconstruídas.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- react-i18next (pt-BR / en)
- React Icons
- ESLint + Prettier

## Como rodar

```bash
npm install
npm run dev       # ambiente de desenvolvimento
npm run build     # build de produção
npm run preview   # serve o build de produção
npm run lint       # checagem de lint
npm run format      # formata com Prettier
```

---

## Direção de design: "mesa de desenho técnico"

O design anterior seguia o padrão mais comum de landing pages geradas por IA: hero centralizado
com badge + título + CTA + imagem à direita, cards `rounded-2xl` uniformes, glow azul/âmbar
desfocado, botões pill, tipografia Inter+Sora. Era funcional, mas genérico e facilmente
reconhecível como "gerado por Lovable/v0/Framer AI".

A nova direção usa a metáfora de uma **mesa de desenho arquitetônico** — coerente com o produto
(plugin de renderização para arquitetos):

- **Molduras de canto** (`MoldeCantos`) em vez de sombra/blur — como a mira de uma câmera técnica.
- **Grade de pontos + miras** (`FundoTecnico`) no lugar dos blobs de glow desfocados.
- **Tipografia**: Space Grotesk (títulos) + IBM Plex Mono (rótulos técnicos e numeração) + Inter (corpo).
- **Botões retangulares com corte de canto** (`corte-canto-sm`) em vez de pill.
- **Numeração técnica** em todas as seções ("01", "F.01", "Q01") como fio condutor visual.
- Paleta mantém o âmbar da marca, mas mais contida; acento técnico azul-acinzentado reservado
  para detalhes de régua/grade.

## O que mudou por seção

| Seção | Antes | Depois |
|---|---|---|
| Destaque (Hero) | Centralizado, badge+título+CTA+imagem à direita | Editorial assimétrico: título full-width, avaliação na margem vertical, imagem com moldura de canto e legenda técnica |
| Antes/Depois | — | Subiu para a 2ª posição (prova visual mais cedo); comparador com moldura e rótulos técnicos |
| Como Funciona | 3 cards lado a lado | Timeline vertical conectada, linha animada por scroll |
| Funcionalidades | Grid uniforme 4 colunas | Grid bento assimétrico com um item em destaque |
| Galeria | Grid estático + filtros em pílula no topo | Filme horizontal com scroll + abas de categoria na lateral |
| Vídeos | Botão play circular + duração em pílula | Cartão com play quadrado + código de tempo estilo timecode |
| Compatibilidade | Grid de ícones | Tabela/lista de especificação técnica |
| Planos | 3 caixas arredondadas com glow | Dossiê comparativo; plano recomendado com moldura de canto |
| Depoimentos | 3 cards em grid | Citações empilhadas com numeração e avaliação lateral |
| FAQ | Accordion com chevron circular | Lista numerada ("Q01") com toggle quadrado +/− |
| CTA | Caixa arredondada com glow | Faixa full-bleed com marcas de mira |

## Arquitetura (100% em português)

```
src/
  ativos/               → imagens, vídeos, ícones
  componentes/
    comuns/              → Botao, Contentor, CabecalhoSecao, Selo, AvaliacaoEstrelas,
                           ContadorAnimado, SeletorIdioma
    leiaute/             → BarraNavegacao, Rodape
    secoes/              → Destaque, AntesDepois, FaixaVersoes, ComoFunciona, Funcionalidades,
                           Galeria, Videos, Compatibilidade, Planos, Depoimentos,
                           PerguntasFrequentes, ChamadaAcao
    ui/                  → MoldeCantos, FundoTecnico, CartaoFuncionalidade, NoEtapa, CartaoPlano,
                           CitacaoDepoimento, ItemPergunta, QuadroGaleria, FitaVideo, IconeBandeira
  paginas/Inicio/        → composição das seções
  ganchos/                → useRolagem, useContagem, useControleDeslizante
  traducao/               → indice.ts (config i18next) + idiomas/{pt-BR,en}.json
  dados/                  → dados não-textuais (imagens, ids, ícones); texto vive na tradução
  tipos/                  → interfaces TypeScript compartilhadas
  servicos/               → servicoContato.ts (placeholder de API)
  constantes/              → constantes globais
  estilos/                 → tokens do design system (cores, tipografia, sombras)
```

### Sobre a nomenclatura em português

Toda pasta, arquivo, componente, hook, tipo, constante e serviço foi renomeado para português
(`componentes`, `paginas`, `ganchos`, `servicos`, `dados`, `Botao`, `Rodape`, `useRolagem`, etc.).

Duas exceções deliberadas, por serem contratos da própria linguagem/framework e não escolhas de
nomenclatura:

1. **`children`** — prop nativa do React/JSX para conteúdo aninhado (`<Componente>filho</Componente>`).
   Renomear quebraria a sintaxe JSX declarativa e obrigaria `<Componente filhos={...}>` em todo
   lugar, prejudicando a legibilidade.
2. **Prefixo `use` nos hooks** (`useRolagem`, `useContagem`, `useControleDeslizante`) — o ESLint
   (`react-hooks/rules-of-hooks`) e o próprio React dependem desse prefixo para identificar hooks
   em tempo de lint/execução. O substantivo do nome é em português; o prefixo estrutural é `use`.

## Internacionalização

Suporte a **Português (Brasil)** e **English**, com seletor de bandeiras (SVG próprios) na barra
de navegação. Idioma salvo em `localStorage`, detectado automaticamente no primeiro acesso.

## Placeholders

Imagens (destaque, antes/depois, galeria, avatares) são placeholders gerados proceduralmente —
sem reprodução de assets de terceiros. Substitua os arquivos em `src/ativos/imagens/` mantendo
os mesmos nomes, ou atualize os imports em `src/dados/*.ts`.

## Otimizações aplicadas

- Dependências mortas removidas (`lucide-react`, `react-router-dom` — nunca importadas).
- Nenhum componente duplicado ou lógica repetida entre seções (padrões extraídos para `ui/` e `comuns/`).
- Animações via Framer Motion com `viewport={{ once: true }}` (evita re-cálculo em cada scroll).
- Linha do tempo de "Como Funciona" usa `useScroll`/`useTransform` do Framer Motion em vez de
  listener de scroll manual.
- `useCallback`/`useRef` no gancho de arraste para evitar recriação de handlers a cada render.
- Lazy loading nativo (`loading="lazy"`) nas imagens da galeria.
- CSS gerado via Tailwind (sem CSS não utilizado, sem duplicação de estilos).

## Próximos passos sugeridos

- Conectar `servicos/servicoContato.ts` a uma API real.
- Substituir os placeholders de imagem/vídeo pelos assets finais.
- Adicionar testes (Vitest + React Testing Library).
