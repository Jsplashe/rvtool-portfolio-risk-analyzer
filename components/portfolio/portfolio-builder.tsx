"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Check, X, Edit, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface PortfolioStock {
  id: string
  ticker: string
  quantity: number
  sector: string
}

interface EditingStock extends Partial<PortfolioStock> {
  id: string
}

const sectors = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer Cyclical",
  "Communication Services",
  "Industrials",
  "Consumer Defensive",
  "Energy",
  "Basic Materials",
  "Real Estate",
  "Utilities",
  "Other"
]

const PORTFOLIO_STORAGE_KEY = 'manualPortfolio'

export function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([])
  const [ticker, setTicker] = useState("")
  const [quantity, setQuantity] = useState("")
  const [sector, setSector] = useState("Technology")
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<EditingStock | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
    if (savedPortfolio) {
      try {
        const parsedPortfolio = JSON.parse(savedPortfolio)
        if (Array.isArray(parsedPortfolio)) {
          setPortfolio(parsedPortfolio)
        }
      } catch (e) {
        console.error("Failed to parse saved portfolio", e)
        localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
      }
    }
  }, [])
  
  const handleAddStock = () => {
    if (!ticker.trim()) {
      setError("Please enter a ticker symbol")
      return
    }
    
    const parsedQuantity = parseFloat(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Please enter a valid, positive quantity")
      return
    }
    
    const upperCaseTicker = ticker.toUpperCase()
    if (portfolio.some(stock => stock.ticker === upperCaseTicker)) {
      setError(`Ticker ${upperCaseTicker} is already in your portfolio. Edit the existing entry instead.`)
      return
    }
    
    setError(null)
    const newStock: PortfolioStock = {
      id: crypto.randomUUID(),
      ticker: upperCaseTicker,
      quantity: parsedQuantity,
      sector
    }
    setPortfolio([...portfolio, newStock])
    setTicker("")
    setQuantity("")
    toast.success(`${newStock.ticker} added to portfolio.`)
  }
  
  const handleRemoveStock = (id: string) => {
    const stockToRemove = portfolio.find(stock => stock.id === id)
    setPortfolio(portfolio.filter(stock => stock.id !== id))
    if (editingStockId === id) {
      setEditingStockId(null)
      setEditingValues(null)
    }
    toast.error(`${stockToRemove?.ticker} removed from portfolio.`)
  }
  
  const startEditing = (stock: PortfolioStock) => {
    setEditingStockId(stock.id)
    setEditingValues({ ...stock })
    setError(null)
  }
  
  const handleEditChange = (field: keyof EditingStock, value: string | number) => {
    if (!editingValues) return
    setEditingValues({ ...editingValues, [field]: value })
  }
  
  const saveEdit = () => {
    if (!editingStockId || !editingValues) return

    const parsedQuantity = Number(editingValues.quantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Please enter a valid, positive quantity for the edited stock.")
      return
    }

    if (!editingValues.ticker?.trim()) {
      setError("Ticker symbol cannot be empty.")
      return
    }
    
    const upperCaseTicker = editingValues.ticker.toUpperCase()
    // Check if the edited ticker conflicts with another existing ticker
    if (portfolio.some(stock => stock.id !== editingStockId && stock.ticker === upperCaseTicker)) {
      setError(`Ticker ${upperCaseTicker} already exists in the portfolio.`)
      return
    }
    
    setError(null)

    setPortfolio(portfolio.map(stock =>
      stock.id === editingStockId ? { ...stock, ...editingValues, ticker: upperCaseTicker, quantity: parsedQuantity } as PortfolioStock : stock
    ))
    setEditingStockId(null)
    setEditingValues(null)
    toast.info(`Updated ${upperCaseTicker} entry.`)
  }

  const cancelEdit = () => {
    setEditingStockId(null)
    setEditingValues(null)
    setError(null)
  }

  const savePortfolio = () => {
    if (portfolio.length === 0) {
      toast.error("Cannot save an empty portfolio.")
      return
    }
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio))
      toast.success("Portfolio saved successfully to Local Storage!")
    } catch (e) {
      console.error("Failed to save portfolio:", e)
      toast.error("Failed to save portfolio. Check browser permissions or console.")
    }
  }

  const resetPortfolio = () => {
    setPortfolio([])
    setTicker("")
    setQuantity("")
    setSector("Technology")
    setEditingStockId(null)
    setEditingValues(null)
    setError(null)
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
    toast.warning("Manual portfolio reset.")
  }

  const analyzePortfolio = () => {
    // Placeholder for future analysis logic
    toast.info("Portfolio analysis feature coming soon!")
  }
  
  return (
    <div className="space-y-6">
      <Card className="border-[#333333] bg-[#1A1A1A]">
        <CardHeader>
          <CardTitle>Build Your Portfolio Manually</CardTitle>
          <CardDescription>
            Add or edit stocks one by one to create your custom portfolio.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <X className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Add Stock Form */}
          {!editingStockId && (
            <div className="grid gap-4 md:grid-cols-4 items-end border-b border-[#333333] pb-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker Symbol</Label>
                <Input
                  id="ticker"
                  placeholder="e.g. AAPL"
                  value={ticker}
                  onChange={e => setTicker(e.target.value)}
                  className="bg-[#222222] border-[#333333]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 10"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="bg-[#222222] border-[#333333]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger id="sector" className="bg-[#222222] border-[#333333]">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222222] border-[#333333]">
                    {sectors.map(sectorOption => (
                      <SelectItem key={sectorOption} value={sectorOption}>
                        {sectorOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddStock}
                className="w-full bg-[#EB0914] hover:bg-[#EB0914]/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
            </div>
          )}
          
          {/* Portfolio Table */}
          {portfolio.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Your Portfolio ({portfolio.length} stocks)</h3>
              
              <div className="rounded-md border border-[#333333] overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#222222]">
                    <TableRow>
                      <TableHead>Ticker</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.map(stock => (
                      <TableRow key={stock.id} className={`border-t border-[#333333] ${editingStockId === stock.id ? 'bg-[#2a2a2a]' : ''}`}>
                        {editingStockId === stock.id ? (
                          <>
                            <TableCell>
                              <Input
                                value={editingValues?.ticker || ''}
                                onChange={e => handleEditChange('ticker', e.target.value.toUpperCase())}
                                className="bg-[#333333] border-[#444444] h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="any"
                                value={editingValues?.quantity || ''}
                                onChange={e => handleEditChange('quantity', e.target.value)}
                                className="bg-[#333333] border-[#444444] h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Select value={editingValues?.sector || ''} onValueChange={value => handleEditChange('sector', value)}>
                                <SelectTrigger className="bg-[#333333] border-[#444444] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#222222] border-[#333333]">
                                  {sectors.map(sectorOption => (
                                    <SelectItem key={sectorOption} value={sectorOption}>{sectorOption}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={saveEdit} className="text-green-500 hover:text-green-400">
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={cancelEdit} className="text-gray-500 hover:text-gray-400">
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-medium">{stock.ticker}</TableCell>
                            <TableCell>{stock.quantity}</TableCell>
                            <TableCell>{stock.sector}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => startEditing(stock)} className="text-[#777777] hover:text-white mr-1">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveStock(stock.id)} className="text-[#EB0914] hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
             <p className="text-center text-[#777777] py-8">Your manually built portfolio is empty. Add stocks using the form above.</p>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-[#333333] pt-6 flex justify-between">
           <Button 
              onClick={analyzePortfolio}
              className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
            >
              🧠 Analyze Portfolio
            </Button>
          <div className="flex gap-2">
            <Button 
              onClick={savePortfolio}
              variant="outline"
              className="border-[#333333] text-white hover:bg-[#333333]"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Portfolio
            </Button>
            <Button 
              onClick={resetPortfolio}
              variant="destructive"
              className="bg-red-900/50 hover:bg-red-900/70 text-red-300 border border-red-700/50"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 