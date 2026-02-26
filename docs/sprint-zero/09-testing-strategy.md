# 09 - Testing Strategy

**Document ID:** SPRINT-ZERO-09
**Version:** 1.0
**Date:** 2026-02-06
**Author:** Keith Hayes (Lead Software Engineer)
**Status:** Draft

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Testing Pyramid](#2-testing-pyramid)
3. [Unit Testing (Vitest)](#3-unit-testing-vitest)
4. [Component Testing (React Testing Library)](#4-component-testing-react-testing-library)
5. [Integration Testing](#5-integration-testing)
6. [E2E Testing (Playwright)](#6-e2e-testing-playwright)
7. [Accessibility Testing](#7-accessibility-testing)
8. [Performance Testing](#8-performance-testing)
9. [Security Testing](#9-security-testing)
10. [Test Data Management](#10-test-data-management)
11. [CI/CD Integration](#11-cicd-integration)
12. [Coverage Targets & Quality Gates](#12-coverage-targets--quality-gates)
13. [Test Environment Strategy](#13-test-environment-strategy)
14. [Open Questions](#14-open-questions)

---

## 1. Testing Philosophy

### Principles

1. **Shift-left**: Catch defects as early as possible. Unit tests run in milliseconds; E2E tests run in minutes. Prefer the fastest feedback loop that gives confidence.
2. **Test behaviour, not implementation**: Tests should assert what the system does, not how it does it. Refactoring should not break tests.
3. **Confidence over coverage**: 80% coverage of critical paths is better than 95% coverage of trivial code. Focus test investment on business logic, access control, and audit trail.
4. **Reproducible and isolated**: Every test must produce the same result regardless of execution order or environment. No shared mutable state between tests.
5. **Clinical data sensitivity**: Test fixtures must never contain real patient data, real study identifiers, or real user PRIDs. All test data is synthetic.

### Why We Test

Collectoid manages access to **strictly confidential clinical trial data**. Defects in access control, approval workflows, or audit trails have regulatory and compliance consequences. The testing strategy is designed to provide high confidence in:

- **Access control correctness**: Users only see and access data they're authorised for
- **Approval workflow integrity**: Multi-TA "all or nothing" logic is atomic and correctly enforced
- **Audit trail completeness**: Every state change is recorded immutably
- **Data accuracy**: External API data (AZCT, Cornerstone, Collibra) is correctly cached and displayed
- **User experience**: Critical workflows (collection creation, access requests) work reliably across browsers

---

## 2. Testing Pyramid

```
                    ┌─────────┐
                    │  E2E    │  ~20 tests
                    │Playwright│  Slowest, highest confidence
                    ├─────────┤
                  ┌─┤ Integr. ├─┐  ~80 tests
                  │ │ API/DB  │ │  Medium speed
                  ├─┤         ├─┤
                ┌─┤ │Component│ ├─┐  ~150 tests
                │ │ │  RTL    │ │ │  Fast
                ├─┤ │         │ ├─┤
              ┌─┤ │ │  Unit   │ │ ├─┐  ~300+ tests
              │ │ │ │  Vitest │ │ │ │  Fastest
              └─┴─┴─┴─────────┴─┴─┴─┘
```

| Level | Tool | Count Target | Execution Time | Runs On |
|-------|------|-------------|----------------|---------|
| **Unit** | Vitest | 300+ | <30 seconds | Every PR |
| **Component** | React Testing Library + Vitest | 150+ | <60 seconds | Every PR |
| **Integration** | Vitest + test database | 80+ | <3 minutes | Every PR |
| **E2E** | Playwright | 20+ | <10 minutes | Merge to main |
| **Accessibility** | axe-core + Playwright | 15+ | <5 minutes | Merge to main |
| **Performance** | Lighthouse CI | 5 pages | <5 minutes | Nightly |
| **Security** | OWASP ZAP + Snyk | Full scan | <15 minutes | Nightly |

---

## 3. Unit Testing (Vitest)

### What to Unit Test

| Module | Key Functions to Test | Priority |
|--------|----------------------|----------|
| **Request matching** | `performSmartMatching()`, `detectIntentConflicts()`, `calculateEstimatedWeeks()`, `findSimilarDatasets()` | P0 |
| **AoT conflict detection** | `detectAoTConflicts()`, `suggestAoT()` | P0 |
| **Category suggestion** | `extractKeywordsAndSuggestCategories()` | P1 |
| **Analytics calculations** | `calculateDemandMetrics()`, `calculateAggregateStats()`, `generateCollectionSuggestions()` | P1 |
| **Validation schemas** | All Zod schemas for API inputs | P0 |
| **Permission checks** | RBAC permission evaluation functions | P0 |
| **Data transformers** | AZCT → Dataset mapping, Cornerstone → TrainingStatus mapping | P1 |
| **Notification helpers** | Filtering, sorting, grouping logic | P2 |
| **Utility functions** | Date formatting, string manipulation, pagination helpers | P2 |

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['**/e2e/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['lib/**', 'server/**', 'app/**/actions.ts'],
      exclude: ['**/*.test.*', '**/test-utils/**'],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
      },
    },
  },
})
```

### File Structure

Tests are **co-located** with source files:

```
lib/
├── request-matching.ts
├── request-matching.test.ts        ← unit test
├── dcm-mock-data.ts
├── analytics-helpers.ts
├── analytics-helpers.test.ts       ← unit test
server/
├── routers/
│   ├── collections.ts
│   ├── collections.test.ts         ← integration test
```

### Naming Conventions

```typescript
describe('performSmartMatching', () => {
  it('categorises dataset as "immediate" when 80%+ already open and no intent conflicts', () => { ... })
  it('categorises dataset as "conflict" when AI research intent conflicts with restrictML flag', () => { ... })
  it('adds 6 weeks to timeline when AI/ML intent has conflict', () => { ... })
  it('returns empty similar datasets when no better alternatives exist', () => { ... })
})
```

Pattern: `it('[action] when [condition]')` — describes behaviour, not implementation.

### Mocking Strategy

| Dependency | Mock Approach | Justification |
|-----------|---------------|---------------|
| External APIs (AZCT, Cornerstone) | MSW (Mock Service Worker) | Intercepts HTTP; tests real fetch code |
| Database (Drizzle) | Test database (Docker) | Real SQL execution; catches query bugs |
| Auth (Auth.js) | `vi.mock()` with session factory | Fast; auth logic tested separately |
| Redis | `ioredis-mock` | In-memory; no Docker dependency for unit tests |
| `Date.now()` / timers | `vi.useFakeTimers()` | Deterministic time-dependent tests |
| Environment variables | `vi.stubEnv()` | Test feature flags, config variations |

### Example Test Pattern

```typescript
// lib/request-matching.test.ts
import { describe, it, expect } from 'vitest'
import { performSmartMatching, detectIntentConflicts } from './request-matching'
import { createMockDataset, createMockIntent } from '@/tests/factories'

describe('detectIntentConflicts', () => {
  it('returns AI research conflict when dataset has restrictML and intent includes aiResearch', () => {
    const dataset = createMockDataset({
      aotMetadata: { restrictML: true, restrictPublication: false, restrictSoftwareDev: false },
    })
    const intent = createMockIntent({
      beyondPrimaryUse: { aiResearch: true, softwareDevelopment: false },
    })

    const conflicts = detectIntentConflicts(dataset, intent)

    expect(conflicts).toHaveLength(1)
    expect(conflicts[0]).toMatchObject({
      intentField: 'aiResearch',
      intentLabel: 'AI/ML Research',
      addedWeeks: 6,
    })
  })

  it('returns no conflicts when intent matches dataset permissions', () => {
    const dataset = createMockDataset({
      aotMetadata: { restrictML: false, restrictPublication: false, restrictSoftwareDev: false },
    })
    const intent = createMockIntent({
      beyondPrimaryUse: { aiResearch: true, softwareDevelopment: false },
    })

    const conflicts = detectIntentConflicts(dataset, intent)

    expect(conflicts).toHaveLength(0)
  })
})
```

---

## 4. Component Testing (React Testing Library)

### What to Test

| Category | Examples | Priority |
|----------|----------|----------|
| **User interactions** | Button clicks trigger correct actions, form submissions validate inputs | P0 |
| **Conditional rendering** | Access badges show correct status, approval buttons hidden for non-approvers | P0 |
| **Form validation** | Required fields, character limits, invalid input feedback | P1 |
| **Error states** | API failure messages, empty states, loading skeletons | P1 |
| **Accessibility** | ARIA labels, role attributes, focus management | P1 |
| **Data display** | Collection cards render correct metadata, dataset tables show correct columns | P2 |

### What NOT to Test

- Internal component state (`useState` values)
- CSS styles or class names
- Implementation details (which function was called internally)
- Third-party component internals (shadcn/ui behaviour)
- Snapshot tests (brittle, low value)

### Testing Patterns

#### Server Components vs Client Components

```typescript
// Server Components: Test the rendered output
// Use async component rendering since Server Components are async
import { render } from '@testing-library/react'
import CollectionCard from './collection-card'

it('renders collection name and dataset count', async () => {
  const collection = createMockCollection({ name: 'Oncology Phase III', datasetCount: 12 })

  const { getByText } = render(await CollectionCard({ collection }))

  expect(getByText('Oncology Phase III')).toBeInTheDocument()
  expect(getByText('12 datasets')).toBeInTheDocument()
})
```

```typescript
// Client Components: Test interactions
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategorySelector from './category-selector'

it('adds category when user clicks suggestion chip', async () => {
  const onSelect = vi.fn()
  render(<CategorySelector suggestions={mockSuggestions} onSelect={onSelect} />)

  await userEvent.click(screen.getByRole('button', { name: 'Oncology' }))

  expect(onSelect).toHaveBeenCalledWith('cat-onc')
})
```

#### renderWithProviders Utility

```typescript
// tests/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

interface ExtendedRenderOptions extends RenderOptions {
  session?: Session | null
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: React.ReactElement,
  { session = mockSession, queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }), ...options }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    )
  }
  return render(ui, { wrapper: Wrapper, ...options })
}
```

#### Accessibility Assertions

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = renderWithProviders(<CollectionBrowser />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## 5. Integration Testing

### API Route / tRPC Procedure Testing

Test tRPC procedures with a real test database to catch SQL/query issues:

```typescript
// server/routers/collections.test.ts
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { createTestCaller } from '@/tests/trpc-test-utils'
import { resetDatabase, seedTestData } from '@/tests/db-utils'

describe('collections router', () => {
  let caller: ReturnType<typeof createTestCaller>

  beforeEach(async () => {
    await resetDatabase()
    await seedTestData()
    caller = createTestCaller({ userId: 'test-dcm-user', role: 'dcm' })
  })

  afterAll(async () => {
    await resetDatabase()
  })

  describe('collections.list', () => {
    it('returns paginated collections for authenticated user', async () => {
      const result = await caller.collections.list({ limit: 10, cursor: undefined })

      expect(result.items).toHaveLength(10)
      expect(result.nextCursor).toBeDefined()
      expect(result.items[0]).toHaveProperty('id')
      expect(result.items[0]).toHaveProperty('name')
      expect(result.items[0]).toHaveProperty('status')
    })

    it('filters collections by therapeutic area', async () => {
      const result = await caller.collections.list({ therapeuticArea: 'ONC' })

      result.items.forEach(item => {
        expect(item.therapeuticAreas).toContain('ONC')
      })
    })

    it('denies access for unauthenticated caller', async () => {
      const unauthCaller = createTestCaller({ userId: null })

      await expect(unauthCaller.collections.list({}))
        .rejects.toThrow('UNAUTHORIZED')
    })
  })

  describe('collections.create', () => {
    it('creates a collection and records audit event', async () => {
      const input = {
        name: 'Test Oncology Collection',
        intent: 'Retrospective analysis of ctDNA biomarkers',
        therapeuticAreas: ['ONC'],
        categoryIds: ['cat-onc', 'cat-sdtm-dm'],
      }

      const result = await caller.collections.create(input)

      expect(result.id).toBeDefined()
      expect(result.status).toBe('draft')
      expect(result.version).toBe(1)

      // Verify audit event was recorded
      const auditEvents = await getAuditEvents({ entityId: result.id })
      expect(auditEvents).toHaveLength(1)
      expect(auditEvents[0].action).toBe('collection.created')
    })
  })
})
```

### Database Integration Tests

```typescript
// tests/db/audit-triggers.test.ts
describe('audit trail immutability', () => {
  it('prevents UPDATE on audit_events table', async () => {
    const event = await insertAuditEvent({ action: 'collection.created', entityId: 'test-id' })

    await expect(
      db.execute(sql`UPDATE audit_events SET action = 'modified' WHERE id = ${event.id}`)
    ).rejects.toThrow(/audit_events are immutable/)
  })

  it('prevents DELETE on audit_events table', async () => {
    const event = await insertAuditEvent({ action: 'collection.created', entityId: 'test-id' })

    await expect(
      db.execute(sql`DELETE FROM audit_events WHERE id = ${event.id}`)
    ).rejects.toThrow(/audit_events are immutable/)
  })
})
```

### External API Contract Testing

Use **Pact** or recorded response fixtures to verify API client behaviour:

```typescript
// tests/clients/azct-client.test.ts
describe('AZCTClient', () => {
  // MSW intercepts HTTP calls to AZCT API
  beforeAll(() => {
    server.use(
      http.get('https://azct-api.az.com/v1/studies', () => {
        return HttpResponse.json(azctStudiesFixture)
      }),
      http.get('https://azct-api.az.com/v1/studies/:dcode', ({ params }) => {
        const study = azctStudiesFixture.find(s => s.dcode === params.dcode)
        if (!study) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
        return HttpResponse.json(study)
      })
    )
  })

  it('maps AZCT study response to Dataset entity', async () => {
    const client = new AZCTClient({ baseUrl: 'https://azct-api.az.com/v1' })
    const datasets = await client.fetchStudies({ therapeuticArea: 'ONC' })

    expect(datasets[0]).toMatchObject({
      code: expect.stringMatching(/^DCODE-/),
      therapeuticArea: expect.arrayContaining(['ONC']),
      phase: expect.any(String),
      status: expect.any(String),
    })
  })

  it('handles rate limiting with retry', async () => {
    let attempts = 0
    server.use(
      http.get('https://azct-api.az.com/v1/studies', () => {
        attempts++
        if (attempts <= 2) return HttpResponse.json({}, { status: 429 })
        return HttpResponse.json(azctStudiesFixture)
      })
    )

    const client = new AZCTClient({ baseUrl: 'https://azct-api.az.com/v1' })
    const datasets = await client.fetchStudies({})

    expect(attempts).toBe(3)
    expect(datasets).toHaveLength(azctStudiesFixture.length)
  })
})
```

---

## 6. E2E Testing (Playwright)

### Critical User Journeys

| # | Journey | Steps | Priority |
|---|---------|-------|----------|
| 1 | **Login via Azure AD** | Navigate → redirect to Azure AD → authenticate → return to app → verify session | P0 |
| 2 | **Collection creation (happy path)** | Intent → Categories → Filters → Activities → Agreements → Details → Review → Publish | P0 |
| 3 | **Browse collections** | Navigate → filter by TA → search by name → view detail → see dataset list | P0 |
| 4 | **Access request** | Select collection → declare intent → review matching → submit request | P0 |
| 5 | **Approval workflow** | Login as approver → view pending → approve → verify status change → verify audit entry | P0 |
| 6 | **Multi-TA rejection** | Login as TA lead → reject → verify all TAs blocked ("all or nothing") | P1 |
| 7 | **Collection versioning** | Edit collection → save → verify new version → view version history | P1 |
| 8 | **Notification flow** | Trigger approval → verify notification appears → mark as read | P1 |
| 9 | **Discovery search** | Navigate to discover → enter query → verify results → click through to collection | P1 |
| 10 | **Logout** | Click logout → verify session cleared → verify redirect to login | P0 |
| 11 | **RBAC enforcement** | Login as Data Consumer → verify cannot access DCM pages → verify cannot approve | P0 |
| 12 | **Audit trail** | Perform action → navigate to audit log → verify entry exists with correct details | P1 |

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'edge', use: { channel: 'msedge' } },
    { name: 'safari', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Page Object Model

```typescript
// e2e/pages/collection-wizard.page.ts
import { Page, Locator } from '@playwright/test'

export class CollectionWizardPage {
  readonly page: Page
  readonly intentInput: Locator
  readonly nextButton: Locator
  readonly stepIndicator: Locator

  constructor(page: Page) {
    this.page = page
    this.intentInput = page.getByRole('textbox', { name: /intent|describe/i })
    this.nextButton = page.getByRole('button', { name: /next|continue/i })
    this.stepIndicator = page.getByTestId('step-indicator')
  }

  async goto() {
    await this.page.goto('/collectoid/dcm/create')
  }

  async enterIntent(text: string) {
    await this.intentInput.fill(text)
  }

  async nextStep() {
    await this.nextButton.click()
  }

  async getCurrentStep(): Promise<number> {
    const text = await this.stepIndicator.textContent()
    return parseInt(text?.match(/Step (\d+)/)?.[1] || '0')
  }
}
```

### Test Data Management for E2E

```typescript
// e2e/fixtures/auth.ts
import { test as base } from '@playwright/test'

// Pre-authenticated test users
export const test = base.extend<{ dcmPage: Page; consumerPage: Page }>({
  dcmPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'e2e/.auth/dcm-user.json' })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },
  consumerPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'e2e/.auth/consumer-user.json' })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },
})
```

### Visual Regression

```typescript
// e2e/visual/collection-browser.spec.ts
import { test, expect } from '@playwright/test'

