<!-- REDESIGN: substitui a direção anterior "Ateliê de Petróleo" (invenção não lastreada no produto). Esta versão porta a identidade visual real do plugin Lumi Render (ui/css/01-base-tema.css, kora-render-plugin) para a landing page e para /conta, por decisão explícita do usuário — brief pinado, não explorado por concept-seed. -->

---
name: Lumi Render
description: Landing page e área de conta do plugin de renderização por IA do SketchUp, na identidade visual real do produto
colors:
  fundo: "#191c1f"
  fundo-elevado: "#232629"
  superficie: "#232629"
  superficie-hover: "#2b2f33"
  borda: "#383d42"
  texto-primario: "#eceef0"
  texto-secundario: "#9aa0a6"
  texto-suave: "#7d838a"
  marca: "#3d9bd6"
  marca-hover: "#5cb0e3"
  marca-escura: "#1d5074"
  marca-suave: "#1b2f3d"
  acento-soft: "#6cb8e6"
  texto-sobre-marca: "#f3fafe"
  sucesso: "#3fcf80"
  aviso: "#dba53f"
  erro: "#e5695f"
  acento: "#d1a44c"
  invertido-fundo: "#eef1f3"
  invertido-texto: "#14171a"
typography:
  titulo:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontWeight: 700
  corpo:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontWeight: 400
  numero-tecnico:
    fontFamily: "'SF Mono', 'Cascadia Code', Consolas, monospace"
    letterSpacing: "0.02em"
rounded:
  botao: "6px"
  quadro: "10px"
  modal: "14px"
  selo: "999px"
spacing:
  contentor-x: "1.5rem"
  contentor-x-lg: "3rem"
  contentor-max: "90rem"
components:
  button-primary:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.texto-sobre-marca}"
    rounded: "{rounded.botao}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.marca-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.texto-primario}"
    rounded: "{rounded.botao}"
  button-secondary-hover:
    textColor: "{colors.marca}"
  card:
    backgroundColor: "{colors.fundo-elevado}"
    rounded: "{rounded.quadro}"
    padding: "1.25rem"
  badge:
    backgroundColor: "{colors.marca-suave}"
    textColor: "{colors.marca}"
    rounded: "{rounded.selo}"
    padding: "0.375rem 0.75rem"
  invert-cta:
    backgroundColor: "{colors.invertido-fundo}"
    textColor: "{colors.invertido-texto}"
    rounded: "{rounded.botao}"
---

# Design System: Lumi Render

## Overview

**Creative North Star: "O Console do Renderista"**

Lumi Render é vendido para quem já vive dentro de V-Ray, Enscape e DaVinci Resolve — softwares técnicos escuros, sem enfeite, onde cada painel é uma superfície de trabalho e cada cor tem um significado funcional. A landing page para de fingir ser um site de SaaS genérico e passa a se parecer com uma extensão real dessas ferramentas: fundo quase-preto (nunca preto puro), painéis com leve elevação por "inner highlight" branco quase imperceptível em vez de sombra colorida, um único accent azul-elétrico reservado a ação e seleção, e valores numéricos (preço, contagem, especificação) sempre em monoespaçada — como se estivessem saindo de um painel de propriedades.

Esta não é mais uma direção inventada pelo agente: é a paleta e a geometria reais do produto (`ui/css/01-base-tema.css` do plugin), portadas para o site de vendas por decisão explícita do dono do produto. O objetivo é continuidade total: quem vê o anúncio, decide comprar, faz checkout e depois abre o plugin dentro do SketchUp não deveria sentir que trocou de marca no meio do caminho.

**Key Characteristics:**
- Fundo escuro nunca preto puro (`#191c1f`); dois níveis de superfície apenas (`#191c1f` → `#232629` → hover `#2b2f33`).
- Um único accent de ação: azul-elétrico `#3d9bd6`, que clareia (não escurece) no hover — convenção de dark UI.
- Geometria contida e técnica: 6px em botões/inputs, 10px em cards, 14px em modais — nunca `rounded-lg`/`rounded-2xl` genérico.
- Sombras sempre pretas e profundas (`rgba(0,0,0,.35–.55)`), nunca azuladas; toda superfície elevada ganha um "inner highlight" branco quase invisível (`rgba(255,255,255,.04–.05)`) para simular chanfro físico de painel.
- Tipografia do sistema, sem web font — mesma decisão do plugin (carregar instantâneo). Números (preço, contagem, especificação técnica, chave de licença) sempre em monoespaçada.
- Cores semânticas (sucesso/aviso/erro) só aparecem em contexto de status real (licença ativa/bloqueada/expirada) — nunca como decoração.
- Uma superfície invertida quase-branca é reservada para 1–2 pontos de contraste máximo por tela (nunca decoração recorrente).

