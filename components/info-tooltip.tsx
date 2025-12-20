"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

interface InfoTooltipProps {
  content: string
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (!isMobile) return
    setOpen((prev) => !prev)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={isMobile ? open : undefined} onOpenChange={isMobile ? setOpen : undefined}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className="ml-1.5 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs text-sm bg-popover text-popover-foreground border border-border shadow-lg z-50"
          sideOffset={5}
        >
          <p className="text-popover-foreground">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
