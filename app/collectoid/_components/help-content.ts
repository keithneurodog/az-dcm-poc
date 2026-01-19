/**
 * Contextual help content for the prototype UI.
 * This is "4th wall" information explaining what the mocked UI demonstrates,
 * NOT documentation for the simulated application.
 */

export interface HelpContent {
  title: string
  content: string
}

export const helpContent: Record<string, HelpContent> = {
  "/collectoid/dcm/propositions": {
    title: "About this page",
    content: `This page demonstrates the DCM "Propositions" workflow.

**Why Propositions exist:**
Propositions provide governance for changes that need careful consideration. They serve as an audit trail, a space for discussion between stakeholders, and a structured approval process. Each proposition follows its own workflow and might need input from data owners, legal review, or management sign off before it can proceed.

**How they're created:**
Users always raise Requests when they want data access. Simple requests are handled directly, but complex ones may automatically generate one or more Propositions that need review. Propositions can also be created directly. For example, when a DCM wants to modify the terms of an existing collection, they would raise a modification request which gets captured as a Proposition.

**What this page shows:**
The DCM's view for triaging incoming propositions. This includes reviewing details, having discussions, and ultimately approving, requesting changes, or suggesting alternatives like merging with similar existing collections.`,
  },
  // Add more routes as needed
}

/**
 * Get help content for a given pathname.
 * Returns null if no help is available for the route.
 */
export function getHelpContent(pathname: string): HelpContent | null {
  // Exact match first
  if (helpContent[pathname]) {
    return helpContent[pathname]
  }

  // Check for prefix matches (e.g., /collectoid/dcm/propositions/123 matches /collectoid/dcm/propositions)
  for (const route of Object.keys(helpContent)) {
    if (pathname.startsWith(route + "/")) {
      return helpContent[route]
    }
  }

  return null
}
