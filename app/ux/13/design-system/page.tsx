"use client"

import { useState, useEffect } from "react"
import { useColorScheme } from "@/app/ux/_components/ux12-color-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Palette,
  Type,
  MousePointerClick,
  FileText,
  Layout,
  Award,
  BarChart3,
  Navigation,
  Layers,
  MessageSquare,
  Zap,
  Circle,
  Check,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Heart,
  Download,
  Upload,
  Search,
  Plus,
  Minus,
  Edit,
  Trash2,
  Settings,
  User,
  Mail,
  Phone,
  Home,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Info,
  AlertTriangle,
  Menu,
} from "lucide-react"

const sections = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "colors", label: "Colors & Themes", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "buttons", label: "Buttons", icon: MousePointerClick },
  { id: "forms", label: "Forms & Inputs", icon: FileText },
  { id: "complex-components", label: "Complex Components", icon: Sparkles },
  { id: "cards", label: "Cards & Containers", icon: Layout },
  { id: "badges", label: "Badges & Avatars", icon: Award },
  { id: "data", label: "Data Display", icon: BarChart3 },
  { id: "navigation", label: "Navigation", icon: Navigation },
  { id: "overlays", label: "Overlays & Dialogs", icon: Layers },
  { id: "feedback", label: "Feedback & States", icon: MessageSquare },
  { id: "animations", label: "Animations", icon: Zap },
]

