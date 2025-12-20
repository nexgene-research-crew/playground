"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { InfoTooltip } from "./info-tooltip"

interface TrainingChartProps {
  data: { epoch: number; trainLoss: number; testLoss: number; trainAcc: number; testAcc: number }[]
  showAccuracy?: boolean
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
      <p className="text-popover-foreground text-sm font-semibold mb-2">Epoch {label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(4) : entry.value}
        </p>
      ))}
    </div>
  )
}

export function TrainingChart({ data, showAccuracy = false }: TrainingChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      epoch: item.epoch,
      value1: showAccuracy ? item.trainAcc : item.trainLoss,
      value2: showAccuracy ? item.testAcc : item.testLoss,
    }))
  }, [data, showAccuracy])

  const hasData = chartData.length > 0

  const accuracyDomain = useMemo<[number, number] | undefined>(() => {
    if (!showAccuracy || !hasData) return undefined

    let minVal = Infinity
    let maxVal = -Infinity

    for (const point of chartData) {
      minVal = Math.min(minVal, point.value1, point.value2)
      maxVal = Math.max(maxVal, point.value1, point.value2)
    }

    if (!isFinite(minVal) || !isFinite(maxVal)) return undefined

    if (Math.abs(maxVal - minVal) < 0.01) {
      const center = (minVal + maxVal) / 2
      minVal = center - 0.05
      maxVal = center + 0.05
    }

    const padding = 0.02
    minVal = Math.max(0, minVal - padding)
    maxVal = Math.min(1, maxVal + padding)

    if (minVal === maxVal) {
      maxVal = Math.min(1, minVal + 0.1)
    }

    return [minVal, maxVal]
  }, [chartData, hasData, showAccuracy])

  return (
    <div className="bg-card border border-border rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-semibold text-foreground">{showAccuracy ? "Accuracy" : "Loss"} Over Time</h3>
          <InfoTooltip
            content={
              showAccuracy
                ? "Training and test accuracy over time. A much lower test accuracy than train accuracy is a sign of overfitting."
                : "Training and test loss over time. Both curves decreasing together is a sign of good learning."
            }
          />
        </div>
        {hasData && <span className="text-xs text-muted-foreground">{chartData.length} epochs</span>}
      </div>

      <div className="h-56 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="epoch"
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
                tick={{ fill: "#9ca3af" }}
                domain={showAccuracy ? accuracyDomain ?? ["auto", "auto"] : ["auto", "auto"]}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "#e5e7eb", fontSize: "11px" }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="value1"
                name={showAccuracy ? "Train Accuracy" : "Train Loss"}
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#8b5cf6", stroke: "#8b5cf6" }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="value2"
                name={showAccuracy ? "Test Accuracy" : "Test Loss"}
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#22c55e", stroke: "#22c55e" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <span className="text-sm">Start training to see metrics</span>
          </div>
        )}
      </div>
    </div>
  )
}
