"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Database,
  Clock,
  CheckCircle2,
  Users,
  Leaf,
  Circle,
  Sparkles,
  Wind,
} from "lucide-react"
import { useColorScheme } from "@/app/ux/_components/ux14-color-context"
import { cn } from "@/lib/utils"

export default function UX14DashboardPage() {
  const { scheme } = useColorScheme()
  return (
    <>
      {/* Breathing Space */}
      <div className="mb-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Circle className={cn("size-1.5 fill-current animate-pulse", scheme.from.replace("from-", "text-").replace("-500", "-400"))} />
          <Circle className={cn("size-1.5 fill-current animate-pulse", scheme.to.replace("to-", "text-").replace("-500", "-400"))} style={{ animationDelay: "0.3s" }} />
          <Circle className={cn("size-1.5 fill-current animate-pulse", scheme.from.replace("from-", "text-").replace("-500", "-400"))} style={{ animationDelay: "0.6s" }} />
        </div>

        <h1 className="text-6xl font-extralight text-neutral-800 mb-6 tracking-tight">
          Welcome
        </h1>
        <p className="text-xl font-extralight text-neutral-500 max-w-xl mx-auto leading-relaxed">
          A peaceful space for data exploration
        </p>
      </div>

      {/* Search - Ultra Minimal */}
      <div className="mb-24">
        <div className="relative max-w-2xl mx-auto">
          <Sparkles className={cn("absolute left-6 top-1/2 size-5 -translate-y-1/2", scheme.from.replace("from-", "text-").replace("-500", "-400/60"))} />
          <Input
            placeholder="What would you like to explore today?"
            className={cn("h-16 pl-16 rounded-3xl bg-white/80 backdrop-blur-sm text-base font-extralight shadow-sm transition-all",
              `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
              `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/20")}`,
              `focus:border-${scheme.from.replace("from-", "").replace("-500", "-300/50")}`,
              `focus:shadow-${scheme.from.replace("from-", "").replace("-500", "-200/30")}`
            )}
          />
        </div>
      </div>

      {/* Stats - Soft Cards */}
      <div className="grid grid-cols-4 gap-6 mb-20">
        {[
          { label: "Datasets", value: "1,284", icon: Database },
          { label: "Pending", value: "8", icon: Clock },
          { label: "Complete", value: "23", icon: CheckCircle2 },
          { label: "Users", value: "142", icon: Users },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i}>
              <div className={cn("bg-white/70 backdrop-blur-sm rounded-3xl p-8 border hover:shadow-lg transition-all duration-500 group",
                `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
                `hover:shadow-${scheme.from.replace("from-", "").replace("-500", "-100/20")}`
              )}>
                <div className="flex items-center justify-center mb-6">
                  <div className={cn("flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br border",
                    scheme.from.replace("from-", "from-").replace("-500", "-400/10"),
                    scheme.to.replace("to-", "to-").replace("-500", "-300/10"),
                    `border-${scheme.from.replace("from-", "").replace("-500", "-200/30")}`
                  )}>
                    <Icon className={cn("size-6", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))} />
                  </div>
                </div>
                <p className={cn("text-sm font-extralight mb-2 text-center uppercase tracking-widest",
                  scheme.from.replace("from-", "text-").replace("-500", "-600/60")
                )}>
                  {stat.label}
                </p>
                <p className="text-4xl font-extralight text-neutral-800 text-center">
                  {stat.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Nature-Inspired Section */}
      <div className="grid grid-cols-2 gap-8 mb-20">
        {/* Calm Card */}
        <Card className={cn("rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm",
          `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
          `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/10")}`
        )}>
          <CardHeader className={cn("border-b bg-gradient-to-br to-transparent pb-8",
            `border-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`,
            scheme.bg.replace("from-", "from-").replace("-50", "-50/30")
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("flex size-12 items-center justify-center rounded-2xl border",
                scheme.from.replace("from-", "bg-").replace("-500", "-400/10"),
                `border-${scheme.from.replace("from-", "").replace("-500", "-200/30")}`
              )}>
                <Leaf className={cn("size-6", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))} />
              </div>
              <CardTitle className="text-xl font-extralight text-neutral-800">Recent Growth</CardTitle>
            </div>
            <CardDescription className="font-extralight text-neutral-500">
              Your data ecosystem flourishing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-5">
            {[
              { user: "Sarah", action: "cultivated", dataset: "Clinical Trial Data", time: "moments ago" },
              { user: "Michael", action: "nurtured", dataset: "Research Archive", time: "recently" },
              { user: "Emily", action: "explored", dataset: "Demographics", time: "earlier" },
            ].map((activity, i) => (
              <div key={i} className={cn("flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-50/30")}`
              )}>
                <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br border",
                  scheme.from.replace("from-", "from-").replace("-500", "-400/20"),
                  scheme.to.replace("to-", "to-").replace("-500", "-400/20"),
                  `border-${scheme.from.replace("from-", "").replace("-500", "-200/40")}`
                )}>
                  <span className={cn("text-xs font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-700"))}>
                    {activity.user[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extralight text-neutral-700 mb-1">
                    <span className="font-light">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs font-extralight text-neutral-500 truncate">{activity.dataset}</p>
                </div>
                <span className={cn("text-xs font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-500/60"))}>{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Breath Card */}
        <Card className={cn("rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm",
          `border-${scheme.to.replace("to-", "").replace("-500", "-100/50")}`,
          `shadow-${scheme.to.replace("to-", "").replace("-500", "-100/10")}`
        )}>
          <CardHeader className={cn("border-b bg-gradient-to-br to-transparent pb-8",
            `border-${scheme.to.replace("to-", "").replace("-500", "-50/50")}`,
            scheme.bgHover.replace("to-", "from-").replace("-50", "-50/30")
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("flex size-12 items-center justify-center rounded-2xl border",
                scheme.to.replace("to-", "bg-").replace("-500", "-400/10"),
                `border-${scheme.to.replace("to-", "").replace("-500", "-200/30")}`
              )}>
                <Wind className={cn("size-6", scheme.to.replace("to-", "text-").replace("-500", "-600/70"))} />
              </div>
              <CardTitle className="text-xl font-extralight text-neutral-800">Gentle Actions</CardTitle>
            </div>
            <CardDescription className="font-extralight text-neutral-500">
              Mindful next steps
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-4">
            {["Begin new journey", "Reflect on insights", "Share discoveries"].map((action, i) => (
              <button
                key={i}
                className={cn("w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r border transition-all duration-300 group",
                  scheme.to.replace("to-", "from-").replace("-500", "-50/40"),
                  scheme.from.replace("from-", "to-").replace("-500", "-50/40"),
                  `border-${scheme.to.replace("to-", "").replace("-500", "-100/40")}`,
                  `hover:from-${scheme.to.replace("to-", "").replace("-500", "-100/50")}`,
                  `hover:to-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
                  `hover:border-${scheme.to.replace("to-", "").replace("-500", "-200/60")}`
                )}
              >
                <span className="text-sm font-extralight text-neutral-700">{action}</span>
                <Circle className={cn("size-2 fill-current group-hover:scale-150 transition-transform duration-300",
                  scheme.to.replace("to-", "text-").replace("-500", "-400")
                )} />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Featured - Organic Layout */}
      <div className="mb-20">
        <h2 className="text-3xl font-extralight text-neutral-800 mb-10 text-center">Cultivated Collections</h2>
        <div className="space-y-5">
          {[
            { name: "Clinical Trial Data Q4 2024", category: "Trials", growth: "Thriving" },
            { name: "Pharmacology Research Archive", category: "Research", growth: "Growing" },
            { name: "Patient Demographics Study 2024", category: "Demographics", growth: "Stable" },
          ].map((dataset, i) => (
            <div key={i} className="group">
              <div className={cn("bg-white/70 backdrop-blur-sm rounded-3xl p-8 border hover:shadow-lg transition-all duration-500",
                `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
                `hover:border-${scheme.from.replace("from-", "").replace("-500", "-200/60")}`,
                `hover:shadow-${scheme.from.replace("from-", "").replace("-500", "-100/20")}`
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={cn("flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br border",
                      scheme.from.replace("from-", "from-").replace("-500", "-400/10"),
                      scheme.to.replace("to-", "to-").replace("-500", "-400/10"),
                      `border-${scheme.from.replace("from-", "").replace("-500", "-200/40")}`
                    )}>
                      <span className={cn("text-lg font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-700"))}>{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-light text-neutral-800 mb-2">{dataset.name}</h3>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={cn("font-extralight rounded-full",
                            `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                            scheme.from.replace("from-", "text-").replace("-500", "-700/70"),
                            scheme.from.replace("from-", "bg-").replace("-500", "-50/30")
                          )}
                        >
                          {dataset.category}
                        </Badge>
                        <span className={cn("text-sm font-extralight", scheme.to.replace("to-", "text-").replace("-500", "-600/70"))}>{dataset.growth}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("rounded-full font-extralight transition-all duration-300",
                      `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                      `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`,
                      `hover:border-${scheme.from.replace("from-", "").replace("-500", "-300/60")}`
                    )}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Breath */}
      <div className={cn("rounded-3xl p-16 text-center bg-gradient-to-br border",
        scheme.bg.replace("from-", "from-").replace("-50", "-50/40"),
        `via-${scheme.to.replace("to-", "").replace("-500", "-50/30")}`,
        scheme.bg.replace("from-", "to-").replace("-50", "-50/40"),
        `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`
      )}>
        <div className={cn("flex size-20 items-center justify-center rounded-3xl bg-white/80 border mx-auto mb-8 shadow-sm",
          `border-${scheme.from.replace("from-", "").replace("-500", "-200/40")}`,
          `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/20")}`
        )}>
          <Leaf className={cn("size-9", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))} />
        </div>
        <h3 className="text-3xl font-extralight text-neutral-800 mb-4">System Harmony</h3>
        <p className="text-neutral-600 font-extralight mb-8 max-w-md mx-auto leading-relaxed">
          All systems flowing peacefully
        </p>
        <Button className={cn("bg-gradient-to-r text-white rounded-full px-10 py-6 font-extralight shadow-lg hover:shadow-xl transition-all duration-300",
          scheme.from.replace("from-", "from-").replace("-500", "-500/90"),
          scheme.to.replace("to-", "to-").replace("-500", "-500/90"),
          `hover:from-${scheme.from.replace("from-", "").replace("-500", "-500")}`,
          `hover:to-${scheme.to.replace("to-", "").replace("-500", "-500")}`,
          `shadow-${scheme.from.replace("from-", "").replace("-500", "-200/30")}`,
          `hover:shadow-${scheme.from.replace("from-", "").replace("-500", "-300/40")}`
        )}>
          View Insights
        </Button>
      </div>
    </>
  )
}
