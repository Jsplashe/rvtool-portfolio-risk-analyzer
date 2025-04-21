"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AlertCircle, BarChart3, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { HealthScorePanel } from "./panels/health-score-panel"
import { CorrelationStormPanel } from "./panels/correlation-storm-panel"
import { CrisisExposurePanel } from "./panels/crisis-exposure-panel"
import { QuickScanButton } from "./quick-scan-button"

// Import RiskPulseGrid with SSR disabled
const RiskPulseGrid = dynamic(() => import("./ui/RiskPulseGrid"), {
  ssr: false,
  loading: () => (
    <div className="h-5 w-5 flex items-center justify-center">
      <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-[#EB0914]" />
    </div>
  ),
})

export function DashboardContent() {
  const [mounted, setMounted] = useState(false)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  
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

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <HealthScorePanel score="B" />
        <CorrelationStormPanel correlationValue={0.82} />
        <CrisisExposurePanel exposureLevel="08-level" />
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-md border border-[#333333] bg-[#1A1A1A] p-6 shadow-card">
        <QuickScanButton onClick={handleQuickScan} isScanning={isScanning} />

        {mounted && riskLevel && (
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
                <RiskPulseGrid 
                  size={9} 
                  columns={3} 
                  color={riskLevel === "High" ? "#EB0914" : "#9333EA"} 
                  className="h-5 w-5"
                />
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
  )
} 