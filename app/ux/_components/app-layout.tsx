"use client"

import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/ux/_components/app-sidebar"
import { TopBar } from "@/app/ux/_components/top-bar"

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function AppLayout({ children, title, breadcrumbs }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar title={title} breadcrumbs={breadcrumbs} />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
