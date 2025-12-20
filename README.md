# Neural Network Playground

> Interactive neural network playground and machine learning training platform for fetal health classification.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Dataset](#dataset)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## 🎯 Overview

This Neural Network Playground was developed as part of the **Practical Training Program in Artificial Intelligence for Healthcare Professionals**, organized for the first time by [Nexgene AI](https://nexgene.ai). The program is designed to provide healthcare professionals with hands-on experience in applying artificial intelligence and machine learning techniques to real-world medical challenges.

This interactive web application focuses on fetal health classification using cardiotocography (CTG) data, providing an intuitive interface for healthcare professionals and ML practitioners to explore machine learning concepts. The application features a complete neural network implementation from scratch, real-time training visualization, and comprehensive data analysis tools—all running entirely in the browser.

## ✨ Features

### Core Functionality
- **Interactive Neural Network Training**: Train multi-layer perceptrons (MLPs) with customizable architectures
- **Real-time Visualization**: Live charts showing training loss, test loss, accuracy, and convergence metrics
- **Hyperparameter Tuning**: Adjust learning rate, activation functions (ReLU, Sigmoid, Tanh), and regularization (L1/L2)
- **Feature Selection**: Selectively choose which features to include in training
- **Network Architecture Builder**: Visually configure hidden layer sizes
- **Data Analysis Dashboard**: Comprehensive statistics and visualizations of the dataset

### Technical Features
- Built-in neural network implementation with backpropagation
- He initialization for weight initialization
- Mini-batch gradient descent optimization
- Cross-entropy loss with softmax activation
- Support for L1 and L2 regularization
- Data normalization and preprocessing
- Train/test split (80/20) with shuffling
- One-hot encoding for multi-class classification

### User Experience
- Modern, responsive UI built with Tailwind CSS
- Real-time metric updates during training
- Step-by-step training mode
- Training controls (Run, Stop, Reset, Step)
- Interactive tooltips and help text

## 📊 Dataset

This project uses the **Fetal Health Classification Dataset** derived from cardiotocography (CTG) data.

### Dataset Citation

If you use this dataset in your research, please cite:

> Ayres de Campos et al. (2000) SisPorto 2.0 A Program for Automated Analysis of Cardiotocograms. *J Matern Fetal Med* 5:311-318

**DOI**: [10.1002/1520-6661(200009/10)9:5<311::AID-MFM12>3.0.CO;2-9](https://onlinelibrary.wiley.com/doi/10.1002/1520-6661(200009/10)9:5%3C311::AID-MFM12%3E3.0.CO;2-9)

### Dataset Details
- **Source**: SisPorto 2.0 Cardiotocogram Analysis
- **Features**: 21 features including baseline values, accelerations, decelerations, variability measures, and histogram statistics
- **Classes**: 3 classes (Normal, Suspect, Pathological)
- **Format**: CSV file (`fetal_health.csv`)
- **Preprocessing**: Data is normalized and one-hot encoded automatically

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **pnpm**: Latest version
- **Modern web browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nexgene-research-crew/playground
   cd playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📖 Usage

### Training a Neural Network

1. **Load the Dataset**: The fetal health dataset is preloaded automatically
2. **Analyze the Data**: Navigate to the "Data Analysis" tab to explore dataset statistics, distributions, and feature relationships to understand the data before feature selection
3. **Select Features**: Use the feature selection panel to choose which features to include based on your data analysis
4. **Configure Network Architecture**: 
   - Set the number of hidden layers
   - Adjust the number of neurons in each layer
5. **Set Hyperparameters**:
   - Learning rate (default: 0.01)
   - Activation function (ReLU, Sigmoid, or Tanh)
   - Regularization type and rate
6. **Start Training**:
   - Click "Run" for continuous training
   - Click "Step" for epoch-by-epoch training
   - Monitor metrics in real-time
7. **Analyze Results**: View training charts and data analysis in the respective tabs

### Interpreting Results

- **Training Loss**: Should decrease over time for successful learning
- **Test Loss**: Should track training loss closely (large gap indicates overfitting)
- **Accuracy**: Percentage of correctly classified samples
- **Convergence**: Both loss curves flattening indicates model convergence

## 🐳 Docker Deployment

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t neural-network-playground .

# Run the container
docker run -p 3000:3000 neural-network-playground
```

The application will be available at `http://localhost:3000`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📧 Contact

For questions, support, or collaboration opportunities, please contact:

**Email**: [contact@nexgene.ai](mailto:contact@nexgene.ai)

**Website**: [https://nexgene.ai](https://nexgene.ai)

## 🙏 Acknowledgments

This playground was developed as part of the **Practical Training Program in Artificial Intelligence for Healthcare Professionals**, organized for the first time by [Nexgene AI](https://nexgene.ai).

### Special Thanks

- **Nexgene AI** for organizing the training program
- The research team behind the SisPorto dataset for making this valuable resource available
- The open-source community for the excellent tools and libraries used in this project

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Copyright © 2025 Nexgene AI**

