"use client"

import { InfoTooltip } from "./info-tooltip"

interface MetricsDisplayProps {
  trainLoss: number
  testLoss: number
  trainAccuracy: number
  testAccuracy: number
}

export function MetricsDisplay({ trainLoss, testLoss, trainAccuracy, testAccuracy }: MetricsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card border border-border rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Train Loss</span>
          <InfoTooltip content="Loss value on the training data. Lower is better." />
        </div>
        <span className="text-lg font-bold font-mono text-primary">{trainLoss.toFixed(4)}</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Test Loss</span>
          <InfoTooltip content="Loss value on the test data. Being close to the train loss is a good sign." />
        </div>
        <span className="text-lg font-bold font-mono text-accent">{testLoss.toFixed(4)}</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Train Accuracy</span>
          <InfoTooltip content="Accuracy on the training data." />
        </div>
        <span className="text-lg font-bold font-mono text-primary">{(trainAccuracy * 100).toFixed(1)}%</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Test Accuracy</span>
          <InfoTooltip content="Accuracy on the test data. This is the main indicator of real performance." />
        </div>
        <span className="text-lg font-bold font-mono text-accent">{(testAccuracy * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}