test('collection browser matches baseline', async ({ page }) => {
  await page.goto('/collectoid/collections')
  await page.waitForLoadState('networkidle')

  await expect(page).toHaveScreenshot('collection-browser.png', {
    maxDiffPixelRatio: 0.01,
    mask: [page.locator('[data-testid="timestamp"]')], // Mask dynamic content
  })
})
```

---

## 7. Accessibility Testing

### Automated Testing (axe-core)

Integrated into both component tests and E2E tests:

```typescript
// Component level (via jest-axe)
import { axe, toHaveNoViolations } from 'jest-axe'

it('collection card has no a11y violations', async () => {
  const { container } = renderWithProviders(<CollectionCard collection={mockCollection} />)
  expect(await axe(container)).toHaveNoViolations()
})

// E2E level (via @axe-core/playwright)
import AxeBuilder from '@axe-core/playwright'

test('collections page passes WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/collectoid/collections')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
```

### WCAG 2.1 AA Compliance Checklist

| Criterion | Description | Test Approach |
|-----------|-------------|---------------|
| 1.1.1 Non-text Content | All images have alt text | axe-core automated |
| 1.3.1 Info and Relationships | Semantic HTML, ARIA landmarks | axe-core + manual review |
| 1.4.3 Contrast (Minimum) | 4.5:1 for normal text, 3:1 for large | axe-core automated |
| 1.4.11 Non-text Contrast | 3:1 for UI components | axe-core + manual |
| 2.1.1 Keyboard | All functionality accessible via keyboard | Playwright keyboard tests |
| 2.4.3 Focus Order | Logical tab order | Manual + Playwright |
| 2.4.7 Focus Visible | Visible focus indicator | Visual inspection |
| 4.1.2 Name, Role, Value | ARIA attributes correct | axe-core automated |

### Keyboard Navigation Tests

```typescript
test('collection creation wizard navigable by keyboard', async ({ page }) => {
  await page.goto('/collectoid/dcm/create')

  // Tab to intent input
  await page.keyboard.press('Tab')
  const focused = await page.evaluate(() => document.activeElement?.tagName)
  expect(focused).toBe('TEXTAREA')

  // Type intent and tab to next button
  await page.keyboard.type('Retrospective analysis')
  await page.keyboard.press('Tab')

  // Verify next button is focused
  const nextFocused = await page.evaluate(() => document.activeElement?.textContent)
  expect(nextFocused).toContain('Next')
})
```

---

## 8. Performance Testing

### Lighthouse CI

```yaml
# .lighthouserc.yml
ci:
  collect:
    url:
      - http://localhost:3000/collectoid/collections
      - http://localhost:3000/collectoid/dcm/create
      - http://localhost:3000/collectoid/discover
      - http://localhost:3000/collectoid/collections/col-1
      - http://localhost:3000/login
    numberOfRuns: 3
  assert:
    assertions:
      categories:performance:
        - error
        - minScore: 0.8
      categories:accessibility:
        - error
        - minScore: 0.9
      first-contentful-paint:
        - warn
        - maxNumericValue: 2000
      largest-contentful-paint:
        - error
        - maxNumericValue: 3000
      cumulative-layout-shift:
        - error
        - maxNumericValue: 0.1
      total-blocking-time:
        - warn
        - maxNumericValue: 300
