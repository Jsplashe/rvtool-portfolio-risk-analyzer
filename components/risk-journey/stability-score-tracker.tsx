"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StabilityScoreTrackerProps {
  data: {
    current: number
    target: number
    history: number[]
  }
}

export function StabilityScoreTracker({ data }: StabilityScoreTrackerProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Generate chart data from history
  const chartData = data.history.map((score, index) => ({
    month: `Month ${index + 1}`,
    score,
  }))

  // Calculate score color based on value
  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-400"
    if (score < 70) return "text-yellow-400"
    if (score < 85) return "text-blue-400"
    return "text-green-400"
  }

  // Calculate progress percentage
  const progressPercentage = (data.current / data.target) * 100

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-medium">Current Score</h4>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Your Portfolio Stability Score measures the overall resilience of your investments against market
                  volatility and downturns.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>

        <div className="relative flex h-36 w-36 items-center justify-center">
          {/* Circular progress background */}
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              className={cn(getScoreColor(data.current))}
              strokeDasharray={283} // 2 * PI * r
              strokeDashoffset={283 - (283 * progressPercentage) / 100}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * progressPercentage) / 100 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>

          {/* Score display */}
          <div className="absolute flex flex-col items-center">
            <motion.span
              className={cn("text-4xl font-bold", getScoreColor(data.current))}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {data.current}
            </motion.span>
            <span className="text-xs text-muted-foreground">out of 100</span>
          </div>

          {/* Glow effect */}
          <div
            className={cn(
              "absolute inset-0 -z-10 rounded-full opacity-20 blur-xl transition-opacity duration-300",
              getScoreColor(data.current).replace("text-", "bg-"),
              isHovered ? "opacity-40" : "opacity-20",
            )}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Target:</span>
          <span className="font-medium">{data.target}</span>
          <span className="text-xs text-muted-foreground">({Math.round(progressPercentage)}% complete)</span>
        </div>
      </div>

      <div
        className="rounded-lg border border-border/40 bg-black/30 p-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h4 className="mb-2 text-sm font-medium">Score History</h4>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                stroke="rgba(255,255,255,0.3)"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                stroke="rgba(255,255,255,0.3)"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2ed573"
                strokeWidth={2}
                dot={{ fill: "#2ed573", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#2ed573", stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border/40 bg-black/30 p-3 text-center">
          <div className="text-xs text-muted-foreground">Volatility</div>
          <div className="text-lg font-medium text-blue-400">Low</div>
        </div>
        <div className="rounded-lg border border-border/40 bg-black/30 p-3 text-center">
          <div className="text-xs text-muted-foreground">Drawdown</div>
          <div className="text-lg font-medium text-green-400">-12%</div>
        </div>
        <div className="rounded-lg border border-border/40 bg-black/30 p-3 text-center">
          <div className="text-xs text-muted-foreground">Recovery Time</div>
          <div className="text-lg font-medium text-yellow-400">3.2 mo</div>
        </div>
      </div>
    </div>
  )
}
