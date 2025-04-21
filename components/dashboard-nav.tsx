"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

interface DashboardNavProps {
  items: NavItem[]
  onNavItemClick?: () => void
}

export function DashboardNav({ items, onNavItemClick }: DashboardNavProps) {
  return (
    <nav className="grid gap-1 px-2 py-4">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <Link
            key={index}
            href={item.href}
            onClick={onNavItemClick}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "group relative flex h-10 justify-start gap-3 px-3 hover:bg-primary/10",
              index === 0 && "bg-primary/10 text-primary",
            )}
          >
            <div className="flex items-center">
              <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-sm font-medium">{item.title}</span>
            {index === 0 && (
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