```

### Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | <2.5s | Lighthouse CI |
| **FID** (First Input Delay) | <100ms | Real User Monitoring |
| **CLS** (Cumulative Layout Shift) | <0.1 | Lighthouse CI |
| **TTFB** (Time to First Byte) | <600ms | Lighthouse CI |
| **FCP** (First Contentful Paint) | <1.8s | Lighthouse CI |

### API Load Testing

Using **k6** for API route load testing:

```javascript
// k6/collections-list.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up
    { duration: '3m', target: 200 },   // Sustained load (200 concurrent)
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95th percentile under 500ms
    http_req_failed: ['rate<0.01'],     // Less than 1% failure rate
  },
}

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/trpc/collections.list?input={}`, {
    headers: { Cookie: `site_auth=${__ENV.AUTH_TOKEN}` },
  })
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
  sleep(1)
}
```

### Database Query Performance

| Query Pattern | Target | Measurement |
|--------------|--------|-------------|
| Collection list (paginated) | <50ms | `EXPLAIN ANALYZE` + APM |
| Dataset search (full-text) | <100ms | `EXPLAIN ANALYZE` |
| Audit trail (filtered) | <200ms | `EXPLAIN ANALYZE` |
| Approval chain lookup | <30ms | `EXPLAIN ANALYZE` |
| Cross-collection duplicate check | <500ms | `EXPLAIN ANALYZE` |

