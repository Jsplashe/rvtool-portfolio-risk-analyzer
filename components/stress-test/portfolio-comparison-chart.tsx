"use client"

import { useState, useEffect } from "react"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Chart, ChartTitle } from "@/components/ui/chart"

interface PortfolioComparisonChartProps {
  portfolioData: number[]
  marketData: number[]
  isAnimating: boolean
  eventName: string
}

export function PortfolioComparisonChart({
  portfolioData,
  marketData,
  isAnimating,
  eventName,
}: PortfolioComparisonChartProps) {
  const [displayData, setDisplayData] = useState<any[]>([])
  const [animationProgress, setAnimationProgress] = useState(0)

  // Transform data arrays into a format Recharts can use
  useEffect(() => {
    if (portfolioData.length === 0 || marketData.length === 0) {
      setDisplayData([])
      return
    }

    // Convert the data into a format Recharts can use
    const dataPoints = Math.min(portfolioData.length, marketData.length)
    const newData = []

    for (let i = 0; i < dataPoints; i++) {
      // Only include data points up to the current animation progress
      if (isAnimating && i > Math.floor(dataPoints * animationProgress)) {
        break
      }

      newData.push({
        index: i,
        time: `Day ${i}`,
        portfolio: portfolioData[i],
        market: marketData[i],
      })
    }

    setDisplayData(newData)
  }, [portfolioData, marketData, animationProgress, isAnimating])

  // Animate the chart when isAnimating becomes true
  useEffect(() => {
    if (!isAnimating) {
      setAnimationProgress(0)
      return
    }

    let frame = 0
    const totalFrames = 50 // Number of animation frames

    const animate = () => {
      frame++
      setAnimationProgress(frame / totalFrames)

      if (frame < totalFrames) {
        requestAnimationFrame(animate)
      }
    }

    const animationTimer = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 200) // Small delay before starting animation

    return () => clearTimeout(animationTimer)
  }, [isAnimating])

  // Find min and max values for axis scale
  const allValues = [...portfolioData, ...marketData]
  const minValue = Math.floor(Math.min(...allValues) - 5)
  const maxValue = Math.ceil(Math.max(0, ...allValues) + 5)

  // Custom tooltip formatter
  const formatTooltip = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  if (!isAnimating && displayData.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-6 text-muted-foreground">
          <LineChart className="h-12 w-12" />
        </div>
        <h3 className="mt-4 text-xl font-medium">Select an event and press "Visualize Impact"</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Compare how your portfolio would perform against the market during historical crises
        </p>
      </div>
    )
  }

  return (
    <Chart className="h-full w-full">
      <ChartTitle>{eventName} Drawdown Analysis</ChartTitle>

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 12 }}
              tickFormatter={(value, index) => {
                // Only show some tick labels to avoid crowding
                return index % 20 === 0 ? `Day ${index}` : ""
              }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 12 }}
              domain={[minValue, maxValue]}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="portfolio"
              name="Your Portfolio"
              stroke="#2ed573"
              strokeWidth={3}
              dot={false}
              animationDuration={500}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="market"
              name="S&P 500"
              stroke="#ff6b6b"
              strokeWidth={2}
              dot={false}
              animationDuration={500}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Chart>
  )
}
