# Introduction Page Specification: Agentic UX Showcase

## Quick Navigation

When viewing the landing page, users should be able to quickly skip to:
- **[Enter POC →]** `/collectoid` - Jump straight to the Data Collection Manager
- **[View Gallery →]** `/context` - See UX theme explorations
- **[Skip Intro]** - Collapse the explanation section

---

## Overview

This POC demonstrates how **agentic AI can enhance traditional UX patterns** without replacing them with chatbot interfaces. The goal is to prove that AI-powered features work best when they're woven into familiar UI paradigms—not as a separate "chat with AI" experience.

### What This POC Proves

1. **AI can make complex workflows simpler** without requiring users to learn new interaction models
2. **Proactive suggestions beat reactive Q&A** - AI surfaces insights at the moment they're needed
3. **Visual feedback is irreplaceable** - Charts, badges, and progress indicators communicate faster than text
4. **User control is preserved** - Every AI suggestion can be overridden or refined

---

## The Agentic UX Philosophy

### The Spectrum of AI Integration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  [Pure Manual]              [Agentic UX]              [Chatbot Only]    │
│       ↓                          ↓                          ↓           │
│  User does                 AI assists within           User talks       │
│  everything                familiar UI patterns         to AI only      │
│                                                                         │
│  • Full control            • Full control              • Limited control│
│  • Slow & tedious          • Fast & guided             • Fast but opaque│
│  • No errors caught        • Errors prevented          • Errors possible│
│  • No suggestions          • Smart suggestions         • Suggestions only│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Why Not Just a Chatbot?

| Chatbot Approach | Agentic UX Approach |
|------------------|---------------------|
| "What categories do you need?" → waits → "Oncology" → "What about biomarkers?" → waits | Shows 30+ categories, pre-selects 5-10 based on intent, displays reasoning as keyword badges |
| "Your request conflicts with dataset restrictions" → user re-asks → clarifies | Highlights conflicts in real-time with severity badges, shows resolution options inline |
| "Based on your needs, I recommend..." → text paragraph | Visual match scores (95%), access breakdowns, timeline predictions with colored bars |
| Sequential Q&A taking minutes | Parallel information display taking seconds |

### Core Principles

1. **Enhance, Don't Replace**
   - Traditional patterns remain learnable and predictable
   - AI adds value on top, doesn't become a black box

2. **Transparency**
   - Loading states indicate AI processing
   - Suggestions labeled as AI-generated
   - Users can see the reasoning (extracted keywords, conflict sources)

3. **User Control**
   - Every suggestion is editable or dismissible
   - Manual paths always available
   - AI never auto-submits or auto-navigates

4. **Progressive Enhancement**
   - Core functionality works without AI
   - AI features layer on top
   - Graceful degradation if AI services fail

5. **Context-Awareness**
   - AI uses available context (previous selections, user profile)
   - Suggestions improve as more context is provided
   - No generic or random suggestions

---

## Complete Feature Catalog

### Category 1: DCM Creation Workflow

These features assist Data Collection Managers in creating and curating data collections through an 8-step wizard.

---

#### Feature 1: AI-Powered Category Suggestion

**What the user sees:**
When a DCM enters their collection intent (e.g., "I need oncology ctDNA biomarker data for immunotherapy response analysis"), the system automatically:
- Extracts keywords like "oncology", "ctDNA", "biomarker", "immunotherapy"
- Pre-selects relevant categories from 30+ options
- Shows "Key Match" badges on auto-selected items
- Displays extracted keywords as interactive badges

**How it works (simple explanation):**
> "The system reads your description and picks out important words. It knows that 'ctDNA' means you probably need genomics data, and 'immunotherapy' means you want treatment response data. Instead of you manually checking 30 boxes, it starts with the 5-10 most relevant ones selected."

**Why it's better than a chatbot:**
- No back-and-forth conversation needed
- Visual checkboxes let you add/remove categories instantly
- Keyword badges show exactly what the AI understood
- "Re-analyze" button lets you refine without retyping everything

