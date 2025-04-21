import type { ReactNode } from "react"

export function DashboardHeader({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-gradient-to-r from-black to-gray-900 px-6">
      <div className="flex items-center gap-2">{children}</div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative h-8 w-8 rounded-full bg-muted">
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
        </div>
      </div>
    </header>
  )
}
