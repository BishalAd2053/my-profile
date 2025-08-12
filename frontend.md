# frontend.md — Build Instructions for an AI Agent (Profile App UI)

> **Goal:** Produce a production‑ready, animated React frontend for the Profile App. Follow these directives exactly. Do not propose alternatives. Implement precisely what’s written.

---

## Final Stack (lock these in)
- **React 18**, **TypeScript 5**
- **Vite 5** (dev server + bundler)
- **React Router 6**
- **Tailwind CSS 3**
- **Framer Motion 11** (animations)
- **@tanstack/react-query 5** (data fetching/cache)
- **Axios 1** (HTTP client)
- **React Hook Form 7** + **Zod 3** (+ `@hookform/resolvers`)
- **No CSS-in-JS;** use Tailwind exclusively.

All versions must be at or above the following minimums:
```
react>=18.2.0
typescript>=5.5.0
vite>=5.0.0
react-router-dom>=6.24.0
tailwindcss>=3.4.9
framer-motion>=11.0.0
@tanstack/react-query>=5.51.0
axios>=1.7.2
react-hook-form>=7.52.0
zod>=3.23.8
@hookform/resolvers>=3.4.0
```
Use exact versions if a `package.json` is provided; otherwise satisfy these minimums.

---

## API Contract (must match backend.md)
Base URL is configurable by env var **`VITE_API_BASE`**, default `http://localhost:8080/api/v1`.

Endpoints to call:
- `GET /profile`
- `GET /projects`
- `GET /timeline`
- `GET /stats/contributions?year=`
- `POST /contact`

All requests/response payloads are JSON. Do not add extra endpoints.

---

## Project Layout (must match)
```
frontend/
  index.html
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  tsconfig.json
  src/
    main.tsx
    App.tsx
    styles/index.css
    lib/api.ts             # Axios instance
    lib/query.ts           # QueryClient factory
    types/                 # TypeScript models for API
      profile.ts
      project.ts
      experience.ts
      contribution.ts
      message.ts
    hooks/                 # React Query hooks
      useProfile.ts
      useProjects.ts
      useTimeline.ts
      useContributions.ts
      useContact.ts
    components/
      Heatmap.tsx
      Skeleton.tsx
      PageShell.tsx
      Nav.tsx
      Footer.tsx
    pages/
      Home.tsx
      Projects.tsx
      Timeline.tsx
      Contact.tsx
```

---

## Type Models (authoritative)
Create TypeScript types mirroring backend payloads exactly.

```ts
// types/profile.ts
export type UserProfile = {
  id: number
  name: string
  title: string
  bio: string | null
  avatarUrl: string | null
  location: string | null
  github: string | null
  linkedin: string | null
  email: string | null
}

// types/project.ts
export type Project = {
  id: number
  name: string
  slug: string
  description: string | null
  url: string | null
  repo: string | null
  featured: boolean
  tags: string[]
}

// types/experience.ts
export type Experience = {
  id: number
  orgName: string
  role: string
  startDate: string   // ISO date
  endDate: string | null
  summary: string | null
  bullets: string[]
}

// types/contribution.ts
export type Contribution = {
  id: number
  date: string  // ISO date
  count: number // >=0
}

// types/message.ts
export type ContactRequest = { name: string; email: string; body: string }
export type ContactResponse = { status: 'ok' }
```

**Why:** Make the UI strongly typed to catch schema drift at build time.

---

## Axios Instance
```ts
// lib/api.ts
import axios from 'axios'
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api/v1',
  timeout: 8000,
})
```

**Reasoning:** Centralized baseURL & timeout; enables interceptors later if needed.

---

## Query Client
```ts
// lib/query.ts
import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })
}
```

**Reasoning:** Avoid chatty refetches; good DX defaults.

---

## Data Hooks (React Query)
Each hook **must** use `api` and return typed data. Keys are stable.

```ts
// hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { UserProfile } from '../types/profile'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserProfile | null> => (await api.get('/profile')).data,
  })
```

Similarly implement:
- `useProjects` → `/projects` returns `Project[]`
- `useTimeline` → `/timeline` returns `Experience[]`
- `useContributions(year?: number)` → `/stats/contributions` returns `{ year: number; items: Contribution[] }`
- `useContact()` → returns a mutation posting to `/contact`

`useContact` example:
```ts
// hooks/useContact.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ContactRequest, ContactResponse } from '../types/message'

export function useContact() {
  return useMutation({
    mutationFn: async (payload: ContactRequest): Promise<ContactResponse> =>
      (await api.post('/contact', payload)).data,
  })
}
```

---

## App Bootstrap
```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './lib/query'
import App from './App'
import './styles/index.css'

const qc = createQueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
```

**Reasoning:** Sets up routing and data caching at the root.

---

