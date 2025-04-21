"use client"

import { useState, useEffect } from "react"
import { Hourglass, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface VisualizeButtonProps {
  onClick: () => void
  isVisualizing: boolean
}

export function VisualizeButton({ onClick, isVisualizing }: VisualizeButtonProps) {
  const [animationClass, setAnimationClass] = useState("")

  // Apply time-warp animation when visualizing
  useEffect(() => {
    if (isVisualizing) {
      setAnimationClass("animate-time-warp")
    } else {
      setAnimationClass("")
    }
  }, [isVisualizing])

  return (
    <div className="relative">
      <Button
        onClick={onClick}
        disabled={isVisualizing}
        className={cn(
          "group relative h-12 w-full overflow-hidden bg-gradient-to-r from-primary/60 to-violet-500/60 text-white transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]",
          animationClass,
        )}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle,_transparent_10%,_#000_150%)] opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
        {isVisualizing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-bold">Calculating Impact...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Hourglass className="h-4 w-4" />
            <span className="font-bold">Visualize Impact</span>
          </div>
        )}
      </Button>

      {/* Time warp overlay effect */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500",
          isVisualizing && "opacity-100",
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-violet-500/0 via-violet-500/30 to-violet-500/0"></div>
        <div className="absolute inset-0 animate-ping-slow rounded-full border-2 border-violet-500/50 opacity-0"></div>
      </div>
    </div>
  )
}
