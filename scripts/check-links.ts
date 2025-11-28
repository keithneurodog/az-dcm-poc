#!/usr/bin/env npx tsx

/**
 * Static link checker for the project
 *
 * Scans all .tsx and .ts files for internal links (href, Link, router.push, actionUrl, etc.)
 * and validates that they point to existing routes in the app directory.
 *
 * Usage: npx tsx scripts/check-links.ts
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"

const APP_DIR = join(process.cwd(), "app")
const IGNORE_PATTERNS = [
  /^#/,                    // Anchor links
  /^https?:\/\//,          // External URLs
  /^mailto:/,              // Email links
  /^tel:/,                 // Phone links
  /^\[.*\]$/,              // Template literals like [id]
]

// Links that are intentionally placeholder/TBD
const KNOWN_PLACEHOLDERS = [
  "#",                     // Common placeholder
]

interface LinkInfo {
  href: string
  file: string
  line: number
  context?: string
}

interface RouteInfo {
  path: string
  isDynamic: boolean
}

// Recursively get all .tsx and .ts files
function getAllSourceFiles(dir: string): string[] {
  const files: string[] = []

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip node_modules, hidden directories, and scripts folder
      if (!entry.startsWith(".") && entry !== "node_modules" && entry !== "scripts") {
        files.push(...getAllSourceFiles(fullPath))
      }
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      files.push(fullPath)
    }
  }

  return files
}

// Get all valid routes from the app directory
function getAppRoutes(dir: string, basePath: string = ""): RouteInfo[] {
  const routes: RouteInfo[] = []

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip private folders (starting with _) and special Next.js folders
      if (entry.startsWith("_") || entry.startsWith(".")) {
        continue
      }

      // Handle dynamic segments [param]
      const isDynamic = entry.startsWith("[") && entry.endsWith("]")
      const segmentPath = isDynamic ? entry : entry
      const newBasePath = `${basePath}/${segmentPath}`

      // Check if this directory has a page.tsx (making it a valid route)
      if (existsSync(join(fullPath, "page.tsx"))) {
        routes.push({
          path: newBasePath,
          isDynamic: isDynamic || basePath.includes("[")
        })
      }

      // Recurse into subdirectories
      routes.push(...getAppRoutes(fullPath, newBasePath))
    }
  }

  return routes
}

// Extract links from a file
function extractLinks(filePath: string): LinkInfo[] {
  const content = readFileSync(filePath, "utf-8")
  const lines = content.split("\n")
  const links: LinkInfo[] = []

  // Patterns to match various link formats
  const patterns = [
    // JSX/TSX patterns
    { regex: /href=["']([^"']+)["']/g, context: "href" },
    { regex: /href=\{["']([^"']+)["']\}/g, context: "href" },
    { regex: /href=\{`([^`]+)`\}/g, context: "href template" },

    // Router patterns
    { regex: /router\.push\(["']([^"']+)["']\)/g, context: "router.push" },
    { regex: /router\.push\(`([^`]+)`\)/g, context: "router.push template" },
    { regex: /router\.replace\(["']([^"']+)["']\)/g, context: "router.replace" },

    // Link component
    { regex: /<Link[^>]*href=["']([^"']+)["']/g, context: "Link" },
    { regex: /<Link[^>]*href=\{["']([^"']+)["']\}/g, context: "Link" },

    // Data/mock patterns - URLs in objects
    { regex: /actionUrl:\s*["']([^"']+)["']/g, context: "actionUrl" },
    { regex: /url:\s*["']([^"']+)["']/g, context: "url property" },
    { regex: /path:\s*["']([^"']+)["']/g, context: "path property" },
    { regex: /redirect:\s*["']([^"']+)["']/g, context: "redirect" },
    { regex: /to:\s*["']([^"']+)["']/g, context: "to property" },
  ]

  lines.forEach((line, index) => {
    for (const { regex, context } of patterns) {
      // Reset regex state
      regex.lastIndex = 0

      let match
      while ((match = regex.exec(line)) !== null) {
        const href = match[1]

        // Skip if matches ignore patterns
        if (IGNORE_PATTERNS.some(p => p.test(href))) {
          continue
        }

        // Skip known placeholders
        if (KNOWN_PLACEHOLDERS.includes(href)) {
          continue
        }

        // Skip template literal variables (contains ${...})
        if (href.includes("${")) {
          continue
        }

        // Skip if it doesn't look like an internal route (must start with /)
        if (!href.startsWith("/")) {
          continue
        }

        links.push({
          href,
          file: filePath,
          line: index + 1,
          context,
        })
      }
    }
  })

  return links
}

// Check if a link matches any valid route
function isValidRoute(href: string, routes: RouteInfo[]): boolean {
  // Normalize the href (remove trailing slash, query params, hash)
  const normalizedHref = href.split("?")[0].split("#")[0].replace(/\/$/, "") || "/"

  for (const route of routes) {
    // Exact match
    if (route.path === normalizedHref) {
      return true
    }

    // Dynamic route matching
    if (route.isDynamic) {
      // Convert route pattern to regex
      // e.g., /collections/[id]/customize -> /collections/[^/]+/customize
      const regexPattern = route.path
        .replace(/\[([^\]]+)\]/g, "[^/]+")
        .replace(/\//g, "\\/")
      const regex = new RegExp(`^${regexPattern}$`)

      if (regex.test(normalizedHref)) {
        return true
      }
    }
  }

  return false
}

// Main execution
function main() {
  console.log("🔍 Scanning for internal links...\n")

  // Get all routes
  const routes = getAppRoutes(APP_DIR)

  // Add root route
  if (existsSync(join(APP_DIR, "page.tsx"))) {
    routes.push({ path: "/", isDynamic: false })
    routes.push({ path: "", isDynamic: false })
  }

  console.log(`📁 Found ${routes.length} routes in the app\n`)

  // Get all source files (.tsx and .ts)
  const files = getAllSourceFiles(process.cwd())
  console.log(`📄 Scanning ${files.length} source files (.tsx, .ts)...\n`)

  // Extract all links
  const allLinks: LinkInfo[] = []
  for (const file of files) {
    allLinks.push(...extractLinks(file))
  }

  console.log(`🔗 Found ${allLinks.length} internal links\n`)

  // Check each link
  const deadLinks: LinkInfo[] = []
  const validLinks: LinkInfo[] = []

  for (const link of allLinks) {
    if (isValidRoute(link.href, routes)) {
      validLinks.push(link)
    } else {
      deadLinks.push(link)
    }
  }

  // Report results
  if (deadLinks.length === 0) {
    console.log("✅ All links are valid!\n")
    console.log(`   ${validLinks.length} links checked`)
    process.exit(0)
  } else {
    console.log(`❌ Found ${deadLinks.length} potentially dead links:\n`)

    // Group by file
    const byFile = new Map<string, LinkInfo[]>()
    for (const link of deadLinks) {
      const relPath = relative(process.cwd(), link.file)
      if (!byFile.has(relPath)) {
        byFile.set(relPath, [])
      }
      byFile.get(relPath)!.push(link)
    }

    for (const [file, links] of byFile) {
      console.log(`  ${file}:`)
      for (const link of links) {
        const ctx = link.context ? ` (${link.context})` : ""
        console.log(`    Line ${link.line}: ${link.href}${ctx}`)
      }
      console.log()
    }

    console.log("---")
    console.log(`Total: ${deadLinks.length} dead links, ${validLinks.length} valid links`)
    console.log("\nNote: Some links may be intentional (e.g., external app links, dynamic paths)")
    console.log("      Add false positives to KNOWN_PLACEHOLDERS in this script")

    process.exit(1)
  }
}

main()
