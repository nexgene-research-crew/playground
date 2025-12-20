// Simple Neural Network Implementation
export interface NetworkConfig {
  inputSize: number
  hiddenLayers: number[]
  outputSize: number
  learningRate: number
  activation: "relu" | "sigmoid" | "tanh"
  regularization: "none" | "l1" | "l2"
  regularizationRate: number
}

export interface TrainingResult {
  epoch: number
  trainLoss: number
  testLoss: number
  trainAccuracy: number
  testAccuracy: number
}

function relu(x: number): number {
  return Math.max(0, x)
}

function reluDerivative(x: number): number {
  return x > 0 ? 1 : 0
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))))
}

function sigmoidDerivative(x: number): number {
  const s = sigmoid(x)
  return s * (1 - s)
}

function tanh_(x: number): number {
  return Math.tanh(x)
}

function tanhDerivative(x: number): number {
  const t = Math.tanh(x)
  return 1 - t * t
}

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr)
  const exps = arr.map((x) => Math.exp(x - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((x) => x / sum)
}

export class NeuralNetwork {
  private weights: number[][][]
  private biases: number[][]
  private config: NetworkConfig

  constructor(config: NetworkConfig) {
    this.config = config
    this.weights = []
    this.biases = []
    this.initializeWeights()
  }

  private initializeWeights() {
    const layers = [this.config.inputSize, ...this.config.hiddenLayers, this.config.outputSize]

    for (let i = 0; i < layers.length - 1; i++) {
      const inputSize = layers[i]
      const outputSize = layers[i + 1]
      const scale = Math.sqrt(2 / inputSize) // He initialization

      const layerWeights: number[][] = []
      const layerBiases: number[] = []

      for (let j = 0; j < outputSize; j++) {
        const neuronWeights: number[] = []
        for (let k = 0; k < inputSize; k++) {
          neuronWeights.push((Math.random() - 0.5) * 2 * scale)
        }
        layerWeights.push(neuronWeights)
        layerBiases.push(0)
      }

      this.weights.push(layerWeights)
      this.biases.push(layerBiases)
    }
  }

  private activate(x: number): number {
    switch (this.config.activation) {
      case "relu":
        return relu(x)
      case "sigmoid":
        return sigmoid(x)
      case "tanh":
        return tanh_(x)
      default:
        return relu(x)
    }
  }

  private activateDerivative(x: number): number {
    switch (this.config.activation) {
      case "relu":
        return reluDerivative(x)
      case "sigmoid":
        return sigmoidDerivative(x)
      case "tanh":
        return tanhDerivative(x)
      default:
        return reluDerivative(x)
    }
  }

  private forward(input: number[]): { outputs: number[][]; preActivations: number[][] } {
    const outputs: number[][] = [input]
    const preActivations: number[][] = [[]]

    let current = input

    for (let l = 0; l < this.weights.length; l++) {
      const newOutput: number[] = []
      const preAct: number[] = []

      for (let j = 0; j < this.weights[l].length; j++) {
        let sum = this.biases[l][j]
        for (let k = 0; k < current.length; k++) {
          sum += current[k] * this.weights[l][j][k]
        }
        preAct.push(sum)

        // Apply activation
        if (l < this.weights.length - 1) {
          newOutput.push(this.activate(sum))
        } else {
          newOutput.push(sum) // No activation for output layer (will use softmax)
        }
      }

      preActivations.push(preAct)
      current = l === this.weights.length - 1 ? softmax(newOutput) : newOutput
      outputs.push(current)
    }

    return { outputs, preActivations }
  }

  predict(input: number[]): number[] {
    const { outputs } = this.forward(input)
    return outputs[outputs.length - 1]
  }

  train(inputs: number[][], labels: number[][], testInputs: number[][], testLabels: number[][]): TrainingResult {
    let totalLoss = 0
    let correct = 0

    // Mini-batch gradient descent
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]
      const label = labels[i]

      const { outputs, preActivations } = this.forward(input)
      const prediction = outputs[outputs.length - 1]

      // Cross-entropy loss
      let loss = 0
      for (let j = 0; j < label.length; j++) {
        loss -= label[j] * Math.log(Math.max(prediction[j], 1e-10))
      }

      // Add regularization
      if (this.config.regularization !== "none") {
        let regLoss = 0
        for (const layer of this.weights) {
          for (const neuron of layer) {
            for (const w of neuron) {
              if (this.config.regularization === "l1") {
                regLoss += Math.abs(w)
              } else {
                regLoss += w * w
              }
            }
          }
        }
        loss += this.config.regularizationRate * regLoss
      }

      totalLoss += loss

      const predictedClass = prediction.indexOf(Math.max(...prediction))
      const actualClass = label.indexOf(Math.max(...label))
      if (predictedClass === actualClass) correct++

      // Backpropagation
      const deltas: number[][] = []

      // Output layer delta (softmax + cross-entropy)
      const outputDelta = prediction.map((p, j) => p - label[j])
      deltas.unshift(outputDelta)

      // Hidden layers
      for (let l = this.weights.length - 2; l >= 0; l--) {
        const delta: number[] = []
        for (let j = 0; j < this.weights[l].length; j++) {
          let error = 0
          for (let k = 0; k < this.weights[l + 1].length; k++) {
            error += deltas[0][k] * this.weights[l + 1][k][j]
          }
          delta.push(error * this.activateDerivative(preActivations[l + 1][j]))
        }
        deltas.unshift(delta)
      }

      // Update weights
      for (let l = 0; l < this.weights.length; l++) {
        for (let j = 0; j < this.weights[l].length; j++) {
          for (let k = 0; k < this.weights[l][j].length; k++) {
            let gradient = deltas[l][j] * outputs[l][k]

            // Add regularization gradient
            if (this.config.regularization === "l1") {
              gradient += this.config.regularizationRate * Math.sign(this.weights[l][j][k])
            } else if (this.config.regularization === "l2") {
              gradient += this.config.regularizationRate * 2 * this.weights[l][j][k]
            }

            this.weights[l][j][k] -= this.config.learningRate * gradient
          }
          this.biases[l][j] -= this.config.learningRate * deltas[l][j]
        }
      }
    }

    // Calculate test metrics
    let testLoss = 0
    let testCorrect = 0

    for (let i = 0; i < testInputs.length; i++) {
      const prediction = this.predict(testInputs[i])

      for (let j = 0; j < testLabels[i].length; j++) {
        testLoss -= testLabels[i][j] * Math.log(Math.max(prediction[j], 1e-10))
      }

      const predictedClass = prediction.indexOf(Math.max(...prediction))
      const actualClass = testLabels[i].indexOf(Math.max(...testLabels[i]))
      if (predictedClass === actualClass) testCorrect++
    }

    return {
      epoch: 0,
      trainLoss: totalLoss / inputs.length,
      testLoss: testLoss / testInputs.length,
      trainAccuracy: correct / inputs.length,
      testAccuracy: testCorrect / testInputs.length,
    }
  }

  reset() {
    this.initializeWeights()
  }

  getWeights() {
    return this.weights
  }
}