**Where to see it:** `/collectoid/dcm/create/categories`

**Technical location:** `app/collectoid/dcm/create/categories/page.tsx` using `extractKeywordsAndSuggestCategories()` from `lib/dcm-mock-data.ts`

---

#### Feature 2: Activity Recommendation Engine

**What the user sees:**
After selecting datasets, a "Recommended Activities" panel appears showing:
- Specific activities suited to the selected data (e.g., "Variant Harmonization")
- Reasoning for each recommendation (e.g., "Genomic data detected across multiple studies")
- Click-to-jump functionality to scroll to that activity in the list

**How it works (simple explanation):**
> "The system looks at what's actually in your selected datasets. If it finds genomic data, it knows you might want to harmonize variants across studies. If you have imaging data from multiple sites, it suggests multimodal fusion. It's like having an expert peek at your data and say 'here's what most people do with this combination.'"

**Why it's better than a chatbot:**
- Inspects actual dataset properties, not just your description
- Recommendations appear at the exact moment you need them
- One click applies the recommendation
- Shows impact on timeline instantly

**Where to see it:** `/collectoid/dcm/create/activities`

**Technical location:** `app/collectoid/dcm/create/activities/page.tsx:127-172`

---

#### Feature 3: Intelligent Agreement of Terms (AoT) Suggestion

**What the user sees:**
When defining data use restrictions, the system suggests:
- Primary use permissions (all default to allowed)
- Beyond-primary-use permissions (AI/ML, software dev) based on your selected activities
- Publication rights based on dataset restrictions
- A summary showing what's allowed with checkmarks

**How it works (simple explanation):**
> "If you selected activities involving machine learning, the system checks whether your datasets allow ML use. If they do, it pre-enables the 'AI/ML Research' permission. If some datasets restrict ML, it shows a conservative suggestion and warns you about the conflict. It's like a legal reviewer who's already read all the fine print."

**Why it's better than a chatbot:**
- Multi-factor analysis happens automatically
- Prevents regulatory violations upfront
- Shows exactly which datasets would block which permissions
- Conservative defaults mean fewer surprises later

**Where to see it:** `/collectoid/dcm/create/agreements`

**Technical location:** `app/collectoid/dcm/create/agreements/page.tsx` using `suggestAoT()` from `lib/dcm-mock-data.ts`

---

#### Feature 4: Real-Time Conflict Detection

**What the user sees:**
When your selected permissions conflict with dataset restrictions:
- Red/amber alert panels appear immediately
- Each conflict shows: which permission, which datasets, severity level
- Resolution options: modify terms, remove datasets, or acknowledge and proceed
- Cannot proceed without addressing critical conflicts

**How it works (simple explanation):**
> "The system constantly checks your choices against the rules built into each dataset. The moment you enable 'External Publication' but one of your datasets prohibits it, a warning appears. It's like a spell-checker for data governance—errors are underlined before you submit."

**Why it's better than a chatbot:**
- Instant feedback, not a conversation about what went wrong
- Visual severity (red = critical, amber = warning)
- Shows all conflicts at once, not one at a time
- Resolution options are clickable, not described

**Where to see it:** `/collectoid/dcm/create/agreements`

**Technical location:** `app/collectoid/dcm/create/agreements/page.tsx` using `detectAoTConflicts()` from `lib/dcm-mock-data.ts`

---

#### Feature 5: Access Timeline Prediction

**What the user sees:**
A sticky sidebar panel showing:
- Estimated time to full access (e.g., "5-14 days")
- Visual breakdown: instant (green) → needs policy (blue) → needs approval (amber) → missing (gray)
- Percentage of data in each category
- Factors affecting timeline (activity types, governance requirements)

