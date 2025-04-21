"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, FileText, Download, Trash2, X, Check, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

interface PortfolioStock {
  ticker: string
  quantity?: number
  weight?: number
  sector?: string
}

const PORTFOLIO_STORAGE_KEY = 'importedPortfolio'

export function PortfolioImporter() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<PortfolioStock[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isImported, setIsImported] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load imported portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
    if (savedPortfolio) {
      try {
        const parsedPortfolio = JSON.parse(savedPortfolio)
        if (Array.isArray(parsedPortfolio) && parsedPortfolio.length > 0) {
          setPreview(parsedPortfolio)
          setIsImported(true)
          // Find the original filename (optional, just for display)
          const savedFilename = localStorage.getItem(PORTFOLIO_STORAGE_KEY + '_filename')
          if (savedFilename) {
            setFile(new File([], savedFilename)) // Create dummy file for name display
          }
          toast.info("Loaded previously imported portfolio.")
        }
      } catch (e) {
        console.error("Failed to parse saved imported portfolio", e)
        localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
        localStorage.removeItem(PORTFOLIO_STORAGE_KEY + '_filename')
      }
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setIsImported(false)
    setPreview([]) // Clear previous preview
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY) // Clear previous save
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY + '_filename')
    const selectedFile = e.target.files?.[0]
    
    if (!selectedFile) return
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }
    
    setFile(selectedFile)
    setIsLoading(true)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== '') // Handle Windows line endings
        
        if (rows.length < 2) {
          throw new Error('CSV file must contain a header row and at least one data row.')
        }
        
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase())
        
        if (!headers.includes('ticker')) {
          throw new Error('CSV must include a "ticker" column.')
        }
        if (!headers.includes('quantity') && !headers.includes('weight')) {
          throw new Error('CSV must include either a "quantity" or "weight" column.')
        }
        
        const tickerIndex = headers.indexOf('ticker')
        const quantityIndex = headers.indexOf('quantity')
        const weightIndex = headers.indexOf('weight')
        const sectorIndex = headers.indexOf('sector')
        
        const stocks: PortfolioStock[] = []
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(',').map(v => v.trim())
          
          // Allow rows with fewer columns if optional ones are missing
          if (values.length < tickerIndex + 1 || !values[tickerIndex]) continue
          
          const stock: PortfolioStock = { ticker: values[tickerIndex].toUpperCase() }
          
          if (quantityIndex !== -1 && values[quantityIndex]) {
            const qty = parseFloat(values[quantityIndex])
            if (!isNaN(qty)) stock.quantity = qty
          }
          if (weightIndex !== -1 && values[weightIndex]) {
            const wgt = parseFloat(values[weightIndex])
            if (!isNaN(wgt)) stock.weight = wgt // Assuming weight is already a percentage
          }
          if (sectorIndex !== -1 && values[sectorIndex]) {
            stock.sector = values[sectorIndex]
          }
          
          // Validate required fields
          if (!stock.ticker || (stock.quantity === undefined && stock.weight === undefined)) {
             console.warn(`Skipping invalid row ${i + 1}:`, rows[i])
             continue // Skip rows missing required data
          }
          
          stocks.push(stock)
        }
        
        if (stocks.length === 0) {
          throw new Error('No valid stock data found in the CSV file.')
        }
        
        setPreview(stocks)
        setIsLoading(false)
        toast.success(`Parsed ${stocks.length} stocks from ${selectedFile.name}`)
      } catch (error) {
        setError((error as Error).message || 'Failed to parse CSV file')
        setFile(null)
        setPreview([])
        setIsLoading(false)
      }
    }
    
    reader.onerror = () => {
      setError('Failed to read the file')
      setFile(null)
      setPreview([])
      setIsLoading(false)
    }
    
    reader.readAsText(selectedFile)
  }

  const handleRemoveStock = (index: number) => {
    const stockToRemove = preview[index]
    const updatedPreview = [...preview]
    updatedPreview.splice(index, 1)
    setPreview(updatedPreview)
    setIsImported(false) // Need to re-confirm if preview changes
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY + '_filename')
    toast.error(`${stockToRemove?.ticker} removed from preview.`)
  }

  const downloadSampleCsv = () => {
    const sampleData = `ticker,quantity,weight,sector\nAAPL,10,,Technology\nMSFT,,15,Technology\nAMZN,3,10,Consumer Cyclical\nGOOGL,2,5,Communication Services\nJNJ,8,,Healthcare`
    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_portfolio.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const confirmImport = () => {
    if (preview.length === 0) {
      toast.error("No portfolio data to import.")
      return
    }
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(preview))
      if (file) {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY + '_filename', file.name)
      }
      setIsImported(true)
      toast.success("Portfolio imported and saved successfully!")
    } catch (e) {
      console.error("Failed to save imported portfolio:", e)
      toast.error("Failed to save portfolio. Check browser permissions or console.")
    }
  }

  const resetUpload = () => {
    setFile(null)
    setPreview([])
    setError(null)
    setIsImported(false)
    setIsLoading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY + '_filename')
    toast.warning("Imported portfolio cleared.")
  }

  const analyzePortfolio = () => {
    if (!isImported || preview.length === 0) {
      toast.error("Please import and save a portfolio before analyzing.")
      return
    }
    // Placeholder for future analysis logic
    toast.info("Portfolio analysis feature coming soon!")
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#333333] bg-[#1A1A1A]">
        <CardHeader>
          <CardTitle>Import Portfolio from CSV</CardTitle>
          <CardDescription>
            Upload a CSV file containing your portfolio data with ticker symbols and quantities or weights.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          {!file && !preview.length && (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#333333] rounded-md bg-[#222222]">
              <Upload className="h-12 w-12 text-[#777777] mb-4" />
              <p className="text-center text-[#FFFFFF] mb-2">
                Drag & drop your CSV file here or click to browse
              </p>
              <p className="text-center text-[#777777] text-sm mb-4">
                Supported columns: Ticker (required), Quantity or Weight, Sector (optional)
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="border-[#333333] text-white hover:bg-[#333333]"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </Button>
                <Button 
                  variant="outline" 
                  onClick={downloadSampleCsv}
                  disabled={isLoading}
                  className="border-[#333333] text-white hover:bg-[#333333]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample CSV
                </Button>
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Success Alert */}
          {isImported && preview.length > 0 && (
            <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
              <Check className="h-4 w-4" />
              <AlertTitle>Portfolio Ready</AlertTitle>
              <AlertDescription>Portfolio from '{file?.name}' is imported and saved. You can now analyze it or reset.</AlertDescription>
            </Alert>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#EB0914]"></div>
              <span className="ml-3 text-[#FFFFFF]">Parsing CSV...</span>
            </div>
          )}

          {/* Preview Table */}
          {preview.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#EB0914]" />
                  <span className="font-medium">
                    Preview: {file?.name || 'Saved Portfolio'} ({preview.length} stocks)
                  </span>
                </div>
                {!isImported && (
                  <Button variant="ghost" size="sm" onClick={resetUpload}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Upload
                  </Button>
                )}
              </div>
              
              <div className="rounded-md border border-[#333333] overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#222222]">
                    <TableRow>
                      <TableHead>Ticker</TableHead>
                      {preview.some(s => s.quantity !== undefined) && (
                        <TableHead>Quantity</TableHead>
                      )}
                      {preview.some(s => s.weight !== undefined) && (
                        <TableHead>Weight (%)</TableHead>
                      )}
                      {preview.some(s => s.sector) && (
                        <TableHead>Sector</TableHead>
                      )}
                      {!isImported && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((stock, index) => (
                      <TableRow key={index} className="border-t border-[#333333]">
                        <TableCell className="font-medium">{stock.ticker}</TableCell>
                        {preview.some(s => s.quantity !== undefined) && (
                          <TableCell>{stock.quantity !== undefined ? stock.quantity : '-'}</TableCell>
                        )}
                        {preview.some(s => s.weight !== undefined) && (
                          <TableCell>{stock.weight !== undefined ? `${stock.weight}%` : '-'}</TableCell>
                        )}
                        {preview.some(s => s.sector) && (
                          <TableCell>{stock.sector || '-'}</TableCell>
                        )}
                        {!isImported && (
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveStock(index)}
                              className="text-[#EB0914] hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Footer Buttons */}
        {(preview.length > 0 || isImported) && (
          <CardFooter className="border-t border-[#333333] pt-6 flex justify-between">
             <Button 
              onClick={analyzePortfolio}
              disabled={!isImported}
              className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white disabled:opacity-50"
            >
              🧠 Analyze Portfolio
            </Button>
            <div className="flex gap-2">
             {!isImported && preview.length > 0 && (
                <Button 
                  onClick={confirmImport} 
                  className="bg-[#EB0914] hover:bg-[#EB0914]/90 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Confirm & Save Import
                </Button>
             )}
              <Button 
                onClick={resetUpload}
                variant="destructive"
                className="bg-red-900/50 hover:bg-red-900/70 text-red-300 border border-red-700/50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
} 