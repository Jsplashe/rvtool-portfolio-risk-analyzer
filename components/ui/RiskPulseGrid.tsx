'use client'

import { useEffect, useState } from 'react'
import RiskPulseSquare from './RiskPulseSquare'

interface RiskPulseGridProps {
  color?: string
  size?: number
  columns?: number
  className?: string
}

export default function RiskPulseGrid({
  color = '#EB0914',
  size = 16,
  columns = 4,
  className = '',
}: RiskPulseGridProps) {
  const [mounted, setMounted] = useState(false)
  
  // Only render on client to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  return (
    <div 
      className={`grid gap-0.5 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: size }).map((_, i) => (
        <RiskPulseSquare key={i} color={color} />
      ))}
    </div>
  )
} 