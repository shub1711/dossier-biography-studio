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

<h2 id="demo-video">Demo Video</h2>

<h2 id="demo-video">🎥 Demo Videos</h2>

<table>
<tr>
<td align="center" width="50%">

<a href="https://www.loom.com/share/5196810926974b9084e1244ed623ba28">
  <img
    src="https://cdn.loom.com/sessions/thumbnails/5196810926974b9084e1244ed623ba28-with-play.gif"
    alt="Product Overview"
    width="100%"
  />
</a>

<b>▶ Product Overview</b>

</td>

<td align="center" width="50%">

<a href="https://www.loom.com/share/7e5f31f1cba548b8abbe31323c97c70b">
  <img
    src="https://cdn.loom.com/sessions/thumbnails/7e5f31f1cba548b8abbe31323c97c70b-with-play.gif"
    alt="Technical Overview"
    width="100%"
  />
</a>

<b>▶ Technical Overview</b>

</td>
</tr>
</table>

> GitHub README does not support embedded Loom players. Click either preview to watch the full video on Loom.

---

## Screenshots

### Authentication

<table>
  <tr>
    <td align="center" width="50%">
      <img
        src="https://github.com/user-attachments/assets/24ae6112-e5fb-490f-89a3-0875b1b9011c"
        alt="Login screen"
        width="100%"
      />
      <br />
      <sub><b>Login</b></sub>
    </td>
    <td align="center" width="50%">
      <img
        src="https://github.com/user-attachments/assets/24ae6112-e5fb-490f-89a3-0875b1b9011c"
        alt="Sign up screen"
        width="100%"
      />
      <br />
      <sub><b>Sign up</b> (replace with signup screenshot)</sub>
    </td>
  </tr>
</table>

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

<table>
  <tr>
    <td valign="top" width="50%">

<h3 id="tech-stack">Tech Stack</h3>

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, MUI Joy, Phosphor Icons |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| AI | Gemini via Vercel AI SDK |
| URL enrichment | Diffbot |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query |

    </td>
    <td valign="top" width="50%">

<h3>Environment variables</h3>

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role (server-side jobs) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini API key |
| `DIFFBOT_API_KEY` | Yes (URL mode) | Diffbot Enhance API |
| `NEXT_PUBLIC_USE_SUPABASE_FUNCTIONS` | No | `false` = local API routes (default) |

See `.env.example` for the full list.

    </td>
  </tr>
</table>

<table>
  <tr>
    <td valign="top" width="33%">

<h3 id="setup">Setup</h3>

**Prerequisites**

- React.js 19 and Next.js
- Supabase project
- Gemini API key
- Diffbot API key (for URL mode)

**Install & run**

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

    </td>
    <td valign="top" width="33%">

<h3>Scripts</h3>

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

    </td>
    <td valign="top" width="33%">

<h3>Project structure</h3>

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

    </td>
  </tr>
</table>

---

## Author

**Shubham Srivastav**

- LinkedIn: [@shub1711](https://www.linkedin.com/in/shub1711/)
- GitHub: [@shub1711](https://github.com/shub1711/)
