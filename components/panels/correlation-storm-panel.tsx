"use client"

import { CloudLightning, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface CorrelationStormPanelProps {
  correlationValue: number
}

export function CorrelationStormPanel({ correlationValue }: CorrelationStormPanelProps) {
  const isStormWarning = correlationValue > 0.75

  // Generate a simple heatmap grid
  const generateHeatmapCells = () => {
    const cells = []
    const assets = ["Stocks", "Bonds", "Gold", "Real Estate", "Crypto"]

    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < assets.length; j++) {
        // Skip the diagonal (self-correlation)
        if (i === j) {
          cells.push({
            value: 1,
            color: "bg-[#333333]",
          })
          continue
        }

        // Generate a correlation value that's high if we're in storm mode
        let value
        if (isStormWarning) {
          // Higher correlations during storm
          value = 0.65 + Math.random() * 0.3
        } else {
          // More varied correlations normally
          value = -0.3 + Math.random() * 0.9
        }

        let color
        if (value > 0.8) color = "bg-[#EB0914]"
        else if (value > 0.6) color = "bg-orange-500"
        else if (value > 0.3) color = "bg-amber-500"
        else if (value > 0) color = "bg-[#00FF00]"
        else color = "bg-[#3B82F6]"

        cells.push({ value, color })
      }
    }

    return cells
  }

  const heatmapCells = generateHeatmapCells()

  return (
    <div className="rounded-md border border-[#333333] bg-[#1A1A1A] p-6 shadow-card transition-all hover:shadow-card-hover">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <Zap className="h-5 w-5 text-[#777777]" />
          <span>Correlation Storm Indicator</span>
        </h3>

        {isStormWarning && (
          <div className="animate-pulse rounded-full bg-[#EB0914]/20 p-2 text-[#EB0914]">
            <CloudLightning className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#777777]">
            {isStormWarning
              ? "Warning: High correlation detected across assets"
              : "Normal correlation patterns observed"}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              isStormWarning ? "bg-[#EB0914]/20 text-[#EB0914]" : "bg-[#00FF00]/20 text-[#00FF00]",
            )}
          >
            {correlationValue.toFixed(2)}
          </span>
        </div>

        <div className="relative">
          <div className="grid grid-cols-5 gap-1">
            {heatmapCells.map((cell, index) => (
              <div
                key={index}
                className={cn("aspect-square rounded-sm", cell.color)}
                style={{ opacity: Math.abs(cell.value) }}
              />
            ))}
          </div>

          {isStormWarning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CloudLightning className="h-12 w-12 text-[#EB0914] drop-shadow-[0_0_10px_rgba(235,9,20,0.5)]" />
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-[#777777]">Asset classes: Stocks, Bonds, Gold, Real Estate, Crypto</div>
      </div>
    </div>
  )
}
