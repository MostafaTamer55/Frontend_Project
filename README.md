# DSP Learning Platform

An interactive, responsive digital learning platform for **Digital Signal Processing (DSP)** academic courses and laboratory sessions. Built with **React + Vite + Tailwind CSS + React Router**, structured for concurrent team development.

---

## 🎨 Figma Architecture & Source of Truth

The design is governed by the 12-page Figma specification:

### 1. Reference Pages (Design System — NOT website routes)
* **00 Cover & Principles**: Visual language, brand identity, and educational ethos.
* **01 Foundations**: Core design tokens (Indigo/Slate palette, Inter typography, 4px/8px spatial rhythm, shadows).
* **02 Components**: Standard UI primitives (Buttons, Inputs, Cards, Badges, Tabs, Modals).
* **03 Usage Notes**: Accessibility contrast (WCAG AA), interaction states, and responsive rules.

### 2. Application Screen Pages (Implemented Routes)
* **04 Login/Signup/Reset Password**: Five distinct auth screens (`/login`, `/signup`, `/forgot-password`, `/verify-otp`, `/reset-password`).
* **05 Dashboard**: Student overview hub with metrics, active course progress, and upcoming deadlines (`/dashboard`).
* **06 Lectures**: Comprehensive lecture catalog (`/lectures`) and interactive lecture player with notes (`/lectures/:lectureId`).
* **07 Sections**: Practical recitation & MATLAB/Python laboratory catalog (`/sections`) and assignment workspace (`/sections/:sectionId`).
* **08 Exam Bank**: Assessment repository (`/exams`), distraction-free quiz runner (`/exams/:examId`), and detailed score review (`/exams/:examId/results`).
* **09 Progress**: Learning analytics, radar topic mastery matrix, and syllabus progress tracking (`/progress`).
* **10 Profile/Settings**: Personal credentials, security settings, and notifications (`/settings`).
* **11 Mobile**: Responsive viewport rules (bottom nav bar, collapsible sidebar drawer, touch targets) across all screens.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js** v18+ (tested on v24)
* **npm** v9+

### Installation & Execution
```bash
# Clone or navigate to the project directory
cd "c:\DSP Platform"

# Install dependencies (already installed)
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

## 🧭 Application Route Map

| Path | Layout | Screen Name | Figma Source | Owner |
|---|---|---|---|---|
| `/login` | `AuthLayout` | Login Screen | Page 04 | Dev 1 |
| `/signup` | `AuthLayout` | Registration Screen | Page 04 | Dev 1 |
| `/forgot-password` | `AuthLayout` | Password Recovery | Page 04 | Dev 1 |
| `/verify-otp` | `AuthLayout` | 6-Digit Verification Code | Page 04 | Dev 1 |
| `/reset-password` | `AuthLayout` | Set New Password | Page 04 | Dev 1 |
| `/dashboard` | `AppLayout` | Student Dashboard & Metrics | Page 05 | Dev 2 |
| `/lectures` | `AppLayout` | Lectures Catalog & Filters | Page 06 | Dev 3 |
| `/lectures/:lectureId` | `AppLayout` | Video Player & Interactive Notes | Page 06 | Dev 3 |
| `/sections` | `AppLayout` | Practical Recitations & Labs | Page 07 | Dev 3 |
| `/sections/:sectionId` | `AppLayout` | Lab Workspace & Code Starter | Page 07 | Dev 3 |
| `/exams` | `AppLayout` | Exam Bank & Quizzes | Page 08 | Dev 4 |
| `/exams/:examId` | `ExamLayout` | Distraction-Free Test Runner | Page 08 | Dev 4 |
| `/exams/:examId/results` | `AppLayout` | Results & Answer Review | Page 08 | Dev 4 |
| `/progress` | `AppLayout` | Topic Mastery & Progress Charts | Page 09 | Dev 2 |
| `/settings` | `AppLayout` | Profile & Account Preferences | Page 10 | Dev 1 |
| `*` | Standard | 404 Not Found | — | Shared |

---

## 👥 Team Collaboration Guide

For detailed feature boundaries, coding standards, and step-by-step developer instructions, see [TEAM_GUIDE.md](./TEAM_GUIDE.md).
