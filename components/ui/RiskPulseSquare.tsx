'use client'

import { useEffect, useState } from 'react'

export default function RiskPulseSquare({ color = '#EB0914' }: { color?: string }) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    // Avoid hydration mismatch by deferring random styling until client-side
    setOpacity(parseFloat((Math.random() * 0.3 + 0.7).toFixed(3)))
  }, [])

  return (
    <div
      className="aspect-square rounded-sm transition-opacity duration-300"
      style={{
        backgroundColor: color,
        opacity,
      }}
    />
  )
} 