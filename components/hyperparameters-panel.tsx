"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoTooltip } from "./info-tooltip"

interface HyperparametersProps {
  learningRate: number
  activation: "relu" | "sigmoid" | "tanh"
  regularization: "none" | "l1" | "l2"
  regularizationRate: number
  onChange: (key: string, value: number | string) => void
  disabled: boolean
}

export function HyperparametersPanel({
  learningRate,
  activation,
  regularization,
  regularizationRate,
  onChange,
  disabled,
}: HyperparametersProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-5">
      <h3 className="text-sm font-semibold text-foreground">Hyperparameters</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label className="text-xs text-muted-foreground">Learning Rate</Label>
            <InfoTooltip content="Controls how quickly the network learns. Higher values learn faster but may be unstable. Lower values are more stable but slower." />
          </div>
          <span className="text-xs font-mono text-primary">{learningRate.toFixed(4)}</span>
        </div>
        <Slider
          value={[Math.log10(learningRate)]}
          min={-4}
          max={-1}
          step={0.1}
          onValueChange={([v]) => onChange("learningRate", Math.pow(10, v))}
          disabled={disabled}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label className="text-xs text-muted-foreground">Activation Function</Label>
          <InfoTooltip content="Determines the output of neurons. ReLU typically performs best, Sigmoid outputs between 0-1, Tanh outputs between -1 and 1." />
        </div>
        <Select value={activation} onValueChange={(v) => onChange("activation", v)} disabled={disabled}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="relu">ReLU</SelectItem>
            <SelectItem value="sigmoid">Sigmoid</SelectItem>
            <SelectItem value="tanh">Tanh</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label className="text-xs text-muted-foreground">Regularization</Label>
          <InfoTooltip content="Prevents overfitting. L1 creates sparse weights (some become zero), L2 shrinks weights proportionally." />
        </div>
        <Select value={regularization} onValueChange={(v) => onChange("regularization", v)} disabled={disabled}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="l1">L1</SelectItem>
            <SelectItem value="l2">L2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {regularization !== "none" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Label className="text-xs text-muted-foreground">Regularization Rate</Label>
              <InfoTooltip content="Strength of regularization. Higher values apply more penalty to prevent overfitting." />
            </div>
            <span className="text-xs font-mono text-primary">{regularizationRate.toFixed(4)}</span>
          </div>
          <Slider
            value={[Math.log10(regularizationRate)]}
            min={-5}
            max={-1}
            step={0.1}
            onValueChange={([v]) => onChange("regularizationRate", Math.pow(10, v))}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
