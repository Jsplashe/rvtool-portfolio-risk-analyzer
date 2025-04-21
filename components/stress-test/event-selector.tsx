"use client"
import { Check, ChevronsUpDown, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface EventSelectorProps {
  events: Array<{
    id: string
    name: string
    maxDrawdown: number
    duration: number
    description: string
  }>
  selectedEvent: {
    id: string
    name: string
    maxDrawdown: number
    duration: number
    description: string
  }
  onSelectEvent: (event: any) => void
  disabled?: boolean
}

export function EventSelector({ events, selectedEvent, onSelectEvent, disabled = false }: EventSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Historical Event</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between border-border/40 bg-black/50 text-left hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{selectedEvent?.name || "Select event..."}</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search historical events..." />
            <CommandList>
              <CommandEmpty>No event found.</CommandEmpty>
              <CommandGroup>
                {events.map((event) => (
                  <CommandItem
                    key={event.id}
                    value={event.id}
                    onSelect={() => {
                      onSelectEvent(event)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedEvent.id === event.id ? "opacity-100" : "opacity-0")}
                    />
                    {event.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
