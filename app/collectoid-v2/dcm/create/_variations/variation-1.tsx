"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useColorScheme } from "@/app/collectoid-v2/_components"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  ArrowRight,
  Database,
  Lightbulb,
  Target,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Zap,
  Info,
} from "lucide-react"

export default function DCMCreateVariation1() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [intent, setIntent] = useState("")
  const [fromAnalytics, setFromAnalytics] = useState(false)

  // Check for query params from analytics page
  useEffect(() => {
    const ta = searchParams.get("ta")
    const type = searchParams.get("type")
    const intentParam = searchParams.get("intent")
    const source = searchParams.get("source")

    if (source === "analytics" || ta || type || intentParam) {
      setFromAnalytics(true)

      // Build a pre-filled intent string based on params
      const parts: string[] = []

      if (ta) {
        const taName = ta === "ONC" ? "oncology" : ta === "CARDIO" ? "cardiovascular" : ta === "IMMUNONC" ? "immuno-oncology" : ta.toLowerCase()
        parts.push(`${taName} research`)
      }

      if (type) {
        const typeName = type.toLowerCase()
        parts.push(`with ${typeName} data`)
      }

      if (intentParam) {
        const intentName = intentParam === "AI/ML" ? "for AI/ML research" : intentParam === "Software Dev" ? "for software development" : intentParam === "Publication" ? "for external publication" : `for ${intentParam.toLowerCase()} use`
        parts.push(intentName)
      }

      if (parts.length > 0) {
        setIntent(`Create a collection for ${parts.join(" ")}`)
      }
    }
  }, [searchParams])

  const handleGetSuggestions = () => {
    // Store intent in sessionStorage for next page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_collection_intent", intent)
    }
    router.push("/collectoid-v2/dcm/create/categories")
  }

  const exampleIntents = [
    "Create a collection for oncology researchers studying ctDNA biomarkers and immunotherapy response in lung cancer patients",
    "Cardiovascular outcomes data for Phase III clinical trials with patient-reported outcomes",
    "Multi-modal imaging and genomics data for breast cancer biomarker discovery",
  ]

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 1 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Collection Purpose</span>
        </div>

        <div className="text-center">
          <div
            className={cn(
              "inline-flex items-center justify-center size-16 rounded-2xl mb-6 bg-gradient-to-br",
              scheme.bg,
              scheme.bgHover
            )}
          >
            <Database className={cn("size-8", scheme.from.replace("from-", "text-"))} />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
            Create New Collection
          </h1>
          {fromAnalytics && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-light mb-3">
              <Zap className="size-3" />
              Pre-filled based on demand analysis
            </div>
          )}
          <p className="text-base font-light text-neutral-600 max-w-2xl mx-auto mb-3">
            Tell us what you&apos;re looking for and we&apos;ll help you find the right datasets
          </p>

          {/* Help Link */}
          <Sheet>
          <SheetTrigger asChild>
            <button className={cn(
              "inline-flex items-center gap-2 text-sm font-light transition-colors",
              scheme.from.replace("from-", "text-"),
              "hover:underline"
            )}>
              <HelpCircle className="size-4" />
              New to AI-assisted data collection? Start here
            </button>
          </SheetTrigger>
          <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
            <div className="px-6 pb-6">
              <SheetHeader>
                <SheetTitle className="text-2xl font-light text-neutral-900 flex items-center gap-2">
                  <MessageSquare className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                  How to Use AI-Assisted Collection Building
                </SheetTitle>
                <SheetDescription className="font-light">
                  A simple guide to describing your data needs in natural language
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-3">Don&apos;t worry, it&apos;s easier than you think!</h3>
                  <p className="text-sm font-light text-neutral-700 leading-relaxed">
                    You don&apos;t need to use technical language or special commands. Just describe what you&apos;re looking
                    for in your own words, as if you were explaining it to a colleague. Our AI will understand
                    and help you find the right data.
                  </p>
                </div>

                <Separator />

                {/* What to Include */}
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                    <Lightbulb className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                    What Should I Include?
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                          scheme.from,
                          scheme.to
                        )}>
                          1
                        </div>
                        <div>
                          <h4 className="text-sm font-normal text-neutral-900 mb-1">Your research area or disease focus</h4>
                          <p className="text-xs font-light text-neutral-600 leading-relaxed">
                            Examples: &quot;oncology&quot;, &quot;breast cancer&quot;, &quot;cardiovascular outcomes&quot;, &quot;immunotherapy&quot;
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                          scheme.from,
                          scheme.to
                        )}>
                          2
                        </div>
                        <div>
                          <h4 className="text-sm font-normal text-neutral-900 mb-1">Types of data you need</h4>
                          <p className="text-xs font-light text-neutral-600 leading-relaxed">
                            Examples: &quot;clinical trial data&quot;, &quot;genomics&quot;, &quot;imaging scans&quot;, &quot;biomarkers&quot;, &quot;patient outcomes&quot;
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                          scheme.from,
                          scheme.to
                        )}>
                          3
                        </div>
                        <div>
                          <h4 className="text-sm font-normal text-neutral-900 mb-1">What you plan to do with it</h4>
                          <p className="text-xs font-light text-neutral-600 leading-relaxed">
                            Examples: &quot;building a predictive model&quot;, &quot;biomarker discovery&quot;, &quot;comparative analysis&quot;
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                          scheme.from,
                          scheme.to
                        )}>
                          4
                        </div>
                        <div>
                          <h4 className="text-sm font-normal text-neutral-900 mb-1">Who needs access (optional)</h4>
                          <p className="text-xs font-light text-neutral-600 leading-relaxed">
                            Examples: &quot;oncology research team&quot;, &quot;data scientists in my group&quot;, &quot;external collaborators&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Good Examples */}
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-green-600" />
                    Good Examples
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                      <Badge className="mb-2 bg-green-100 text-green-800 font-light text-xs">
                        Great example
                      </Badge>
                      <p className="text-sm font-light text-green-900 italic">
                        &quot;I need to create a collection for oncology researchers studying ctDNA biomarkers and
                        immunotherapy response in lung cancer patients&quot;
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                      <Badge className="mb-2 bg-green-100 text-green-800 font-light text-xs">
                        Great example
                      </Badge>
                      <p className="text-sm font-light text-green-900 italic">
                        &quot;Looking for cardiovascular outcomes data from Phase III trials that include patient-reported
                        outcomes and quality of life metrics for our meta-analysis&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* What Happens Next */}
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                    <Zap className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                    What Happens Next?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                      <div>
                        <p className="text-sm font-light text-neutral-700 leading-relaxed">
                          <span className="font-normal">AI analyzes your request</span> - Extracts key concepts and
                          identifies relevant data categories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                      <div>
                        <p className="text-sm font-light text-neutral-700 leading-relaxed">
                          <span className="font-normal">Suggests data categories</span> - Shows you matching categories
                          from our 30+ category taxonomy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                      <div>
                        <p className="text-sm font-light text-neutral-700 leading-relaxed">
                          <span className="font-normal">You review and refine</span> - Select or deselect categories,
                          adjust your description if needed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                      <div>
                        <p className="text-sm font-light text-neutral-700 leading-relaxed">
                          <span className="font-normal">Find matching datasets</span> - We show you all available studies
                          that match your criteria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Encouragement */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <div className="flex gap-3">
                    <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
                    <div className="text-sm font-light text-blue-900">
                      <p className="mb-2 font-normal">Remember: You&apos;re in control!</p>
                      <p className="text-blue-700 leading-relaxed">
                        The AI is here to help, not replace your expertise. You can always edit, refine, or start
                        over at any point. Think of it as having a knowledgeable assistant who knows where all
                        the data is stored.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Intent Input Card */}
      <Card className="border-neutral-200 rounded-3xl overflow-hidden shadow-sm mb-8">
        <CardContent className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-light text-neutral-700 mb-3 flex items-center gap-2">
              <Target className="size-4" />
              Describe your collection&apos;s purpose
            </label>
            <div className="relative">
              <Sparkles
                className={cn(
                  "absolute left-4 top-4 size-5",
                  scheme.from.replace("from-", "text-"),
                  intent ? "opacity-100" : "opacity-40"
                )}
              />
              <Textarea
                placeholder="Example: I need to create a collection for oncology researchers studying ctDNA biomarkers and immunotherapy response in lung cancer patients"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="pl-12 min-h-[160px] border-2 border-neutral-200 focus:border-neutral-300 rounded-2xl text-base font-light resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className={cn("rounded-xl p-4 mb-6 border", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "100"))}>
            <div className="flex gap-3">
              <Lightbulb className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
              <div>
                <p className="text-sm font-light text-neutral-700 mb-2">
                  <span className="font-normal">Tip:</span> Include details about:
                </p>
                <ul className="text-sm font-light text-neutral-600 space-y-1 ml-4">
                  <li>• Therapeutic area or disease focus</li>
                  <li>• Data types needed (clinical, genomics, imaging)</li>
                  <li>• Research focus or intended use</li>
                  <li>• Target user community</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGetSuggestions}
            disabled={intent.trim().length < 10}
            className={cn(
              "w-full h-14 text-base font-light rounded-2xl shadow-lg hover:shadow-xl transition-all",
              intent.trim().length >= 10
                ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            <Sparkles className="mr-2 size-5" />
            Get AI Suggestions
            <ArrowRight className="ml-2 size-5" />
          </Button>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/collectoid-v2/dcm/create/categories")}
              className="text-sm font-light text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center gap-1.5"
            >
              Skip AI and select categories manually
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Example Intents */}
      <div className="space-y-4">
        <p className="text-sm font-light text-neutral-600 mb-4">
          Or try one of these examples:
        </p>
        {exampleIntents.map((example, i) => (
          <button
            key={i}
            onClick={() => setIntent(example)}
            className="w-full text-left p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-white text-sm font-light bg-gradient-to-br",
                  scheme.from,
                  scheme.to
                )}
              >
                {i + 1}
              </div>
              <p className="text-sm font-light text-neutral-700 leading-relaxed pt-1">
                {example}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 1 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Collection Purpose</span>
        </div>
        <p className="text-sm font-light text-neutral-500 text-center">
          Our AI will analyze your intent and suggest relevant data categories from our 30+ category taxonomy
        </p>
      </div>
    </div>
  )
}
