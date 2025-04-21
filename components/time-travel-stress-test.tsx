"use client"

import { useState, useEffect } from "react"
import { Clock, LineChart } from "lucide-react"

import { EventSelector } from "./stress-test/event-selector"
import { SeveritySlider } from "./stress-test/severity-slider"
import { PortfolioComparisonChart } from "./stress-test/portfolio-comparison-chart"
import { VisualizeButton } from "./stress-test/visualize-button"

// Historical market events with their characteristics
const HISTORICAL_EVENTS = [
  {
    id: "2008-crisis",
    name: "2008 Financial Crisis",
    maxDrawdown: -56.8,
    duration: 517, // days
    description: "Global financial crisis triggered by the collapse of the housing market and banking system.",
  },
  {
    id: "covid-crash",
    name: "COVID-19 Crash",
    maxDrawdown: -33.9,
    duration: 33,
    description: "Rapid market collapse due to the global pandemic and economic shutdown.",
  },
  {
    id: "dotcom-bubble",
    name: "Dotcom Bubble",
    maxDrawdown: -49.1,
    duration: 929,
    description: "Tech stock implosion after the speculative internet company boom of the late 1990s.",
  },
  {
    id: "black-monday",
    name: "Black Monday (1987)",
    maxDrawdown: -22.6,
    duration: 101,
    description: "Single-day market crash driven by program trading and market psychology.",
  },
  {
    id: "2018-correction",
    name: "2018 Market Correction",
    maxDrawdown: -19.8,
    duration: 95,
    description: "Late 2018 selloff caused by interest rate hikes and trade tensions.",
  },
]

export function TimeTravelStressTest() {
  const [mounted, setMounted] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(HISTORICAL_EVENTS[0])
  const [severity, setSeverity] = useState(50) // 0-100 scale
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [isChartReady, setIsChartReady] = useState(false)
  const [portfolioPerformance, setPortfolioPerformance] = useState<number[]>([])
  const [marketPerformance, setMarketPerformance] = useState<number[]>([])

  // Use effect to handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle visualization trigger
  const handleVisualize = () => {
    setIsVisualizing(true)
    setIsChartReady(false)

    // Generate data based on selected event and severity
    setTimeout(() => {
      generateStressTestData()
      setIsChartReady(true)

      // End visualization mode after animation completes
      setTimeout(() => {
        setIsVisualizing(false)
      }, 2000)
    }, 1000)
  }

  // Generate stress test data based on selected event and severity factor
  const generateStressTestData = () => {
    if (!mounted) return // Skip data generation during SSR
    
    const dataPoints = 100
    const severityFactor = severity / 50 // 0.0-2.0 scale
    const eventDrawdown = selectedEvent.maxDrawdown

    // Generate market performance data (S&P 500 proxy)
    const marketData = []

    // Generate portfolio performance with some randomness and based on severity
    const portfolioData = []

    // Portfolio generally does better than market in our simulation, but severity affects this
    const portfolioAdvantage = ((100 - severity) / 100) * 0.4 // 0-40% advantage based on severity

    for (let i = 0; i < dataPoints; i++) {
      const progress = i / dataPoints

      // Create a drawdown curve that's deeper in the middle
      // Using a modified sine curve for realistic market movement
      const marketValue = Math.sin(progress * Math.PI) * eventDrawdown * severityFactor * progress

      // Add some randomness to market data but only on client
      marketData.push(marketValue * (1 + (Math.random() * 0.2 - 0.1)))

      // Portfolio performs differently based on severity
      // With high severity, portfolio suffers more than market
      // With low severity, portfolio has more protection
      const portfolioImpact =
        severity > 75
          ? marketValue * (1 + Math.random() * 0.3) // Worse than market in severe cases
          : marketValue * (1 - portfolioAdvantage + (Math.random() * 0.3 - 0.15)) // Better than market in milder cases

      portfolioData.push(portfolioImpact)
    }

    setMarketPerformance(marketData)
    setPortfolioPerformance(portfolioData)
  }

  return (
    <div className="rounded-xl border border-border/40 bg-black/50 p-6 shadow-lg transition-all">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          <Clock className="h-6 w-6 text-primary" />
          <span>Time Travel Stress Test</span>
        </h2>

        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Visualize historical market events on your portfolio</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <div className="space-y-4">
            <EventSelector
              events={HISTORICAL_EVENTS}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
              disabled={isVisualizing}
            />

            <SeveritySlider value={severity} onChange={setSeverity} disabled={isVisualizing} />

            <div className="rounded-lg border border-border/40 bg-black/30 p-4">
              <h3 className="mb-2 text-sm font-medium">Event Description</h3>
              <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Max Drawdown</div>
                  <div className="font-mono text-sm text-red-400">{selectedEvent.maxDrawdown}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Duration</div>
                  <div className="font-mono text-sm">{selectedEvent.duration} days</div>
                </div>
              </div>
            </div>

            <VisualizeButton onClick={handleVisualize} isVisualizing={isVisualizing} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="relative flex h-[400px] w-full items-center justify-center rounded-lg border border-border/40 bg-black/30 p-4">
            {mounted && isVisualizing && !isChartReady && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
                <div className="mt-4 text-lg font-medium">Time traveling to {selectedEvent.name}...</div>
              </div>
            )}

            {mounted && (
              <PortfolioComparisonChart
                portfolioData={portfolioPerformance}
                marketData={marketPerformance}
                isAnimating={isChartReady}
                eventName={selectedEvent.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