---

## 9. Security Testing

### Dependency Scanning

| Tool | Scope | Frequency | Blocking |
|------|-------|-----------|----------|
| **Dependabot** | npm dependencies | Continuous (GitHub) | P0/P1 CVEs block merge |
| **npm audit** | npm dependencies | Every CI run | Critical/High block merge |
| **Snyk** | Dependencies + containers | Daily | Critical block deploy |
| **Trivy** | Docker images (ECR) | Every push to ECR | Critical block deploy |

### Vulnerability Response SLAs

| Severity | Response Time | Fix Deadline | Blocking |
|----------|--------------|-------------|----------|
| Critical (CVSS 9.0+) | 4 hours | 24 hours | Blocks deployment |
| High (CVSS 7.0-8.9) | 24 hours | 7 days | Blocks deployment |
| Medium (CVSS 4.0-6.9) | 72 hours | 30 days | Non-blocking |
| Low (CVSS <4.0) | Next sprint | 90 days | Non-blocking |

### OWASP ZAP Integration

Run as nightly CI job against staging:

```yaml
# .github/workflows/security-scan.yml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - name: OWASP ZAP Baseline Scan
      uses: zaproxy/action-baseline@v0.9.0
      with:
        target: ${{ secrets.STAGING_URL }}
        rules_file_name: '.zap-rules.tsv'
        fail_action: true
```

