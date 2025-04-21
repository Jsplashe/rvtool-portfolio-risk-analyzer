"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { Beaker, Flame, Gauge, PieChart } from "lucide-react"

import { AssetList } from "./asset-list"
import { Cauldron } from "./cauldron"
import { RiskMetricsCard } from "./risk-metrics-card"
import type { Asset } from "./types"

// Sample portfolio assets
const initialAssets: Asset[] = [
  { id: "aapl", ticker: "AAPL", name: "Apple Inc.", weight: 15, sector: "Technology", risk: 65 },
  { id: "msft", ticker: "MSFT", name: "Microsoft Corp.", weight: 12, sector: "Technology", risk: 60 },
  { id: "amzn", ticker: "AMZN", name: "Amazon.com Inc.", weight: 10, sector: "Consumer Cyclical", risk: 75 },
  { id: "googl", ticker: "GOOGL", name: "Alphabet Inc.", weight: 8, sector: "Communication Services", risk: 70 },
  { id: "brk-b", ticker: "BRK.B", name: "Berkshire Hathaway", weight: 7, sector: "Financial Services", risk: 45 },
  { id: "jnj", ticker: "JNJ", name: "Johnson & Johnson", weight: 6, sector: "Healthcare", risk: 30 },
  { id: "pg", ticker: "PG", name: "Procter & Gamble", weight: 5, sector: "Consumer Defensive", risk: 25 },
  { id: "v", ticker: "V", name: "Visa Inc.", weight: 5, sector: "Financial Services", risk: 50 },
  { id: "unh", ticker: "UNH", name: "UnitedHealth Group", weight: 4, sector: "Healthcare", risk: 40 },
  { id: "hd", ticker: "HD", name: "Home Depot Inc.", weight: 4, sector: "Consumer Cyclical", risk: 55 },
]

export function RiskCauldron() {
  const [portfolioAssets, setPortfolioAssets] = useState<Asset[]>(initialAssets)
  const [cauldronAssets, setCauldronAssets] = useState<Asset[]>([])
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null)
  const [riskTemp, setRiskTemp] = useState(0)
  const [volatilityLevel, setVolatilityLevel] = useState(0)
  const [diversificationScore, setDiversificationScore] = useState(100)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Calculate risk metrics whenever cauldron assets change
  useEffect(() => {
    if (cauldronAssets.length === 0) {
      setRiskTemp(0)
      setVolatilityLevel(0)
      setDiversificationScore(100)
      return
    }

    // Calculate weighted risk temperature (0-100)
    const totalWeight = cauldronAssets.reduce((sum, asset) => sum + asset.weight, 0)
    const weightedRisk = cauldronAssets.reduce((sum, asset) => sum + asset.risk * asset.weight, 0) / totalWeight
    setRiskTemp(Math.round(weightedRisk))

    // Calculate volatility based on asset mix and risk
    const volatility = Math.min(100, Math.round(weightedRisk * 1.2 * (1 + cauldronAssets.length / 20)))
    setVolatilityLevel(volatility)

    // Calculate diversification score (higher is better)
    // Decreases as more assets from the same sector are added
    const sectors = cauldronAssets.map((asset) => asset.sector)
    const uniqueSectors = new Set(sectors)
    const sectorConcentration = sectors.length > 0 ? uniqueSectors.size / sectors.length : 1
    const diversification = Math.round(100 * sectorConcentration * (1 - weightedRisk / 150))
    setDiversificationScore(Math.max(0, Math.min(100, diversification)))
  }, [cauldronAssets])

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const assetId = active.id as string

    // Find the asset being dragged
    const draggedAsset = [...portfolioAssets, ...cauldronAssets].find((asset) => asset.id === assetId)
    if (draggedAsset) {
      setActiveAsset(draggedAsset)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveAsset(null)

    if (!over) return

    const assetId = active.id as string
    const overId = over.id

    // Handle dropping into cauldron
    if (overId === "cauldron") {
      const assetIndex = portfolioAssets.findIndex((asset) => asset.id === assetId)

      // If asset is from portfolio, move it to cauldron
      if (assetIndex !== -1) {
        const asset = portfolioAssets[assetIndex]
        setPortfolioAssets(portfolioAssets.filter((a) => a.id !== assetId))
        setCauldronAssets([...cauldronAssets, asset])
      }
    }

    // Handle dropping back to portfolio
    if (overId === "portfolio") {
      const assetIndex = cauldronAssets.findIndex((asset) => asset.id === assetId)

      // If asset is from cauldron, move it back to portfolio
      if (assetIndex !== -1) {
        const asset = cauldronAssets[assetIndex]
        setCauldronAssets(cauldronAssets.filter((a) => a.id !== assetId))
        setPortfolioAssets([...portfolioAssets, asset])
      }
    }
  }

  // Reset the cauldron
  const handleReset = () => {
    setPortfolioAssets([...initialAssets])
    setCauldronAssets([])
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          <Beaker className="h-6 w-6 text-primary" />
          <span>Risk Cauldron</span>
        </h2>
        <button
          onClick={handleReset}
          className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80"
        >
          Reset Cauldron
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Left side - Asset list */}
          <div className="rounded-xl border border-border/40 bg-black/50 p-4 shadow-lg">
            <h3 className="mb-4 text-lg font-medium">Portfolio Assets</h3>
            <AssetList assets={portfolioAssets} id="portfolio" />
          </div>

          {/* Right side - Cauldron and metrics */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-1 items-center justify-center rounded-xl border border-border/40 bg-black/50 p-6 shadow-lg">
              <Cauldron assets={cauldronAssets} riskLevel={riskTemp} id="cauldron" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <RiskMetricsCard
                title="Risk Temperature"
                value={riskTemp}
                maxValue={100}
                icon={<Flame className="h-5 w-5" />}
                color={riskTemp < 30 ? "green" : riskTemp < 60 ? "yellow" : "red"}
                unit="°"
              />
              <RiskMetricsCard
                title="Volatility Level"
                value={volatilityLevel}
                maxValue={100}
                icon={<Gauge className="h-5 w-5" />}
                color={volatilityLevel < 30 ? "green" : volatilityLevel < 60 ? "yellow" : "red"}
                unit="%"
              />
              <RiskMetricsCard
                title="Diversification Score"
                value={diversificationScore}
                maxValue={100}
                icon={<PieChart className="h-5 w-5" />}
                color={diversificationScore > 70 ? "green" : diversificationScore > 40 ? "yellow" : "red"}
                unit=""
                higherIsBetter
              />
            </div>
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeAsset ? (
            <div className="rounded-md border border-border/40 bg-black/80 p-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 font-mono text-primary">
                  {activeAsset.ticker.substring(0, 4)}
                </div>
                <div>
                  <div className="font-medium">{activeAsset.name}</div>
                  <div className="text-xs text-muted-foreground">{activeAsset.sector}</div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