**How it works (simple explanation):**
> "Based on what you've selected, the system calculates how long it will take to actually access your data. If 80% is already open, you'll get most of it instantly. But if you need ML permissions on restricted data, add 6 weeks for the exception process. The breakdown shows exactly where the delays come from."

**Why it's better than a chatbot:**
- Transparent reasoning: you see which datasets are blocking
- Drives informed trade-offs: "If I skip ML access, I save 6 weeks"
- Updates in real-time as you change selections
- Visual breakdown communicates faster than text

**Where to see it:** `/collectoid/dcm/create/activities` and `/collectoid/dcm/create/agreements`

**Technical location:** `app/collectoid/dcm/create/activities/page.tsx:238-269` and `lib/request-matching.ts:17-45`

---

#### Feature 6: Proposition Triage System

**What the user sees:**
When reviewing user-submitted collection modification requests:
- Each request has a recommendation badge: Auto-Approve (green), Suggest Merge (purple), Needs Review (amber)
- Estimated review time for each
- Reasoning: "Requester has good standing, standard access pattern"
- Quick stats: how many can be auto-approved

**How it works (simple explanation):**
> "The system looks at each request and decides: is this routine enough to approve automatically? Is it similar to an existing collection that could be merged? Does it need legal review? It's like a smart inbox that pre-sorts your mail into 'handle now', 'combine with similar', and 'read carefully.'"

**Why it's better than a chatbot:**
- Reduces review burden: routine requests auto-approved
- Prevents collection fragmentation by suggesting merges
- Shows reasoning so you can override if needed
- Batch processing vs. one-at-a-time conversation

**Where to see it:** `/collectoid/dcm/propositions`

**Technical location:** `app/collectoid/dcm/propositions/page.tsx:38-159`

---

### Category 2: Data Discovery

These features help researchers find the data they need using natural language and smart filtering.

---

#### Feature 7: Natural Language Discovery

**What the user sees:**
A search box where you can type naturally:
> "I need lung cancer ctDNA data for ML research with publication rights"

The system returns:
- Ranked collections with match scores (95%, 87%, etc.)
- Extracted keywords as editable badges
- Intent match indicators (green = allowed, amber = partial, red = restricted)
- Access breakdown for each collection

**How it works (simple explanation):**
> "Instead of clicking through filters, just describe what you need. The system extracts the important concepts and finds collections that match. It also checks if those collections allow your intended use—so you know before you request access whether ML research or publication is permitted."

**Why it's better than a chatbot:**
- Structured results with visual scores, not text paragraphs
- Keyword badges let you refine: click to remove, add new ones
- Access breakdown shows what's instant vs. needs approval
- Intent warnings appear before you waste time requesting restricted data

**Where to see it:** `/collectoid/discover/ai`

**Technical location:** `app/collectoid/discover/ai/_variations/variation-1.tsx`

---

#### Feature 8: Smart Semantic Filtering

**What the user sees:**
When your query is complex, the system:
- Automatically activates "Smart Search" mode
- Extracts filters: therapeutic area, study phase, geography
- Groups results by access status: Open → Awaiting Policy → Needs Approval
- Shows a toggle to compare AI-filtered vs. manual results

**How it works (simple explanation):**
> "Smart Search understands the meaning behind your words, not just exact matches. When you say 'tumor response data', it finds datasets about treatment outcomes even if they don't contain those exact words. It's like asking a librarian who knows what you mean, not just a search engine that matches keywords."

**Why it's better than a chatbot:**
- No manual filter setup: AI sets them from your description
- Access-first grouping: immediately see what's available now
- Toggle lets you verify the AI's choices
- Criteria count shows how many filters were auto-applied

**Where to see it:** `/collectoid/discover/ai` (Dataset Explorer variation)

**Technical location:** `app/collectoid/discover/ai/_variations/variation-datasets.tsx:332-409`

---

#### Feature 9: Intent-Based Collection Filtering