### Auth Bypass Testing

```typescript
// tests/security/auth-bypass.test.ts
describe('authentication bypass prevention', () => {
  it('rejects requests without session cookie', async () => {
    const res = await fetch('/api/trpc/collections.list')
    expect(res.status).toBe(401)
  })

  it('rejects requests with expired session', async () => {
    const res = await fetch('/api/trpc/collections.list', {
      headers: { Cookie: 'site_auth=expired-token' },
    })
    expect(res.status).toBe(401)
  })

  it('rejects requests with tampered session', async () => {
    const res = await fetch('/api/trpc/collections.list', {
      headers: { Cookie: 'site_auth=tampered-value' },
    })
    expect(res.status).toBe(401)
  })

  it('prevents DCM-only endpoints from being accessed by Data Consumer role', async () => {
    const consumerSession = await createTestSession({ role: 'data_consumer' })
    const res = await fetch('/api/trpc/collections.create', {
      method: 'POST',
      headers: { Cookie: `site_auth=${consumerSession}` },
      body: JSON.stringify({ name: 'Test' }),
    })
    expect(res.status).toBe(403)
  })
})
```

---

## 10. Test Data Management

### Test Factories

```typescript
// tests/factories/index.ts
import { faker } from '@faker-js/faker'

export function createMockDataset(overrides: Partial<Dataset> = {}): Dataset {
  return {
    id: faker.string.uuid(),
    code: `DCODE-${faker.number.int({ min: 100, max: 999 })}`,
    name: `${faker.science.chemicalElement().name} ${faker.helpers.arrayElement(['Phase I', 'Phase II', 'Phase III'])} Study`,
    therapeuticArea: [faker.helpers.arrayElement(['ONC', 'CARDIO', 'IMMUNONC'])],
    phase: faker.helpers.arrayElement(['Phase I', 'Phase II', 'Phase III']),
    status: faker.helpers.arrayElement(['Active', 'Closed', 'Archived']),
    patientCount: faker.number.int({ min: 50, max: 5000 }),
    accessBreakdown: {
      alreadyOpen: faker.number.int({ min: 0, max: 100 }),
      readyToGrant: faker.number.int({ min: 0, max: 100 }),
      needsApproval: faker.number.int({ min: 0, max: 100 }),
      missingLocation: faker.number.int({ min: 0, max: 100 }),
    },
    aotMetadata: {
      restrictML: faker.datatype.boolean(),
      restrictPublication: faker.datatype.boolean(),
      restrictSoftwareDev: faker.datatype.boolean(),
    },
    ...overrides,
  }
}

export function createMockCollection(overrides: Partial<Collection> = {}): Collection { ... }
export function createMockIntent(overrides: Partial<DataAccessIntent> = {}): DataAccessIntent { ... }
export function createMockUser(overrides: Partial<User> = {}): User { ... }
export function createMockApproval(overrides: Partial<Approval> = {}): Approval { ... }
```

