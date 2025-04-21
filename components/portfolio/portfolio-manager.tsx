"use client"

import { useState } from "react"
import { Folder, Upload, PlusCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioImporter } from "./portfolio-importer"
import { PortfolioBuilder } from "./portfolio-builder"

export function PortfolioManager() {
  const [activeTab, setActiveTab] = useState("import")
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Folder className="h-8 w-8 text-[#EB0914]" />
        <h1 className="text-2xl font-bold tracking-tight">📁 My Portfolio</h1>
      </div>
      
      <Tabs defaultValue="import" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Build Manually
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="mt-4">
          <PortfolioImporter />
        </TabsContent>
        
        <TabsContent value="manual" className="mt-4">
          <PortfolioBuilder />
        </TabsContent>
      </Tabs>
    </div>
  )
} 