## Colors

Paleta técnica de dois níveis de superfície escura + um único accent de ação, com semânticas reservadas a status real.

### Primary
- **Azul-Elétrico** (`#3d9bd6`): accent de marca — botão primário, links, seleção, ícones ativos, borda de foco.
- **Azul-Elétrico Hover** (`#5cb0e3`): hover/active do accent — mais claro que o repouso, padrão de dark UI (nunca escurecer no hover em fundo escuro).
- **Azul-Elétrico Escuro** (`#1d5074`): variante escura do accent, para estados pressed ou contraste sobre superfícies muito claras.
- **Accent Tint** (`#1b2f3d`): fundo tingido de badges/seleção em estado "marca".
- **Accent Soft** (`#6cb8e6`): cor de borda em hover (não do texto) — usada quando um contorno precisa reagir sem virar o accent sólido.
- **Texto Sobre Accent** (`#f3fafe`): texto/ícone sobre fundo `marca` — quase-branco, nunca branco puro.

### Secondary
- **Dourado — Favorito** (`#d1a44c`): único uso decorativo fora do accent — estrelas de avaliação preenchidas e qualquer indicador de "destaque"/"favorito". Nunca em texto de corpo, botão ou link.

### Neutral
- **Fundo Geral** (`#191c1f`): fundo de página, atrás de todos os painéis.
- **Superfície** (`#232629`): cards, header, painéis, modais, form inputs.
- **Superfície Hover** (`#2b2f33`): hover de superfícies e inputs.
- **Borda** (`#383d42`): contorno de inputs, separadores, contorno de cards.
- **Texto Primário** (`#eceef0`): títulos e corpo — off-white, nunca branco puro.
- **Texto Secundário** (`#9aa0a6`): legendas, metadados, corpo de apoio.
- **Texto Terciário** (`#7d838a`): placeholder, texto de apoio mais discreto, numeração/rótulos uppercase pequenos (10-11px) no rodapé, nav, índice do FAQ e legendas da galeria. Clareado do valor bruto do plugin (`#676d73`, ~3.3:1 sobre `#191c1f`) para `#7d838a` (~4.5-4.8:1) — desvio deliberado e documentado da fonte literal, feito por legibilidade/WCAG AA nesses rótulos pequenos, mantendo o mesmo papel "terciário" no sistema.

### Semantic (status only)
- **Sucesso** (`#3fcf80`): licença ativa.
- **Aviso** (`#dba53f`): licença expirada / atenção.
- **Erro** (`#e5695f`): licença bloqueada, reembolsada, mensagem de erro de formulário.

### Inverted Surface
- **Fundo Invertido** (`#eef1f3`) / **Texto Invertido** (`#14171a`): CTA de contraste máximo, reservado a 1–2 usos por tela (ex.: faixa final de conversão). Não é um "modo claro" — é um recurso de ênfase pontual.

### Named Rules
**The Single Accent Rule.** O azul-elétrico é a única cor com função de ação (CTA, link, foco, seleção, ícone ativo). Dourado é estritamente decorativo (favorito/avaliação); semânticas (sucesso/aviso/erro) só existem em contexto real de status, nunca como decoração ou substituto de accent.

**The Never-Pure-Black Rule.** Nenhum fundo é `#000000` puro nem `#ffffff` puro; a escala inteira vive entre `#191c1f` e `#eceef0`, com a superfície invertida (`#eef1f3`/`#14171a`) como única exceção deliberada e rara.

## Typography

