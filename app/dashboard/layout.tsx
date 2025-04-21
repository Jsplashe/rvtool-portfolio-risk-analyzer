"use client"

import { Suspense } from "react"
import Dashboard from "@/components/dashboard-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Dashboard>
      <Suspense fallback={<div className="p-6 animate-pulse">Loading view...</div>}>
        {children}
      </Suspense>
    </Dashboard>
  )
} 