"use client"

import { useDroppable } from "@dnd-kit/core"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Asset } from "./types"

interface CauldronProps {
  assets: Asset[]
  riskLevel: number
  id: string
}

export function Cauldron({ assets, riskLevel, id }: CauldronProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  // Calculate color based on risk level
  const getColor = () => {
    if (riskLevel === 0) return "#2ed573" // Default green
    if (riskLevel < 30) return "#2ed573" // Green
    if (riskLevel < 60) return "#ffbe76" // Yellow
    if (riskLevel < 80) return "#ff7f50" // Orange
    return "#ff4757" // Red
  }

  // Calculate bubble count based on assets
  const bubbleCount = Math.min(20, assets.length * 3)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-medium">Risk Cauldron</h3>
        <p className="text-sm text-muted-foreground">Drag assets to analyze risk profile</p>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "relative flex h-64 w-64 items-end justify-center transition-all duration-300",
          isOver && "scale-110",
        )}
      >
        {/* Cauldron stand */}
        <div className="absolute bottom-0 h-6 w-40 rounded-md bg-gray-800"></div>

        {/* Cauldron body */}
        <div className="relative h-48 w-56 rounded-b-full border-4 border-gray-700 bg-gray-900">
          {/* Cauldron handles */}
          <div className="absolute -left-6 top-10 h-6 w-6 rounded-full border-4 border-gray-700"></div>
          <div className="absolute -right-6 top-10 h-6 w-6 rounded-full border-4 border-gray-700"></div>

          {/* Liquid container */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-full">
            {/* Animated liquid */}
            <motion.div
              initial={{ height: "0%" }}
              animate={{
                height: assets.length ? "80%" : "0%",
                backgroundColor: getColor(),
              }}
              transition={{ duration: 0.5 }}
              className="relative w-full"
              style={{
                boxShadow: `0 0 20px ${getColor()}40, 0 0 30px ${getColor()}20`,
              }}
            >
              {/* Bubbles */}
              <AnimatePresence>
                {Array.from({ length: bubbleCount }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: Math.random() * 100 - 50,
                      y: 0,
                      opacity: 0.7,
                      scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                      y: -100 - Math.random() * 50,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                    className="absolute bottom-0 h-3 w-3 rounded-full bg-white"
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Asset count badge */}
        {assets.length > 0 && (
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {assets.length}
          </div>
        )}

        {/* Drop indicator */}
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary"
          />
        )}
      </div>

      {/* Instructions */}
      {assets.length === 0 && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Drag assets into the cauldron to analyze risk
        </div>
      )}
    </div>
  )
}