### MSW (Mock Service Worker) Setup

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // AZCT API
  http.get('https://azct-api.az.com/v1/studies', () => {
    return HttpResponse.json(azctStudiesFixture)
  }),

  // Cornerstone API
  http.get('https://cornerstone-api.az.com/v1/training-status/:userId', ({ params }) => {
    return HttpResponse.json({
      userId: params.userId,
      completedCourses: ['ROAM-101', 'DATA-HANDLING-201'],
      allRequiredComplete: true,
    })
  }),

  // Immuta API
  http.post('https://immuta-api.az.com/v1/policies', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ policyId: `pol-${Date.now()}`, status: 'active' })
  }),
]
```

### Sensitive Data Policy

- **Never use** real patient data, real study identifiers, or real user PRIDs in test fixtures
- **Never use** real d-codes (DCODE-*) — use synthetic codes (DCODE-TEST-001)
- **Never commit** API credentials or tokens to test fixtures
- **Sanitise** any data copied from production for test use
- **Review** all test fixture files for accidental PII before committing

---

## 11. CI/CD Integration

### Pipeline Stages

```
PR Opened / Updated:
  ┌─────────────────────────────────────────┐
  │ Stage 1: Checks (parallel, ~2 min)      │
  │  ├── Lint (ESLint)                      │
  │  ├── Type Check (tsc --noEmit)          │
  │  ├── Format Check (Prettier)            │
  │  └── Dependency Audit (npm audit)       │
  ├─────────────────────────────────────────┤
  │ Stage 2: Tests (parallel, ~3 min)       │
  │  ├── Unit Tests (Vitest)                │
  │  ├── Component Tests (RTL + Vitest)     │
  │  └── Integration Tests (Vitest + DB)    │
  ├─────────────────────────────────────────┤
  │ Stage 3: Build (~2 min)                 │
  │  └── Next.js Production Build           │
  └─────────────────────────────────────────┘
  Total: ~5 minutes                    [BLOCKING]

