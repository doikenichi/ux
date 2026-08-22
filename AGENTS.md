# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite-powered React/TypeScript prototype for the nutrition-tracking interface.

- `src/main.tsx` is the browser entry point; `src/app/App.tsx` contains the primary screens, state, and domain data.
- `src/app/components/ui/` contains reusable Radix/shadcn-style UI primitives. Extend these before introducing duplicate controls.
- `src/app/components/figma/` contains Figma-related helpers such as `ImageWithFallback.tsx`.
- `src/styles/` holds global CSS, Tailwind setup, fonts, and Material Design 3 theme tokens.
- `src/imports/` stores imported design assets, including SVGs.
- `guidelines/Guidelines.md` contains design-system guidance; `index.html`, `vite.config.ts`, and `postcss.config.mjs` define the app shell and tooling.

## Build, Test, and Development Commands

Run these from the repository root:

- `npm install` (or `pnpm install`) installs dependencies.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` creates the production bundle in `dist/` and is the required pre-PR smoke check.

There are currently no automated test or lint scripts in `package.json`. Validate UI changes manually in the dev server and always run the production build.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, double-quoted imports/strings, and TypeScript types for component props and domain data. Name React components and types in `PascalCase`, functions and variables in `camelCase`, and constants such as `FOOD_DB` or `GOAL_KCAL` in `UPPER_SNAKE_CASE`. Prefer existing Tailwind utility classes and CSS variables from `src/styles/theme.css`; keep Material 3 tokens and accessible labels consistent. Use the `@/` alias for imports from `src`.

## Testing Guidelines

No test framework or coverage threshold is configured. For changes, exercise the affected navigation and interaction flows manually, check responsive layouts, and verify keyboard/ARIA behavior where applicable. Add tests only after introducing a project-approved test runner and scripts.

## Commit & Pull Request Guidelines

History currently contains short initialization commits (for example, `commit inicial`), so no strict convention is established. Use concise imperative messages, ideally scoped (for example, `Add meal confirmation screen`). Pull requests should explain the user-visible change, list validation commands, link the relevant issue or design reference, and include screenshots or a short recording for visual changes.

## Configuration & Assets

Do not commit `.env` files or generated `dist/` output. Keep Figma asset resolution and the Vite plugin requirements intact when editing `vite.config.ts`; do not add CSS, TSX, or TS files to `assetsInclude`.
