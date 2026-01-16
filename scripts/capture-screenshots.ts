/**
 * Playwright script to capture screenshots of agentic features
 * Run with: npx tsx scripts/capture-screenshots.ts
 *
 * Prerequisites:
 * - Dev server running on localhost:3000
 * - Site password set in .env.local
 */

import { chromium, type Page } from "playwright"
import path from "path"
import fs from "fs"

const BASE_URL = "http://localhost:3000"
const SITE_PASSWORD = process.env.SITE_PASSWORD || "dcm2026!"
const OUTPUT_DIR = path.join(process.cwd(), "public", "previews")

// Mock data for seeding sessionStorage - must match the expected types
const MOCK_INTENT =
  "I need oncology ctDNA biomarker data for AI/ML research on lung cancer treatment response prediction"

const MOCK_CATEGORIES = [
  "Oncology",
  "Biomarkers",
  "Genomics",
  "Clinical Outcomes",
  "Imaging",
]

// Full dataset objects matching the Dataset interface
const MOCK_DATASETS = [
  {
    id: "dcode-042",
    code: "DCODE-042",
    name: "NSCLC ctDNA Monitoring - Phase III",
    therapeuticArea: ["ONC", "IMMUNONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-03-15",
    geography: ["US", "EU", "Asia"],
    patientCount: 890,
    description: "Longitudinal ctDNA monitoring in non-small cell lung cancer",
    categories: ["Oncology", "Biomarkers", "Genomics"],
    collections: ["Oncology ctDNA Initiative"],
    activeUsers: 45,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 60, readyToGrant: 20, needsApproval: 15, missingLocation: 5 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "s3://az-clinical/dcode-042", genomics: "s3://az-genomics/dcode-042", imaging: "s3://az-imaging/dcode-042" },
    frequentlyBundledWith: ["DCODE-089", "DCODE-123"],
    aotMetadata: { restrictML: false, restrictPublication: false },
  },
  {
    id: "dcode-089",
    code: "DCODE-089",
    name: "Breast Cancer ctDNA Dynamics - Phase II",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2024-01-10",
    geography: ["US", "EU"],
    patientCount: 456,
    description: "ctDNA dynamics in breast cancer patients",
    categories: ["Oncology", "Biomarkers"],
    collections: [],
    activeUsers: 23,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 25, missingLocation: 5 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "s3://az-clinical/dcode-089", genomics: "s3://az-genomics/dcode-089" },
    frequentlyBundledWith: ["DCODE-042"],
    aotMetadata: { restrictML: true, restrictPublication: false }, // ML restricted!
  },
  {
    id: "dcode-123",
    code: "DCODE-123",
    name: "Colorectal Cancer Biomarker Study - Phase III",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-11-20",
    geography: ["US", "EU", "Asia"],
    patientCount: 1200,
    description: "Comprehensive biomarker study in colorectal cancer",
    categories: ["Oncology", "Biomarkers", "Clinical Outcomes"],
    collections: ["GI Cancer Collection"],
    activeUsers: 67,
    organizations: 12,
    accessBreakdown: { alreadyOpen: 20, readyToGrant: 30, needsApproval: 40, missingLocation: 10 },
    accessPlatform: "SCP",
    dataLayer: ["Snowflake", "S3"],
    dataLocation: { clinical: "s3://az-clinical/dcode-123", genomics: "s3://az-genomics/dcode-123", imaging: "s3://az-imaging/dcode-123" },
    frequentlyBundledWith: ["DCODE-042"],
    aotMetadata: { restrictML: false, restrictPublication: true }, // Publication restricted!
  },
  {
    id: "dcode-156",
    code: "DCODE-156",
    name: "Lung Adenocarcinoma Response Study",
    therapeuticArea: ["ONC", "RESP"],
    phase: "II",
    status: "Closed",
    closedDate: "2024-02-28",
    geography: ["US"],
    patientCount: 320,
    description: "Treatment response monitoring in lung adenocarcinoma",
    categories: ["Oncology", "Imaging", "Clinical Outcomes"],
    collections: [],
    activeUsers: 15,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 80, readyToGrant: 10, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "s3://az-clinical/dcode-156", imaging: "s3://az-imaging/dcode-156" },
    frequentlyBundledWith: [],
    aotMetadata: { restrictML: false, restrictPublication: false },
  },
]