**Title/Body Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` — sem web font, mesma decisão do plugin (carregamento instantâneo, independente de internet).
**Numeric/Mono Font:** `'SF Mono', 'Cascadia Code', Consolas, monospace` — todo valor numérico de identidade (preço, contador, timecode, especificação, chave de licença).

**Character:** Neutro e nativo por design — a personalidade vem da paleta e da geometria, não da fonte. É uma escolha deliberadamente "sem escolha", igual à do software real.

### Hierarchy
- **Display/Hero** (bold 700, `text-[3.1rem]` → `5.75rem`, line-height ~1.02): título do hero.
- **Headline** (bold 700, `text-4xl` → `5xl`, line-height 1.1): título de seção.
- **Title** (semibold 600, `text-lg`–`text-xl`): citações, títulos de card destacado.
- **Body** (regular/medium, `text-sm`/`text-[15px]`, leading-relaxed): descrições e corpo.
- **Label/Numérico** (medium, `text-[10px]`–`text-[11px]`, uppercase, tracking-wide, **fonte monoespaçada**): numeração de seção, preço, contador, chave de licença, timecode.

### Named Rules
**The Monospace Number Rule.** Todo número que carrega identidade ou precisão técnica (preço, índice de seção, chave de licença, especificação, timecode) é monoespaçado. Nenhum outro texto usa monoespaçada.

## Layout

Contêiner central com `max-width: 90rem`, padding horizontal `1.5rem` (mobile) subindo a `3rem` em `lg:`. Seções mantêm o ritmo vertical já estabelecido (`py-20 lg:py-28`), `CabecalhoSecao` abrindo cada seção com número + marcador + título. Estrutura de página (11 seções, ordem, listas vs. grid por conteúdo) é preservada integralmente desta versão para a anterior — apenas a linguagem visual muda.

## Elevation & Depth

Sistema de painel técnico: fundo escuro plano com dois níveis de superfície, profundidade dada por sombra preta profunda combinada com um "inner highlight" branco quase invisível no topo de cada painel — a sensação de um chanfro físico de hardware/software profissional, não de blur/glass decorativo.

### Shadow Vocabulary
- **`shadow-suave`** (`0 8px 24px -16px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)`): cards padrão, botões, thumbnails.
- **`shadow-quadro`** (`0 24px 48px -28px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.05)`): moldura de destaque (`MoldeCantos`) em painéis premium (comparador antes/depois, painel de plano, modal de licença).

### Named Rules
**The Black-Only Shadow Rule.** Toda sombra projetada é preta (`rgba(0,0,0,…)`); nenhuma sombra usa a cor de marca ou qualquer matiz — isso pertence exclusivamente ao glow de fundo do `FundoTecnico`, nunca à sombra de um componente.

## Shapes

Geometria contida e deliberadamente "não fofa": 6px em botões e inputs, 10px em cards e painéis, 14px em modais — sempre menor que o `rounded-xl`/`rounded-2xl` genérico de UI kit. Pill (`999px`) reservado a selos/badges e avatares circulares. Bordas finas de 1px (`border-borda`) definem contorno sobre a superfície escura em vez de depender só de sombra.

## Components

### Buttons (`Botao`)
- **Shape:** `rounded-botao` (6px), altura fixa por tamanho.
- **Primary:** fundo `marca`, texto `texto-sobre-marca` (quase-branco, não branco puro), `shadow-suave`; **hover clareia** para `marca-hover` (nunca escurece — convenção de dark UI).
- **Secondary:** fundo transparente, borda `borda`; hover troca borda para `acento-soft` e texto para `marca`.
- **Ghost:** transparente, texto `texto-secundario`; hover clareia para `texto-primario`.

### Badges/Selos (`Selo`)
- **Style:** pill (`rounded-selo`), borda 1px, texto uppercase monoespaçado.
- **State:** `marca` (fundo `marca-suave`, texto `marca`), `neutro`/`contorno` (borda `borda`).

### Cards / Containers
- **Corner Style:** `rounded-quadro` (10px).
- **Background:** `fundo-elevado`/`superficie` (`#232629`) sobre `fundo` (`#191c1f`).
- **Shadow Strategy:** `shadow-suave` em repouso (sombra preta + inner highlight); hover reforça borda para `marca/40`, nunca aumenta a sombra.
- **Border:** `border-borda` (`#383d42`).

