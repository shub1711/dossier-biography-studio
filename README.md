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
  <a href="#demo-video">Demo Video</a> •
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

## Demo Video

<p align="center">
  <a href="https://www.loom.com/share/5196810926974b9084e1244ed623ba28" target="_blank" rel="noopener noreferrer">
    <img
      src="https://cdn.loom.com/sessions/thumbnails/5196810926974b9084e1244ed623ba28-with-play.gif"
      alt="Dossier product demo — click to watch on Loom"
      width="800"
    />
  </a>
</p>

<p align="center">
  <a href="https://www.loom.com/share/5196810926974b9084e1244ed623ba28" target="_blank" rel="noopener noreferrer">
    ▶ Product overview
  </a>
</p>

<p align="center">
  <a href="https://www.loom.com/share/7e5f31f1cba548b8abbe31323c97c70b" target="_blank" rel="noopener noreferrer">
    ▶ Technical overview 
  </a>
</p>

> GitHub README does not support embedded Loom players. The GIF above is a live preview — click it to open and play the full video on Loom.

---

## Screenshots

### Authentication

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/24ae6112-e5fb-490f-89a3-0875b1b9011c"
    alt="Login screen"
    width="900"
  />
</p>

### Biography Generation

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/362dbd15-611e-4afd-a38b-0b13afcfeeab"
    alt="Generate biography modal"
    width="900"
  />
</p>

### Generated Dossier

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/0af7fed1-ebc7-474f-840c-6a47b39fd628"
    alt="Generated biography dossier with section cards"
    width="900"
  />
</p>

### AI Rewrite

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/46071a9a-4c43-4f73-a5c6-04226dcd5747"
    alt="AI rewrite section with voice input"
    width="900"
  />
</p>

---

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

- React.js 19 and Next.js
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