Merge to main:
  ┌─────────────────────────────────────────┐
  │ Stage 4: E2E + A11y (~10 min)           │
  │  ├── Playwright E2E (Chrome)            │
  │  ├── Accessibility (axe-core)           │
  │  └── Visual Regression                  │
  ├─────────────────────────────────────────┤
  │ Stage 5: Deploy to Dev (~5 min)         │
  │  ├── Docker Build + Push to ECR         │
  │  └── ECS Service Update                 │
  └─────────────────────────────────────────┘
  Total: ~15 minutes                   [BLOCKING]

Nightly:
  ┌─────────────────────────────────────────┐
  │ Stage 6: Extended Checks (~30 min)      │
  │  ├── Full Browser Matrix (Chrome/Edge/  │
  │  │   Safari)                            │
  │  ├── Lighthouse CI (5 pages)            │
  │  ├── OWASP ZAP Baseline Scan            │
  │  ├── Snyk Security Scan                 │
  │  └── Load Test (k6, staging)            │
  └─────────────────────────────────────────┘
  Total: ~30 minutes               [NON-BLOCKING]
```

### Blocking vs Non-Blocking

| Check | PR | Merge | Nightly |
|-------|-----|-------|---------|
| Lint + Type Check | Blocking | — | — |
| Unit Tests | Blocking | — | — |
| Component Tests | Blocking | — | — |
| Integration Tests | Blocking | — | — |
| Build | Blocking | — | — |
| E2E (Chrome) | — | Blocking | — |
| Accessibility | — | Blocking | — |
| Visual Regression | — | Non-blocking (warning) | — |
| E2E (Edge, Safari) | — | — | Non-blocking |
| Lighthouse CI | — | — | Non-blocking |
| OWASP ZAP | — | — | Non-blocking |
| Load Test | — | — | Non-blocking |

---

## 12. Coverage Targets & Quality Gates

### Coverage Targets

| Module | Line | Branch | Function | Rationale |
|--------|------|--------|----------|-----------|
| `lib/request-matching.ts` | 90% | 85% | 90% | Core access control logic — high risk |
| `lib/dcm-mock-data.ts` (AoT functions) | 85% | 80% | 85% | Conflict detection critical for compliance |
| `server/routers/**` | 80% | 75% | 80% | API layer — moderate risk |
| `lib/analytics-helpers.ts` | 70% | 65% | 70% | Analytics — lower risk |
| `app/**/*.tsx` (components) | 60% | 50% | 60% | UI — tested via E2E for critical paths |
| **Overall** | **80%** | **75%** | **80%** | — |

### Quality Gates (Merge Blockers)

| Gate | Threshold | Rationale |
|------|-----------|-----------|
| All unit tests pass | 100% | No broken tests allowed |
| All integration tests pass | 100% | No broken tests allowed |
| Line coverage ≥ threshold | 80% overall | Prevent coverage regression |
| No critical/high Snyk vulnerabilities | 0 | Security requirement |
| Lint errors | 0 | Code quality |
| TypeScript errors | 0 | Type safety |
| Build succeeds | Yes | Deployability |

### Coverage Trend Monitoring

Coverage reports are generated on every PR and published as PR comments. A declining coverage trend triggers a warning. Coverage below threshold blocks merge.

---

## 13. Test Environment Strategy

### Local Development

```yaml
# docker-compose.yml (for local development)
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: collectoid_test
      POSTGRES_USER: collectoid
      POSTGRES_PASSWORD: localdev
    ports:
      - '5433:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6380:6379'

