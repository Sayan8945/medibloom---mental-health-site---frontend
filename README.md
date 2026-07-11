# MediBloom — Frontend

React 18 single-page application for a mental wellness platform. Features an AI-powered chatbot, a 12-step mental health assessment survey, Google OAuth authentication, and a wellness history dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Forms | React Hook Form |
| HTTP client | Axios (with credentials) |
| Auth | Google OAuth via Passport (backend) |
| Email | EmailJS |
| AI Chatbot | Google Gemini API (proxied through the backend — see Backend/README.md) |
| Charts | Recharts |
| Notifications | react-hot-toast |
| Icons | react-icons |

---

## Project Structure

```
frontend/
├── public/
│   └── logo.png
├── src/
│   ├── assets/
│   ├── componenets/
│   │   ├── Navbar.jsx
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Resources.jsx
│   │   ├── WorkingSteps.jsx
│   │   ├── SurveySection.jsx
│   │   ├── Quotes.jsx
│   │   ├── Contact.jsx
│   │   ├── ChatAi.jsx
│   │   ├── Footer.jsx
│   │   ├── LoginModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ScrollToTop.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── quotes.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── Login.jsx
│   │   ├── SurveyPage.jsx
│   │   └── SurveyHistoryPage.jsx
│   ├── survey/
│   │   ├── components/
│   │   │   ├── SurveyLayout.jsx
│   │   │   ├── StepWelcome.jsx ... StepResults.jsx
│   │   │   └── ui/
│   │   ├── data/
│   │   │   └── surveySteps.js
│   │   └── hooks/
│   │       └── useSurvey.js
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started

### 1. Prerequisites

- Node.js >= 18
- Backend server running on port 5000 (see Backend/README.md)

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Environment variables

Create `.env` in the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Base URL of the Express backend |
| `VITE_EMAILJS_*` | EmailJS credentials used by the Contact form |

> The Gemini API key lives only in `Backend/.env` (`GEMINI_API_KEY`) — the
> frontend never talks to Gemini directly. All chat requests go through
> `POST /api/chat` on the backend.

### 4. Start dev server

```bash
npm run dev
```

Runs at `http://localhost:5173`

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## Routes

| Path | Component | Protected |
|---|---|---|
| `/` | HomePage | No |
| `/login` | Login | No |
| `/survey` | SurveyPage | Yes |
| `/history` | SurveyHistoryPage | Yes |
| `/analytics` | AnalyticsPage — wellness trends, comparisons, badges | Yes |

---

## Key Features

**Authentication**
- Google OAuth 2.0 via backend Passport.js
- Session restored on refresh via `/api/auth/me`
- ProtectedRoute blocks unauthenticated access
- Avatar dropdown in Navbar when signed in

**AI Chatbot**
- Floating button with pulse ring animation
- Talks to `POST /api/chat` on the backend, which proxies to Gemini
- For signed-in users, replies are personalized using a summary of their
  wellness history (toggle in the profile menu: "Personalized AI")
- Indicator in the chat header shows whether responses are personalized
- Smooth open/close with icon rotation

**Wellness Journey (/analytics)**
- Summary stats (current/best/average score, assessment count, improvement %)
- AI-generated insight cards and unlockable achievement badges
- Trend charts (Recharts) with date-range filters
- Latest vs. previous assessment comparison

**Light / Dark mode**
- Scoped to the survey and progress (analytics) pages only
- Toggle persists to `localStorage`, independent of the rest of the site

**Mental Health Survey**
- 12-step wizard with localStorage auto-save/resume
- Question types: Likert scale, emoji rating, chips, sliders, dropdowns
- Animated wellness report with SVG score ring and 6 dimension bars
- Submissions saved to MongoDB linked to authenticated user

**Survey History (/history)**
- Past submissions with overall score ring
- Expandable dimension breakdown per submission
- Coping habits shown as chips

**Design System**
- Colors: `#0e1122` (dark bg), `#06a055` (primary green)
- Fonts: DM Sans (body), Bricolage Grotesque (headings), Playfair Display (editorial), Lora (poem/quotes)
- Framer Motion for all animations and transitions

---

## Contact Form

Uses EmailJS. Service ID, Template ID, and Public Key are in `Contact.jsx`.
Move to env vars before production:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## Production

```bash
npm run build
```

Deploy `dist/` to Vercel, Netlify, or any static host.
`vercel.json` is included with SPA rewrite rules.
