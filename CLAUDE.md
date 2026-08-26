# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/sales landing page for the "Lumi Render" SketchUp plugin. React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + `react-router-dom`, with i18n (pt-BR/en via `i18next`/`react-i18next`). Mostly a single-page, long-scroll marketing site (`/`), plus one authenticated route (`/conta`) that calls the Kora Render licensing API (`kora-render-api`, sibling repo). The marketing page itself still has no backend of its own — it only links out to Hotmart checkout URLs for purchases.

## Commands

```bash
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run format   # prettier --write .
npm run preview  # preview a production build locally
```

No test suite exists in this repo.

## Architecture

- `src/App.tsx` — `BrowserRouter` with two routes: `/` (`paginas/Inicio`, the marketing page) and `/conta` (`paginas/Conta`, the client account area — see below).
- `src/paginas/Inicio/index.tsx` — the marketing site: `BarraNavegacao` (nav) + `Rodape` (footer) wrapping 11 sections rendered in a fixed order from `src/componentes/secoes/*` (Destaque, AntesDepois, FaixaVersoes, ComoFunciona, Funcionalidades, Galeria, Compatibilidade, Planos, Depoimentos, PerguntasFrequentes, ChamadaAcao).
- Content is split across two layers: **structured data** in `src/dados/*.ts` (arrays/objects a section maps over — images, feature lists, checkout links) and **copy/strings** in `src/traducao/idiomas/{pt-BR,en}.json` (read via `useTranslation()`/`t(...)`). When changing visible text, edit the JSON files (both languages); when changing what's listed/looped over, edit the matching file in `src/dados/`.
- `src/constantes/index.ts` — site-wide constants: `NOME_SITE`, `EMAIL_CONTATO`, and `IDS_SECAO` (anchor ids used for in-page nav links, must match each section's `id` prop).
- `src/ganchos/` — small reusable hooks (`useContagem` — animated counter, `useControleDeslizante` — before/after slider, `useRolagem` — scroll-based effects).
- `src/tipos/index.ts` — shared TS types (e.g. contact form values).

### Pricing / checkout

The **Planos** section (`src/componentes/secoes/Planos/index.tsx`) advertises a single fixed price (`planos.preco` in the i18n JSON, currently "R$ 197"/12 months) with **one** Hotmart checkout link: `checkoutPlanos[0]` from `src/dados/planos.ts`. This is intentionally decoupled from the API's internal plan codes (`BASIC`/`DUO`/`CREATOR`, see `kora-render-api`'s `CLAUDE.md`) — the mapping from a Hotmart product purchased here to an internal plan happens entirely server-side, by product name matching in the API's `hotmart.service.ts`. Don't assume this site needs to mirror the API's plan tiers; it currently sells one product only.

`checkoutPlanos[1]` in `src/dados/planos.ts` is unused dead data (leftover from an earlier two-tier pricing design) — safe to remove if touching that file, or repurpose if a second visible plan is ever added back.

### Contact form

`src/servicos/servicoContato.ts` (`enviarFormularioContato`) is an explicit placeholder — it never calls a real API, just simulates a delay and logs to console. Replace its body with a real request when a backend endpoint for this exists (it does not today, in the licensing API or elsewhere).

### Client account area (`/conta`)

`src/paginas/Conta/index.tsx` — lets a customer log in with email + license key (the same credential the plugin uses) to see their name, license status/validity, and download the latest plugin build. Backed by `src/servicos/servicoPortal.ts`, which calls `POST /api/portal/login` and `GET /api/portal/me` on the API (`VITE_API_URL`, falls back to the production API if unset — never to `localhost`, so a build with a missing env var doesn't silently point at a dev machine). The JWT is stored in `localStorage` (`kr_portal_token`); "logout" just clears it client-side, there's no server session to revoke.

This is a **separate auth scheme from the plugin's own login** (`/api/auth/login`) — see `kora-render-api`'s `CLAUDE.md` for why (reusing the plugin's endpoint would burn one of the license's device slots on every website visit). A blocked/expired license can still log in here and see its real status (with the download button disabled) rather than being refused outright.

## Environment

`.env`/`.env.*` are gitignored. The only variable this project reads is `VITE_API_URL` (used by `servicoPortal.ts`) — see the fallback behavior above if it's unset.

## Known rough edges

- `EMAIL_CONTATO` (`constantes/index.ts`) is `suporte@lumi.app`, inconsistent with the rest of the ecosystem's `korarender.ia@gmail.com` / `korarender.com.br` domain — confirm which is correct before relying on it.
- `src/componentes/secoes/` contains a stray empty directory literally named `{Destaque,FaixaVersoes,AntesDepois,ComoFunciona,Funcionalidades,Galeria,Videos,Compatibilidade,Planos,Depoimentos,PerguntasFrequentes,ChamadaAcao}` — leftover from a `mkdir` brace-expansion that didn't expand (run outside bash). Empty, unreferenced, safe to delete.
