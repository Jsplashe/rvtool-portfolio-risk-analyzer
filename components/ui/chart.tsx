import * as React from "react"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("rounded-md border bg-popover text-popover-foreground", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} ref={ref} {...props} />
  },
)
ChartTitle.displayName = "ChartTitle"

const ChartDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p className={cn("text-sm text-muted-foreground", className)} ref={ref} {...props} />
  },
)
ChartDescription.displayName = "ChartDescription"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("mt-4 flex items-center justify-center space-x-2", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("rounded-md border bg-secondary p-2 text-sm", className)} ref={ref} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartTitle, ChartDescription, ChartLegend, ChartTooltip }