**What the user sees:**
Collection browser with smart filter chips:
- Filter by intent: "AI/ML" / "Publication" / "Software Dev"
- Each collection shows access badges: ✓ (allowed) or ✗ (restricted)
- Multi-view: Cards / Table / Kanban by provisioning status
- "My Access" filter: show only collections you can access

**How it works (simple explanation):**
> "Before you even click on a collection, you can see whether it allows your intended use. The badges show at a glance: green checkmark means ML research is allowed, red X means it's restricted. No need to open each collection to check—the important info is surfaced upfront."

**Why it's better than a chatbot:**
- Usage intent visible without clicking
- Visual differentiation impossible in chat
- Multiple view modes for different workflows
- Pre-filters by your current access level

**Where to see it:** `/collectoid/collections` (V2 variation)

**Technical location:** `app/collectoid/collections/_variations/variation-v2.tsx:55-66, 121-187`

---

#### Feature 10: Discovery Method Selection

**What the user sees:**
A landing page offering two paths:
- **AI-Assisted Discovery**: "Describe what you're looking for in natural language"
- **Browse Collections**: "Use filters and explore curated collections"

Feature badges explain each: "Natural Language", "Smart Recommendations", "Intent Matching"

**How it works (simple explanation):**
> "Not everyone wants AI help. Some users prefer traditional browsing. This landing page lets you choose your path—and explains what each offers so you can pick the right one for your task."

**Why it's better than a chatbot:**
- Respects different user preferences
- Clear explanation of what each mode offers
- Both paths lead to the same result

**Where to see it:** `/collectoid/discover`

**Technical location:** `app/collectoid/discover/page.tsx:89-158`

---

### Category 3: Analytics & Demand Prediction

These features help DCMs understand data demand patterns and prioritize collection creation.

---

#### Feature 11: Demand Gap Analysis

**What the user sees:**
An analytics dashboard showing:
- Heatmap of demand by therapeutic area × data type
- Gap scores: high demand + low coverage = opportunity
- Trend indicators: ↑ trending up, ↓ trending down
- Multiple visualization styles: grid, bubble, treemap, radial

**How it works (simple explanation):**
> "The system analyzes all data requests across the organization. It calculates a 'gap score' for each dataset: if lots of people want it but few collections include it, that's an opportunity. The heatmap shows where demand is hottest so you know where to focus your curation efforts."

**Why it's better than a chatbot:**
- Data-driven decisions based on actual usage
- Scalable: analyzes hundreds of datasets automatically
- Visual patterns impossible to describe in text
- Trend detection shows emerging needs

**Where to see it:** `/collectoid/dcm/analytics`

**Technical location:** `app/collectoid/dcm/analytics/page.tsx` using `calculateDemandMetrics()` from `lib/analytics-helpers.ts`

---

#### Feature 12: Collection Suggestion Engine

**What the user sees:**
A "Recommended Collections" panel showing:
- Suggested new collections based on demand gaps
- Gap score and projected user count for each
- Top datasets to include
- "Create Collection" button that pre-fills the wizard with suggested filters

**How it works (simple explanation):**
> "The system identifies opportunities you might not have noticed. It might say: 'There's high demand for Oncology genomics data, but existing collections only cover 40% of it. Here are the top 5 datasets to include.' One click starts a new collection with those datasets pre-selected."

**Why it's better than a chatbot:**
- Proactive: identifies opportunities before you ask
- Actionable: one click to start with pre-filled data
- Uses two strategies: therapeutic area gaps AND intent-based gaps (AI/ML demand)
- Shows projected impact (how many users would benefit)

**Where to see it:** `/collectoid/dcm/analytics`

**Technical location:** `app/collectoid/dcm/analytics/_components/suggestions-panel.tsx` using `generateCollectionSuggestions()` from `lib/analytics-helpers.ts`

---

## Technical Reference

