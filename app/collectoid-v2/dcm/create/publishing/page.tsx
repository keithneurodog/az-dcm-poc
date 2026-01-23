"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useColorScheme } from "@/app/collectoid-v2/_components"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Users,
  Send,
  FileSearch,
  Mail,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Clock,
  Info,
  MessageCircle,
  BookOpen,
  HelpCircle,
  Headphones,
} from "lucide-react"
import { Dataset } from "@/lib/dcm-mock-data"

export default function DCMPublishingPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [collectionName, setCollectionName] = useState("")
  const [totalUsers, setTotalUsers] = useState(0)
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Get data from sessionStorage
    if (typeof window !== "undefined") {
      const storedName = sessionStorage.getItem("dcm_collection_name")
      const storedUsers = sessionStorage.getItem("dcm_total_users")
      const storedDatasets = sessionStorage.getItem("dcm_selected_datasets")

      if (!storedName) {
        router.push("/collectoid-v2/dcm/create")
        return
      }

      if (storedName) setCollectionName(storedName)
      if (storedUsers) setTotalUsers(parseInt(storedUsers))
      if (storedDatasets) setSelectedDatasets(JSON.parse(storedDatasets))
    }

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 70) {
          clearInterval(interval)
          return 70
        }
        return prev + 10
      })
    }, 800)

    return () => clearInterval(interval)
  }, [router])

  const calculateAccessBreakdown = () => {
    const total = selectedDatasets.length
    const breakdown = {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 0,
      missingLocation: 0,
    }

    selectedDatasets.forEach((dataset) => {
      breakdown.alreadyOpen += dataset.accessBreakdown.alreadyOpen
      breakdown.readyToGrant += dataset.accessBreakdown.readyToGrant
      breakdown.needsApproval += dataset.accessBreakdown.needsApproval
      breakdown.missingLocation += dataset.accessBreakdown.missingLocation
    })

    return {
      alreadyOpen: Math.round(breakdown.alreadyOpen / total),
      readyToGrant: Math.round(breakdown.readyToGrant / total),
      needsApproval: Math.round(breakdown.needsApproval / total),
      missingLocation: Math.round(breakdown.missingLocation / total),
    }
  }

  const accessBreakdown = calculateAccessBreakdown()
  const usersWithImmediateAccess = Math.round((totalUsers * 50) / 100)
  const usersAfterInstantGrant = Math.round((totalUsers * 90) / 100)

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 7 of 7</span>
        <span className="text-xs text-neutral-300">|</span>
        <span className="text-xs font-light text-neutral-600">Published</span>
      </div>

      {/* Success Header */}
      <div className="text-center mb-12">
        <div
          className={cn(
            "inline-flex items-center justify-center size-20 rounded-full mb-6 bg-gradient-to-br shadow-lg",
            scheme.from,
            scheme.to
          )}
        >
          <CheckCircle2 className="size-10 text-white" />
        </div>
        <h1 className="text-3xl font-extralight text-neutral-900 mb-4 tracking-tight">
          Collection Published!
        </h1>
        <p className="text-base font-light text-neutral-600 max-w-2xl mx-auto">
          &quot;{collectionName}&quot; has been created and Collectoid is now executing your provisioning plan
        </p>
      </div>

      {/* Immediate Actions Complete */}
      <Card className="border-2 border-green-200 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="size-6 text-green-600" />
            <h3 className="text-lg font-normal text-neutral-900">Immediate Actions (Complete)</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-normal text-green-900">
                  Collection metadata saved to catalog
                </p>
                <p className="text-xs font-light text-green-700">
                  {selectedDatasets.length} datasets added • Created at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-normal text-green-900">
                  {usersWithImmediateAccess} users granted immediate access ({accessBreakdown.alreadyOpen}% - {Math.round((selectedDatasets.length * accessBreakdown.alreadyOpen) / 100)} datasets)
                </p>
                <p className="text-xs font-light text-green-700">
                  Email notifications sent to users with immediate access
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card
        className={cn(
          "border-2 rounded-2xl overflow-hidden mb-6",
          scheme.from.replace("from-", "border-")
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Loader2 className={cn("size-6 animate-spin", scheme.from.replace("from-", "text-"))} />
            <h3 className="text-lg font-normal text-neutral-900">In Progress</h3>
          </div>

          <div className="space-y-4">
            {/* Instant Grant */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <Sparkles className={cn("size-5 shrink-0 mt-1", scheme.from.replace("from-", "text-"))} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-normal text-neutral-900">
                      Generating Immuta policies for instant grant
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-light",
                        scheme.from.replace("from-", "border-").replace("500", "200"),
                        scheme.from.replace("from-", "text-")
                      )}
                    >
                      {progress}% complete
                    </Badge>
                  </div>
                  <p className="text-xs font-light text-neutral-600 mb-3">
                    • {Math.round((selectedDatasets.length * accessBreakdown.readyToGrant) / 100)} datasets ({accessBreakdown.readyToGrant}% category)
                  </p>
                  <p className="text-xs font-light text-neutral-600 mb-2">
                    • {usersAfterInstantGrant} users (90%) will gain access
                  </p>
                  <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                    <Clock className="size-3" />
                    <span>Estimated completion: ~{new Date(Date.now() + 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} (1 hour from publish)</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 mt-3">
                    <div
                      className={cn("h-2 rounded-full transition-all bg-gradient-to-r", scheme.from, scheme.to)}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Requests */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <Send className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-normal text-amber-900 mb-2">
                  Creating authorization requests for external approval
                </p>
                <div className="space-y-2 text-xs font-light text-amber-700">
                  <p>• {Math.round((selectedDatasets.length * accessBreakdown.needsApproval * 0.6) / 100)} requests → GPT-Oncology (est. 2-3 days)</p>
                  <p>• {Math.round((selectedDatasets.length * accessBreakdown.needsApproval * 0.4) / 100)} requests → TALT-Legal (est. 3-5 days)</p>
                  <p>• Collectoid will auto-grant upon approval</p>
                </div>
                <Badge variant="outline" className="font-light border-amber-200 text-amber-800 mt-3">
                  Monitoring for approvals
                </Badge>
              </div>
            </div>

            {/* Data Discovery */}
            {accessBreakdown.missingLocation > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <FileSearch className="size-5 text-neutral-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-normal text-neutral-900 mb-2">
                    Initiating data discovery workflow
                  </p>
                  <div className="space-y-1 text-xs font-light text-neutral-600">
                    <p>• Dataset: {selectedDatasets.find(d => d.accessBreakdown.missingLocation > 0)?.code || 'DCODE-299'}</p>
                    <p>• Data steward notification sent</p>
                    <p>• Manual search workflow started</p>
                    <p>• You&apos;ll be notified when data is located</p>
                  </div>
                </div>
              </div>
            )}

            {/* Training Reminders */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <Mail className="size-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-normal text-blue-900 mb-2">
                  Training reminder emails sent
                </p>
                <div className="space-y-1 text-xs font-light text-blue-700">
                  <p>• {Math.round((totalUsers * 10) / 100)} users notified with training links</p>
                  <p>• Auto-grant will trigger upon training completion</p>
                  <p>• No further DCM action needed</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className={cn("size-6", scheme.from.replace("from-", "text-"))} />
            <h3 className="text-lg font-normal text-neutral-900">Progress Tracking</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-light text-neutral-700">Current Status</p>
                <p className="text-sm font-normal text-neutral-900">
                  {usersWithImmediateAccess} of {totalUsers} users ({Math.round((usersWithImmediateAccess / totalUsers) * 100)}%) have some access
                </p>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-3">
                <div
                  className={cn("h-3 rounded-full bg-gradient-to-r", scheme.from, scheme.to)}
                  style={{ width: `${(usersWithImmediateAccess / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
              <div>
                <p className="text-xs font-light text-neutral-500 mb-1 uppercase tracking-wider">
                  Expected (1 hour)
                </p>
                <p className="text-lg font-normal text-neutral-900">
                  {usersAfterInstantGrant} users (90%)
                </p>
              </div>
              <div>
                <p className="text-xs font-light text-neutral-500 mb-1 uppercase tracking-wider">
                  Expected (3-5 days)
                </p>
                <p className="text-lg font-normal text-neutral-900">
                  {usersAfterInstantGrant} users (90%)
                </p>
              </div>
              <div>
                <p className="text-xs font-light text-neutral-500 mb-1 uppercase tracking-wider">
                  Final Target
                </p>
                <p className="text-lg font-normal text-neutral-900">
                  {totalUsers} users (100%)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support Panel */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "flex size-10 items-center justify-center rounded-full",
              scheme.bg.replace("500", "100")
            )}>
              <Info className={cn("size-5", scheme.from.replace("from-", "text-"))} />
            </div>
            <div>
              <h3 className="text-lg font-normal text-neutral-900">Need Help or Have Questions?</h3>
              <p className="text-sm font-light text-neutral-600">Resources and support for your data collection</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
            {/* What to Do Next */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="size-4 text-green-600" />
                <h4 className="text-sm font-normal text-neutral-900">What to Do Next</h4>
              </div>
              <div className="space-y-2 text-sm font-light text-neutral-700">
                <div className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                  <p>Monitor collection status in the live dashboard</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                  <p>Check your email for approval request confirmations</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                  <p>Users will receive notifications as access becomes available</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                  <p>No further action required from you—Collectoid handles automation</p>
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="size-4 text-blue-600" />
                <h4 className="text-sm font-normal text-neutral-900">Contact & Support</h4>
              </div>
              <div className="space-y-3">
                <a
                  href="mailto:data-science-team@example.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all group"
                >
                  <MessageCircle className="size-4 text-neutral-600 group-hover:text-neutral-900" />
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">Data Science Team</p>
                    <p className="text-xs font-light text-neutral-600">General collection questions</p>
                  </div>
                  <ExternalLink className="size-3 text-neutral-400" />
                </a>

                <a
                  href="mailto:collectoid-support@example.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all group"
                >
                  <HelpCircle className="size-4 text-neutral-600 group-hover:text-neutral-900" />
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">Collectoid Support</p>
                    <p className="text-xs font-light text-neutral-600">Technical issues & automation</p>
                  </div>
                  <ExternalLink className="size-3 text-neutral-400" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="size-4 text-neutral-600" />
              <h4 className="text-sm font-normal text-neutral-900">Helpful Resources</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg font-light text-xs hover:bg-neutral-100"
                onClick={() => window.open('#', '_blank')}
              >
                <BookOpen className="size-3 mr-1.5" />
                DCM User Guide
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg font-light text-xs hover:bg-neutral-100"
                onClick={() => window.open('#', '_blank')}
              >
                <FileSearch className="size-3 mr-1.5" />
                Training Portal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg font-light text-xs hover:bg-neutral-100"
                onClick={() => window.open('#', '_blank')}
              >
                <Users className="size-3 mr-1.5" />
                Immuta Documentation
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg font-light text-xs hover:bg-neutral-100"
                onClick={() => window.open('#', '_blank')}
              >
                <TrendingUp className="size-3 mr-1.5" />
                Collection Best Practices
              </Button>
            </div>
          </div>

          {/* FAQ Callout */}
          <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4">
            <div className="flex gap-3">
              <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-normal text-blue-900 mb-2">Common Questions</p>
                <div className="space-y-1.5 text-xs font-light text-blue-700">
                  <p><span className="font-normal">Q: When will users get access?</span> Most users (90%) within 1 hour; remaining 10% after approvals and training completion.</p>
                  <p><span className="font-normal">Q: Can I edit the collection?</span> Yes, from your DCM dashboard you can add/remove datasets and users.</p>
                  <p><span className="font-normal">Q: What if approvals are delayed?</span> You can check approval status in the dashboard and follow up with governance teams directly.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 7 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Published</span>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/collectoid")}
            variant="outline"
            className="flex-1 h-12 rounded-2xl font-light border-neutral-200"
          >
            Return to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/collectoid-v2/dcm/progress")}
            className={cn(
              "flex-1 h-12 rounded-2xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
              scheme.from,
              scheme.to
            )}
          >
            <ExternalLink className="size-4 mr-2" />
            View Live Status Dashboard
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>

        <p className="text-sm font-light text-neutral-500 text-center">
          You can monitor collection progress, view detailed status, and track approvals from your DCM dashboard
        </p>
      </div>
    </div>
  )
}
