"use client"

import type React from "react"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  earned: boolean
  date?: string
  progress?: number
}

interface AchievementBadgesProps {
  achievements: Achievement[]
  selectedAchievement: Achievement
  onSelectAchievement: (achievement: Achievement) => void
}

export function AchievementBadges({ achievements, selectedAchievement, onSelectAchievement }: AchievementBadgesProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectAchievement(achievement)}
            className={cn(
              "relative flex cursor-pointer flex-col items-center rounded-lg border border-border/40 bg-black/30 p-4 transition-all",
              selectedAchievement.id === achievement.id &&
                "border-primary/50 bg-black/50 shadow-[0_0_10px_rgba(46,213,115,0.2)]",
              !achievement.earned && "opacity-70",
            )}
          >
            <div
              className={cn(
                "mb-2 flex h-16 w-16 items-center justify-center rounded-full text-white",
                achievement.color,
                !achievement.earned && "grayscale",
              )}
            >
              {achievement.icon}
            </div>
            <h4 className="text-center text-sm font-medium">{achievement.title}</h4>
            {achievement.earned && (
              <div className="mt-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">Earned</div>
            )}
            {!achievement.earned && achievement.progress && (
              <div className="mt-1 w-full">
                <Progress value={achievement.progress} className="h-1.5" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg border border-border/40 bg-black/30 p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">{selectedAchievement.title}</h4>
          {selectedAchievement.earned && selectedAchievement.date && (
            <div className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
              Earned on {format(new Date(selectedAchievement.date), "MMM d, yyyy")}
            </div>
          )}
          {!selectedAchievement.earned && selectedAchievement.progress && (
            <div className="rounded-md bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
              {selectedAchievement.progress}% Complete
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{selectedAchievement.description}</p>

        {selectedAchievement.earned ? (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-primary/10 p-3 text-sm">
            <div className="rounded-full bg-primary/20 p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="text-primary">
              Achievement unlocked! You've demonstrated exceptional risk management skills.
            </span>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-muted/20 p-3 text-sm">
            <div className="rounded-full bg-muted/30 p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="text-muted-foreground">
              Keep working toward this achievement by following the criteria above.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
