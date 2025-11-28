# Collectoid UI Prototypes

A Next.js project for prototyping and showcasing UI concepts for the Collectoid clinical trial data access platform.

> **Note:** This project contains mocked UIs only - no backend functionality. It's designed for rapid UX exploration and stakeholder demonstrations.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the prototype index.

## Project Structure

This project is organized around **workstreams** - distinct prototypes or proof-of-concepts that can be developed independently. Each workstream has its own components to ensure isolation.

```
/app
├── page.tsx                    # Landing page - index of all workstreams
├── layout.tsx                  # Root layout (includes IterationSwitcher)
├── globals.css                 # Global styles & CSS variables
│
├── ux/                         # WORKSTREAM: UX Theme Explorations
│   ├── _components/            # UX-specific components (layouts, sidebars, etc.)
│   └── [1-14]/                 # 14 different visual styling concepts
│       ├── home/page.tsx
│       ├── management/page.tsx
│       └── search/page.tsx
│
└── collectoid/                 # WORKSTREAM: DCM Proof of Concept
    ├── _components/            # POC-specific components (isolated from UX)
    │   ├── color-context.tsx   # Color scheme provider
    │   ├── notification-context.tsx
    │   ├── sidebar.tsx
    │   ├── top-bar.tsx
    │   ├── notification-panel.tsx
    │   ├── dev-widget.tsx
    │   └── index.ts            # Barrel export
    ├── layout.tsx              # POC layout
    ├── dcm/                    # Data Collection Manager flows
    │   ├── create/             # Multi-step collection creation wizard
    │   ├── progress/           # Progress tracking & discussion
    │   └── propositions/       # Proposition review
    ├── collections/            # Collection browsing
    ├── discover/               # Data discovery (inc. AI)
    ├── requests/               # Access request management
    ├── my-requests/            # User's request dashboard
    └── notifications/          # Notification center

/components
├── ui/                         # shadcn/ui primitives - DO NOT MODIFY
└── iteration-switcher.tsx      # Global component (used by root layout)

/lib
├── dcm-mock-data.ts            # All mock data & helper functions
├── notification-helpers.ts     # Notification utilities
└── utils.ts                    # Tailwind cn() utility

/docs                           # Feature specs & requirements
└── collectoid-poc-requirements.md  # Main requirements doc (v2.1)

/hooks                          # Custom React hooks
```

## Component Organization Rules

### DO NOT modify `/components/ui/`
These are shadcn/ui components installed from the registry. If you need to customize them, create a wrapper in your workstream's `_components/` directory.

### Each workstream has isolated components
Components live in `_components/` directories within each workstream:
- `/app/ux/_components/` - UX iteration components
- `/app/collectoid/_components/` - Collectoid POC components

### No shared components between workstreams
Each POC/workstream should be self-contained. If you need a component similar to another workstream, **copy it** into your workstream's `_components/` directory. This allows each workstream to evolve independently.

### Global components stay in `/components/`
Only truly global components (like `iteration-switcher.tsx`) should be in the root `/components/` directory.

## Workstreams

### 1. UX Theme Explorations (`/ux/`)

14 different visual styling concepts exploring various aesthetics:

| # | Name | Description |
|---|------|-------------|
| 1 | Professional Portal | Clean sidebar nav, neutral palette |
| 2 | Bold & Geometric | AZ burgundy/gold, brutal shadows |
| 3 | Data-Focused Professional | Table-based, information-dense |
| 4 | AI-Enhanced Data Explorer | Hybrid of 1 & 3 with AI hero |
| 5 | Friendly Teal Explorer | Warm teal/coral variant of 4 |
| 6 | Modern Glassmorphism | Purple gradients, glass effects |
| 7 | Dark Cyber Command | Neon emerald/cyan dark theme |
| 8 | Minimal Zen | White space, light typography |
| 9 | Vibrant Energy | Bold colors, emoji accents |
| 10 | Executive Suite | Gold accents, serif typography |
| 11 | Premium Vibrant | Executive + Vibrant hybrid |
| 12 | Zen Explorer | Zen + AI hero + color picker |
| 13 | Zen Dual Nav | Zen + sidebar + top bar |
| 14 | Garden Zen | Nature-inspired greens/teals |

