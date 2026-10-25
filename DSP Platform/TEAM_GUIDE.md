# DSP Learning Platform — Team Collaboration Guide

Welcome to the team! This guide explains the architecture, feature ownership, coding conventions, and workflow rules designed to keep development frictionless and merge-conflict-free.

---

## 🏗️ 1. Architecture & Folder Structure

We follow a **Feature-Based (Domain-Driven) Modular Architecture**. Every major functional domain of the platform lives in its own folder under `src/features/`.

```text
src/
├── components/                 # GLOBAL shared UI library (Figma Pages 00-03)
│   ├── common/                 # Primitives: Button, Badge, Card, ProgressBar
│   ├── forms/                  # Inputs: Input, Select, SearchBar, Checkbox
│   ├── feedback/               # Modals, Dialogs, Toasts, Skeletons, EmptyState
│   └── layout/                 # Shells: Sidebar, Header, MobileNav
│
├── layouts/                    # Top-level route wrappers
│   ├── AppLayout.jsx           # Main shell: Persistent desktop Sidebar + Top Header + Mobile Bottom Nav
│   ├── AuthLayout.jsx          # Centered card with DSP glowing brand background
│   └── ExamLayout.jsx          # Fullscreen, distraction-free assessment environment
│
├── routes/                     # Centralized React Router configuration
│   ├── AppRoutes.jsx           # Declarative route table
│   └── ProtectedRoute.jsx      # Future auth gate
│
├── features/                   # ⭐️ DEVELOPER WORKSPACE (Feature Modules)
│   ├── auth/                   # [Dev 1] Login, Signup, ForgotPassword, VerifyOtp, ResetPassword
│   ├── settings/               # [Dev 1] Profile, Security, Notifications
│   ├── dashboard/              # [Dev 2] Hero banner, Metrics cards, Active lecture teaser
│   ├── progress/               # [Dev 2] Syllabus completion, Topic mastery matrix
│   ├── lectures/               # [Dev 3] Lectures catalog, Video player, Notes, Slides
│   ├── sections/               # [Dev 3] Recitations, Lab assignments, Code starters
│   └── exams/                  # [Dev 4] Exam bank, Assessment runner, Results & review
│
├── services/                   # Shared mock data stores & API services
│   └── mockData/               # Master mock datasets for DSP courses, lectures, exams
│
├── styles/                     # Tailwind CSS entrypoint
│   └── index.css
│
├── App.jsx                     # Top-level BrowserRouter
└── main.jsx                    # React 19 root
```

---

## 👥 2. Feature Ownership & Team Division

To ensure independent work and prevent merge conflicts, each developer has full ownership of specific folders:

| Developer | Assigned Feature Folders | Routes Owned | Figma Page Reference |
|---|---|---|---|
| **Developer 1** | `src/features/auth/`<br>`src/features/settings/` | `/login`<br>`/signup`<br>`/forgot-password`<br>`/verify-otp`<br>`/reset-password`<br>`/settings` | **04** Login/Signup/Reset Password<br>**10** Profile/Settings |
| **Developer 2** | `src/features/dashboard/`<br>`src/features/progress/` | `/dashboard`<br>`/progress` | **05** Dashboard<br>**09** Progress Analytics |
| **Developer 3** | `src/features/lectures/`<br>`src/features/sections/` | `/lectures`<br>`/lectures/:lectureId`<br>`/sections`<br>`/sections/:sectionId` | **06** Lectures Catalog & Player<br>**07** Sections & Practical Labs |
| **Developer 4** | `src/features/exams/` | `/exams`<br>`/exams/:examId`<br>`/exams/:examId/results` | **08** Exam Bank & Assessment Runner |

---

## 룰 3. Golden Rules for Zero-Conflict Development

### Rule 1: Stay Inside Your Feature Directory
* All components specific to your feature should live in `src/features/<your-feature>/components/`.
* For example, Developer 4 puts `QuestionCard.jsx` and `QuestionPalette.jsx` in `src/features/exams/components/`, **NOT** in `src/components/common/`.

### Rule 2: Reuse Shared Components — Do NOT Duplicate
* Never reinvent a `Button`, `Input`, `Card`, or `Badge`.
* Always import existing primitives from `src/components/common` or `src/components/forms`.
* If a shared component needs an enhancement or additional variant, discuss with Developer 1 (Design System Lead) before modifying it.

### Rule 3: Use Design Tokens via Tailwind Classes
* Always use the tokens defined in `tailwind.config.js`:
  * Brand Colors: `bg-brand-600`, `text-brand-700`, `bg-brand-50`
  * Accent Colors: `bg-accent-500`, `text-accent-600`
  * Slate Neutrals: `text-slate-900`, `text-slate-500`, `border-slate-200`
  * Shadows: `shadow-card`, `shadow-card-hover`, `shadow-elevated`
  * Radius: `rounded-card`, `rounded-xl`, `rounded-2xl`
* Avoid hardcoded hex colors (`#4f46e5`) in component styles.

### Rule 4: Data Isolation
* Put your feature's mock datasets and local helper functions inside your feature directory (e.g. `src/features/lectures/lecturesService.js`).
* If another feature needs your data, expose it cleanly via an export from your service file.

### Rule 5: Responsive Layouts (Figma Page 11)
* Remember that Page 11 is not a route — it defines mobile layouts.
* Use responsive Tailwind prefixes (`sm:`, `md:`, `lg:`) on all screens.
* Test your screens at `375px` (mobile), `768px` (tablet), and `1280px` (desktop).

---

## 💻 4. Developer Workflows

### How to work on your assigned feature:
1. Create a feature branch:
   ```bash
   git checkout -b feature/lectures-player
   ```
2. Navigate to your assigned folder:
   ```bash
   cd src/features/<your-feature>
   ```
3. Build your sub-components in `components/` and your page views in `pages/`.
4. Import shared primitives:
   ```jsx
   import Button from '../../../components/common/Button';
   import Card, { CardBody } from '../../../components/common/Card';
   import Badge from '../../../components/common/Badge';
   ```
5. Test your route in your browser (e.g., `http://localhost:5173/lectures/1`).
6. Push your branch and open a PR without touching other developers' files!

---

## 🛠️ 5. Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server with Hot Module Replacement |
| `npm run build` | Builds optimized production bundle |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs Oxlint to check code quality |
