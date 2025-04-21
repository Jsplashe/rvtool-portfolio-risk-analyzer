"use client"

import { useState } from "react"
import { Award, BarChart3, Shield, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"

import { AchievementBadges } from "./achievement-badges"
import { StabilityScoreTracker } from "./stability-score-tracker"
import { PeerComparison } from "./peer-comparison"

// Sample achievement data
const achievements = [
  {
    id: "diversification-master",
    title: "Diversification Master",
    description: "Maintained a portfolio with assets across 8+ sectors",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "bg-blue-500",
    earned: true,
    date: "2023-11-15",
  },
  {
    id: "crisis-survivor",
    title: "Crisis Survivor",
    description: "Portfolio recovered from a 20%+ drawdown",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-purple-500",
    earned: true,
    date: "2023-08-22",
  },
  {
    id: "steady-growth",
    title: "Steady Growth",
    description: "Maintained positive returns for 12 consecutive months",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "bg-green-500",
    earned: false,
    progress: 75,
  },
  {
    id: "risk-optimizer",
    title: "Risk Optimizer",
    description: "Achieved 15%+ returns with below-market volatility",
    icon: <Award className="h-6 w-6" />,
    color: "bg-amber-500",
    earned: true,
    date: "2024-01-10",
  },
  {
    id: "market-timer",
    title: "Market Timer",
    description: "Successfully avoided 3 major market corrections",
    icon: <Users className="h-6 w-6" />,
    color: "bg-red-500",
    earned: false,
    progress: 33,
  },
]

// Sample stability score data
const stabilityScoreData = {
  current: 78,
  target: 85,
  history: [65, 68, 72, 70, 75, 73, 78],
}

// Sample peer comparison data
const peerComparisonData = [
  { metric: "Risk-Adjusted Return", percentile: 82, average: 65 },
  { metric: "Drawdown Protection", percentile: 75, average: 60 },
  { metric: "Diversification Score", percentile: 90, average: 72 },
  { metric: "Volatility Management", percentile: 68, average: 58 },
]

export function RiskJourney() {
  const [selectedAchievement, setSelectedAchievement] = useState(achievements[0])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          <Award className="h-6 w-6 text-primary" />
          <span>Your Risk Journey</span>
        </h2>
        <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 text-sm">
          <span className="text-muted-foreground">Journey Level:</span>
          <span className="font-medium text-primary">Advanced</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left column - Achievements and Stability Score */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border/40 bg-black/50 p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Achievement Badges</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {achievements.filter((a) => a.earned).length}/{achievements.length} Earned
              </span>
            </div>
            <AchievementBadges
              achievements={achievements}
              selectedAchievement={selectedAchievement}
              onSelectAchievement={setSelectedAchievement}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-border/40 bg-black/50 p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-medium">Your Portfolio Stability Score</h3>
            <StabilityScoreTracker data={stabilityScoreData} />
          </motion.div>
        </div>

        {/* Right column - Peer Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl border border-border/40 bg-black/50 p-6 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-medium">Compare with Peers</h3>
          <PeerComparison data={peerComparisonData} />
        </motion.div>
      </div>

      {/* Bottom section - Journey Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-xl border border-border/40 bg-black/50 p-6 shadow-lg"
      >
        <h3 className="mb-4 text-lg font-medium">Journey Insights</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border/40 bg-black/30 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-blue-500/20 p-2 text-blue-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h4 className="font-medium">Risk Consistency</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Your portfolio has maintained consistent risk levels for the past 3 months, showing disciplined
              management.
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-black/30 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-green-500/20 p-2 text-green-400">
                <Shield className="h-4 w-4" />
              </div>
              <h4 className="font-medium">Improvement Areas</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Consider increasing your bond allocation to improve your portfolio's resilience during market downturns.
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-black/30 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-purple-500/20 p-2 text-purple-400">
                <Award className="h-4 w-4" />
              </div>
              <h4 className="font-medium">Next Achievement</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              You're 25% away from earning the "Steady Growth" achievement. Maintain positive returns for 3 more months.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
