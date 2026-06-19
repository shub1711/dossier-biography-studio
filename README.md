<h1 align="center">Dossier — Biography Studio</h1>

<p align="center">
  AI-powered structured biography generator. Turn a LinkedIn URL or pasted resume into a reviewable, editable dossier.
</p>

<p align="center">
  <a href="#">
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  </a>
  <a href="#">
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  </a>
  <a href="#">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  </a>
  <a href="#">
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  </a>
  <a href="#">
    <img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
  </a>
  <a href="https://github.com/shub1711/dossier-biography-studio" target="_blank">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/shub1711/" target="_blank">
    <img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#setup">Setup</a> •
  <a href="#author">Author</a>
</p>

---

## Features

- **Auth** — Sign up / sign in with Supabase (split-panel UI)
- **Generate** — Create a biography from pasted text or a profile URL (Diffbot + OpenAI)
- **9 sections** — Structured dossier with **Known / Inferred** provenance chips
- **Rewrite** — Per-section AI rewrite with natural-language instructions
- **Review & save** — Edit inline, sticky save bar, one profile per user
- **Dark / light theme** — Persists across sessions

## Screenshots

> Add screenshots after your first deploy or local run. Drag images into a GitHub issue to get hosted URLs, then replace the placeholders below.

### Login

<!-- <img width="900" alt="Login screen" src="YOUR_IMAGE_URL" /> -->

### Biography editor

<!-- <img width="900" alt="Biography page" src="YOUR_IMAGE_URL" /> -->

### Generate modal

<!-- <img width="900" alt="Generate biography" src="YOUR_IMAGE_URL" /> -->

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, MUI Joy, Phosphor Icons |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| AI | OpenAI via Vercel AI SDK |
| URL enrichment | Diffbot |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query |

## Setup

### Prerequisites

- Node.js 20+
- Supabase project
- OpenAI API key
- Diffbot API key (for URL mode)

### Install & run

```bash
git clone https://github.com/shub1711/dossier-biography-studio.git
cd dossier-biography-studio
npm install
cp .env.example .env.local
```

Fill in `.env.local`, then run migrations in `supabase/migrations/` (001–007) in your Supabase SQL editor.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up at `/signup`, then use `/biography`.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role (server-side jobs) |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `DIFFBOT_API_KEY` | Yes (URL mode) | Diffbot Enhance API |
| `NEXT_PUBLIC_USE_SUPABASE_FUNCTIONS` | No | `false` = local API routes (default) |

See `.env.example` for the full list.

### Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

## Project structure

```
src/
├── app/              # Routes + API handlers
├── features/         # auth & biography (hooks, UI, api)
├── components/       # shared layout, brand, core
├── lib/              # services, LLM, Supabase, validators
└── styles/           # design tokens + MUI theme
supabase/
├── migrations/       # Database schema + RLS
└── functions/        # Edge function stubs
```

## Author

**Shubham Srivastav**

- LinkedIn: [@shub1711](https://www.linkedin.com/in/shub1711/)
- GitHub: [@shub1711](https://github.com/shub1711/)