Use the **IterationSwitcher** (bottom-right floating widget) to quickly switch between themes while staying on the same page.

### 2. DCM POC (`/collectoid/`)

Full proof-of-concept for the Data Collection Manager workflow. Built on a Zen aesthetic with dynamic color schemes.

Key features:
- Multi-step collection creation wizard
- AI-powered category suggestions
- Dataset filtering with access provisioning breakdown
- Progress tracking with discussion threads
- End-user discovery and request flows

## Adding a New Workstream

When adding a new prototype or POC:

1. **Create a new directory** under `/app/`:
   ```
   /app/my-new-poc/
   ├── _components/         # POC-specific components
   │   ├── sidebar.tsx
   │   ├── layout-wrapper.tsx
   │   └── index.ts         # Barrel export
   ├── layout.tsx           # POC layout (imports from _components)
   └── page.tsx             # Entry point
   ```

2. **Add to the landing page** (`/app/page.tsx`):
   - Add a card in the "Proof of Concepts" section for full POCs
   - Or add to the UX themes array if it's a styling variation

3. **Create POC-specific components**:
   - Place all components in `/app/my-new-poc/_components/`
   - Create an `index.ts` barrel export for clean imports
   - Copy components from other workstreams if needed (don't share)

4. **Add mock data**:
   - For small amounts: add to existing `lib/dcm-mock-data.ts`
   - For large amounts: create `lib/my-poc-mock-data.ts`

5. **Document the workstream**:
   - Add requirements/specs to `/docs/my-poc-*.md`

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Lucide** icons

## Key Conventions

### Layouts & Navigation

- **UX variations 1-11**: Use layouts from `/app/ux/_components/`
- **UX variations 12-14**: Have explicit layouts with `ColorSchemeProvider`
- **POCs**: Should have their own `layout.tsx` using components from their `_components/` directory

### Color Schemes

UX 12-14 and the Collectoid POC use a dynamic color scheme system with 7 palettes:
- Coral, Purple, Teal, Blue, Emerald, Amber, AZ Brand

The `ColorSchemeProvider` injects CSS variables at runtime. Use the dev widget (bottom-left) to switch schemes.

### Mock Data

All mock data lives in `/lib/dcm-mock-data.ts`. Key exports:
- `mockDatasets`, `mockCollections`, `mockUsers`
- `dataCategories` - 30+ category taxonomy
- Helper functions: `filterDatasets()`, `extractKeywordsAndSuggestCategories()`, etc.

### Import Patterns

For POC components, use relative imports from the `_components` directory:

```tsx
// In /app/collectoid/layout.tsx
import { ColorSchemeProvider, Sidebar, TopBar } from "./_components"

// In /app/collectoid/some-page/page.tsx
import { useColorScheme } from "@/app/collectoid/_components"
```

For shadcn/ui components, always use the `@/components/ui/` path:

```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

## Documentation

Detailed specs and requirements are in `/docs/`:
- `collectoid-poc-requirements.md` - Main requirements (v2.1)
- `dcm-*.md` - DCM-specific specs
- `end-user-*.md` - End-user flow specs

## Tips for Claude Sessions

When starting a new Claude session on this project:

1. **Read this README first** to understand the structure
2. **Check `/docs/collectoid-poc-requirements.md`** for detailed requirements
3. **Use the landing page** (`/app/page.tsx`) to understand what workstreams exist
4. **For UX work**: The UX themes are in `/app/ux/[1-14]/`, components in `/app/ux/_components/`
5. **For POC work**: The main POC is in `/app/collectoid/`, components in `/app/collectoid/_components/`
6. **Mock data**: Everything is in `/lib/dcm-mock-data.ts`

When adding new features:
- **Never modify `/components/ui/`** - these are shadcn components
- **Keep components in the workstream's `_components/` directory**
- **Copy, don't share** components between workstreams
- Follow the existing patterns in similar files
- Add mock data to support new UI elements
- Update this README if adding a new workstream
