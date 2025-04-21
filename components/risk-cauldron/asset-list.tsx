"use client"

import { useDraggable, useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Asset } from "./types"

interface AssetListProps {
  assets: Asset[]
  id: string
}

export function AssetList({ assets, id }: AssetListProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef} className="flex max-h-[500px] flex-col space-y-2 overflow-y-auto pr-2">
      {assets.length === 0 ? (
        <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-border/40 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
          No assets available
        </div>
      ) : (
        assets.map((asset) => <DraggableAsset key={asset.id} asset={asset} />)
      )}
    </div>
  )
}

interface DraggableAssetProps {
  asset: Asset
}

function DraggableAsset({ asset }: DraggableAssetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: asset.id,
    data: asset,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  // Determine risk level color
  const getRiskColor = (risk: number) => {
    if (risk < 30) return "bg-green-500/20 text-green-400"
    if (risk < 60) return "bg-yellow-500/20 text-yellow-400"
    return "bg-red-500/20 text-red-400"
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex cursor-grab items-center justify-between rounded-md border border-border/40 bg-black/50 p-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-black/70 active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 font-mono text-primary">
          {asset.ticker.substring(0, 4)}
        </div>
        <div>
          <div className="font-medium">{asset.name}</div>
          <div className="text-xs text-muted-foreground">{asset.sector}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-medium">{asset.weight}%</div>
          <div className={`rounded-full px-2 py-0.5 text-xs ${getRiskColor(asset.risk)}`}>Risk: {asset.risk}</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}
