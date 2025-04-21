"use client"

import { useState, useEffect } from "react"
import { BellRing, Plus, Trash2, Info, X, Check, AlertTriangle, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { toast } from "sonner"

// --- Types --- 

type Metric = "Portfolio Beta" | "Value at Risk (VaR)" | "Max Correlation"
type Condition = "Above" | "Below"

interface RiskAlert {
  id: string
  metric: Metric
  threshold: number
  condition: Condition
  notificationTarget?: string
  status: "Active" | "Triggered" // Status would be updated by a backend/monitoring system
}

// --- Mock Data --- 
const MOCK_CURRENT_METRICS: Record<Metric, number> = {
  "Portfolio Beta": 1.05,
  "Value at Risk (VaR)": 25000, // Example: $25,000
  "Max Correlation": 0.78,
}

const ALERTS_STORAGE_KEY = 'riskAlerts'
const ALERTS_ENABLED_KEY = 'riskAlertsEnabled'

// --- Component --- 

export function AlertManager() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([])
  const [metric, setMetric] = useState<Metric>("Portfolio Beta")
  const [threshold, setThreshold] = useState("")
  const [condition, setCondition] = useState<Condition>("Above")
  const [notificationTarget, setNotificationTarget] = useState("")
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Load state from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY)
    if (savedAlerts) {
      try {
        const parsedAlerts = JSON.parse(savedAlerts)
        if (Array.isArray(parsedAlerts)) {
          setAlerts(parsedAlerts)
        }
      } catch (e) { console.error("Failed to parse saved alerts", e) }
    }
    
    const savedEnabled = localStorage.getItem(ALERTS_ENABLED_KEY)
    if (savedEnabled !== null) {
        setAlertsEnabled(savedEnabled === 'true')
    }
  }, [])

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts))
  }, [alerts])

  // Save enabled state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(ALERTS_ENABLED_KEY, String(alertsEnabled))
  }, [alertsEnabled])

  const handleSetAlert = () => {
    setError(null)
    const parsedThreshold = parseFloat(threshold)
    
    if (isNaN(parsedThreshold)) {
      setError("Threshold must be a valid number.")
      return
    }
    
    // Basic validation (can be expanded)
    if (metric === "Portfolio Beta" && (parsedThreshold < 0 || parsedThreshold > 3)) {
        setError("Beta threshold typically between 0 and 3.")
        return
    }
    if (metric === "Max Correlation" && (parsedThreshold < -1 || parsedThreshold > 1)) {
        setError("Correlation threshold must be between -1 and 1.")
        return
    }
     if (metric === "Value at Risk (VaR)" && parsedThreshold < 0) {
        setError("VaR threshold must be positive.")
        return
    }
    
    const newAlert: RiskAlert = {
      id: crypto.randomUUID(),
      metric,
      threshold: parsedThreshold,
      condition,
      notificationTarget: notificationTarget.trim() || undefined,
      status: "Active", // Default status
    }
    
    setAlerts([...alerts, newAlert])
    
    // Reset form
    setThreshold("")
    setNotificationTarget("")
    
    toast.success(`Alert set for ${metric} ${condition} ${parsedThreshold}`)
  }
  
  const handleDeleteAlert = (id: string) => {
    const alertToDelete = alerts.find(a => a.id === id)
    setAlerts(alerts.filter(alert => alert.id !== id))
    toast.error(`Alert for ${alertToDelete?.metric} deleted.`)
  }

  const toggleAlerts = (enabled: boolean) => {
    setAlertsEnabled(enabled)
    toast.info(`All alerts ${enabled ? 'enabled' : 'disabled'}.`)
  }
  
  const getMetricDescription = (metricName: Metric): string => {
      switch(metricName) {
          case "Portfolio Beta": return "Measures portfolio volatility relative to the market (e.g., S&P 500). Beta > 1 is more volatile, Beta < 1 is less volatile.";
          case "Value at Risk (VaR)": return "Estimates the potential loss in portfolio value over a specific period for a given confidence level (e.g., 95% VaR of $10k means 5% chance of losing $10k or more).";
          case "Max Correlation": return "Indicates the highest correlation between any two assets in the portfolio. High correlation reduces diversification benefits.";
          default: return "Selected risk metric.";
      }
  }

  return (
    <TooltipProvider>
    <div className="space-y-8 text-white">
        {/* Header & Global Toggle */} 
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BellRing className="h-6 w-6 text-yellow-400" />
                🚨 Risk Alerts
            </h1>
            <div className="flex items-center space-x-2">
                <Label htmlFor="alerts-enabled" className="text-sm font-medium">
                    {alertsEnabled ? "Alerts Enabled" : "Alerts Disabled"}
                </Label>
                <Switch 
                    id="alerts-enabled"
                    checked={alertsEnabled}
                    onCheckedChange={toggleAlerts}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                />
            </div>
        </div>

        {/* Current Mock Metrics */} 
        <Card className="border-[#333333] bg-[#1A1A1A]">
            <CardHeader>
                <CardTitle>Current Metric Values (Mock Data)</CardTitle>
                <CardDescription>Simulated values for demonstration purposes.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {Object.entries(MOCK_CURRENT_METRICS).map(([m, value]) => (
                    <div key={m} className="bg-[#222222] p-3 rounded-md border border-[#333333]">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-400">{m}</span>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs bg-black border border-[#333]">
                                    <p>{getMetricDescription(m as Metric)}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="text-lg font-semibold text-white">
                           {m === "Value at Risk (VaR)" ? `$${value.toLocaleString()}` : value.toFixed(2)}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

        {/* Add Alert Form */} 
        <Card className="border-[#333333] bg-[#1A1A1A]">
            <CardHeader>
                <CardTitle>Set New Risk Alert</CardTitle>
                <CardDescription>Get notified when a metric crosses your defined threshold.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {error && (
                    <Alert variant="destructive" className="mb-4">
                    <X className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 items-end">
                    <div className="space-y-1.5">
                        <Label htmlFor="metric">Select Metric</Label>
                        <Select value={metric} onValueChange={(value) => setMetric(value as Metric)}>
                            <SelectTrigger id="metric" className="bg-[#222222] border-[#333333]">
                                <SelectValue placeholder="Choose metric..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#222222] border-[#333333]">
                                {Object.keys(MOCK_CURRENT_METRICS).map(m => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="condition">Trigger Condition</Label>
                        <Select value={condition} onValueChange={(value) => setCondition(value as Condition)}>
                            <SelectTrigger id="condition" className="bg-[#222222] border-[#333333]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#222222] border-[#333333]">
                                <SelectItem value="Above">Above</SelectItem>
                                <SelectItem value="Below">Below</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="threshold">Threshold</Label>
                        <Input 
                            id="threshold" 
                            type="number" 
                            step="any"
                            placeholder="e.g., 1.2 or 50000"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                            className="bg-[#222222] border-[#333333]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="notification">Notify (Email/Webhook - Optional)</Label>
                        <Input 
                            id="notification" 
                            placeholder="your@email.com or webhook URL"
                            value={notificationTarget}
                            onChange={(e) => setNotificationTarget(e.target.value)}
                            className="bg-[#222222] border-[#333333]"
                        />
                    </div>
                    <Button 
                        onClick={handleSetAlert}
                        className="w-full bg-[#EB0914] hover:bg-[#EB0914]/90 text-white lg:mt-0 mt-4"
                        disabled={!alertsEnabled}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Set Alert
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        {/* Active Alerts Table */}
         <Card className="border-[#333333] bg-[#1A1A1A]">
            <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Your currently configured risk alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                {alerts.length > 0 ? (
                    <div className="rounded-md border border-[#333333] overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#222222]">
                            <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Threshold</TableHead>
                                <TableHead>Notification Target</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert.id} className="border-t border-[#333333]">
                                <TableCell className="font-medium">{alert.metric}</TableCell>
                                <TableCell>{alert.condition}</TableCell>
                                <TableCell>{alert.threshold}</TableCell>
                                <TableCell>{alert.notificationTarget || "-"}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${alert.status === 'Triggered' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {alert.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDeleteAlert(alert.id)}
                                                className="text-[#EB0914] hover:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-black border border-[#333]">
                                            <p>Delete Alert</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                 ) : (
                    <p className="text-center text-gray-500 py-8">No active alerts configured. Use the form above to set one.</p>
                 )}
            </CardContent>
        </Card>

    </div>
    </TooltipProvider>
  )
} 