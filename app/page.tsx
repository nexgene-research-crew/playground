"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ControlPanel } from "@/components/control-panel"
import { HyperparametersPanel } from "@/components/hyperparameters-panel"
import { NetworkArchitecture } from "@/components/network-architecture"
import { FeatureSelection } from "@/components/feature-selection"
import { TrainingChart } from "@/components/training-chart"
import { DataAnalysis } from "@/components/data-analysis"
import { MetricsDisplay } from "@/components/metrics-display"
import { NeuralNetwork, type NetworkConfig } from "@/lib/neural-network"

const ALL_FEATURES = [
  "baseline_value",
  "accelerations",
  "fetal_movement",
  "uterine_contractions",
  "light_decelerations",
  "severe_decelerations",
  "prolongued_decelerations",
  "abnormal_short_term_variability",
  "mean_value_of_short_term_variability",
  "percentage_of_time_with_abnormal_long_term_variability",
  "mean_value_of_long_term_variability",
  "histogram_width",
  "histogram_min",
  "histogram_max",
  "histogram_number_of_peaks",
  "histogram_number_of_zeroes",
  "histogram_mode",
  "histogram_mean",
  "histogram_median",
  "histogram_variance",
  "histogram_tendency",
]

export default function NeuralNetworkPlayground() {
  // Data state
  const [rawData, setRawData] = useState<number[][]>([])
  const [rawLabels, setRawLabels] = useState<number[]>([])
  const [headers, setHeaders] = useState<string[]>(ALL_FEATURES)
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Feature selection
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(ALL_FEATURES)

  // Network configuration
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([8, 4])
  const [learningRate, setLearningRate] = useState(0.01)
  const [activation, setActivation] = useState<"relu" | "sigmoid" | "tanh">("relu")
  const [regularization, setRegularization] = useState<"none" | "l1" | "l2">("none")
  const [regularizationRate, setRegularizationRate] = useState(0.001)

  // Training state
  const [epoch, setEpoch] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [trainingHistory, setTrainingHistory] = useState<
    { epoch: number; trainLoss: number; testLoss: number; trainAcc: number; testAcc: number }[]
  >([])
  const [currentMetrics, setCurrentMetrics] = useState({ trainLoss: 0, testLoss: 0, trainAccuracy: 0, testAccuracy: 0 })

  const networkRef = useRef<NeuralNetwork | null>(null)
  const animationRef = useRef<number | null>(null)
  const preparedDataRef = useRef<{
    trainX: number[][]
    trainY: number[][]
    testX: number[][]
    testY: number[][]
  } | null>(null)

  useEffect(() => {
    const loadDataset = async () => {
      try {
        const response = await fetch("/fetal_health.csv")
        const text = await response.text()
        const lines = text.trim().split("\n")

        // Parse header
        const headerLine = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
        const featureHeaders = headerLine.slice(0, -1) // All except last column (fetal_health)

        // Parse data
        const parsedData: number[][] = []
        const parsedLabels: number[] = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => Number.parseFloat(v.trim()))
          if (values.length === headerLine.length && !values.some(isNaN)) {
            parsedData.push(values.slice(0, -1)) // Features
            parsedLabels.push(values[values.length - 1]) // Label
          }
        }

        setRawData(parsedData)
        setRawLabels(parsedLabels)
        setHeaders(featureHeaders)
        setSelectedFeatures(featureHeaders)
        setFileName("fetal_health.csv (Preloaded)")
      } catch (error) {
        console.error("Failed to load dataset:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDataset()
  }, [])

  // Prepare data based on selected features
  const prepareData = useCallback(() => {
    if (rawData.length === 0) return { trainX: [], trainY: [], testX: [], testY: [] }

    if (preparedDataRef.current) return preparedDataRef.current

    const featureIndices = selectedFeatures.map((f) => headers.indexOf(f)).filter((i) => i !== -1)

    // Filter data to selected features
    const filteredData = rawData.map((row) => featureIndices.map((i) => row[i]))

    // Normalize data
    const numFeatures = featureIndices.length
    const mins = new Array(numFeatures).fill(Number.POSITIVE_INFINITY)
    const maxs = new Array(numFeatures).fill(Number.NEGATIVE_INFINITY)

    for (const row of filteredData) {
      for (let i = 0; i < numFeatures; i++) {
        mins[i] = Math.min(mins[i], row[i])
        maxs[i] = Math.max(maxs[i], row[i])
      }
    }

    const normalizedData = filteredData.map((row) =>
      row.map((val, i) => (maxs[i] - mins[i] > 0 ? (val - mins[i]) / (maxs[i] - mins[i]) : 0)),
    )

    // One-hot encode labels (1, 2, 3) -> ([1,0,0], [0,1,0], [0,0,1])
    const oneHotLabels = rawLabels.map((label) => {
      const encoded = [0, 0, 0]
      encoded[Math.round(label) - 1] = 1
      return encoded
    })

    // Split 80/20
    const splitIndex = Math.floor(normalizedData.length * 0.8)
    const indices = Array.from({ length: normalizedData.length }, (_, i) => i)

    // Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }

    const trainIndices = indices.slice(0, splitIndex)
    const testIndices = indices.slice(splitIndex)

    const result = {
      trainX: trainIndices.map((i) => normalizedData[i]),
      trainY: trainIndices.map((i) => oneHotLabels[i]),
      testX: testIndices.map((i) => normalizedData[i]),
      testY: testIndices.map((i) => oneHotLabels[i]),
    }

    preparedDataRef.current = result
    return result
  }, [rawData, rawLabels, selectedFeatures, headers])

  const initNetwork = useCallback(() => {
    const config: NetworkConfig = {
      inputSize: selectedFeatures.length,
      hiddenLayers,
      outputSize: 3,
      learningRate,
      activation,
      regularization,
      regularizationRate,
    }
    networkRef.current = new NeuralNetwork(config)
  }, [selectedFeatures.length, hiddenLayers, learningRate, activation, regularization, regularizationRate])

  const epochRef = useRef(0)
  const MAX_EPOCH = 1000

  const runEpoch = useCallback(() => {
    if (!networkRef.current) {
      initNetwork()
    }

    const { trainX, trainY, testX, testY } = prepareData()
    if (trainX.length === 0) return

    // Check if max epoch reached
    if (epochRef.current >= MAX_EPOCH) {
      setIsRunning(false)
      return
    }

    const result = networkRef.current!.train(trainX, trainY, testX, testY)

    epochRef.current += 1
    const newEpoch = epochRef.current

    setEpoch(newEpoch)

    setTrainingHistory((prev) => [
      ...prev,
      {
        epoch: newEpoch,
        trainLoss: result.trainLoss,
        testLoss: result.testLoss,
        trainAcc: result.trainAccuracy,
        testAcc: result.testAccuracy,
      },
    ])

    setCurrentMetrics({
      trainLoss: result.trainLoss,
      testLoss: result.testLoss,
      trainAccuracy: result.trainAccuracy,
      testAccuracy: result.testAccuracy,
    })
  }, [prepareData, initNetwork])

  const handleRun = useCallback(() => {
    setIsRunning(true)
  }, [])

  const handleStop = useCallback(() => {
    setIsRunning(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const fullReset = useCallback(() => {
    setIsRunning(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setEpoch(0)
    epochRef.current = 0
    setTrainingHistory([])
    setCurrentMetrics({ trainLoss: 0, testLoss: 0, trainAccuracy: 0, testAccuracy: 0 })
    networkRef.current = null
    preparedDataRef.current = null // Clear prepared data cache on reset
  }, [])

  const handleReset = useCallback(() => {
    fullReset()
  }, [fullReset])

  const handleStep = useCallback(() => {
    if (epochRef.current >= MAX_EPOCH) {
      return // Don't step if max epoch reached
    }
    runEpoch()
  }, [runEpoch])

  const handleDataUpload = useCallback(
    (data: number[][], labels: number[], fileHeaders: string[]) => {
      setRawData(data)
      setRawLabels(labels)
      setHeaders(fileHeaders)
      setFileName("fetal_health.csv")
      setSelectedFeatures(fileHeaders)
      fullReset()
      preparedDataRef.current = null // Clear cache when new data is uploaded
    },
    [fullReset],
  )

  const handleClearData = useCallback(() => {
    setRawData([])
    setRawLabels([])
    setFileName("")
    fullReset()
  }, [fullReset])

  const handleHyperparameterChange = useCallback(
    (key: string, value: number | string) => {
      switch (key) {
        case "learningRate":
          setLearningRate(value as number)
          break
        case "activation":
          setActivation(value as "relu" | "sigmoid" | "tanh")
          break
        case "regularization":
          setRegularization(value as "none" | "l1" | "l2")
          break
        case "regularizationRate":
          setRegularizationRate(value as number)
          break
      }
      fullReset()
    },
    [fullReset],
  )

  const handleHiddenLayersChange = useCallback(
    (newLayers: number[]) => {
      setHiddenLayers(newLayers)
      fullReset()
    },
    [fullReset],
  )

  const handleFeatureSelectionChange = useCallback(
    (newFeatures: string[]) => {
      setSelectedFeatures(newFeatures)
      fullReset()
      preparedDataRef.current = null // Clear cache when features change
    },
    [fullReset],
  )

  useEffect(() => {
    if (!isRunning || rawData.length === 0) return

    let timeoutId: NodeJS.Timeout

    const loop = () => {
      if (epochRef.current >= MAX_EPOCH) {
        setIsRunning(false)
        return
      }
      runEpoch()
      timeoutId = setTimeout(loop, 50) // 50ms delay between epochs for smooth updates
    }

    timeoutId = setTimeout(loop, 50)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isRunning, rawData.length, runEpoch])

  const isDataLoaded = rawData.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="https://nexgene.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-32 h-8 sm:w-40 sm:h-10">
              <Image src="/logo-dark.png" alt="Nexgene AI Logo" fill className="object-contain object-left" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Neural Network Playground</h1>
              <p className="text-xs text-muted-foreground">Fetal Health Classification</p>
            </div>
          </a>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto justify-start sm:justify-end">
            {isLoading ? (
              <span className="px-2 py-1 rounded bg-secondary animate-pulse">Loading dataset...</span>
            ) : (
              <>
                <span className="px-2 py-1 rounded bg-secondary">{rawData.length} samples</span>
                <span className="px-2 py-1 rounded bg-secondary">Multi-class (3 classes)</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 space-y-4 order-1">
            <ControlPanel
              isRunning={isRunning}
              epoch={epoch}
              onRun={handleRun}
              onStop={handleStop}
              onReset={handleReset}
              onStep={handleStep}
              disabled={!isDataLoaded || isLoading}
            />

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Dataset</h3>
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading fetal_health.csv...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">File:</span>
                    <span className="text-foreground font-medium">fetal_health.csv</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Samples:</span>
                    <span className="text-foreground font-medium">{rawData.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Features:</span>
                    <span className="text-foreground font-medium">{headers.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Classes:</span>
                    <span className="text-foreground font-medium">Normal, Suspect, Pathological</span>
                  </div>
                </div>
              )}
            </div>

            <HyperparametersPanel
              learningRate={learningRate}
              activation={activation}
              regularization={regularization}
              regularizationRate={regularizationRate}
              onChange={handleHyperparameterChange}
              disabled={isRunning}
            />
          </div>

          {/* Center - Main Content */}
          <div className="lg:col-span-6 space-y-4 order-3 lg:order-2">
            <Tabs defaultValue="training" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger
                  value="training"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Training
                </TabsTrigger>
                <TabsTrigger
                  value="analysis"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Data Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="training" className="mt-4 space-y-4">
                <NetworkArchitecture
                  hiddenLayers={hiddenLayers}
                  onChange={handleHiddenLayersChange}
                  disabled={isRunning}
                  inputSize={selectedFeatures.length}
                />

                <MetricsDisplay
                  trainLoss={currentMetrics.trainLoss}
                  testLoss={currentMetrics.testLoss}
                  trainAccuracy={currentMetrics.trainAccuracy}
                  testAccuracy={currentMetrics.testAccuracy}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TrainingChart data={trainingHistory} showAccuracy={false} />
                  <TrainingChart data={trainingHistory} showAccuracy={true} />
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-4">
                <DataAnalysis data={rawData} labels={rawLabels} features={headers} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Feature Selection */}
          <div className="lg:col-span-3 order-2 lg:order-3">
            <FeatureSelection
              features={headers.length > 0 ? headers : ALL_FEATURES}
              selectedFeatures={selectedFeatures}
              onChange={handleFeatureSelectionChange}
              disabled={isRunning}
            />
          </div>
        </div>
      </main>
      {/* </CHANGE> */}

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            This playground was developed as part of the{" "}
            <span className="font-semibold text-foreground">Practical Training Program in Artificial Intelligence for Healthcare Professionals</span>, organized for
            the first time by{" "}
            <a
              href="https://nexgene.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Nexgene AI
            </a>
          </p>
        </div>
      </footer>
      {/* </CHANGE> */}
    </div>
  )
}
