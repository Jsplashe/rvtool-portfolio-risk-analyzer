"use client"

import { Loader2, Radar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuickScanButtonProps {
  onClick: () => void
  isScanning: boolean
}

export function QuickScanButton({ onClick, isScanning }: QuickScanButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isScanning}
      size="lg"
      className="btn-glow group relative h-16 w-full max-w-xs overflow-hidden rounded-md bg-[#EB0914] text-white transition-all hover:shadow-red-glow"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle,_transparent_10%,_#000_150%)] opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
      <span className="absolute inset-0 flex items-center justify-center">
        {isScanning ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-bold">Scanning Risk Environment...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Radar className="h-5 w-5 animate-pulse" />
            <span className="font-bold">Quick Scan</span>
          </div>
        )}
      </span>
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-[#EB0914] to-[#EB0914]/80 blur-xl opacity-50"></span>
    </Button>
  )
}
