# DSP project notes

## Commands
- `npm install` installs dependencies; `npm run dev` starts the Vite development server.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- `pnpm install --frozen-lockfile` and the equivalent `pnpm` scripts are also supported.

## Structure
- `src/main.tsx` is the React entry point.
- `src/App.tsx` contains the application routing and screen composition.
- `src/auth/` and `src/api/auth.ts` implement the authentication experience and API integration.
- `src/index.css` contains the global styles.
- `vite.config.ts` configures Vite, React, Tailwind CSS, and the `@` alias.
