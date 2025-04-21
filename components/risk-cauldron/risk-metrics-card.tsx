"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface RiskMetricsCardProps {
  title: string
  value: number
  maxValue: number
  icon: ReactNode
  color: "red" | "yellow" | "green"
  unit: string
  higherIsBetter?: boolean
}

export function RiskMetricsCard({
  title,
  value,
  maxValue,
  icon,
  color,
  unit,
  higherIsBetter = false,
}: RiskMetricsCardProps) {
  // Calculate percentage for progress bar
  const percentage = (value / maxValue) * 100

  // Get color classes based on color prop
  const getColorClasses = () => {
    switch (color) {
      case "red":
        return "from-red-500/20 to-red-500/10 text-red-400 shadow-red-500/20"
      case "yellow":
        return "from-yellow-500/20 to-yellow-500/10 text-yellow-400 shadow-yellow-500/20"
      case "green":
        return "from-green-500/20 to-green-500/10 text-green-400 shadow-green-500/20"
      default:
        return "from-primary/20 to-primary/10 text-primary shadow-primary/20"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b p-4 shadow-lg",
        getColorClasses(),
      )}
    >
      <div className="relative z-10 flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tabular-nums">{value}</span>
          <span className="text-lg">{unit}</span>
        </div>

        <div className="mt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn("h-full rounded-full", higherIsBetter ? "bg-current" : "bg-current")}
            />
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 -z-10 opacity-30 blur-xl"
        style={{
          background: `radial-gradient(circle at center, currentColor 0%, transparent 70%)`,
          animation: "pulse 4s infinite alternate",
        }}
      />
    </motion.div>
  )
}
