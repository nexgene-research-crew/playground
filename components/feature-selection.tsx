"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { InfoTooltip } from "./info-tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FeatureSelectionProps {
  features: string[]
  selectedFeatures: string[]
  onChange: (selected: string[]) => void
  disabled: boolean
}

const featureDescriptions: Record<string, string> = {
  baseline_value: "Baseline fetal heart rate (bpm)",
  accelerations: "Number of accelerations in heart rate",
  fetal_movement: "Number of fetal movements",
  uterine_contractions: "Number of uterine contractions",
  light_decelerations: "Number of light decelerations",
  severe_decelerations: "Number of severe decelerations",
  prolongued_decelerations: "Number of prolonged decelerations",
  abnormal_short_term_variability: "Percentage of abnormal short-term variability",
  mean_value_of_short_term_variability: "Mean value of short-term variability",
  percentage_of_time_with_abnormal_long_term_variability: "Percentage of time with abnormal long-term variability",
  mean_value_of_long_term_variability: "Mean value of long-term variability",
  histogram_width: "Width of the histogram",
  histogram_min: "Minimum value in histogram",
  histogram_max: "Maximum value in histogram",
  histogram_number_of_peaks: "Number of peaks in histogram",
  histogram_number_of_zeroes: "Number of zeros in histogram",
  histogram_mode: "Mode of the histogram",
  histogram_mean: "Mean of the histogram",
  histogram_median: "Median of the histogram",
  histogram_variance: "Variance of the histogram",
  histogram_tendency: "Tendency of the histogram",
}

export function FeatureSelection({ features, selectedFeatures, onChange, disabled }: FeatureSelectionProps) {
  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      if (selectedFeatures.length > 1) {
        onChange(selectedFeatures.filter((f) => f !== feature))
      }
    } else {
      onChange([...selectedFeatures, feature])
    }
  }

  const selectAll = () => onChange([...features])
  const deselectAll = () => onChange([features[0]])

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h3 className="text-sm font-semibold text-foreground">Feature Selection</h3>
          <InfoTooltip content="Select which features to use for training. At least 1 feature must be selected." />
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            All
          </button>
          <span className="text-muted-foreground">/</span>
          <button
            onClick={deselectAll}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:underline disabled:opacity-50"
          >
            Min
          </button>
        </div>
      </div>

      <ScrollArea className="h-48">
        <div className="space-y-2 pr-4">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <Checkbox
                id={feature}
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={() => toggleFeature(feature)}
                disabled={disabled}
              />
              <Label
                htmlFor={feature}
                className="text-xs text-foreground cursor-pointer flex-1 truncate"
                title={featureDescriptions[feature] || feature}
              >
                {feature.replace(/_/g, " ")}
              </Label>
              <InfoTooltip content={featureDescriptions[feature] || "No description available"} />
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {selectedFeatures.length} / {features.length} features selected
        </span>
      </div>
    </div>
  )
}