### Key Helper Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `extractKeywordsAndSuggestCategories()` | `lib/dcm-mock-data.ts:395-429` | NLP keyword extraction + category mapping |
| `suggestAoT()` | `lib/dcm-mock-data.ts:4879-4960` | Agreement of Terms suggestion based on activities |
| `detectAoTConflicts()` | `lib/dcm-mock-data.ts:4965-5030` | Real-time conflict detection |
| `calculateDemandMetrics()` | `lib/analytics-helpers.ts:165-219` | Demand prediction + gap scoring |
| `generateCollectionSuggestions()` | `lib/analytics-helpers.ts:308-383` | Proactive collection recommendations |
| `buildHeatmapData()` | `lib/analytics-helpers.ts:224-286` | Multi-dimensional analytics grid |
| `performSmartMatching()` | `lib/request-matching.ts:254-326` | Access timeline prediction |
| `detectIntentConflicts()` | `lib/request-matching.ts:48-88` | Intent vs. restriction conflict detection |
| `findSimilarDatasets()` | `lib/request-matching.ts:128-197` | Alternative dataset recommendations |

### Data Flow

```
User Intent (text)
       ↓
extractKeywordsAndSuggestCategories()
       ↓
Category Selection → Dataset Selection
       ↓
Activity Recommendation Engine
       ↓
suggestAoT() + detectAoTConflicts()
       ↓
calculateEstimatedWeeks()
       ↓
Collection Created → Analytics Updated
       ↓
generateCollectionSuggestions() (identifies next opportunities)
```

---

## Landing Page Requirements

### Must Have

1. **Quick Navigation (Top of Page)**
   - "Enter POC" button → `/collectoid`
   - "View Gallery" button → `/context`
   - "Skip Intro" toggle to collapse explanation

2. **Hero Section**
   - Title: "Collectoid: Agentic UX for Clinical Data Management"
   - Tagline: "AI that enhances your workflow, not replaces it"
   - Visual showing the AI ↔ UX spectrum

3. **"Why Not Just a Chatbot?" Section**
   - Side-by-side comparison
   - Expandable for more detail

4. **Feature Showcase (12 Cards)**
   - Each card: Icon, Title, One-line description
   - "See it in action" link to the feature
   - Grouped by category (DCM Workflow / Discovery / Analytics)

5. **Design Principles Summary**
   - 5 principles as visual cards or icons

### Nice to Have

1. **Animated Feature Reveal**
   - Cards animate in as user scrolls
   - Use Framer Motion

2. **Interactive Demos**
   - Embedded mini-demos showing AI suggestions in action

3. **Progress Tracking**
   - Track which features user has explored
   - "You've seen 4 of 12 features" indicator

4. **"Deep Dive" Expandable Sections**
   - Technical details for interested viewers
   - Code snippets showing implementation

### Design Guidelines

- Follow existing Zen aesthetic (font-extralight headings, font-light body)
- Use rounded-xl for cards, rounded-full for buttons
- Keep color scheme consistent with POC (dynamic scheme support)
- Mobile-responsive (though desktop is primary)
- Respect `prefers-reduced-motion` for animations

---

## Implementation Phases

### Phase 1: Spec Complete ✓
- [x] Document all 12 agentic features
- [x] Explain why each beats a chatbot
- [x] Define landing page requirements

### Phase 2: Landing Page Build
- [ ] Create component architecture
- [ ] Build hero + quick nav
- [ ] Build feature cards (12)
- [ ] Add animations
- [ ] Test on multiple viewports

### Phase 3: Polish
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Final copy review
- [ ] Stakeholder demo

---

## Summary

This POC contains **12 distinct agentic features** across 3 categories:

| Category | Features | Key Innovation |
|----------|----------|----------------|
| DCM Workflow | 6 | Proactive suggestions at each wizard step |
| Data Discovery | 4 | Natural language → structured results |
| Analytics | 2 | Data-driven opportunity identification |

The landing page should communicate that **agentic AI works best when embedded in familiar UX patterns**—not as a separate chat interface. Users should be able to quickly navigate to the POC while understanding why this approach matters.
