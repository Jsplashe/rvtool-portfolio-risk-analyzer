"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface PeerComparisonProps {
  data: {
    metric: string
    percentile: number
    average: number
  }[]
}

export function PeerComparison({ data }: PeerComparisonProps) {
  // Get color based on percentile
  const getPercentileColor = (percentile: number) => {
    if (percentile < 40) return "text-red-400"
    if (percentile < 60) return "text-yellow-400"
    if (percentile < 80) return "text-blue-400"
    return "text-green-400"
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/40 bg-black/30 p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Peer Group: Advanced Investors</h4>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Your portfolio metrics are compared against 5,000+ investors with similar risk profiles and investment goals.
        </p>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{item.metric}</span>
              <span className={cn("font-medium", getPercentileColor(item.percentile))}>
                {item.percentile}th percentile
              </span>
            </div>

            <div className="relative h-8 w-full rounded-md bg-black/50">
              {/* Average marker */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-white/30" style={{ left: `${item.average}%` }}>
                <div className="absolute -top-1 -translate-x-1/2 rounded-sm bg-white/30 px-1 py-0.5 text-[10px]">
                  Avg
                </div>
              </div>

              {/* Percentile bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentile}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-md",
                  item.percentile < 40 && "bg-red-500/50",
                  item.percentile >= 40 && item.percentile < 60 && "bg-yellow-500/50",
                  item.percentile >= 60 && item.percentile < 80 && "bg-blue-500/50",
                  item.percentile >= 80 && "bg-green-500/50",
                )}
              />

              {/* Percentile marker */}
              <div
                className={cn(
                  "absolute top-0 bottom-0 flex w-0.5 items-center justify-center",
                  getPercentileColor(item.percentile).replace("text-", "bg-"),
                )}
                style={{ left: `${item.percentile}%` }}
              >
                <div
                  className={cn(
                    "absolute -right-1 h-3 w-3 rounded-full border-2 border-background",
                    getPercentileColor(item.percentile).replace("text-", "bg-"),
                  )}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg border border-border/40 bg-black/30 p-4">
        <h4 className="mb-2 text-sm font-medium">Overall Ranking</h4>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Your portfolio outperforms</div>
          <div className="text-xl font-bold text-primary">78%</div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "78%" }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-primary"
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Based on anonymized data from investors with similar portfolio sizes and investment horizons.
        </p>
      </div>
    </div>
  )
}