const MOCK_ACTIVITIES = ["etl", "variant-harm", "early-response"]

async function login(page: Page) {
  console.log("Logging in...")
  await page.goto(`${BASE_URL}/login`)
  await page.waitForSelector('input[type="password"]')
  await page.fill('input[type="password"]', SITE_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL((url) => !url.pathname.includes("/login"))
  console.log("Logged in successfully")
}

async function seedSessionStorage(page: Page, data: Record<string, unknown>) {
  await page.evaluate((storageData) => {
    for (const [key, value] of Object.entries(storageData)) {
      sessionStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value)
      )
    }
  }, data)
}

async function captureScreenshot(page: Page, name: string, selector?: string) {
  const filepath = path.join(OUTPUT_DIR, `${name}.png`)

  if (selector) {
    const element = await page.$(selector)
    if (element) {
      await element.screenshot({ path: filepath })
      console.log(`  Captured: ${name} (element)`)
      return
    }
    console.log(`  Element not found: ${selector}, capturing viewport`)
  }

  await page.screenshot({ path: filepath, fullPage: false })
  console.log(`  Captured: ${name}`)
}

async function captureCategories(page: Page) {
  console.log("\n--- Capturing Category Suggestion ---")

  // Go to a neutral page first to seed storage
  await page.goto(`${BASE_URL}/collectoid`)
  await page.waitForLoadState("networkidle")

  // Seed with intent
  await seedSessionStorage(page, {
    dcm_collection_intent: MOCK_INTENT,
  })

  // Now navigate to categories
  await page.goto(`${BASE_URL}/collectoid/dcm/create/categories`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(2000) // Wait for AI suggestions to render

  await captureScreenshot(page, "category-suggestion")
}

async function captureActivities(page: Page) {
  console.log("\n--- Capturing Activity Recommendations + Timeline ---")

  // Go to a neutral page first to seed storage
  await page.goto(`${BASE_URL}/collectoid`)
  await page.waitForLoadState("networkidle")

  // Seed with all required previous steps
  await seedSessionStorage(page, {
    dcm_collection_intent: MOCK_INTENT,
    dcm_selected_categories: MOCK_CATEGORIES,
    dcm_selected_datasets: MOCK_DATASETS,
  })

  // Now navigate to activities
  await page.goto(`${BASE_URL}/collectoid/dcm/create/activities`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(2000) // Wait for recommendations to compute

  // Capture the full page showing recommendations
  await captureScreenshot(page, "activity-recommendations")

  // The timeline is in a sticky sidebar - capture the whole page for that too
  // (they're on the same page, but we could scroll or highlight differently)
  await captureScreenshot(page, "timeline-prediction")
}

async function captureAgreements(page: Page) {
  console.log("\n--- Capturing Terms Suggestion + Conflict Detection ---")

  // Go to a neutral page first to seed storage
  await page.goto(`${BASE_URL}/collectoid`)
  await page.waitForLoadState("networkidle")

  // Seed with all required previous steps including activities
  await seedSessionStorage(page, {
    dcm_collection_intent: MOCK_INTENT,
    dcm_selected_categories: MOCK_CATEGORIES,
    dcm_selected_datasets: MOCK_DATASETS,
    dcm_selected_activities: MOCK_ACTIVITIES,
  })

  // Now navigate to agreements
  await page.goto(`${BASE_URL}/collectoid/dcm/create/agreements`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(2000) // Wait for AoT suggestions and conflicts

  // Capture terms suggestion
  await captureScreenshot(page, "terms-suggestion")

  // Scroll down a bit to see conflicts if any
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(500)

  await captureScreenshot(page, "conflict-detection")
}

// STANDALONE FEATURES

async function captureRequestTriage(page: Page) {
  console.log("\n--- Capturing Request Triage ---")
  await page.goto(`${BASE_URL}/collectoid/dcm/propositions`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1500)
  await captureScreenshot(page, "request-triage")
}

async function captureNaturalLanguageSearch(page: Page) {
  console.log("\n--- Capturing Natural Language Search ---")
  await page.goto(`${BASE_URL}/collectoid/discover/ai`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)

  // Type a search query to show the AI search in action
  const searchInput = await page.$('input[type="text"], textarea')
  if (searchInput) {
    await searchInput.fill("lung cancer ctDNA data for ML research")
    await page.waitForTimeout(500)
    // Press enter or click search button
    await searchInput.press("Enter")
    await page.waitForTimeout(2000) // Wait for results
  }

  await captureScreenshot(page, "natural-language-search")
}

async function captureSmartFiltering(page: Page) {
  console.log("\n--- Capturing Smart Filtering ---")
  // Same page as natural language search but showing filter results
  await page.goto(`${BASE_URL}/collectoid/discover/ai`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)

  // Type a different query
  const searchInput = await page.$('input[type="text"], textarea')
  if (searchInput) {
    await searchInput.fill("tumor response biomarker studies")
    await searchInput.press("Enter")
    await page.waitForTimeout(2000)
  }

  await captureScreenshot(page, "smart-filtering")
}

async function captureIntentFiltering(page: Page) {
  console.log("\n--- Capturing Intent Filtering ---")
  await page.goto(`${BASE_URL}/collectoid/collections`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1500)
  await captureScreenshot(page, "intent-filtering")
}

async function captureDiscoveryPaths(page: Page) {
  console.log("\n--- Capturing Discovery Paths ---")
  await page.goto(`${BASE_URL}/collectoid/discover`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1500)
  await captureScreenshot(page, "discovery-paths")
}

async function captureDemandAnalysis(page: Page) {
  console.log("\n--- Capturing Demand Analysis ---")
  await page.goto(`${BASE_URL}/collectoid/dcm/analytics`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1500)
  await captureScreenshot(page, "demand-analysis")
}

async function captureCollectionSuggestions(page: Page) {
  console.log("\n--- Capturing Collection Suggestions ---")
  // Same page as demand analysis - scroll to see suggestions section
  await page.goto(`${BASE_URL}/collectoid/dcm/analytics`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1500)

  // Scroll down to see collection suggestions
  await page.evaluate(() => window.scrollBy(0, 500))
  await page.waitForTimeout(500)

  await captureScreenshot(page, "collection-suggestions")
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log("Starting Playwright screenshot capture...")
  console.log(`Output directory: ${OUTPUT_DIR}`)

  const browser = await chromium.launch({
    headless: true, // Set to false to see the browser
  })

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2, // Retina quality
  })

  const page = await context.newPage()

  try {
    // Login first
    await login(page)

    // Capture flow-embedded features
    await captureCategories(page)
    await captureActivities(page)
    await captureAgreements(page)

    // Capture standalone features
    await captureRequestTriage(page)
    await captureNaturalLanguageSearch(page)
    await captureSmartFiltering(page)
    await captureIntentFiltering(page)
    await captureDiscoveryPaths(page)
    await captureDemandAnalysis(page)
    await captureCollectionSuggestions(page)

    console.log("\n✓ All screenshots captured successfully!")
    console.log(`Files saved to: ${OUTPUT_DIR}`)
  } catch (error) {
    console.error("Error capturing screenshots:", error)
    // Take a debug screenshot
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "error-debug.png"),
      fullPage: true,
    })
    console.log("Debug screenshot saved to error-debug.png")
  } finally {
    await browser.close()
  }
}

main()
