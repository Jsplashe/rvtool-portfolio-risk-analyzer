"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import {
  AlertCircle,
  BarChart3,
  Bell,
  BarChartIcon as ChartBar,
  Clock,
  Command,
  LineChart,
  Menu,
  PieChart,
  Shield,
  Loader2,
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
import { HealthScorePanel } from "./panels/health-score-panel"
import { CorrelationStormPanel } from "./panels/correlation-storm-panel"
import { CrisisExposurePanel } from "./panels/crisis-exposure-panel"
import { QuickScanButton } from "./quick-scan-button"
import { TimeTravelStressTest } from "./time-travel-stress-test"
import { VoiceAssistant } from "./voice-assistant/voice-assistant"

// Import RiskPulseGrid with SSR disabled and a loading fallback
const RiskPulseGrid = dynamic(() => import("./ui/RiskPulseGrid"), {
  ssr: false,
  loading: () => (
    <div className="h-5 w-5 flex items-center justify-center">
      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
    </div>
  ),
})

// Loading placeholder to replace complex components during SSR
const LoadingPlaceholder = () => (
  <div className="animate-pulse flex space-x-4">
    <div className="rounded-full bg-[#333333]/30 h-4 w-4"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-[#333333]/30 rounded"></div>
    </div>
  </div>
)

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const pathname = usePathname()
  
  // Use effect to handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleQuickScan = () => {
    setIsScanning(true)
    setRiskLevel(null)

    // Simulate scanning process with stable seed
    setTimeout(() => {
      if (typeof window !== "undefined") {
        // Only run in browser
        const levels = ["Low", "Moderate", "Elevated", "High", "Severe"]
        const randomIndex = Math.floor(Date.now() % 5) // More stable "random" value
        setRiskLevel(levels[randomIndex])
      }
      setIsScanning(false)
    }, 2000)
  }

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: Command },
    { title: "Time Travel", href: "/dashboard/stress-test", icon: Clock },
    { title: "Risk Cauldron", href: "/dashboard/risk-cauldron", icon: ChartBar },
    { title: "Your Journey", href: "/dashboard/risk-journey", icon: LineChart },
    { title: "Alerts", href: "/dashboard/alerts", icon: Bell },
    { title: "Compare", href: "/dashboard/compare", icon: PieChart },
  ]

  const isStressTestPage = pathname === "/dashboard/stress-test"
  const isRiskCauldronPage = pathname === "/dashboard/risk-cauldron"
  const isRiskJourneyPage = pathname === "/dashboard/risk-journey"

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
          <SidebarHeader className="flex h-16 items-center border-b border-[#333333] px-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#EB0914]" />
              <h1 className="text-xl font-bold tracking-tight text-white">Risk Control Station</h1>
            </div>
          </SidebarHeader>
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
                    : "Risk Control Station"}
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative h-8 w-8 rounded-full bg-[#333333]">
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#00FF00] ring-1 ring-[#121212]"></span>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {isStressTestPage ? (
              <div className="p-6">
                <TimeTravelStressTest />
              </div>
            ) : isRiskCauldronPage ? (
              <div className="p-0">{/* Risk Cauldron content is rendered in its page component */}</div>
            ) : isRiskJourneyPage ? (
              <div className="p-0">{/* Risk Journey content is rendered in its page component */}</div>
            ) : (
              <div className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <HealthScorePanel score="B" />
                  <CorrelationStormPanel correlationValue={0.82} />
                  <CrisisExposurePanel exposureLevel="08-level" />
                </div>

                <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-md border border-[#333333] bg-[#1A1A1A] p-6 shadow-card">
                  <QuickScanButton onClick={handleQuickScan} isScanning={isScanning} />

                  {riskLevel && (
                    <div
                      className={cn(
                        "mt-4 flex items-center gap-3 rounded-md px-4 py-3 text-lg font-medium",
                        riskLevel === "Low" && "bg-[#00FF00]/10 text-[#00FF00]",
                        riskLevel === "Moderate" && "bg-amber-500/10 text-amber-400",
                        riskLevel === "Elevated" && "bg-orange-500/10 text-orange-400",
                        riskLevel === "High" && "bg-[#EB0914]/10 text-[#EB0914]",
                        riskLevel === "Severe" && "bg-purple-500/10 text-purple-400"
                      )}
                    >
                      <AlertCircle className="h-5 w-5" />
                      <span>
                        Current Risk Warning Level: <strong>{riskLevel}</strong>
                      </span>
                      {(riskLevel === "High" || riskLevel === "Severe") && (
                        <div className="ml-auto">
                          <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
                            <RiskPulseGrid 
                              size={9} 
                              columns={3} 
                              color={riskLevel === "High" ? "#EB0914" : "#9333EA"} 
                              className="h-5 w-5"
                            />
                          </Suspense>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-md border border-[#333333] bg-[#1A1A1A] p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
                      <BarChart3 className="h-5 w-5 text-[#777777]" />
                      <span>Historical Risk Patterns</span>
                    </h3>
                    <div className="h-[250px] rounded-md bg-[#333333]/30"></div>
                  </div>
                  <div className="rounded-md border border-[#333333] bg-[#1A1A1A] p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
                      <Shield className="h-5 w-5 text-[#777777]" />
                      <span>Risk Mitigation Strategies</span>
                    </h3>
                    <div className="space-y-3">
                      {["Diversification", "Hedging", "Stop-Loss", "Rebalancing"].map((strategy, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-md border border-[#333333] bg-[#222222] p-3 btn-glow"
                        >
                          <div className="rounded-full bg-[#333333] p-2 text-[#777777]">
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{strategy}</div>
                            <div className="text-xs text-[#777777]">
                              Effectiveness: {["High", "Medium", "Very High", "Medium"][i]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
