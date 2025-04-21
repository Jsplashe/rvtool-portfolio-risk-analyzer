"use client"

import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface HealthScorePanelProps {
  score: "A" | "B" | "C" | "D" | "F"
}

export function HealthScorePanel({ score }: HealthScorePanelProps) {
  const getScoreColor = (score: string) => {
    switch (score) {
      case "A":
        return "text-[#00FF00] bg-[#00FF00]/10 border-[#00FF00]/50"
      case "B":
        return "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/50"
      case "C":
        return "text-amber-400 bg-amber-500/10 border-amber-500/50"
      case "D":
        return "text-orange-400 bg-orange-500/10 border-orange-500/50"
      case "F":
        return "text-[#EB0914] bg-[#EB0914]/10 border-[#EB0914]/50"
      default:
        return "text-[#777777] bg-[#777777]/10 border-[#777777]/50"
    }
  }

  const getScoreDescription = (score: string) => {
    switch (score) {
      case "A":
        return "Excellent health with minimal risk"
      case "B":
        return "Good health with manageable risk"
      case "C":
        return "Average health with moderate risk"
      case "D":
        return "Poor health with significant risk"
      case "F":
        return "Critical health with extreme risk"
      default:
        return "Unknown health status"
    }
  }

  const getPulseClass = (score: string) => {
    switch (score) {
      case "A":
        return "positive-pulse"
      case "B":
      case "C":
        return ""
      case "D":
      case "F":
        return "risk-pulse"
      default:
        return ""
    }
  }

  return (
    <div className="rounded-md border border-[#333333] bg-[#1A1A1A] p-6 shadow-card transition-all hover:shadow-card-hover">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <Activity className="h-5 w-5 text-[#777777]" />
          <span>Portfolio Health Score</span>
        </h3>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl font-bold",
            getScoreColor(score),
            getPulseClass(score),
          )}
        >
          {score}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-[#777777]">{getScoreDescription(score)}</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Volatility</span>
            <span className="font-medium text-[#3B82F6]">Moderate</span>
          </div>
          <div className="h-2 rounded-full bg-[#333333]/30">
            <div className="h-2 w-1/2 rounded-full bg-[#3B82F6]"></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Drawdown</span>
            <span className="font-medium text-amber-400">Caution</span>
          </div>
          <div className="h-2 rounded-full bg-[#333333]/30">
            <div className="h-2 w-3/4 rounded-full bg-amber-500"></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Liquidity</span>
            <span className="font-medium text-[#00FF00]">Strong</span>
          </div>
          <div className="h-2 rounded-full bg-[#333333]/30">
            <div className="h-2 w-4/5 rounded-full bg-[#00FF00]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