export default function UX13DesignSystemPage() {
  const { scheme } = useColorScheme()
  const [activeSection, setActiveSection] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(true)
  const [switchEnabled, setSwitchEnabled] = useState(false)
  const [textareaValue, setTextareaValue] = useState("")
  const [selectOpen1, setSelectOpen1] = useState(false)
  const [selectOpen2, setSelectOpen2] = useState(false)
  const [selectOpen3, setSelectOpen3] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState("Select phase...")
  const [selectedRegion, setSelectedRegion] = useState("Select region...")
  const [selectedArea, setSelectedArea] = useState("Therapeutic Area...")

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Find the scrollable container (main element with overflow-auto)
      const scrollContainer = element.closest('main')
      if (scrollContainer) {
        const offset = 100
        const elementPosition = element.offsetTop

        scrollContainer.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        })
        setActiveSection(id)
      }
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.custom-dropdown')) {
        setSelectOpen1(false)
        setSelectOpen2(false)
        setSelectOpen3(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="flex gap-8">
      {/* Sticky Navigation Sidebar */}
      <aside className="w-64 shrink-0">
        <div className="sticky top-24">
          <div className={cn(
            "rounded-2xl border bg-white/70 backdrop-blur-xl p-4 shadow-lg",
            `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
            `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/20")}`
          )}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
              <Sparkles className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              <h3 className="font-light text-sm text-neutral-900">Design System</h3>
            </div>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-light transition-all",
                      isActive
                        ? cn("bg-gradient-to-r text-white shadow-md", scheme.from, scheme.to)
                        : "text-neutral-600 hover:bg-neutral-50"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-16">
        {/* Overview Section */}
        <section id="overview">
          <div className={cn(
            "rounded-3xl p-12 border bg-gradient-to-br",
            scheme.bg,
            scheme.bgHover,
            `border-${scheme.from.replace("from-", "").replace("-500", "-100")}/50`
          )}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Circle className={cn("size-2 animate-pulse fill-current", scheme.from.replace("from-", "text-"))} />
              <span className="text-xs font-light text-neutral-600 uppercase tracking-wider">UX 13 Design System</span>
            </div>
            <h1 className="text-5xl font-extralight text-neutral-900 mb-4 text-center tracking-tight">
              Zen Dual Navigation
            </h1>
            <p className="text-lg font-light text-neutral-600 text-center max-w-2xl mx-auto mb-8">
              A comprehensive showcase of components, patterns, and interactions with dynamic color theming
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Components", value: "15+", icon: Layout },
                { label: "Color Schemes", value: "7", icon: Palette },
                { label: "Animations", value: "12+", icon: Zap },
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
                    <div className="flex items-center justify-center mb-3">
                      <div className={cn("flex size-12 items-center justify-center rounded-full bg-gradient-to-br", scheme.from, scheme.to)}>
                        <Icon className="size-5 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-light text-neutral-900 mb-1">{stat.value}</p>
                    <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Colors & Themes Section */}
        <section id="colors" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Colors & Themes</h2>
            <p className="text-neutral-600 font-light">Dynamic color system with 7 beautiful schemes</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Current Color Scheme</CardTitle>
              <CardDescription className="font-light">Use the color picker (bottom-right) to switch themes</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className={cn("rounded-xl p-6 bg-gradient-to-br", scheme.from, scheme.to)}>
                  <p className="text-white font-light mb-2">Primary Gradient</p>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <code>{scheme.from}</code>
                    <ArrowRight className="size-3" />
                    <code>{scheme.to}</code>
                  </div>
                </div>
                <div className={cn("rounded-xl p-6 bg-gradient-to-br border", scheme.bg, scheme.bgHover, "border-neutral-200")}>
                  <p className="text-neutral-900 font-light mb-2">Background Gradient</p>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <code>{scheme.bg}</code>
                    <ArrowRight className="size-3" />
                    <code>{scheme.bgHover}</code>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <h4 className="text-sm font-light text-neutral-700">Shadow Variants</h4>
                <div className="grid grid-cols-4 gap-3">
                  {["shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"].map((shadow) => (
                    <div key={shadow} className={cn("rounded-xl p-4 bg-white border border-neutral-200", shadow)}>
                      <code className="text-xs text-neutral-600">{shadow}</code>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography Section */}
        <section id="typography" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Typography</h2>
            <p className="text-neutral-600 font-light">Ultra-light, zen-inspired type hierarchy</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Heading Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="space-y-3">
                <h1 className="text-5xl font-extralight text-neutral-900 tracking-tight">Heading 1 - Extra Light</h1>
                <h2 className="text-4xl font-extralight text-neutral-900 tracking-tight">Heading 2 - Extra Light</h2>
                <h3 className="text-3xl font-light text-neutral-900">Heading 3 - Light</h3>
                <h4 className="text-2xl font-light text-neutral-900">Heading 4 - Light</h4>
                <h5 className="text-xl font-normal text-neutral-900">Heading 5 - Normal</h5>
                <h6 className="text-lg font-normal text-neutral-900">Heading 6 - Normal</h6>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <p className="text-base font-light text-neutral-700">Body text - Light weight for comfortable reading</p>
                <p className="text-sm font-light text-neutral-600">Small text - Perfect for captions and metadata</p>
                <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Uppercase Label - Small caps</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Buttons Section */}
        <section id="buttons" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Buttons</h2>
            <p className="text-neutral-600 font-light">All variants, sizes, and states</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Button Variants</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Primary Gradient</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button className={cn("bg-gradient-to-r text-white rounded-full font-light", scheme.from, scheme.to)}>
                    <Sparkles className="mr-2 size-4" />
                    Gradient Button
                  </Button>
                  <Button className={cn("bg-gradient-to-r text-white rounded-full font-light", scheme.from, scheme.to)} size="sm">
                    Small
                  </Button>
                  <Button className={cn("bg-gradient-to-r text-white rounded-full font-light", scheme.from, scheme.to)} size="lg">
                    Large
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Standard Variants</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Icon Buttons</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="icon" className={cn("rounded-full bg-gradient-to-br", scheme.from, scheme.to)}>
                    <Plus className="size-4 text-white" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Edit className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">States</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button disabled>Disabled</Button>
                  <Button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000) }}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Click to Load"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Forms & Inputs Section */}
        <section id="forms" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Forms & Inputs</h2>
            <p className="text-neutral-600 font-light">Input fields with various states</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Input Fields</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-light text-neutral-700">Default Input</Label>
                  <Input
                    placeholder="Enter text..."
                    className={cn(
                      "rounded-xl font-light border-2 border-neutral-200 h-10",
                      "hover:border-neutral-300 focus-visible:border-current transition-colors",
                      `focus-visible:${scheme.from.replace("from-", "border-").replace("-500", "-400")}`
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-light text-neutral-700">With Icon</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      placeholder="Search..."
                      className={cn(
                        "pl-10 rounded-xl font-light border-2 border-neutral-200 h-10",
                        "hover:border-neutral-300 focus-visible:border-current transition-colors",
                        `focus-visible:${scheme.from.replace("from-", "border-").replace("-500", "-400")}`
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-light text-neutral-700">Disabled</Label>
                  <Input
                    placeholder="Disabled..."
                    disabled
                    className="rounded-xl font-light border-2 border-neutral-200 h-10 bg-neutral-50 opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-light text-neutral-700">With Subtle Gradient Focus</Label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-0 group-focus-within:opacity-10 blur-sm transition-opacity",
                      scheme.from,
                      scheme.to
                    )} />
                    <Input
                      placeholder="Focus for gradient..."
                      className="relative rounded-xl font-light border-2 border-neutral-200 h-10 hover:border-neutral-300 focus-visible:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <Label className="text-sm font-light text-neutral-700">Input with Action Button</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email address..."
                    className={cn(
                      "rounded-xl font-light border-2 border-neutral-200 h-10",
                      "hover:border-neutral-300 focus-visible:border-current transition-colors",
                      `focus-visible:${scheme.from.replace("from-", "border-").replace("-500", "-400")}`
                    )}
                  />
                  <Button className={cn("bg-gradient-to-r text-white rounded-xl shrink-0 shadow-md hover:shadow-lg", scheme.from, scheme.to)}>
                    Subscribe
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-light text-neutral-700 mb-3">Checkboxes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="checkbox-1"
                        checked={checked}
                        onCheckedChange={(val) => setChecked(val as boolean)}
                      />
                      <Label htmlFor="checkbox-1" className="font-light text-sm text-neutral-700 cursor-pointer">
                        Accept terms and conditions
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="checkbox-2" />
                      <Label htmlFor="checkbox-2" className="font-light text-sm text-neutral-700 cursor-pointer">
                        Subscribe to newsletter
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="checkbox-3" disabled />
                      <Label htmlFor="checkbox-3" className="font-light text-sm text-neutral-500 cursor-not-allowed">
                        Disabled checkbox
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-light text-neutral-700 mb-3">Switches</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                      <div>
                        <Label htmlFor="switch-1" className="font-normal text-sm text-neutral-900 cursor-pointer">
                          Enable notifications
                        </Label>
                        <p className="text-xs font-light text-neutral-500">Receive updates about your collections</p>
                      </div>
                      <Switch
                        id="switch-1"
                        checked={switchEnabled}
                        onCheckedChange={setSwitchEnabled}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                      <div>
                        <Label htmlFor="switch-2" className="font-normal text-sm text-neutral-900 cursor-pointer">
                          Auto-approve requests
                        </Label>
                        <p className="text-xs font-light text-neutral-500">Automatically grant access</p>
                      </div>
                      <Switch id="switch-2" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 opacity-50">
                      <div>
                        <Label htmlFor="switch-3" className="font-normal text-sm text-neutral-500 cursor-not-allowed">
                          Disabled switch
                        </Label>
                        <p className="text-xs font-light text-neutral-400">This option is not available</p>
                      </div>
                      <Switch id="switch-3" disabled />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-light text-neutral-700 mb-3">Textarea</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="textarea-1" className="text-sm font-light text-neutral-700">
                        Description
                      </Label>
                      <Textarea
                        id="textarea-1"
                        placeholder="Enter your description here..."
                        value={textareaValue}
                        onChange={(e) => setTextareaValue(e.target.value)}
                        className={cn(
                          "min-h-[100px] rounded-xl font-light resize-y border-2 border-neutral-200",
                          "hover:border-neutral-300 focus-visible:border-current transition-colors",
                          `focus-visible:${scheme.from.replace("from-", "border-").replace("-500", "-400")}`
                        )}
                      />
                      <p className="text-xs font-light text-neutral-500">
                        {textareaValue.length} characters
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="textarea-2" className="text-sm font-light text-neutral-700">
                        AI Smart Filter Example
                      </Label>
                      <div className="relative group">
                        <div className={cn(
                          "absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-0 group-focus-within:opacity-10 blur-sm transition-opacity",
                          scheme.from,
                          scheme.to
                        )} />
                        <Textarea
                          id="textarea-2"
                          placeholder='e.g., "Show me recent oncology studies with imaging data in Europe"'
                          className="relative min-h-[80px] rounded-xl font-light resize-none border-2 border-neutral-200 hover:border-neutral-300 focus-visible:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-light text-neutral-700 mb-3">Custom Styled Dropdowns</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Study Phase Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-neutral-700">Study Phase</Label>
                      <div className="relative custom-dropdown">
                        <button
                          onClick={() => setSelectOpen1(!selectOpen1)}
                          className={cn(
                            "w-full h-10 pl-4 pr-10 rounded-xl border-2 font-light text-sm bg-white cursor-pointer text-left transition-all",
                            selectOpen1
                              ? cn("border-current", scheme.from.replace("from-", "border-").replace("-500", "-400"))
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          {selectedPhase}
                        </button>
                        <ChevronDown className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                          selectOpen1 && "rotate-180"
                        )} />
                        {selectOpen1 && (
                          <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {["Select phase...", "Phase I", "Phase II", "Phase III", "Phase IV"].map((option) => (
                              <button
                                key={option}
                                onClick={() => {
                                  setSelectedPhase(option)
                                  setSelectOpen1(false)
                                }}
                                className={cn(
                                  "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                                  selectedPhase === option
                                    ? cn("bg-neutral-100 text-neutral-900", scheme.from.replace("from-", "text-").replace("-500", "-700"))
                                    : "hover:bg-neutral-50"
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Geography Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-neutral-700">Geography</Label>
                      <div className="relative custom-dropdown">
                        <button
                          onClick={() => setSelectOpen2(!selectOpen2)}
                          className={cn(
                            "w-full h-10 pl-4 pr-10 rounded-xl border-2 font-light text-sm bg-white cursor-pointer text-left transition-all",
                            selectOpen2
                              ? cn("border-current", scheme.from.replace("from-", "border-").replace("-500", "-400"))
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          {selectedRegion}
                        </button>
                        <ChevronDown className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                          selectOpen2 && "rotate-180"
                        )} />
                        {selectOpen2 && (
                          <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {["Select region...", "US", "EU", "Asia", "Global"].map((option) => (
                              <button
                                key={option}
                                onClick={() => {
                                  setSelectedRegion(option)
                                  setSelectOpen2(false)
                                }}
                                className={cn(
                                  "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                                  selectedRegion === option
                                    ? cn("bg-neutral-100 text-neutral-900", scheme.from.replace("from-", "text-").replace("-500", "-700"))
                                    : "hover:bg-neutral-50"
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gradient Border Dropdown */}
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-light text-neutral-700">
                      With subtle gradient border
                    </Label>
                    <div className="relative custom-dropdown">
                      {/* Subtle gradient border */}
                      {selectOpen3 && (
                        <div className={cn(
                          "absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-30 blur-sm",
                          scheme.from,
                          scheme.to
                        )} />
                      )}
                      <div className="relative">
                        <button
                          onClick={() => setSelectOpen3(!selectOpen3)}
                          className={cn(
                            "w-full h-10 pl-4 pr-10 rounded-xl border-2 font-light text-sm bg-white cursor-pointer text-left transition-all relative",
                            selectOpen3
                              ? "border-transparent"
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          {selectedArea}
                        </button>
                        <ChevronDown className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform z-10",
                          selectOpen3 && "rotate-180"
                        )} />
                        {selectOpen3 && (
                          <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {["Therapeutic Area...", "Oncology", "Cardiovascular", "Neurology", "Endocrinology"].map((option) => (
                              <button
                                key={option}
                                onClick={() => {
                                  setSelectedArea(option)
                                  setSelectOpen3(false)
                                }}
                                className={cn(
                                  "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                                  selectedArea === option
                                    ? cn("bg-neutral-100 text-neutral-900", scheme.from.replace("from-", "text-").replace("-500", "-700"))
                                    : "hover:bg-neutral-50"
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Disabled Dropdown */}
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-light text-neutral-700">
                      Disabled state
                    </Label>
                    <div className="relative opacity-50">
                      <button
                        disabled
                        className="w-full h-10 pl-4 pr-10 rounded-xl border-2 border-neutral-200 font-light text-sm bg-neutral-50 cursor-not-allowed text-left"
                      >
                        Not available...
                      </button>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Complex Components Section */}
        <section id="complex-components" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Complex Components</h2>
            <p className="text-neutral-600 font-light">Advanced UI patterns from the DCM workflow</p>
          </div>

          {/* Smart Filter */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">AI Smart Filter</CardTitle>
              <CardDescription className="font-light">Natural language filtering with visual feedback</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative max-w-3xl">
                {/* Animated gradient border background */}
                <div className={cn(
                  "absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-75 blur-sm animate-pulse",
                  scheme.from,
                  scheme.to
                )} />

                <div className={cn(
                  "relative rounded-2xl border-2 bg-white shadow-xl transition-all p-6",
                  scheme.from.replace("from-", "border-")
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex size-12 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0",
                      scheme.from,
                      scheme.to
                    )}>
                      <Sparkles className="size-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base font-normal text-neutral-900">AI Smart Filter Active</h4>
                        <Badge className={cn(
                          "font-light text-xs",
                          scheme.from.replace("from-", "bg-"),
                          "text-white"
                        )}>
                          AI
                        </Badge>
                      </div>
                      <p className="text-sm font-light text-neutral-700 mb-3 italic">
                        "Show me recent oncology studies with imaging data in Europe"
                      </p>
                      <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                        <Check className="size-3 text-green-600" />
                        <span>
                          Actively filtering <span className="font-normal text-neutral-900">42 studies</span> based on AI analysis
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={cn(
                        "flex items-center gap-2 backdrop-blur-sm rounded-xl px-3 py-2",
                        "bg-white/50"
                      )}>
                        <span className="text-xs font-light text-neutral-600">Active</span>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Pagination Controls</CardTitle>
              <CardDescription className="font-light">Navigate through large datasets</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
                <div className="text-sm font-light text-neutral-600">
                  Showing 1-15 of 66 datasets
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg font-light border-neutral-200"
                  >
                    <ArrowLeft className="size-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      className={cn("rounded-lg font-light w-9 h-9 bg-gradient-to-r text-white border-0", scheme.from, scheme.to)}
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg font-light w-9 h-9 border-neutral-200"
                    >
                      2
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg font-light w-9 h-9 border-neutral-200"
                    >
                      3
                    </Button>
                    <span className="px-2 text-neutral-400">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg font-light w-9 h-9 border-neutral-200"
                    >
                      5
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg font-light border-neutral-200"
                  >
                    Next
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Items Card */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Selected Items Sidebar</CardTitle>
              <CardDescription className="font-light">Quick access to selected datasets with removal</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-xs space-y-2">
                {[
                  { code: "DCODE-123", name: "Breast Cancer Biomarker Study", patients: "856", phase: "III" },
                  { code: "DCODE-456", name: "Cardiovascular Outcomes Trial", patients: "1,240", phase: "IV" },
                ].map((dataset, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-xl border-2 p-3 transition-all group hover:shadow-md",
                      scheme.from.replace("from-", "border-").replace("500", "100"),
                      "bg-white"
                    )}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-light">
                            {dataset.code}
                          </Badge>
                          <Badge className="text-xs font-light bg-green-100 text-green-800">
                            Closed
                          </Badge>
                        </div>
                        <h4 className="text-sm font-normal text-neutral-900 mb-1 line-clamp-2">
                          {dataset.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                          <span>{dataset.patients} pts</span>
                          <span>•</span>
                          <span>Phase {dataset.phase}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg font-light h-7 w-7 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4 text-neutral-500 hover:text-red-600" />
                      </Button>
                    </div>

                    {/* Mini Access Breakdown */}
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-neutral-100">
                      <div className="bg-green-500" style={{ width: "45%" }} />
                      <div className={cn("bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: "30%" }} />
                      <div className="bg-amber-500" style={{ width: "20%" }} />
                      <div className="bg-neutral-400" style={{ width: "5%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Cards */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Notification Cards</CardTitle>
              <CardDescription className="font-light">Action-oriented notification system</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-2xl space-y-3">
                {/* Critical Notification */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500">
                    <AlertCircle className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-normal text-red-900">Access Blocker</h4>
                      <Badge className="text-xs font-light bg-red-100 text-red-700 border-0">
                        Critical
                      </Badge>
                    </div>
                    <p className="text-sm font-light text-red-800 mb-2">
                      DCODE-789 requires immediate approval from compliance team
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 rounded-lg font-light border-red-300 text-red-700 hover:bg-red-100">
                        View Details
                      </Button>
                      <Button size="sm" className="h-8 rounded-lg font-light bg-red-600 text-white hover:bg-red-700">
                        Resolve Now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info Notification */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <Info className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-normal text-blue-900">Collection Update</h4>
                      <Badge className="text-xs font-light bg-blue-100 text-blue-700 border-0">
                        Info
                      </Badge>
                    </div>
                    <p className="text-sm font-light text-blue-800">
                      Your collection "Q4 Oncology Research" now has 3 new datasets available
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section id="cards" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Cards & Containers</h2>
            <p className="text-neutral-600 font-light">Various card styles and layouts</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Basic Card */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 bg-white">
                <CardTitle className="text-base font-light">Basic Card</CardTitle>
                <CardDescription className="font-light">Simple card layout</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm font-light text-neutral-600">
                  Standard card with header, content, and footer sections.
                </p>
              </CardContent>
              <CardFooter className="border-t border-neutral-100 bg-neutral-50">
                <Button variant="ghost" size="sm" className="font-light">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            {/* Hover Card */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <CardHeader className="border-b border-neutral-100 bg-white">
                <CardTitle className="text-base font-light">Hover Effect</CardTitle>
                <CardDescription className="font-light">Try hovering over me</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm font-light text-neutral-600">
                  Card with shadow and translate animation on hover.
                </p>
              </CardContent>
            </Card>

            {/* Gradient Card */}
            <Card className={cn("rounded-2xl overflow-hidden border-0 bg-gradient-to-br", scheme.from, scheme.to)}>
              <CardHeader>
                <CardTitle className="text-base font-light text-white">Gradient Card</CardTitle>
                <CardDescription className="font-light text-white/80">With gradient background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-white/90">
                  Beautiful gradient background using theme colors.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges & Avatars Section */}
        <section id="badges" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Badges & Avatars</h2>
            <p className="text-neutral-600 font-light">Status indicators and user avatars</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Badge Variants</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Standard Variants</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Status Badges</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 rounded-full font-light">
                    <CheckCircle2 className="mr-1 size-3" />
                    Active
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 rounded-full font-light">
                    <Clock className="mr-1 size-3" />
                    Pending
                  </Badge>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 rounded-full font-light">
                    <XCircle className="mr-1 size-3" />
                    Error
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 rounded-full font-light">
                    <Info className="mr-1 size-3" />
                    Info
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Gradient Badges</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("bg-gradient-to-r text-white border-0 rounded-full font-light", scheme.from, scheme.to)}>
                    Premium
                  </Badge>
                  <Badge className={cn("bg-gradient-to-r text-white border-0 rounded-full font-light", scheme.from, scheme.to)}>
                    <Star className="mr-1 size-3 fill-current" />
                    Featured
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Avatars</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={cn("bg-gradient-to-br text-white font-light", scheme.from, scheme.to)}>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-neutral-100 text-neutral-600 font-light">AB</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-light">SC</AvatarFallback>
                  </Avatar>
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-white">
                      <AvatarFallback className={cn("bg-gradient-to-br text-white font-light text-xs", scheme.from, scheme.to)}>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-white">
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-light text-xs">AB</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-white">
                      <AvatarFallback className="bg-teal-100 text-teal-700 font-light text-xs">SC</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Display Section */}
        <section id="data" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Data Display</h2>
            <p className="text-neutral-600 font-light">Tabs, lists, and data components</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Tabs Component</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-white border border-neutral-200 rounded-full p-1">
                  <TabsTrigger
                    value="overview"
                    className={cn("rounded-full font-light data-[state=active]:bg-gradient-to-r data-[state=active]:text-white", `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`)}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className={cn("rounded-full font-light data-[state=active]:bg-gradient-to-r data-[state=active]:text-white", `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`)}
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className={cn("rounded-full font-light data-[state=active]:bg-gradient-to-r data-[state=active]:text-white", `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`)}
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-sm font-light text-neutral-700">Overview content with zen styling</p>
                </TabsContent>
                <TabsContent value="analytics" className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-sm font-light text-neutral-700">Analytics data and charts</p>
                </TabsContent>
                <TabsContent value="settings" className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-sm font-light text-neutral-700">Settings and configuration</p>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Loading Skeletons</h4>
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-3/4 rounded-xl" />
                  <Skeleton className="h-12 w-1/2 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Navigation Section */}
        <section id="navigation" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Navigation</h2>
            <p className="text-neutral-600 font-light">Menus and navigation patterns</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Navigation Items</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-2">
                {[
                  { icon: Home, label: "Home", active: true },
                  { icon: Search, label: "Search", active: false },
                  { icon: Settings, label: "Settings", active: false },
                  { icon: User, label: "Profile", active: false },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={i}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-light transition-all",
                        item.active
                          ? cn("bg-gradient-to-r text-white shadow-md", scheme.from, scheme.to)
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      <Icon className="size-5" />
                      <span>{item.label}</span>
                      {item.active && <ChevronRight className="size-4 ml-auto" />}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Overlays & Dialogs Section */}
        <section id="overlays" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Overlays & Dialogs</h2>
            <p className="text-neutral-600 font-light">Modals, sheets, and tooltips</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Interactive Overlays</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Dialogs</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-full font-light">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="font-light">Beautiful Dialog</DialogTitle>
                        <DialogDescription className="font-light">
                          This is a zen-styled dialog with smooth animations
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm font-light text-neutral-600">
                          Dialogs fade in with a zoom effect and smooth backdrop blur.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="rounded-full font-light">Cancel</Button>
                        <Button className={cn("bg-gradient-to-r text-white rounded-full font-light", scheme.from, scheme.to)}>
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="rounded-full font-light">Open Sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle className="font-light">Slide-in Sheet</SheetTitle>
                        <SheetDescription className="font-light">
                          Sheets slide in from the side with smooth transitions
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6 space-y-4">
                        <p className="text-sm font-light text-neutral-600">
                          Perfect for settings panels, filters, or additional content.
                        </p>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-light text-neutral-700 mb-3">Tooltips</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="rounded-full font-light">
                          <Info className="mr-2 size-4" />
                          Hover Me
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-light">This is a helpful tooltip</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Feedback & States Section */}
        <section id="feedback" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Feedback & States</h2>
            <p className="text-neutral-600 font-light">Success, error, and loading states</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">State Indicators</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Success State */}
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500">
                      <Check className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-light text-emerald-900">Success</p>
                      <p className="text-xs font-light text-emerald-700">Operation completed</p>
                    </div>
                  </div>
                </div>

                {/* Error State */}
                <div className="p-6 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-red-500">
                      <X className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-light text-red-900">Error</p>
                      <p className="text-xs font-light text-red-700">Something went wrong</p>
                    </div>
                  </div>
                </div>

                {/* Warning State */}
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-amber-500">
                      <AlertTriangle className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-light text-amber-900">Warning</p>
                      <p className="text-xs font-light text-amber-700">Please review</p>
                    </div>
                  </div>
                </div>

                {/* Info State */}
                <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-500">
                      <Info className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-light text-blue-900">Information</p>
                      <p className="text-xs font-light text-blue-700">Helpful tip</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Animations Section */}
        <section id="animations" className="space-y-6">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Animations</h2>
            <p className="text-neutral-600 font-light">Smooth transitions and effects</p>
          </div>

          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <CardTitle className="text-lg font-light text-neutral-900">Animation Showcase</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-4">
                {/* Pulse */}
                <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Circle className={cn("size-6 animate-pulse fill-current", scheme.from.replace("from-", "text-"))} />
                  </div>
                  <p className="text-sm font-light text-neutral-700">Pulse</p>
                  <code className="text-xs text-neutral-500">animate-pulse</code>
                </div>

                {/* Spin */}
                <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Loader2 className={cn("size-6 animate-spin", scheme.from.replace("from-", "text-"))} />
                  </div>
                  <p className="text-sm font-light text-neutral-700">Spin</p>
                  <code className="text-xs text-neutral-500">animate-spin</code>
                </div>

                {/* Hover Translate */}
                <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
                  <div className="flex items-center justify-center mb-3">
                    <TrendingUp className={cn("size-6", scheme.from.replace("from-", "text-"))} />
                  </div>
                  <p className="text-sm font-light text-neutral-700">Hover Lift</p>
                  <code className="text-xs text-neutral-500">-translate-y-2</code>
                </div>

                {/* Hover Scale */}
                <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="flex items-center justify-center mb-3">
                    <Sparkles className={cn("size-6", scheme.from.replace("from-", "text-"))} />
                  </div>
                  <p className="text-sm font-light text-neutral-700">Hover Scale</p>
                  <code className="text-xs text-neutral-500">scale-105</code>
                </div>

                {/* Shadow Transition */}
                <div className="p-6 rounded-xl bg-white border border-neutral-200 text-center shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="flex items-center justify-center mb-3">
                    <Zap className={cn("size-6", scheme.from.replace("from-", "text-"))} />
                  </div>
                  <p className="text-sm font-light text-neutral-700">Shadow Lift</p>
                  <code className="text-xs text-neutral-500">shadow-xl</code>
                </div>

                {/* Gradient Transition */}
                <div className={cn("p-6 rounded-xl border-0 text-center text-white cursor-pointer bg-gradient-to-r hover:shadow-lg transition-all duration-300", scheme.from, scheme.to)}>
                  <div className="flex items-center justify-center mb-3">
                    <Heart className="size-6 fill-current" />
                  </div>
                  <p className="text-sm font-light">Gradient</p>
                  <code className="text-xs text-white/70">bg-gradient-to-r</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className={cn("rounded-2xl p-8 text-center border bg-gradient-to-br", scheme.bg, scheme.bgHover, `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`)} >
          <Sparkles className={cn("size-8 mx-auto mb-4", scheme.from.replace("from-", "text-"))} />
          <h3 className="text-2xl font-light text-neutral-900 mb-2">Beautiful, Consistent, Zen</h3>
          <p className="text-neutral-600 font-light max-w-md mx-auto">
            A complete design system with smooth animations, dynamic theming, and thoughtful interactions
          </p>
        </div>
      </div>
    </div>
  )
}
