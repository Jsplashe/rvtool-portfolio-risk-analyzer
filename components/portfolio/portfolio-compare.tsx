"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Scale } from "lucide-react"
import { toast } from "sonner"

// Assuming PortfolioStock interface is defined elsewhere, e.g., in portfolio-importer/builder
// If not, define it here:
interface PortfolioStock {
  id?: string // Optional for imported
  ticker: string
  quantity?: number
  weight?: number // Assume weight is a percentage value (e.g., 25 for 25%)
  sector?: string
}

interface Portfolio {
  name: string
  stocks: PortfolioStock[]
}

// --- Mock Data --- 
// In a real implementation, load these from localStorage using the keys
// from portfolio-builder.tsx and portfolio-importer.tsx
const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    name: "My Manual Portfolio",
    stocks: [
      { id: "1", ticker: "AAPL", quantity: 10, sector: "Technology" },
      { id: "2", ticker: "MSFT", quantity: 5, sector: "Technology" },
      { id: "3", ticker: "TSLA", quantity: 8, sector: "Consumer Cyclical" },
      { id: "4", ticker: "JPM", quantity: 15, sector: "Financial Services" },
    ],
  },
  {
    name: "Imported CSV Portfolio",
    stocks: [
      { ticker: "AAPL", weight: 25, sector: "Technology" },
      { ticker: "MSFT", weight: 15, sector: "Technology" },
      { ticker: "AMZN", weight: 10, sector: "Consumer Cyclical" },
      { ticker: "GOOGL", weight: 5, sector: "Communication Services" },
      { ticker: "JNJ", weight: 10, sector: "Healthcare" },
    ],
  },
  {
    name: "Aggressive Growth",
    stocks: [
        { ticker: "TSLA", weight: 30, sector: "Consumer Cyclical" },
        { ticker: "NVDA", weight: 25, sector: "Technology" },
        { ticker: "AMD", weight: 20, sector: "Technology" },
        { ticker: "SQ", weight: 15, sector: "Technology" },
        { ticker: "PLTR", weight: 10, sector: "Technology" },
    ]
  }
]

// --- Helper Functions --- 

// Normalize portfolio to use weights (calculates if only quantity is available)
// NOTE: This is a simplified normalization. Real-world requires price data.
const normalizePortfolioWeights = (portfolio: Portfolio): { [ticker: string]: number } => {
  const weights: { [ticker: string]: number } = {}
  let totalValue = 0

  // Prioritize existing weights
  if (portfolio.stocks.every(s => s.weight !== undefined)) {
    portfolio.stocks.forEach(stock => {
      weights[stock.ticker] = stock.weight ?? 0
    })
    return weights
  }
  
  // If only quantities, assign equal value for simplicity (needs price data for real calc)
  if (portfolio.stocks.every(s => s.quantity !== undefined && s.weight === undefined)) {
      console.warn("Calculating weights based on equal value assumption - requires price data for accuracy.")
      totalValue = portfolio.stocks.reduce((sum, stock) => sum + (stock.quantity ?? 0), 0) // Treat quantity as value for now
      portfolio.stocks.forEach(stock => {
          weights[stock.ticker] = ((stock.quantity ?? 0) / totalValue) * 100
      })
      return weights
  }

  console.error("Portfolio has mixed or missing quantity/weight data for normalization:", portfolio.name)
  toast.error(`Cannot normalize weights for ${portfolio.name}. Ensure consistent data (all weights or all quantities).`) 
  return {}
}


// --- Component --- 

