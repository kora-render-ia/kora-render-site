# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Arquitetos e designers freelancer ou de pequeno escritório que já modelam no SketchUp. Decidem a compra sozinhos (sem processo de aprovação corporativa) e são sensíveis a custo/hardware — competem com ferramentas como Enscape, V-Ray, D5 e Twinmotion que exigem GPU potente e/ou assinatura mensal cara. Visitam a landing page para avaliar se vale substituir esse fluxo por um plugin de renderização por IA direto no SketchUp.

## Product Purpose

Lumi Render é um plugin oficial do SketchUp que gera renderizações fotorrealistas por IA a partir do modelo 3D, direto na viewport, sem exportar arquivo e sem ajustar luz manualmente. Sucesso para o usuário é conseguir uma imagem de apresentação em segundos, com custo previsível e sem precisar de placa de vídeo dedicada.

## Positioning

Mecanismo central: o usuário conecta a própria chave de API de IA e paga só pelo que renderiza (menos de R$1 por imagem) — sem GPU cara, sem mensalidade do Lumi, sem intermediário de custo. Isso é o que um concorrente como Enscape/V-Ray/D5/Twinmotion não pode replicar honestamente, já que essas ferramentas dependem de hardware local caro e/ou assinatura fixa. Velocidade e simplicidade dentro do SketchUp (1 clique, sem sair do fluxo de modelagem) reforçam esse mecanismo, mas o argumento de custo/hardware é o principal.

## Operating Context

- Fluxo do usuário: modela no SketchUp → escolhe estilo/iluminação/proporção → renderiza com um clique → opcionalmente refina com IA (troca de elementos, sliders de pós-produção).
- A landing page (`/`) é puramente informativa/comercial — não tem backend próprio, apenas linka para checkout externo na Hotmart.
- Existe uma área logada separada (`/conta`) onde o cliente já comprado usa email + chave de licença (mesma credencial do plugin) para ver validade da licença e baixar a build mais recente do plugin, via API de licenciamento (`kora-render-api`, repo irmão).
- Preço atual: um único plano, R$ 197/ano (12 meses), com um único link de checkout Hotmart ativo (`checkoutPlanos[0]` em `src/dados/planos.ts`). Um segundo link (`checkoutPlanos[1]`) é dado morto de um design de dois planos anterior.
- Site com i18n pt-BR/en (idioma padrão pt-BR, detectado e salvo em localStorage).

## Capabilities and Constraints

- React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + react-router-dom; texto em `src/traducao/idiomas/{pt-BR,en}.json`, dados estruturados em `src/dados/*.ts`.
- Convenção de nomenclatura: todo o código em `src/` é nomeado em português (pastas, componentes, hooks, tipos), com as duas exceções documentadas em CLAUDE.md (`children`, prefixo `use`).
- Formulário de contato (`servicos/servicoContato.ts`) é um placeholder que simula delay e loga no console — não existe endpoint real hoje.
- `EMAIL_CONTATO` em `constantes/index.ts` está como `suporte@lumi.app`, inconsistente com o domínio real do ecossistema (`korarender.ia@gmail.com` / `korarender.com.br`) — precisa confirmação antes de ser usado como fonte de verdade.
- Sem suite de testes no repositório.

## Brand Commitments

- Nome do produto: Lumi Render. Marcador "PLUGIN OFICIAL SKETCHUP".
- Direção visual atual documentada no README como "mesa de desenho técnico": molduras de canto, grade de pontos/miras, tipografia Space Grotesk + IBM Plex Mono + Inter, botões retangulares com corte de canto, numeração técnica ("01", "F.01", "Q01") como fio condutor. Paleta com âmbar de marca mais contido + acento técnico azul-acinzentado.

## Evidence on Hand

- Imagens reais já presentes em `src/ativos/imagens/` (antes/depois de renders reais como `casa-concreto-antes/depois.webp`, `quarto-antes/depois.webp`, `sala-casa-praia-antes/depois.webp`, close-ups de piscina, galeria e avatares de depoimentos) — não são mais placeholders proceduralmente gerados como o README legado descreve.
- Depoimentos com avatares reais associados (`lucas-andrade`, `mariana-costa`, `rafael-lima` em `src/dados/planos.ts` / seção Depoimentos).
- Contagem "+12.000 arquitetos e designers" usada no hero — origem/veracidade não confirmada nesta sessão; tratar como copy existente, não inventar novos números.

## Product Principles

- Custo e hardware são o argumento central de venda — qualquer nova seção/copy deve reforçar "sem GPU cara, paga só o que usa", não only "rápido e fácil".
- Não tirar o usuário do fluxo do SketchUp é uma promessa de produto, não só de UX — evitar linguagem que sugira passos extras de exportação/instalação complexa.
- Preservar a nomenclatura 100% em português no código como convenção não-negociável.
- Preço é um único plano público (R$197/ano); não introduzir múltiplos tiers visíveis sem validar com o usuário, já que o mapeamento de planos internos da API acontece só no backend.
