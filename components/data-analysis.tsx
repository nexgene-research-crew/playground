"use client"

import { useState, useMemo, useEffect, memo, useCallback } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { InfoTooltip } from "./info-tooltip"

interface DataAnalysisProps {
  data: number[][]
  labels: number[]
  features: string[]
}

const classColors = {
  1: "#22c55e", // Normal - green
  2: "#eab308", // Suspect - yellow
  3: "#ef4444", // Pathological - red
}

const classNames = {
  1: "Normal",
  2: "Suspect",
  3: "Pathological",
}

function DataAnalysisComponent({ data, labels, features }: DataAnalysisProps) {
  const [xFeature, setXFeature] = useState(features[0] || "")
  const [yFeature, setYFeature] = useState(features[1] || features[0] || "")

  // Update feature selections when features prop changes
  useEffect(() => {
    if (features.length > 0) {
      if (!features.includes(xFeature)) {
        setXFeature(features[0])
      }
      if (!features.includes(yFeature) || yFeature === xFeature) {
        setYFeature(features[1] || features[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features])

  const xIndex = useMemo(() => features.indexOf(xFeature), [features, xFeature])
  const yIndex = useMemo(() => features.indexOf(yFeature), [features, yFeature])

  // Memoize handlers to prevent unnecessary re-renders
  const handleXFeatureChange = useCallback((value: string) => {
    setXFeature(value)
  }, [])
  
  const handleYFeatureChange = useCallback((value: string) => {
    setYFeature(value)
  }, [])

  // Memoize chartData calculation - only recalculate when data, labels, or indices change
  // Add data sampling for performance - limit to 800 points max for ScatterChart
  // ScatterChart performs poorly with too many data points
  const MAX_POINTS = 800
  const chartData = useMemo(() => {
    if (data.length === 0 || xIndex === -1 || yIndex === -1) return []
    
    const mapped = data.map((row, i) => ({
      x: row[xIndex],
      y: row[yIndex],
      class: labels[i],
      className: classNames[labels[i] as keyof typeof classNames],
    }))
    
    // Sample data if too large - use every nth element to maintain distribution
    if (mapped.length > MAX_POINTS) {
      const step = Math.ceil(mapped.length / MAX_POINTS)
      return mapped.filter((_, i) => i % step === 0)
    }
    
    return mapped
  }, [data, labels, xIndex, yIndex])

  // Memoize class filters - only recalculate when chartData changes
  // Use single pass filtering for better performance
  const { class1Data, class2Data, class3Data } = useMemo(() => {
    const class1: typeof chartData = []
    const class2: typeof chartData = []
    const class3: typeof chartData = []
    
    for (const d of chartData) {
      if (d.class === 1) class1.push(d)
      else if (d.class === 2) class2.push(d)
      else if (d.class === 3) class3.push(d)
    }
    
    return { class1Data: class1, class2Data: class2, class3Data: class3 }
  }, [chartData])

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-sm font-semibold text-foreground">Data Analysis</h3>
          <InfoTooltip content="Visualize how different features relate to each other by class label. Colors represent classes: Green=Normal, Yellow=Suspect, Red=Pathological." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">X Axis</Label>
          <Select value={xFeature} onValueChange={handleXFeatureChange}>
            <SelectTrigger className="bg-input border-border text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border max-h-48">
              {features.map((f) => (
                <SelectItem key={f} value={f} className="text-xs">
                  {f.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Y Axis</Label>
          <Select value={yFeature} onValueChange={handleYFeatureChange}>
            <SelectTrigger className="bg-input border-border text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border max-h-48">
              {features.map((f) => (
                <SelectItem key={f} value={f} className="text-xs">
                  {f.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-64">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                type="number"
                dataKey="x"
                name={xFeature}
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                label={{
                  value: xFeature.replace(/_/g, " "),
                  position: "bottom",
                  fontSize: 10,
                  fill: "#9ca3af",
                }}
              />
              <YAxis type="number" dataKey="y" name={yFeature} stroke="#9ca3af" fontSize={10} tickLine={false} />
              <ZAxis range={[30, 30]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#f9fafb",
                }}
                itemStyle={{
                  color: "#f9fafb",
                }}
                labelStyle={{
                  color: "#f9fafb",
                }}
                formatter={(value: number) => value.toFixed(2)}
                labelFormatter={() => ""}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "#d1d5db" }}>{value}</span>}
              />
              <Scatter 
                name="Normal" 
                data={class1Data} 
                fill={classColors[1]} 
                opacity={0.7}
                isAnimationActive={false}
              />
              <Scatter 
                name="Suspect" 
                data={class2Data} 
                fill={classColors[2]} 
                opacity={0.7}
                isAnimationActive={false}
              />
              <Scatter 
                name="Pathological" 
                data={class3Data} 
                fill={classColors[3]} 
                opacity={0.7}
                isAnimationActive={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Upload dataset to visualize
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="flex justify-center gap-6 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classColors[1] }} />
            <span className="text-xs text-muted-foreground">Normal ({class1Data.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classColors[2] }} />
            <span className="text-xs text-muted-foreground">Suspect ({class2Data.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classColors[3] }} />
            <span className="text-xs text-muted-foreground">Pathological ({class3Data.length})</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Custom comparison function for memo - only re-render if data actually changed
// Uses reference equality check - parent component should maintain stable references
const arePropsEqual = (prevProps: DataAnalysisProps, nextProps: DataAnalysisProps) => {
  // If references are the same, props are equal (no re-render needed)
  if (
    prevProps.data === nextProps.data &&
    prevProps.labels === nextProps.labels &&
    prevProps.features === nextProps.features
  ) {
    return true
  }
  
  // If references changed, check if content actually changed (shallow check for performance)
  if (
    prevProps.data.length !== nextProps.data.length ||
    prevProps.labels.length !== nextProps.labels.length ||
    prevProps.features.length !== nextProps.features.length
  ) {
    return false
  }
  
  // Check features content (usually stable, so this is fine)
  if (prevProps.features.some((f, i) => f !== nextProps.features[i])) {
    return false
  }
  
  // For data and labels, if references changed but lengths are same,
  // assume content changed (parent should memoize for optimal performance)
  return false
}

// Memoize component to prevent unnecessary re-renders when parent updates
export const DataAnalysis = memo(DataAnalysisComponent, arePropsEqual)
