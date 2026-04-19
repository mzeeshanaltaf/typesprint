# TypeSprint

> **Type smarter with AI — practice on lessons generated just for you.**

A modern typing tutor web app built with Next.js 16. Practice typing, follow structured lessons, or generate your own AI-tailored drills on any topic, difficulty, and length — all in a clean, dark-mode-first interface.

![TypeSprint](docs/typing-board.png)

## Features

- **AI-generated lessons** ✨ — describe a topic, pick difficulty / length / tone (and a programming language for code drills), and OpenAI generates a custom lesson saved to your library to retype anytime
- **Per-lesson history** — every AI lesson page tracks all your attempts with best WPM, best accuracy, and a full attempts table
- **Live typing test** — 15 / 30 / 60 s modes with real-time WPM, accuracy, and mistake tracking
- **Structured lessons** — beginner → intermediate → advanced lessons grouped by category (home row, numbers, symbols, paragraphs, coding)
- **Progress dashboard** — streak counter, best/avg WPM KPI cards, and interactive WPM + accuracy charts (last 30 days), with eager cache invalidation so new sessions appear instantly — no refresh required
- **Authentication** — email/password sign-up and Google OAuth via Better Auth
- **Admin panel** — CRUD for lessons, user role management, and platform-wide analytics
- **Contact form** — progressive-enhancement form wired to an n8n webhook
- **Dark / light mode** — next-themes toggle, system preference respected
- **SEO** — sitemap, robots.txt, Open Graph metadata

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (New York, slate) |
| Animations | Framer Motion |
| Auth | Better Auth (email/password + Google OAuth) |
| Database | PostgreSQL via Drizzle ORM (`typesprint` schema) |
| AI | OpenAI Responses API (`gpt-5.4-nano`) |
| Charts | Recharts |
| Notifications | Sonner |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL instance
- Google OAuth credentials (optional — only needed for Google sign-in)
- An n8n (or compatible) webhook for the contact form (optional)

### 1. Clone and install

```bash
git clone https://github.com/mzeeshanaltaf/typesprint.git
cd typesprint
npm install
```

### 2. Configure environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret ≥ 32 chars (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Base URL of your app (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `OPENAI_API_KEY` | OpenAI API key (required for AI-generated lessons) |
| `N8N_API_KEY` | API key for the contact form webhook |

### 3. Run database migrations

```bash
npx drizzle-kit migrate
```

### 4. Seed demo lessons (optional)

```bash
npx tsx src/db/seed.ts
```

This inserts ~15 lessons across all levels and promotes `zeeshan.altaf@gmail.com` to `role='admin'`. Edit the file to change the admin email.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & routes
│   ├── (auth)/             # Sign-in / sign-up pages
│   ├── actions/            # Server Actions (eager cache invalidation)
│   ├── admin/              # Admin panel (lessons, users, analytics)
│   ├── ai-lessons/         # AI lesson generator + per-lesson detail pages
│   ├── api/                # Route handlers (auth, ai-lessons/generate, contact)
│   ├── dashboard/          # User progress dashboard
│   ├── lessons/            # Lesson browser + individual lesson pages
│   └── practice/           # Free typing practice page
├── components/
│   ├── admin/              # Admin CRUD components
│   ├── ai-lessons/         # Generate form + AI lesson cards
│   ├── contact/            # Contact form
│   ├── dashboard/          # Chart and table components
│   ├── landing/            # Landing page sections
│   ├── layout/             # Navbar, footer, shared wrappers
│   ├── typing/             # Typing test engine components
│   └── ui/                 # shadcn/ui primitives
├── db/
│   └── schema/             # Drizzle table definitions (typesprint schema)
└── lib/
    ├── auth.ts             # Better Auth server config
    ├── auth-client.ts      # Better Auth client SDK
    ├── db.ts               # Drizzle client
    ├── openai.ts           # OpenAI client + model constant
    └── typing/             # Pure typing engine (WPM, accuracy, char states)
```

## Deployment

1. Push to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add all environment variables under **Project → Settings → Environment Variables**.
4. Deploy — Vercel auto-detects Next.js and builds with Turbopack.

## License

MIT
