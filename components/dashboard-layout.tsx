"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import {
  Bell,
  BarChartIcon as ChartBar,
  Clock,
  Command,
  LineChart,
  Menu,
  PieChart,
  Shield,
  Loader2,
  Folder,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Import VoiceAssistant with client-side rendering only
const VoiceAssistant = dynamic(() => import("./voice-assistant/voice-assistant").then(mod => ({ default: mod.VoiceAssistant })), {
  ssr: false,
})

// Loading placeholder for SSR
const LoadingPlaceholder = () => (
  <div className="animate-pulse flex space-x-4">
    <div className="rounded-full bg-[#333333]/30 h-4 w-4"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-[#333333]/30 rounded"></div>
    </div>
  </div>
)

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  
  // Use effect to handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: Command },
    { title: "My Portfolio", href: "/dashboard/portfolio", icon: Folder },
    { title: "Time Travel", href: "/dashboard/stress-test", icon: Clock },
    { title: "Risk Cauldron", href: "/dashboard/risk-cauldron", icon: ChartBar },
    { title: "Your Journey", href: "/dashboard/risk-journey", icon: LineChart },
    { title: "Alerts", href: "/dashboard/alerts", icon: Bell },
    { title: "Compare", href: "/dashboard/compare", icon: PieChart },
  ]

  const isStressTestPage = pathname === "/dashboard/stress-test"
  const isRiskCauldronPage = pathname === "/dashboard/risk-cauldron"
  const isRiskJourneyPage = pathname === "/dashboard/risk-journey"
  const isPortfolioPage = pathname === "/dashboard/portfolio"

  // Render a simpler version during SSR
  if (!mounted) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-[#121212]">
          <Sidebar variant="sidebar" className="bg-[#1A1A1A] border-r border-[#333333]">
            {/* Simplified sidebar content */}
            <SidebarHeader className="flex h-16 items-center border-b border-[#333333] px-6">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-[#EB0914]" />
                <h1 className="text-xl font-bold tracking-tight text-white">Risk Control Station</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <LoadingPlaceholder />
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-[#333333] bg-[#1A1A1A] px-6">
              <LoadingPlaceholder />
            </header>
            <main className="flex-1 p-6">
              <LoadingPlaceholder />
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#121212]">
        <Sidebar variant="sidebar" className="bg-[#1A1A1A] border-r border-[#333333]">
          {/* Keep the existing sidebar content */}
          <SidebarHeader className="flex h-16 items-center border-b border-[#333333] px-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#EB0914]" />
              <h1 className="text-xl font-bold tracking-tight text-white">Risk Control Station</h1>
            </div>
          </SidebarHeader>
          {/* Navigation */}
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-300 rounded-md",
                        isActive ? "bg-[#333333] text-white" : "text-[#FFFFFF]",
                      )}
                    >
                      <Link href={item.href}>
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            isActive ? "text-white" : "text-[#777777]",
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-[#333333] p-6">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full bg-[#333333]">
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#00FF00] ring-1 ring-[#121212]"></span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-white">Risk Analyst</p>
                <p className="text-xs text-[#777777]">Online</p>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-[#333333] bg-[#1A1A1A] px-6">
            <SidebarTrigger variant="ghost" size="icon" className="mr-2 text-white btn-glow">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SidebarTrigger>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {isStressTestPage
                ? "Time Travel Analysis"
                : isRiskCauldronPage
                  ? "Risk Cauldron"
                  : isRiskJourneyPage
                    ? "Your Risk Journey"
                    : isPortfolioPage
                      ? "My Portfolio"
                      : "Risk Control Station"}
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative h-8 w-8 rounded-full bg-[#333333]">
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#00FF00] ring-1 ring-[#121212]"></span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>

          {/* Voice Assistant - appears on all views */}
          <Suspense fallback={null}>
            <VoiceAssistant />
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  )
} 