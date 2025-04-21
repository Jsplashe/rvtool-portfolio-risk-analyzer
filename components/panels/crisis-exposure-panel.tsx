"use client"

import { AlertTriangle, CloudLightning, CloudRain, CloudSun } from "lucide-react"

interface CrisisExposurePanelProps {
  exposureLevel: "None" | "Dotcom-level" | "08-level" | "Covid-level"
}

export function CrisisExposurePanel({ exposureLevel }: CrisisExposurePanelProps) {
  const getStormIcon = () => {
    switch (exposureLevel) {
      case "None":
        return <CloudSun className="h-10 w-10 text-[#00FF00]" />
      case "Dotcom-level":
        return <CloudRain className="h-10 w-10 text-amber-500" />
      case "Covid-level":
        return <CloudLightning className="h-10 w-10 text-orange-500" />
      case "08-level":
        return (
          <div className="flex">
            <CloudLightning className="h-10 w-10 text-[#EB0914]" />
            <CloudLightning className="h-10 w-10 text-[#EB0914]" />
          </div>
        )
      default:
        return <CloudSun className="h-10 w-10 text-[#00FF00]" />
    }
  }

  const getExposureDescription = () => {
    switch (exposureLevel) {
      case "None":
        return "No significant crisis exposure detected"
      case "Dotcom-level":
        return "Moderate exposure similar to 2000 tech bubble"
      case "Covid-level":
        return "Significant exposure similar to 2020 pandemic"
      case "08-level":
        return "Severe exposure similar to 2008 financial crisis"
      default:
        return "Unknown exposure level"
    }
  }

  const getSeverityColor = () => {
    switch (exposureLevel) {
      case "None":
        return "bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/50"
      case "Dotcom-level":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      case "Covid-level":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "08-level":
        return "bg-[#EB0914]/20 text-[#EB0914] border-[#EB0914]/50"
      default:
        return "bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/50"
    }
  }

  const getPulseClass = () => {
    switch (exposureLevel) {
      case "None":
        return ""
      case "Dotcom-level":
        return ""
      case "Covid-level":
        return ""
      case "08-level":
        return "risk-pulse"
      default:
        return ""
    }
  }

  return (
    <div className="rounded-md border border-[#333333] bg-[#1A1A1A] p-6 shadow-card transition-all hover:shadow-card-hover">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <AlertTriangle className="h-5 w-5 text-[#777777]" />
          <span>Current Crisis Exposure</span>
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-[#333333] bg-[#222222] p-4">
          {getStormIcon()}
          <div className={`mt-2 rounded-full px-3 py-1 text-sm font-medium ${getSeverityColor()} ${getPulseClass()}`}>
            {exposureLevel}
          </div>
        </div>

        <p className="text-sm text-[#777777]">{getExposureDescription()}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Market Stress</span>
            <span className="font-medium text-[#EB0914]">Severe</span>
          </div>
          <div className="h-2 rounded-full bg-[#333333]/30">
            <div className="h-2 w-4/5 rounded-full bg-[#EB0914]"></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Liquidity Risk</span>
            <span className="font-medium text-orange-400">High</span>
          </div>
          <div className="h-2 rounded-full bg-[#333333]/30">
            <div className="h-2 w-3/5 rounded-full bg-orange-500"></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Contagion Risk</span>
            <span className="font-medium text-[#EB0914]">Severe</span>
          </div>
          <div className="h-2 rounded-full bg-[#333333]/30">
            <div className="h-2 w-4/5 rounded-full bg-[#EB0914]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
