"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, X, Loader2, AlertCircle, BarChart3, WormIcon as Virus } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample responses for demo commands
const SAMPLE_RESPONSES = {
  beta: {
    title: "Beta vs. NASDAQ",
    icon: <BarChart3 className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Your Portfolio Beta:</span>
          <span className="font-bold text-[#3B82F6]">0.87</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#333333]/30">
          <div className="h-2 w-[87%] rounded-full bg-[#3B82F6]"></div>
        </div>
        <p className="text-xs text-[#777777]">
          Your portfolio is less volatile than the NASDAQ, with 13% lower price movements on average.
        </p>
      </div>
    ),
  },
  covid: {
    title: "COVID Stress Test Results",
    icon: <Virus className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Projected Drawdown:</span>
          <span className="font-bold text-amber-400">-24.3%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Recovery Time:</span>
          <span className="font-bold text-[#00FF00]">4.2 months</span>
        </div>
        <p className="text-xs text-[#777777]">
          Your portfolio would perform 18% better than the market average during a COVID-like scenario.
        </p>
      </div>
    ),
  },
  alert: {
    title: "Risk Temperature Alert Set",
    icon: <AlertCircle className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-md bg-amber-500/20 p-2 text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Alert will trigger when Risk Temperature exceeds 80°</span>
        </div>
        <p className="text-xs text-[#777777]">
          You'll receive notifications via email and dashboard when this threshold is reached.
        </p>
      </div>
    ),
  },
}

type AssistantState = "idle" | "listening" | "processing" | "responding"

export function VoiceAssistant() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<AssistantState>("idle")
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<keyof typeof SAMPLE_RESPONSES | null>(null)
  const typingRef = useRef<NodeJS.Timeout | null>(null)
  const processingTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Disable all randomness and animations during SSR
  const [randomQueryIndex, setRandomQueryIndex] = useState(0)

  // Sample queries to simulate voice recognition
  const sampleQueries = ["Show my beta vs. NASDAQ", "Run a COVID stress test", "Alert me if risk temp exceeds 80°"]

  // Use effect to handle client-side mounting
  useEffect(() => {
    setMounted(true)
    
    // Initialize random index only once after mounting on client
    setRandomQueryIndex(Math.floor((Date.now() % 3)))
  }, [])

  // Handle microphone button click
  const handleMicClick = () => {
    if (state === "idle") {
      setIsOpen(true)
      setState("listening")
    } else {
      // Cancel any ongoing simulations
      if (typingRef.current) clearTimeout(typingRef.current)
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current)

      setState("idle")
      setQuery("")
      setResponse(null)
    }
  }

  // Close the assistant panel
  const handleClose = () => {
    if (typingRef.current) clearTimeout(typingRef.current)
    if (processingTimerRef.current) clearTimeout(processingTimerRef.current)

    setIsOpen(false)
    setState("idle")
    setQuery("")
    setResponse(null)
  }

  // Simulate typing for a sample query
  const simulateTyping = (text: string, callback: () => void) => {
    let i = 0
    setQuery("")

    const type = () => {
      if (i < text.length) {
        setQuery((prev) => prev + text.charAt(i))
        i++
        typingRef.current = setTimeout(type, 50)
      } else {
        callback()
      }
    }

    type()
  }

  // Simulate processing and response
  const simulateProcessing = (queryType: number) => {
    setState("processing")

    processingTimerRef.current = setTimeout(() => {
      setState("responding")

      // Set response based on query type
      if (queryType === 0) setResponse("beta")
      else if (queryType === 1) setResponse("covid")
      else if (queryType === 2) setResponse("alert")
    }, 1500)
  }

  // Simulate a random voice command when in listening state - client-side only
  useEffect(() => {
    if (state === "listening" && isOpen && mounted) {
      // Use the pre-determined random query index
      const randomQuery = sampleQueries[randomQueryIndex]

      // Start typing after a short delay
      const timer = setTimeout(() => {
        simulateTyping(randomQuery, () => simulateProcessing(randomQueryIndex))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [state, isOpen, mounted, randomQueryIndex])

  // Don't render anything during SSR
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Microphone button */}
      <motion.button
        onClick={handleMicClick}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg btn-glow",
          state === "idle" ? "bg-[#EB0914] text-white" : "bg-[#EB0914] text-white",
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {state === "idle" ? (
          <Mic className="h-6 w-6" />
        ) : (
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <Mic className="h-6 w-6" />
          </motion.div>
        )}
      </motion.button>

      {/* Voice assistant panel - render only if open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-md border border-[#333333] bg-[#1A1A1A] p-4 shadow-card backdrop-blur-md"
          >
            {/* Rest of the voice assistant UI */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Risk Voice Assistant</h3>
              <button onClick={handleClose} className="rounded-full p-1 hover:bg-[#333333]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-md border border-[#333333] bg-[#222222] p-3">
              {/* Listening state */}
              {state === "listening" && !query && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EB0914]/20"
                  >
                    <Mic className="h-6 w-6 text-[#EB0914]" />
                  </motion.div>
                  <p className="text-sm">What do you want to know about your risk?</p>
                </div>
              )}

              {/* Query display */}
              {query && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-6 w-6 rounded-full bg-[#EB0914]/20 p-1">
                      <Mic className="h-4 w-4 text-[#EB0914]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">You asked:</p>
                      <p className="text-sm">{query}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing state */}
              {state === "processing" && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-[#333333]/20 p-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#EB0914]" />
                  <span className="text-xs">Processing your request...</span>
                </div>
              )}

              {/* Response */}
              {state === "responding" && response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-2 rounded-md border border-[#333333] bg-[#222222] p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-[#EB0914]/20 p-1 text-[#EB0914]">
                      {SAMPLE_RESPONSES[response].icon}
                    </div>
                    <h4 className="text-sm font-medium">{SAMPLE_RESPONSES[response].title}</h4>
                  </div>
                  <div className="text-sm">{SAMPLE_RESPONSES[response].content}</div>
                </motion.div>
              )}
            </div>

            <div className="mt-3 text-center text-xs text-[#777777]">
              {state === "idle" && "Click the microphone to start"}
              {state === "listening" && !query && "Listening..."}
              {state === "listening" && query && "Processing..."}
              {state === "processing" && "Analyzing risk data..."}
              {state === "responding" && "Voice command executed"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