export function PortfolioCompare() {
  const [portfolioA, setPortfolioA] = useState<Portfolio | null>(null)
  const [portfolioB, setPortfolioB] = useState<Portfolio | null>(null)
  const [availablePortfolios, setAvailablePortfolios] = useState<Portfolio[]>([])

  useEffect(() => {
    // TODO: Replace MOCK_PORTFOLIOS with actual loading from localStorage
    // Example: 
    // const manualPortfolio = localStorage.getItem('manualPortfolio');
    // const importedPortfolio = localStorage.getItem('importedPortfolio');
    // const loadedPortfolios = [...parsePortfolio(manualPortfolio, "Manual Portfolio"), ...parsePortfolio(importedPortfolio, "Imported Portfolio")];
    setAvailablePortfolios(MOCK_PORTFOLIOS)
    
    // Pre-select first two if available
    if (MOCK_PORTFOLIOS.length >= 2) {
      setPortfolioA(MOCK_PORTFOLIOS[0])
      setPortfolioB(MOCK_PORTFOLIOS[1])
    } else if (MOCK_PORTFOLIOS.length === 1) {
      setPortfolioA(MOCK_PORTFOLIOS[0])
    }

  }, [])

  const handleSelectA = (portfolioName: string) => {
    const selected = availablePortfolios.find(p => p.name === portfolioName)
    setPortfolioA(selected || null)
  }

  const handleSelectB = (portfolioName: string) => {
    const selected = availablePortfolios.find(p => p.name === portfolioName)
    setPortfolioB(selected || null)
  }

  const comparisonData = useMemo(() => {
    if (!portfolioA || !portfolioB) return []

    const weightsA = normalizePortfolioWeights(portfolioA)
    const weightsB = normalizePortfolioWeights(portfolioB)
    const allTickers = Array.from(new Set([...Object.keys(weightsA), ...Object.keys(weightsB)]))

    return allTickers.map(ticker => {
      const weightA = weightsA[ticker] || 0
      const weightB = weightsB[ticker] || 0
      const difference = weightB - weightA
      return { ticker, weightA, weightB, difference }
    }).sort((a, b) => b.weightA + b.weightB - (a.weightA + a.weightB)) // Sort by combined weight initially

  }, [portfolioA, portfolioB])

  const topDifferences = useMemo(() => {
      return [...comparisonData]
          .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
          .slice(0, 5)
  }, [comparisonData])

  const overlapData = useMemo(() => {
      if (!portfolioA || !portfolioB) return { overlapScore: 0, diversificationDelta: 0 };
      
      const tickersA = new Set(portfolioA.stocks.map(s => s.ticker))
      const tickersB = new Set(portfolioB.stocks.map(s => s.ticker))
      
      const intersection = new Set([...tickersA].filter(ticker => tickersB.has(ticker)))
      const union = new Set([...tickersA, ...tickersB])
      
      const overlapScore = union.size > 0 ? (intersection.size / union.size) * 100 : 0
      
      // Simple diversification delta (difference in number of unique assets)
      // More complex metrics (like sector concentration diff) could be added
      const diversificationDelta = tickersA.size > 0 ? 
          ((tickersB.size - tickersA.size) / tickersA.size) * 100 
          : (tickersB.size > 0 ? Infinity : 0); // Handle division by zero
          
      return { overlapScore, diversificationDelta }
  }, [portfolioA, portfolioB])

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-blue-400" />
              📊 Compare Portfolios
          </h1>
      </div>
      
      {/* Portfolio Selection */}
      <Card className="border-[#333333] bg-[#1A1A1A]">
          <CardHeader>
              <CardTitle>Select Portfolios to Compare</CardTitle>
              <CardDescription>Choose two saved portfolios from the dropdowns below.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label htmlFor="portfolio-a">Select Portfolio A</Label>
              <Select 
                onValueChange={handleSelectA} 
                value={portfolioA?.name}
                disabled={availablePortfolios.length === 0}
              >
                <SelectTrigger id="portfolio-a" className="bg-[#222222] border-[#333333]">
                  <SelectValue placeholder="Select a portfolio" />
                </SelectTrigger>
                <SelectContent className="bg-[#222222] border-[#333333]">
                  {availablePortfolios.map(p => (
                    <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-b">Select Portfolio B</Label>
              <Select 
                onValueChange={handleSelectB} 
                value={portfolioB?.name}
                disabled={availablePortfolios.length === 0}
              >
                <SelectTrigger id="portfolio-b" className="bg-[#222222] border-[#333333]">
                  <SelectValue placeholder="Select a portfolio" />
                </SelectTrigger>
                <SelectContent className="bg-[#222222] border-[#333333]">
                  {availablePortfolios.map(p => (
                    <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
      </Card>

      {/* Comparison Table */}
      {portfolioA && portfolioB ? (
          <Card className="border-[#333333] bg-[#1A1A1A]">
              <CardHeader>
                  <CardTitle>Asset Weight Comparison</CardTitle>
                  <CardDescription>Comparing weights between '{portfolioA.name}' and '{portfolioB.name}'.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-[#333333] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#222222]">
                      <TableRow>
                        <TableHead>Asset (Ticker)</TableHead>
                        <TableHead className="text-right">Weight in A (%)</TableHead>
                        <TableHead className="text-right">Weight in B (%)</TableHead>
                        <TableHead className="text-right">Difference (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.length > 0 ? comparisonData.map(item => (
                        <TableRow key={item.ticker} className="border-t border-[#333333]">
                          <TableCell className="font-medium">{item.ticker}</TableCell>
                          <TableCell className="text-right">{item.weightA.toFixed(2)}%</TableCell>
                          <TableCell className="text-right">{item.weightB.toFixed(2)}%</TableCell>
                          <TableCell 
                            className={`text-right font-semibold ${item.difference > 0 ? 'text-green-400' : item.difference < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                            {item.difference > 0 ? '+' : ''}{item.difference.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                Portfolios have no comparable assets or data could not be normalized.
                            </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
          </Card>
      ) : (
          <Card className="border-[#333333] bg-[#1A1A1A]">
              <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Please select two portfolios to compare.</p>
              </CardContent>
          </Card>
      )}
      
      {/* Difference Chart Placeholder */} 
       {portfolioA && portfolioB && comparisonData.length > 0 && (
           <Card className="border-[#333333] bg-[#1A1A1A]">
              <CardHeader>
                  <CardTitle>Top 5 Weight Differences</CardTitle>
                  <CardDescription>Visualization of the assets with the largest absolute weight difference.</CardDescription>
              </CardHeader>
              <CardContent>
                   {/* Placeholder for Bar Chart */}
                  <div className="h-64 w-full bg-[#222222]/50 rounded-md flex items-center justify-center text-gray-500 border border-[#333333]">
                      Chart Placeholder (Top 5 Differences: {topDifferences.map(d => `${d.ticker} (${d.difference > 0 ? '+' : ''}${d.difference.toFixed(1)}%)`).join(', ')})
                  </div>
              </CardContent>
          </Card>
       )}

      {/* Summary Metrics */} 
       {portfolioA && portfolioB && comparisonData.length > 0 && (
           <Card className="border-[#333333] bg-[#1A1A1A]">
              <CardHeader>
                  <CardTitle>Comparison Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                   <div className="bg-[#222222] p-4 rounded-md border border-[#333333]">
                       <div className="text-gray-400 mb-1">Diversification Delta</div>
                       <div 
                         className={`text-lg font-bold ${overlapData.diversificationDelta > 10 ? 'text-green-400' : overlapData.diversificationDelta < -10 ? 'text-red-400' : 'text-gray-300'}`}
                       >
                           {isFinite(overlapData.diversificationDelta) ? 
                             `${overlapData.diversificationDelta > 0 ? '+' : ''}${overlapData.diversificationDelta.toFixed(1)}%` 
                             : 'N/A'}
                       </div>
                       <div className="text-xs text-gray-500">Difference in number of unique assets (B vs A)</div>
                   </div>
                   <div className="bg-[#222222] p-4 rounded-md border border-[#333333]">
                       <div className="text-gray-400 mb-1">Overlap Score</div>
                       <div className="text-lg font-bold text-blue-400">{overlapData.overlapScore.toFixed(1)}%</div>
                       <div className="text-xs text-gray-500">Percentage of unique assets shared between portfolios</div>
                   </div>
              </CardContent>
          </Card>
       )}

    </div>
  )
} 