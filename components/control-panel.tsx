"use client"

import { Play, Pause, RotateCcw, StepForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InfoTooltip } from "./info-tooltip"

interface ControlPanelProps {
  isRunning: boolean
  epoch: number
  onRun: () => void
  onStop: () => void
  onReset: () => void
  onStep: () => void
  disabled: boolean
}

export function ControlPanel({ isRunning, epoch, onRun, onStop, onReset, onStep, disabled }: ControlPanelProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Control Panel</h3>
        <InfoTooltip content="Control the training process. Run for continuous training, Step to advance one epoch at a time." />
      </div>

      <div className="flex items-center gap-2 mb-4">
        {!isRunning ? (
          <Button
            onClick={onRun}
            disabled={disabled}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        ) : (
          <Button onClick={onStop} variant="secondary" className="flex-1">
            <Pause className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}

        <Button
          onClick={onStep}
          disabled={disabled || isRunning}
          variant="outline"
          className="flex-1 border-border bg-transparent"
        >
          <StepForward className="h-4 w-4 mr-2" />
          Step
        </Button>

        <Button onClick={onReset} variant="outline" className="border-border bg-transparent">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <span className="text-xs text-muted-foreground block mb-1">Current Epoch</span>
        <span className="text-2xl font-bold font-mono text-primary">{epoch}</span>
      </div>
    </div>
  )
}