volumes:
  pgdata:
```

### CI Environment

| Component | Approach |
|-----------|----------|
| **PostgreSQL** | GitHub Actions service container (`postgres:16-alpine`) |
| **Redis** | GitHub Actions service container (`redis:7-alpine`) |
| **External APIs** | MSW (Mock Service Worker) — no real API calls in CI |
| **Auth** | Mocked Auth.js session (no Azure AD in CI) |
| **Browser** | Playwright-managed Chromium, Edge, WebKit |

### Staging Environment

| Component | Approach |
|-----------|----------|
| **PostgreSQL** | Aurora PostgreSQL (staging instance) |
| **Redis** | ElastiCache (staging instance) |
| **External APIs** | Real sandbox/dev instances where available |
| **Auth** | Azure AD (dev tenant with test users) |
| **Data** | Synthetic seed data (never production data) |

### Test User Management

| User | Role | Purpose | Source |
|------|------|---------|--------|
| `test-dcm@az.com` | DCM | Collection creation, management tests | Azure AD dev tenant |
| `test-consumer@az.com` | Data Consumer | Discovery, request tests | Azure AD dev tenant |
| `test-approver@az.com` | Approver | Approval workflow tests | Azure AD dev tenant |
| `test-admin@az.com` | Admin | Admin panel, RBAC tests | Azure AD dev tenant |
| `test-dpo@az.com` | DPO | Policy provisioning tests | Azure AD dev tenant |

[QUESTION-TST-001] Are test users in the Azure AD dev tenant available? Who creates them?

---

## 14. Open Questions

| ID | Question | Priority | Impact | Owner | Status |
|----|----------|----------|--------|-------|--------|
| QUESTION-TST-001 | Are Azure AD test users available in a dev tenant for E2E testing? | P0 | Blocks E2E auth testing | Identity Services | Open |
| QUESTION-TST-002 | Is Sentry approved for use at AZ? If not, what error tracking tool should we use? | P1 | Affects monitoring setup | Cloud Engineering | Open |
| QUESTION-TST-003 | Is there a preferred load testing tool at AZ (k6, Artillery, Gatling, JMeter)? | P2 | Affects performance testing setup | Cloud Engineering | Open |
| QUESTION-TST-004 | What is the expected peak concurrent user load for Collectoid in Year 1? | P1 | Determines load test targets | Product Owner (Divya) | Open |
| QUESTION-TST-005 | Are there existing AZ standards for test coverage thresholds? | P2 | May override our targets | Engineering Standards | Open |
| QUESTION-TST-006 | Is GitHub Actions the approved CI/CD platform, or must we use CodePipeline/Jenkins? | P0 | Blocks CI/CD setup | Cloud Engineering | Open |
| QUESTION-TST-007 | Can E2E tests run against the staging environment during nightly runs? | P1 | Affects E2E coverage | DevOps | Open |
| QUESTION-TST-008 | Is visual regression testing required, or is it nice-to-have? | P2 | Affects E2E test scope | Product Owner | Open |
| QUESTION-TST-009 | What contract testing approach is preferred for external API clients (Pact, recorded fixtures, or schema validation)? | P1 | Affects integration test design | Lead Engineer | Open |

---

*Cross-references: `01-architecture-overview.md` (deployment, monitoring) | `02-business-requirements.md` (NFRs) | `03-data-model.md` (schema, audit) | `04-integration-map.md` (external APIs) | `05-security-compliance.md` (security testing) | `06-risk-register.md` (RISK-T-* technical risks) | `07-technical-decisions.md` (ADR-010) | `08-sprint-zero-backlog.md` (SZ-TST-* tasks)*
