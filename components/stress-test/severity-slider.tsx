"use client"

import { Flame } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface SeveritySliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function SeveritySlider({ value, onChange, disabled = false }: SeveritySliderProps) {
  // Determine the severity labels and colors based on the value
  const getSeverityLabel = () => {
    if (value < 20) return { text: "Minor Ripple", color: "text-green-400" }
    if (value < 40) return { text: "Moderate Shock", color: "text-blue-400" }
    if (value < 60) return { text: "Significant Impact", color: "text-yellow-400" }
    if (value < 80) return { text: "Major Disturbance", color: "text-orange-400" }
    return { text: "Full Storm", color: "text-red-400" }
  }

  const severityInfo = getSeverityLabel()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Severity Level</label>
        <span className={`flex items-center gap-1 text-xs font-semibold ${severityInfo.color}`}>
          <Flame className="h-3 w-3" />
          {severityInfo.text}
        </span>
      </div>
      <Slider
        defaultValue={[50]}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={1}
        max={100}
        step={1}
        disabled={disabled}
        className="py-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Minor</span>
        <span>Severe</span>
      </div>
    </div>
  )
}
