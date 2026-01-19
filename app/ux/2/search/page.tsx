"use client"

import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Compass,
  Eye,
  Circle,
  Leaf,
} from "lucide-react"
import { useColorScheme } from "@/app/ux/_components/ux14-color-context"
import { cn } from "@/lib/utils"

export default function UX14SearchPage() {
  const { scheme } = useColorScheme()

  return (
    <>
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Compass className={cn("size-6", scheme.from.replace("from-", "text-").replace("-500", "-500/60"))} />
        </div>
        <h1 className="text-5xl font-extralight text-neutral-800 mb-4 tracking-tight">
          Discover
        </h1>
        <p className="text-lg font-extralight text-neutral-500">
          Explore with curiosity
        </p>
      </div>

      {/* Search */}
      <div className="mb-16">
        <div className="relative max-w-3xl mx-auto">
          <Search className={cn("absolute left-7 top-1/2 size-6 -translate-y-1/2", scheme.from.replace("from-", "text-").replace("-500", "-400/60"))} />
          <Input
            placeholder="What are you looking for?"
            className={cn("h-20 pl-16 rounded-3xl bg-white/80 backdrop-blur-sm text-lg font-extralight shadow-sm transition-all",
              `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
              `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/20")}`,
              `focus:border-${scheme.from.replace("from-", "").replace("-500", "-300/50")}`,
              `focus:shadow-${scheme.from.replace("from-", "").replace("-500", "-200/30")}`
            )}
          />
        </div>
        <div className="flex items-center justify-center gap-3 mt-8">
          {["Clinical Trials", "2024", "Public"].map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className={cn("rounded-full font-extralight bg-white/70 backdrop-blur-sm px-5 py-2 transition-colors",
                `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                scheme.from.replace("from-", "text-").replace("-500", "-700/70"),
                `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`
              )}
            >
              {filter}
              <button className={cn("ml-3 transition-colors",
                scheme.from.replace("from-", "text-").replace("-500", "-400/70"),
                `hover:text-${scheme.from.replace("from-", "").replace("-500", "-600")}`
              )}>×</button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-12 text-center">
        <p className="text-sm font-extralight text-neutral-500 flex items-center justify-center gap-2">
          <Leaf className={cn("size-4", scheme.from.replace("from-", "text-").replace("-500", "-500/60"))} />
          <span>247 discoveries await</span>
        </p>
      </div>

      {/* Results */}
      <div className="space-y-6 mb-16">
        {[
          {
            name: "Clinical Trial Data Q4 2024",
            description: "Comprehensive trial data including patient demographics, treatment outcomes, and adverse event reporting",
            category: "Clinical Trials",
            size: "2.4 GB",
            modified: "Oct 15, 2024",
            access: "Public",
          },
          {
            name: "Pharmacology Research Dataset",
            description: "Drug interaction studies, molecular compound analysis, and efficacy research data",
            category: "Pharmacology",
            size: "1.8 GB",
            modified: "Sep 28, 2024",
            access: "Restricted",
          },
          {
            name: "Patient Demographics Study 2024",
            description: "Anonymized demographic information for statistical analysis and population research",
            category: "Demographics",
            size: "890 MB",
            modified: "Aug 12, 2024",
            access: "Public",
          },
          {
            name: "Lab Results Dataset Q3",
            description: "Laboratory test results, biomarker data, and diagnostic information",
            category: "Lab Results",
            size: "1.2 GB",
            modified: "Sep 30, 2024",
            access: "Restricted",
          },
        ].map((dataset, i) => (
          <Card key={i} className={cn("rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 group bg-white/70 backdrop-blur-sm",
            `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
            `hover:shadow-${scheme.from.replace("from-", "").replace("-500", "-100/20")}`
          )}>
            <CardContent className="p-10">
              <div className="flex items-start gap-6">
                <div className={cn("flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br border group-hover:scale-105 transition-transform duration-500",
                  scheme.from.replace("from-", "from-").replace("-500", "-400/10"),
                  scheme.to.replace("to-", "to-").replace("-500", "-400/10"),
                  `border-${scheme.from.replace("from-", "").replace("-500", "-200/40")}`
                )}>
                  <span className={cn("text-xl font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-700"))}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <CardTitle className="text-2xl font-light text-neutral-800 mb-3">
                      {dataset.name}
                    </CardTitle>
                    <p className="text-sm font-extralight text-neutral-600 leading-loose">
                      {dataset.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-extralight text-neutral-500 mb-5">
                    <span>{dataset.size}</span>
                    <Circle className="size-1 fill-neutral-300" />
                    <span>{dataset.modified}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={cn("font-extralight rounded-full",
                        `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                        scheme.from.replace("from-", "text-").replace("-500", "-700/70"),
                        scheme.from.replace("from-", "bg-").replace("-500", "-50/30")
                      )}>
                        {dataset.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`font-extralight rounded-full ${
                          dataset.access === "Public"
                            ? "border-teal-200/50 text-teal-700/70 bg-teal-50/30"
                            : "border-amber-200/50 text-amber-700/70 bg-amber-50/30"
                        }`}
                      >
                        {dataset.access}
                      </Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        className={cn("bg-gradient-to-r text-white rounded-full font-extralight shadow-md hover:shadow-lg transition-all duration-300",
                          scheme.from.replace("from-", "from-").replace("-500", "-500/90"),
                          scheme.to.replace("to-", "to-").replace("-500", "-500/90"),
                          `hover:from-${scheme.from.replace("from-", "").replace("-500", "-500")}`,
                          `hover:to-${scheme.to.replace("to-", "").replace("-500", "-500")}`,
                          `shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`,
                          `hover:shadow-${scheme.from.replace("from-", "").replace("-500", "-300/30")}`
                        )}
                      >
                        <Eye className="mr-2 size-4" />
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-16 flex justify-center">
        <div className="flex items-center gap-2">
          {[1, 2, 3, "...", 21].map((page, i) => (
            <Button
              key={i}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              className={
                page === 1
                  ? cn("bg-gradient-to-r text-white rounded-full font-extralight min-w-[2.5rem] shadow-md",
                      scheme.from.replace("from-", "from-").replace("-500", "-500/90"),
                      scheme.to.replace("to-", "to-").replace("-500", "-500/90"),
                      `hover:from-${scheme.from.replace("from-", "").replace("-500", "-500")}`,
                      `hover:to-${scheme.to.replace("to-", "").replace("-500", "-500")}`,
                      `shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`
                    )
                  : cn("rounded-full font-extralight min-w-[2.5rem] bg-white/70 backdrop-blur-sm",
                      `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                      `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`
                    )
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}