### Molduras (`MoldeCantos`, componente de assinatura)
Envolve mídia/painéis de alto destaque com `rounded-quadro` + `shadow-quadro`. O dispositivo de assinatura real é o anel de contorno controlado pela prop `corCanto`: `corCanto="marca"` aplica `ring-1 ring-marca/35` (um halo azul-elétrico quase imperceptível ao redor do painel) e é reservado a painéis de prova/decisão de alto peso — comparador antes/depois do hero, painéis de login e status em `/conta`, e o painel de plano recomendado; `corCanto="neutro"` (o padrão) aplica `ring-1 ring-borda` para painéis de destaque que não pedem ênfase de marca (ex.: o segundo painel de antes/depois). O anel `marca` é o que distingue um `MoldeCantos` "vitrine de instrumento" de um card comum — não decoração recorrente, só nos pontos de maior peso de decisão da página.

### Fundo técnico (`FundoTecnico`, componente de assinatura)
Mancha radial única de accent azul muito diluída atrás do hero/CTA — o dourado (`acento`) não participa mais do glow de fundo, pois foi reservado a favorito/avaliação (Single Accent Rule). Nunca cobre conteúdo, nunca aparece em mais de uma seção por vez.

### FAQ / Listas numeradas (`ItemPergunta`)
Sem card — linha com `border-b border-borda`, número monoespaçado (`Q01`) à esquerda, toggle circular +/− à direita; número e contorno mudam para `marca` quando aberto.

### Depoimentos (`CitacaoDepoimento`)
Linha com `border-t`, número grande monoespaçado à esquerda, avatar real (não iniciais quando a foto existir) à direita, `AvaliacaoEstrelas` em dourado (`acento`).

### Status de licença (`/conta`, `PainelConta`)
Badge de status usa exclusivamente as cores semânticas: `sucesso` (ativa), `aviso` (expirada), `erro` (bloqueada/reembolsada), `texto-suave`/`superficie` (cancelada). Nunca a paleta genérica do Tailwind (`emerald-500`, `red-500` etc.) — sempre os tokens do sistema.

### CTA invertido (`ChamadaAcao`, uso reservado)
A faixa final de conversão é o único ponto da página com permissão de usar a superfície invertida (`invertido-fundo`/`invertido-texto`) no botão primário, como o único contraste máximo do site — não decoração recorrente.

## Do's and Don'ts

### Do:
- **Do** manter o azul-elétrico (`#3d9bd6`) como única cor de ação; hover sempre clareia (`#5cb0e3`), nunca escurece.
- **Do** usar `rounded-botao` (6px) em botões/inputs e `rounded-quadro` (10px) em cards/painéis — geometria sempre contida, nunca `rounded-xl`/`rounded-2xl` genérico.
- **Do** usar fonte monoespaçada para todo número de identidade (preço, contagem, chave de licença, timecode, índice de seção).
- **Do** manter sombras pretas com inner highlight branco quase invisível (`shadow-suave`/`shadow-quadro`); nunca sombra colorida.
- **Do** usar as cores semânticas (`sucesso`/`aviso`/`erro`) exclusivamente em contexto real de status de licença/formulário.
- **Do** manter dourado (`acento`, `#d1a44c`) restrito a estrelas de avaliação/favorito.

### Don't:
- **Don't** usar branco puro (`#ffffff`) ou preto puro (`#000000`) em qualquer superfície — a escala vive entre `#191c1f` e `#eceef0`; a superfície invertida (`#eef1f3`) é a única exceção deliberada, reservada a 1–2 usos por tela.
- **Don't** reintroduzir a paleta clara "Ateliê de Petróleo" (fundo `#f7f8f9`, azul `#3e6680`, bronze `#c9a97e`) — essa direção foi substituída porque não tinha lastro no produto real; ela vive só como histórico em versões anteriores do Git.
- **Don't** usar cores do Tailwind por nome (`emerald-500`, `red-600`, `amber-500`) em vez dos tokens semânticos do sistema — quebra a possibilidade de auditar contraste/consistência num só lugar.
- **Don't** carregar web fonts (Google Fonts etc.) — o sistema usa exclusivamente a pilha de fontes do sistema operacional, por decisão de marca herdada do plugin.
- **Don't** usar sombra colorida (azulada) em cards/botões — cor pertence só ao glow de fundo do `FundoTecnico`, nunca à elevação de um componente.
