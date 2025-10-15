# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Build and run the application:
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run start      # Start production server
```

Code quality checks:
```bash
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Architecture Overview

This is a Remix.js full-stack application using:
- **Remix v2** with Vite for build tooling
- **React 18** with TypeScript
- **Tailwind CSS** with custom animations
- **shadcn/ui pattern** for component architecture

### Key Directories

- `app/routes/` - File-based routing, each file is a route
- `app/components/` - React components, with `ui/` for primitives
- `app/lib/` - Utility functions (e.g., `cn()` for className merging)
- `public/` - Static assets including videos and icons

### Important Patterns

1. **Path aliases**: Use `~/` to import from the `app/` directory
   ```typescript
   import { Button } from "~/components/ui/button"
   ```

2. **Component variants**: Uses `class-variance-authority` for component styling
   ```typescript
   const buttonVariants = cva("base-classes", {
     variants: { size: { default: "...", sm: "..." } }
   })
   ```

3. **Tailwind utilities**: Use the `cn()` helper from `~/lib/utils` to merge classes
   ```typescript
   className={cn("base-class", conditional && "conditional-class")}
   ```

4. **Route modules**: Export default component, and optionally `loader`, `action`, `meta`
   ```typescript
   export const meta: MetaFunction = () => [{ title: "..." }]
   export default function RouteName() { ... }
   ```

## TypeScript Configuration

- Strict mode is enabled
- Path alias `~/*` maps to `./app/*`
- Separate tsconfig files for different environments (app, node, vite)

## Component Development

When creating new components:
1. Place UI primitives in `app/components/ui/`
2. Use the existing Button component pattern as reference
3. Apply Tailwind classes with the `cn()` utility
4. Follow the component variant pattern with `cva()`

## Styling Guidelines

- Use Tailwind CSS utility classes
- CSS variables are defined in `app/tailwind.css`
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Animations: Use `tailwindcss-animate` plugin classes

## Notes

- No testing framework is currently configured
- Videos are stored as `.mov` files in `public/`
- The application includes Japanese content (活性化サーバー)
- ESLint is configured but no code formatter (Prettier) is set up