## Routing & Page Transitions
```tsx
// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from './components/PageShell'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Timeline from './pages/Timeline'
import Contact from './pages/Contact'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function App() {
  const loc = useLocation()
  return (
    <PageShell>
      <AnimatePresence mode="wait">
        <motion.div key={loc.pathname} variants={page} initial="initial" animate="animate" exit="exit">
          <Routes location={loc}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </PageShell>
  )
}
```

**Reasoning:** Single place to define animated route transitions; keeps motion consistent.

---

## Layout Components
Create **PageShell**, **Nav**, **Footer** that compose the layout with Tailwind classes.

```tsx
// components/PageShell.tsx
import Nav from './Nav'
import Footer from './Footer'
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-6 text-neutral-100 bg-neutral-950">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
```

**Reasoning:** Centralized layout + stylistic consistency.

---

## Heatmap Component
```tsx
// components/Heatmap.tsx
import { motion } from 'framer-motion'
import type { Contribution } from '../types/contribution'

export default function Heatmap({ items }: { items: Contribution[] }) {
  const map = new Map(items.map(i => [i.date, i.count]))
  const year = new Date(items[0]?.date ?? new Date().toISOString()).getFullYear()
  const start = new Date(year, 0, 1)
  const days = Array.from({ length: 365 }, (_, i) => new Date(start.getTime() + i * 86400000))
  const color = (c: number) => ['#1f2937', '#14532d', '#166534', '#15803d', '#16a34a'][Math.min(c, 4)]
  return (
    <div className="overflow-x-auto">
      <div className="grid" style={{ gridTemplateColumns: 'repeat(53, 12px)', gap: 3 }}>
        {days.map((d, idx) => {
          const key = d.toISOString().slice(0, 10)
          const c = map.get(key) ?? 0
          return (
            <motion.div
              key={idx}
              className="w-3 h-3 rounded-sm"
              title={`${key}: ${c}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.002, duration: 0.2 }}
              style={{ background: color(c) }}
            />
          )
        })}
      </div>
    </div>
  )
}
```

**Reasoning:** Lightweight SVG/div grid with staggered animation; mirrors GitHub calendar.

---

## Pages

### Home
- Fetch `useProfile` + `useContributions()`.
- Animate avatar and text entrance.
- Render `Heatmap` when data is ready; otherwise show `Skeleton`.

### Projects
- Fetch `useProjects()`.
- Display cards with hover micro‑interactions (scale/translate shadow).
- Sort by `featured` then by name (UI sorting mirrors backend).

### Timeline
- Fetch `useTimeline()`.
- Render items with date range and bullet points; animate list with staggered motion.

### Contact
- Form validation with **Zod** via `zodResolver`.
- On submit, call `useContact().mutateAsync`; show success banner.
- Respect `prefers-reduced-motion` by disabling non‑essential motion.

**Contact form schema:**
```ts
import { z } from 'zod'
export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(5).max(2000),
})
```

---

## Tailwind Setup
- Configure `content` to scan `index.html` and all `src/**/*.{ts,tsx}`.
- Global CSS (`styles/index.css`) must include Tailwind base/components/utilities.
- Use dark theme by default with neutral palette.

**Accessibility:** Keep color contrast AA+. Provide visible focus rings (`focus:outline-none focus:ring` utilities).

---

## Error & Loading States
Create a **Skeleton** component (shimmer block) and show it while data loads. Use `React.Suspense` if you convert hooks to suspense later, but for now, explicit loading states are required.

**Empty states:** When arrays are empty, render a friendly placeholder with a CTA to contact.

---

## Performance Guardrails
- Lazy‑load route components where beneficial (Vite dynamic import), but do **not** split tiny components.
- Animate only `opacity` and `transform` properties.
- Avoid re‑render loops by memoizing derived arrays with `useMemo` if needed.
- Add `rel="noreferrer"` on external links and `loading="lazy"` on images.

---

## Vite Config
- Port: `5173`
- Define env var passthrough for `VITE_API_BASE`.
- No custom aliases beyond default; keep config minimal.

---

## Commands
- `npm run dev` → start Vite on `http://localhost:5173`
- `npm run build` → typecheck and bundle
- `npm run preview` → preview production build

Build must succeed with zero TypeScript errors.

---

## Acceptance Criteria
- App starts and renders **Home**, **Projects**, **Timeline**, **Contact** routes.
- Data loads via React Query with caching and typed responses.
- Animations present: page transitions + micro‑interactions; obey `prefers-reduced-motion`.
- Contact form validates and submits; success UI shown.
- Heatmap displays 365 cells for the selected year when data exists.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 90 on desktop.
- The UI reads API base from `VITE_API_BASE` and defaults to `http://localhost:8080/api/v1`.

Follow these steps and produce the codebase accordingly.
