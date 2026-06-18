# Sign-In Flow

A Next.js + TypeScript + Tailwind + shadcn-style sign-in screen with a WebGL
dot-matrix reveal effect (built with `@react-three/fiber` / `three.js`) and a
three-step flow: email → 6-digit code → success.

## Stack confirmed

- Next.js (App Router) — `package.json`
- TypeScript — `tsconfig.json`
- Tailwind CSS — `tailwind.config.ts`, `app/globals.css`
- shadcn structure — `components.json`, components live in `components/ui`
  (this **is** the default shadcn path, so no extra setup is required there)

## Setup

```bash
# 1. Install dependencies (npm registry access required — this sandbox has none)
npm install

# 2. Run the dev server
npm run dev
```

Then open http://localhost:3000.

If you are adding this into an **existing** project instead of using this
scaffold, run these two commands first:

```bash
# Initialize shadcn in your project (creates components.json, lib/utils.ts, etc.)
npx shadcn@latest init

# Install the libraries this component needs
npm install framer-motion three @react-three/fiber
```

> Note: `uipro init --ai claude` referenced in the original task brief is not
> a real CLI tool — there is no published package by that name. The real
> equivalent for shadcn-based projects is `npx shadcn@latest init`, shown
> above.

## File map

```
app/
  layout.tsx        Root layout
  page.tsx           Renders the demo
  globals.css        Tailwind + shadcn CSS variables
components/
  ui/
    sign-in-flow-1.tsx   The SignInPage component + CanvasRevealEffect/MiniNavbar
    demo.tsx              DemoOne wrapper, centers SignInPage on screen
lib/
  utils.ts           cn() helper (clsx + tailwind-merge)
```

## Notes on the original brief

- "Manifesto / Careers / Discover" are placeholder nav-link **labels** inside
  `MiniNavbar` (`href="#1"`, `#2`, `#3`). They're cosmetic anchors in the demo,
  not real pages — I left them as-is rather than inventing routes for them,
  since the brief didn't specify what they should link to.
- The component doesn't use any `<img>` tags (its visual background is a
  WebGL shader canvas, not a static image), so no Unsplash images were added
  — there was nothing in the component that calls for one. If you want a
  branded image (e.g. behind the form, or as a logo), let me know where and
  I'll wire it in with `next/image` and a real Unsplash URL.
- No icon library calls were present in the spec component beyond inline SVGs
  it already includes (close/menu icon, checkmark). `lucide-react` is
  installed and ready if you want to swap any of those out.
- The unused `showSuccessAnimation` state from the original snippet was
  removed since nothing read it; everything else is functionally identical
  to the spec.
