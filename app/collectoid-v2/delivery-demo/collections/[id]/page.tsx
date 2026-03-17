"use client"

import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MOCK_DATASETS } from "@/lib/dcm-mock-data"
import { ComingSoonPanel } from "../../_components"
import {
  Database,
  ClipboardList,
  Users,
  FlaskConical,
  FileCheck,
  Shield,
  MessageSquare,
  LayoutDashboard,
  Clock,
  Layers,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Hardcoded collection data
// ---------------------------------------------------------------------------

const collectionName = "Oncology Phase III \u2014 ctDNA Biomarker Outcomes"
const collectionDescription =
  "A curated collection of Phase III oncology clinical trial datasets focused on ctDNA biomarker dynamics as early response indicators. Covers immunotherapy and combination therapy trials across NSCLC, melanoma, and bladder cancer."

const timelineEvents = [
  { date: "15 Jan 2026", title: "Collection created", description: "Sarah Chen created this collection", icon: "create" },
  { date: "16 Jan 2026", title: "Datasets added", description: "8 datasets added from Oncology Phase III catalog", icon: "datasets" },
  { date: "18 Jan 2026", title: "Activities defined", description: "4 permitted activities configured across research categories", icon: "activities" },
  { date: "20 Jan 2026", title: "Data Use Terms configured", description: "Primary research use with standard publication rights", icon: "terms" },
  { date: "22 Jan 2026", title: "Promoted to Draft", description: "Collection now visible in collections browser", icon: "promote" },
  { date: "24 Jan 2026", title: "Review completed", description: "Access Provisioning Breakdown generated and reviewed", icon: "review" },
  { date: "28 Jan 2026", title: "Approved", description: "Dr. James Miller (DDO Oncology) approved the collection", icon: "approve" },
  { date: "28 Jan 2026", title: "Collection Active", description: "All governance approvals obtained \u2014 collection is now live", icon: "active" },
]

// ---------------------------------------------------------------------------
// Datasets
// ---------------------------------------------------------------------------

const demoDatasets = MOCK_DATASETS
  .filter(d => d.therapeuticArea?.includes("ONC") || d.therapeuticArea?.includes("IMMUNONC"))
  .slice(0, 8)

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DemoCollectionDetailPage() {
  const { scheme } = useColorScheme()

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* Header */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-4">
        {/* Title + badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extralight text-neutral-800">{collectionName}</h1>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-normal">
            Active
          </span>
        </div>

        {/* Description */}
        <p className="text-sm font-light text-neutral-500 max-w-3xl">{collectionDescription}</p>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-light">
          <span>Created by Sarah Chen</span>
          <span>&middot;</span>
          <span>15 January 2026</span>
          <span>&middot;</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-500">Oncology</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-500">Immuno-Oncology</span>
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "8", label: "Datasets", icon: Database },
            { value: "4", label: "Activities", icon: ClipboardList },
            { value: "35", label: "Users", icon: Users },
            { value: "2", label: "Therapeutic Areas", icon: FlaskConical },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-neutral-100 bg-white p-4 flex items-start justify-between">
              <div>
                <div className="text-2xl font-extralight text-neutral-800">{m.value}</div>
                <div className="text-xs font-light text-neutral-400">{m.label}</div>
              </div>
              <m.icon className="size-4 text-neutral-300" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Tabs */}
      {/* ----------------------------------------------------------------- */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-transparent border-b border-neutral-100 rounded-none w-full justify-start gap-1 p-0 h-auto">
          {[
            { value: "overview", label: "Overview", icon: LayoutDashboard },
            { value: "datasets", label: "Datasets", icon: Database },
            { value: "timeline", label: "Timeline", icon: Clock },
            { value: "activities", label: "Activities", icon: ClipboardList },
            { value: "terms", label: "Terms", icon: FileCheck },
            { value: "roles", label: "Roles", icon: Users },
            { value: "provisioning", label: "Provisioning", icon: Shield },
            { value: "discussion", label: "Discussion", icon: MessageSquare },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-sm font-light text-neutral-400 data-[state=active]:text-neutral-800 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 rounded-none px-4 py-2.5 bg-transparent"
            >
              <tab.icon className="size-3.5 mr-1.5" strokeWidth={1.5} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* -------------------------------------------------------------- */}
        {/* Overview Tab */}
        {/* -------------------------------------------------------------- */}
        <TabsContent value="overview">
          <div className="rounded-xl border border-neutral-100 bg-white p-6 space-y-5">
            <h2 className="text-base font-normal text-neutral-700">About this Collection</h2>
            <p className="text-sm font-light text-neutral-500">{collectionDescription}</p>

            <div className="border-t border-neutral-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {[
                {
                  label: "Governance Stage",
                  value: (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>Active</span>
                    </span>
                  ),
                },
                { label: "Request Type", value: "New Collection" },
                {
                  label: "Therapeutic Areas",
                  value: (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">ONC</span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">IMMUNONC</span>
                    </span>
                  ),
                },
                { label: "Created By", value: "Sarah Chen" },
                { label: "Created", value: "15 January 2026" },
                { label: "Last Modified", value: "28 January 2026" },
                { label: "Total Datasets", value: "8" },
                { label: "Total Users", value: "35" },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline justify-between py-1">
                  <span className="text-xs font-light text-neutral-400">{item.label}</span>
                  <span className="text-sm font-light text-neutral-700">{typeof item.value === "string" ? item.value : item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* -------------------------------------------------------------- */}
        {/* Datasets Tab */}
        {/* -------------------------------------------------------------- */}
        <TabsContent value="datasets">
          <div className="rounded-xl border border-neutral-100 bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50/50">
                  {["D-Code", "Study Name", "Therapeutic Area", "Phase", "Status", "Patients"].map((h) => (
                    <th key={h} className="text-left text-xs font-normal text-neutral-400 uppercase tracking-wider px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {demoDatasets.map((ds) => (
                  <tr key={ds.id} className="border-b border-neutral-50 text-sm font-light">
                    <td className="px-4 py-3 text-neutral-700">{ds.code}</td>
                    <td className="px-4 py-3 text-neutral-700">{ds.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex gap-1">
                        {ds.therapeuticArea.map((ta) => (
                          <span key={ta} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                            {ta}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{ds.phase}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            ds.status === "Active" || ds.status === "Closed"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          )}
                        />
                        <span className="text-neutral-600">{ds.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{ds.patientCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* -------------------------------------------------------------- */}
        {/* Timeline Tab */}
        {/* -------------------------------------------------------------- */}
        <TabsContent value="timeline">
          <div className="rounded-xl border border-neutral-100 bg-white p-6">
            <div className="relative">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="flex gap-6 py-4">
                  {/* Date */}
                  <div className="w-24 shrink-0 text-right">
                    <span className="text-xs font-light text-neutral-400">{event.date}</span>
                  </div>

                  {/* Dot + line */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={cn(
                        "size-3 rounded-full bg-gradient-to-br z-10",
                        scheme.from,
                        scheme.to
                      )}
                    />
                    {idx < timelineEvents.length - 1 && (
                      <div className="w-px flex-1 bg-neutral-200" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <div className="text-sm font-normal text-neutral-700">{event.title}</div>
                    <div className="text-xs font-light text-neutral-400 mt-0.5">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* -------------------------------------------------------------- */}
        {/* Placeholder Tabs */}
        {/* -------------------------------------------------------------- */}
        <TabsContent value="activities">
          <div className="rounded-xl border border-neutral-100 bg-white">
            <ComingSoonPanel
              icon={ClipboardList}
              title="Permitted Activities"
              description="Track which research activities are allowed within this collection — from biomarker analysis to AI/ML research. Each activity is categorised and mapped to the appropriate access level and approval requirements."
            />
          </div>
        </TabsContent>

        <TabsContent value="terms">
          <div className="rounded-xl border border-neutral-100 bg-white">
            <ComingSoonPanel
              icon={FileCheck}
              title="Data Use Terms"
              description="View and manage the governance terms for this collection — primary use permissions, beyond-primary-use rights (AI/ML, software development), publication restrictions, and external sharing rules. Conflict detection highlights where dataset restrictions don't align with collection terms."
            />
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <div className="rounded-xl border border-neutral-100 bg-white">
            <ComingSoonPanel
              icon={Users}
              title="Access & User Management"
              description="See who has access to this collection and in what capacity. Manage role assignments (Data Consumer Lead, Data Owner, Virtual Team Lead), track training compliance, and monitor provisioning status across all collection members."
            />
          </div>
        </TabsContent>

        <TabsContent value="provisioning">
          <div className="rounded-xl border border-neutral-100 bg-white">
            <ComingSoonPanel
              icon={Shield}
              title="Access Provisioning"
              description="The access provisioning breakdown shows how data access maps across four categories: already open (no action needed), awaiting policy configuration (instant approval), needs governance approval (GPT/TALT routing), and missing data location (requires discovery). This drives the automated provisioning pipeline."
            />
          </div>
        </TabsContent>

        <TabsContent value="discussion">
          <div className="rounded-xl border border-neutral-100 bg-white">
            <ComingSoonPanel
              icon={MessageSquare}
              title="Collaboration & Discussion"
              description="Threaded conversations about this collection — coordinate with approvers, flag blockers, discuss scope changes, and keep a record of key decisions. Supports @mentions, reactions, and file attachments."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
