"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Users,
  Database,
  Calendar,
  Check,
  X,
  AlertTriangle,
  Zap,
  Clock,
  FileText,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react"

// Mock collection data
const MOCK_COLLECTION = {
  id: "col-1",
  name: "Oncology ctDNA Outcomes Collection",
  description: "Curated collection of Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms. Suitable for outcomes research, biomarker analysis, and multimodal data fusion.",
  purpose: "Curated for oncology researchers studying ctDNA dynamics and immunotherapy response in lung cancer patients.",
  targetAudience: "Oncology Data Scientists and Biostatisticians studying immunotherapy response and ctDNA dynamics",
  createdBy: "Divya (DCM)",
  createdAt: new Date("2025-11-11"),
  updatedAt: new Date("2025-11-15"),
  totalDatasets: 16,
  totalUsers: 120,
  therapeuticAreas: ["Oncology", "Immuno-Oncology"],
  studyPhases: ["Phase III"],
  // Agreement of Terms
  agreementOfTerms: {
    primaryUse: {
      understandDrugMechanism: true,
      understandDisease: true,
      developDiagnosticTests: true,
      learnFromPastStudies: true,
      improveAnalysisMethods: true,
    },
    beyondPrimaryUse: {
      aiResearch: true,
      softwareDevelopment: false,
    },
    publication: {
      internalCompanyRestricted: true,
      externalPublication: true,
    },
    externalSharing: {
      allowed: true,
      process: "Standard External Sharing process applies",
    },
  },
  // User access breakdown (personalized)
  accessBreakdown: {
    instant: 8,
    approvalRequired: 8,
    estimatedDays: "2-3",
  },
  // Datasets
  datasets: [
    { code: "DCODE-001", name: "NSCLC Genomic Profiling", phase: "Phase III", patients: 890, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-023", name: "Lung Cancer Survival Outcomes", phase: "Phase III", patients: 1200, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-042", name: "NSCLC ctDNA Monitoring", phase: "Phase III", patients: 890, status: "Closed", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-045", name: "Immunotherapy Response Study", phase: "Phase III", patients: 650, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-067", name: "Immunotherapy Response Phase III", phase: "Phase III", patients: 780, status: "Closed", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-088", name: "Lung Cancer Clinical Outcomes", phase: "Phase III", patients: 920, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-102", name: "PET Imaging Substudy", phase: "Phase III", patients: 340, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-134", name: "Biomarker Validation Study", phase: "Phase III", patients: 560, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-156", name: "Active NSCLC Trial", phase: "Phase III", patients: 1100, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-178", name: "Ongoing Immunotherapy Study", phase: "Phase III", patients: 890, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-189", name: "Multi-Site Biomarker Trial", phase: "Phase III", patients: 1450, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-201", name: "Phase III Active Study", phase: "Phase III", patients: 780, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-223", name: "Multi-Regional Study", phase: "Phase III", patients: 2100, status: "Closed", accessStatus: "approval", approvalTeam: "TALT-Legal" },
    { code: "DCODE-267", name: "European Consortium Study", phase: "Phase III", patients: 1800, status: "Closed", accessStatus: "approval", approvalTeam: "TALT-Legal" },
    { code: "DCODE-288", name: "ctDNA Dynamics Study", phase: "Phase III", patients: 670, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-312", name: "Response Prediction Analysis", phase: "Phase III", patients: 890, status: "Closed", accessStatus: "instant" },
  ],
  // Who's using
  usageStats: {
    organizations: [
      { name: "Oncology Biometrics", users: 45 },
      { name: "Oncology Data Science", users: 60 },
      { name: "Translational Medicine - Oncology", users: 15 },
    ],
    commonActivities: [
      "Biomarker outcome analysis",
      "Immunotherapy response prediction",
      "Multimodal data fusion",
    ],
  },
}

export default function CollectionDetailPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  const collection = MOCK_COLLECTION // In real app, fetch by params.id

  const instantCount = collection.datasets.filter(d => d.accessStatus === "instant").length
  const approvalCount = collection.datasets.filter(d => d.accessStatus === "approval").length

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/collectoid/collections")}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Collections
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2">
              {collection.name}
            </h1>
            <div className="flex items-center gap-4 text-sm font-light text-neutral-600 mb-4">
              <span>Created by {collection.createdBy}</span>
              <span>•</span>
              <span>Updated {collection.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-light text-neutral-600">
                <Users className="size-4" />
                <span>{collection.totalUsers} users</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-light text-neutral-600">
                <Database className="size-4" />
                <span>{collection.totalDatasets} datasets</span>
              </div>
              <Badge className="bg-green-100 text-green-700 font-light text-xs">
                ✅ Matches your intent
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/collectoid/collections/${params.id}/request`)}
              className="h-12 rounded-2xl font-light border-neutral-200"
            >
              Request Access
            </Button>
            <Button
              onClick={() => router.push(`/collectoid/collections/${params.id}/customize`)}
              className={cn(
                "h-12 rounded-2xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
                scheme.from,
                scheme.to
              )}
            >
              <Sparkles className="size-4 mr-2" />
              Request Access + Customize
            </Button>
          </div>
        </div>
      </div>

      {/* Your Access Status Card */}
      <Card className={cn(
        "border-2 rounded-2xl overflow-hidden mb-8",
        scheme.from.replace("from-", "border-").replace("-500", "-200")
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className={cn("size-5", scheme.from.replace("from-", "text-"))} />
            <h3 className="text-lg font-normal text-neutral-900">Your Access Status</h3>
          </div>
          <p className="text-sm font-light text-neutral-600 mb-4">
            Based on your role and department:
          </p>

          {/* Access Breakdown Bar */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-neutral-100">
                  <div
                    className="bg-green-500 transition-all"
                    style={{ width: `${(instantCount / collection.totalDatasets) * 100}%` }}
                  />
                  <div
                    className="bg-amber-500 transition-all"
                    style={{ width: `${(approvalCount / collection.totalDatasets) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm font-light">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-green-500" />
                <span className="text-neutral-700">⚡ {instantCount} datasets: Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-amber-500" />
                <span className="text-neutral-700">⏳ {approvalCount} datasets: Approval Required</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <Clock className="size-4 text-blue-600 shrink-0" />
            <span className="text-sm font-light text-blue-800">
              Estimated time to full access: <span className="font-normal">{collection.accessBreakdown.estimatedDays} business days</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-neutral-200 rounded-full p-1">
          {[
            { value: "overview", label: "Overview" },
            { value: "datasets", label: `Datasets (${collection.totalDatasets})` },
            { value: "terms", label: "Agreement of Terms" },
            { value: "activity", label: "Activity" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "rounded-full font-light data-[state=active]:bg-gradient-to-r data-[state=active]:text-white",
                `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Purpose */}
            <Card className="col-span-2 border-neutral-200 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-base font-normal text-neutral-900 mb-3">Purpose</h3>
                <p className="text-sm font-light text-neutral-600 mb-4">
                  {collection.description}
                </p>
                <h4 className="text-sm font-normal text-neutral-900 mb-2">Target Audience</h4>
                <p className="text-sm font-light text-neutral-600">
                  {collection.targetAudience}
                </p>
              </CardContent>
            </Card>

            {/* Quick AoT Summary */}
            <Card className="border-neutral-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="size-5 text-neutral-700" />
                  <h3 className="text-base font-normal text-neutral-900">Allowed Uses</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-neutral-600">ML/AI Research</span>
                    <Badge className={cn(
                      "text-xs font-light",
                      collection.agreementOfTerms.beyondPrimaryUse.aiResearch
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {collection.agreementOfTerms.beyondPrimaryUse.aiResearch ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-neutral-600">Software Dev</span>
                    <Badge className={cn(
                      "text-xs font-light",
                      collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-neutral-600">Publication</span>
                    <Badge className={cn(
                      "text-xs font-light",
                      collection.agreementOfTerms.publication.externalPublication
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {collection.agreementOfTerms.publication.externalPublication ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="link"
                  className="mt-4 p-0 h-auto font-light text-sm"
                  onClick={() => setActiveTab("terms")}
                >
                  View Full Agreement of Terms →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Who's Using */}
          <Card className="border-neutral-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="size-5 text-neutral-700" />
                <h3 className="text-base font-normal text-neutral-900">Who's Using This Collection</h3>
              </div>
              <p className="text-sm font-light text-neutral-600 mb-4">
                {collection.totalUsers} researchers across {collection.usageStats.organizations.length} organizations:
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-normal text-neutral-700 mb-2">Organizations</h4>
                  <ul className="space-y-1">
                    {collection.usageStats.organizations.map((org) => (
                      <li key={org.name} className="text-sm font-light text-neutral-600">
                        • {org.name} ({org.users} users)
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-normal text-neutral-700 mb-2">Common Activities</h4>
                  <ul className="space-y-1">
                    {collection.usageStats.commonActivities.map((activity) => (
                      <li key={activity} className="text-sm font-light text-neutral-600">
                        • {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-600">
              {collection.totalDatasets} datasets in this collection
            </p>
          </div>

          {collection.datasets.map((dataset) => (
            <Card
              key={dataset.code}
              className="border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      {dataset.code}
                    </Badge>
                    <div>
                      <h4 className="text-sm font-normal text-neutral-900">{dataset.name}</h4>
                      <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                        <span>{dataset.phase}</span>
                        <span>•</span>
                        <span>{dataset.patients.toLocaleString()} patients</span>
                        <span>•</span>
                        <Badge className={cn(
                          "text-xs font-light",
                          dataset.status === "Closed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        )}>
                          {dataset.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {dataset.accessStatus === "instant" ? (
                      <Badge className="bg-green-100 text-green-700 font-light text-xs">
                        ⚡ Instant Access
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 font-light text-xs">
                        ⏳ {dataset.approvalTeam}
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Agreement of Terms Tab */}
        <TabsContent value="terms" className="space-y-6">
          <Card className="border-neutral-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="size-5 text-neutral-700" />
                <h3 className="text-lg font-normal text-neutral-900">Agreement of Terms</h3>
              </div>

              {/* Primary Use */}
              <div className="mb-6">
                <h4 className="text-sm font-normal text-neutral-900 mb-3">Primary Use (IMI-Guided Protocol)</h4>
                <div className="space-y-2">
                  {[
                    { key: "understandDrugMechanism", label: "Understand how drugs work in the body" },
                    { key: "understandDisease", label: "Better understand disease and health problems" },
                    { key: "developDiagnosticTests", label: "Develop diagnostic tests for disease" },
                    { key: "learnFromPastStudies", label: "Learn from past studies to plan new studies" },
                    { key: "improveAnalysisMethods", label: "Improve scientific analysis methods" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      {collection.agreementOfTerms.primaryUse[item.key as keyof typeof collection.agreementOfTerms.primaryUse] ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-light text-neutral-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beyond Primary Use */}
              <div className="mb-6">
                <h4 className="text-sm font-normal text-neutral-900 mb-3">Beyond Primary Use</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {collection.agreementOfTerms.beyondPrimaryUse.aiResearch ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <X className="size-4 text-red-600" />
                    )}
                    <span className="text-sm font-light text-neutral-700">AI research / AI model training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <X className="size-4 text-red-600" />
                    )}
                    <span className="text-sm font-light text-neutral-700">Software development and testing</span>
                  </div>
                </div>
              </div>

              {/* Publication */}
              <div className="mb-6">
                <h4 className="text-sm font-normal text-neutral-900 mb-3">Publication</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {collection.agreementOfTerms.publication.internalCompanyRestricted ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <X className="size-4 text-red-600" />
                    )}
                    <span className="text-sm font-light text-neutral-700">Internal 'company restricted' findings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {collection.agreementOfTerms.publication.externalPublication ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <X className="size-4 text-red-600" />
                    )}
                    <span className="text-sm font-light text-neutral-700">External publication</span>
                  </div>
                </div>
              </div>

              {/* External Sharing */}
              <div>
                <h4 className="text-sm font-normal text-neutral-900 mb-3">External Sharing</h4>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-light text-amber-800">
                    {collection.agreementOfTerms.externalSharing.process}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="border-neutral-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="size-5 text-neutral-700" />
                <h3 className="text-base font-normal text-neutral-900">Recent Activity</h3>
              </div>
              <p className="text-sm font-light text-neutral-600">
                Activity tracking coming soon. This will show recent changes, user access, and discussions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
