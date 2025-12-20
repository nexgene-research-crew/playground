"use client"

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InfoTooltip } from "./info-tooltip"

interface NetworkArchitectureProps {
  hiddenLayers: number[]
  onChange: (layers: number[]) => void
  disabled: boolean
  inputSize: number
}

export function NetworkArchitecture({ hiddenLayers, onChange, disabled, inputSize }: NetworkArchitectureProps) {
  const addLayer = () => {
    if (hiddenLayers.length < 6) {
      onChange([...hiddenLayers, 4])
    }
  }

  const removeLayer = (index: number) => {
    if (hiddenLayers.length > 1) {
      onChange(hiddenLayers.filter((_, i) => i !== index))
    }
  }

  const updateNeurons = (index: number, delta: number) => {
    const newLayers = [...hiddenLayers]
    newLayers[index] = Math.max(1, Math.min(16, newLayers[index] + delta))
    onChange(newLayers)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-sm font-semibold text-foreground">Network Architecture</h3>
          <InfoTooltip content="Define the structure of your neural network. Add or remove neurons per layer or add new hidden layers." />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addLayer}
          disabled={disabled || hiddenLayers.length >= 6}
          className="h-7 text-xs border-border"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Layer
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {/* Input Layer */}
        <div className="flex flex-col items-center min-w-fit">
          <div className="flex flex-col gap-1">
            {Array.from({ length: Math.min(inputSize, 6) }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-accent" />
            ))}
            {inputSize > 6 && <span className="text-[10px] text-muted-foreground">+{inputSize - 6}</span>}
          </div>
          <span className="text-[10px] text-muted-foreground mt-2">Input</span>
          <span className="text-[10px] font-mono text-primary">{inputSize}</span>
        </div>

        {/* Connections line */}
        <div className="h-px w-4 bg-border" />

        {/* Hidden Layers */}
        {hiddenLayers.map((neurons, layerIndex) => (
          <div key={layerIndex} className="flex items-center gap-2">
            <div className="flex flex-col items-center min-w-fit bg-secondary/30 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => updateNeurons(layerIndex, -1)}
                  disabled={disabled || neurons <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs font-mono w-4 text-center text-primary">{neurons}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => updateNeurons(layerIndex, 1)}
                  disabled={disabled || neurons >= 16}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                {Array.from({ length: Math.min(neurons, 6) }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-primary" />
                ))}
                {neurons > 6 && <span className="text-[10px] text-muted-foreground">+{neurons - 6}</span>}
              </div>
              <span className="text-[10px] text-muted-foreground mt-2">Hidden {layerIndex + 1}</span>
              {hiddenLayers.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 mt-1 text-destructive hover:text-destructive"
                  onClick={() => removeLayer(layerIndex)}
                  disabled={disabled}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="h-px w-4 bg-border" />
          </div>
        ))}

        {/* Output Layer */}
        <div className="flex flex-col items-center min-w-fit">
          <div className="flex flex-col gap-1">
            <div className="w-3 h-3 rounded-full bg-success" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-destructive" />
          </div>
          <span className="text-[10px] text-muted-foreground mt-2">Output</span>
          <span className="text-[10px] font-mono text-primary">3</span>
        </div>
      </div>
    </div>
  )
}
