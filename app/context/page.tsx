import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette } from "lucide-react"

const uxThemes = [
  {
    id: 1,
    name: "Professional Portal",
    description: "Clean, professional data portal with sidebar navigation, stat cards, and comprehensive dashboard widgets. Features neutral color palette with AstraZeneca brand accents.",
    status: "Implemented",
    route: "/ux/1/home",
    features: [
      "Sidebar + Top Bar Navigation",
      "Dashboard with 6 widgets",
      "Advanced Search Interface",
      "Data Management System",
      "Responsive Design"
    ]
  },
  {
    id: 2,
    name: "Garden Zen",
    description: "A different zen approach with nature-inspired serenity. Features soft sage greens and teals, organic rounded shapes, ultra-light typography, and abundant breathing space. Inspired by peaceful gardens with language like 'cultivate', 'nurture', and 'flourish' throughout.",
    status: "Implemented",
    route: "/ux/2/home",
    features: [
      "Nature-Inspired Greens & Teals",
      "Organic Rounded Shapes",
      "Ultra-Light Typography",
      "Abundant White Space",
      "Garden-Themed Language"
    ]
  },
  {
    id: 3,
    name: "Data-Focused Professional",
    description: "Professional, data-dense interface with table-based layouts and comprehensive information display. Features compact design with burgundy and gold color scheme from the AstraZeneca logo.",
    status: "Implemented",
    route: "/ux/3/home",
    features: [
      "Left Sidebar Navigation Only",
      "Logo Burgundy & Gold Colors",
      "Table-Based Data Display",
      "Information-Dense Design",
      "Professional & Efficient"
    ]
  },
  {
    id: 4,
    name: "Executive Suite",
    description: "Sophisticated premium design with clean white backgrounds and refined gold accents. Inspired by luxury corporate environments with serif typography, elegant spacing, and refined details. Professional elegance with an upscale executive aesthetic.",
    status: "Implemented",
    route: "/ux/4/home",
    features: [
      "Clean Light Palette",
      "Gold/Amber Accents",
      "Serif Typography",
      "Premium Sophistication",
      "Executive Luxury Feel"
    ]
  },
  {
    id: 5,
    name: "Friendly Teal Explorer",
    description: "Based on UX 4 but with a welcoming and friendly color palette. Replaces burgundy with warm teal and gold with vibrant coral/orange for a more approachable feel while maintaining the AI-enhanced data explorer features.",
    status: "Implemented",
    route: "/ux/5/home",
    features: [
      "Warm Teal & Orange Colors",
      "Sidebar + Top Bar Navigation",
      "Colorful Gradient Cards",
      "Friendly & Welcoming Design",
      "AI-Focused Hero Section"
    ]
  },
  {
    id: 6,
    name: "Modern Glassmorphism",
    description: "Contemporary design featuring glassmorphic cards with backdrop blur effects, purple/violet gradients, and floating card layouts. A fresh, modern aesthetic with clean top navigation and airy spacing for a premium feel.",
    status: "Implemented",
    route: "/ux/6/home",
    features: [
      "Glassmorphic Design Elements",
      "Purple & Violet Gradients",
      "Top Navigation Only",
      "Floating Card Layouts",
      "Modern Backdrop Blur Effects"
    ]
  },
  {
    id: 7,
    name: "Dark Cyber Command",
    description: "High-tech dark theme with neon emerald/cyan accents, inspired by data centers and command terminals. Features dark backgrounds, glow effects, monospace typography, and animated status indicators for a futuristic cyberpunk aesthetic.",
    status: "Implemented",
    route: "/ux/7/home",
    features: [
      "Dark Theme with Neon Accents",
      "Emerald/Cyan Color Palette",
      "Left Sidebar Navigation",
      "Terminal-Inspired Design",
      "Animated Glow Effects"
    ]
  },
  {
    id: 8,
    name: "Minimal Zen",
    description: "Serene minimalist design inspired by Japanese aesthetics and Swiss design principles. Features abundant white space, light typography, subtle gray tones with coral/rose gradient accents, and rounded elements for a calm, focused experience.",
    status: "Implemented",
    route: "/ux/8/home",
    features: [
      "Minimalist White Space",
      "Light Font Weights",
      "Coral/Rose Gradients",
      "Rounded Elements",
      "Zen-Inspired Calm Design"
    ]
  },
]

export default function ContextPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/10">
              <Palette className="size-8 text-brand" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AstraZeneca Data Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            UX Theme Concepts & Prototypes
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Explore different user interface designs and interaction patterns
          </p>
        </div>

        {/* POC Section */}
        <div className="mb-12 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Proof of Concepts
            </h2>
            <p className="text-muted-foreground">
              Interactive prototypes demonstrating full workflows and functionality
            </p>
          </div>
          <Card className="border-2 border-brand/50 bg-gradient-to-br from-brand/5 to-brand/10">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand/20 font-bold text-brand">
                  1
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400">
                  Active
                </span>
              </div>
              <CardTitle className="text-xl">Data Collection Manager (DCM)</CardTitle>
              <CardDescription>
                Complete end-to-end workflow for creating and managing data collections. Features AI-powered category suggestions,
                multi-dimensional filtering with smart semantic search, dataset selection with access provisioning breakdown,
                activity definition, and collection publishing. Built on Zen aesthetic with dynamic color schemes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Key Features:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>AI-Powered Smart Filtering & Category Suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Multi-Dimensional Dataset Filtering (Phase, Geography, Modality, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Real-Time Access Provisioning Breakdown</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Actionable Dashboard with Needs Attention Cards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>7 Dynamic Color Schemes (Zen Aesthetic)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Pagination & Selected Studies Sidebar</span>
                  </li>
                </ul>
              </div>
              <Button asChild className="w-full">
                <Link href="/collectoid/dcm/create">
                  Explore DCM Prototype
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Theme Cards */}
        <div className="mb-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            UX Theme Concepts
          </h2>
          <p className="text-muted-foreground mb-6">
            These themes were created to demonstrate the range of visual directions possible, from minimal and calm to bold and energetic, showing how different the same interface can feel with different design choices.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-7xl mx-auto">
          {uxThemes.map((theme) => (
            <Card
              key={theme.id}
              className={`flex flex-col ${theme.status === 'Implemented' ? 'border-brand/50' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                    {theme.id}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme.status === 'Implemented'
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {theme.status}
                  </span>
                </div>
                <CardTitle className="text-xl">{theme.name}</CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {theme.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Key Features:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {theme.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto pt-4">
                  {theme.status === 'Implemented' ? (
                    <Button asChild className="w-full">
                      <Link href={theme.route}>
                        View Theme
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Prototyping Environment</p>
        </div>
      </div>
    </div>
  )
}
