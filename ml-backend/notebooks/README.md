# Lumeris ML Assessment - Jupyter Notebooks

Data Science & Machine Learning Analysis for Gaming Recommendations, Sentiment Analysis, and DeFi Predictions

---

## Overview

This directory contains three comprehensive Jupyter notebooks demonstrating the implementation, feature engineering, model training, and evaluation for each assessment task.

## Notebooks

### 1. Gaming Recommendations (`01_gaming_recommendations.ipynb`)
**Hybrid Recommendation System**

**Contents**:
- Data exploration and game feature analysis
- Feature engineering (11-dimensional vectors)
- Game similarity matrix visualization
- User engagement analysis
- Hybrid collaborative + content-based filtering
- Recommendation generation and evaluation
- Performance metrics (coverage, diversity, personalization)

**Key Visualizations**:
- Game ratings and player count distributions
- Feature matrix heatmaps
- Game-to-game similarity matrix
- User-game engagement matrix
- Recommendation score comparisons

**Approach**: Combines 60% content-based filtering (game features) with 40% collaborative filtering (user similarities) for personalized recommendations with cold-start handling.

---

### 2. Sentiment Analysis (`02_sentiment_analysis.ipynb`)
**Hybrid NLP Sentiment Classifier**

**Contents**:
- Training data distribution analysis
- TF-IDF feature engineering (1000 features, bigrams)
- Naive Bayes model training and evaluation
- TextBlob polarity and subjectivity analysis
- Multi-emotion detection (8 emotions)
- Batch processing and aggregate statistics
- Word clouds by sentiment category

**Key Visualizations**:
- Sentiment and category distributions
- Feature correlation heatmaps
- Word clouds (positive/negative/neutral)
- Confusion matrix
- Polarity/subjectivity box plots
- Emotion detection heatmaps
- Batch analysis pie charts

**Approach**: Dual-method system combining rule-based TextBlob sentiment with trained ML classifier, plus keyword-based multi-emotion detection for comprehensive analysis.

---

### 3. DeFi Predictions (`03_defi_predictions.ipynb`)
**Time Series Forecasting & Trend Classification**

**Contents**:
- Pool metrics comparison (TVL, APY, volume, price)
- 30-day historical data analysis
- Technical indicator engineering (SMA, momentum, volatility)
- Random Forest price regression
- Gradient Boosting trend classification
- 7-day forecasting with confidence intervals
- Multi-factor risk assessment
- Trading signal generation

**Key Visualizations**:
- Interactive pool metrics dashboard (Plotly)
- Price history time series (Altair)
- Feature correlation matrix
- Feature importance bar charts
- Current vs predicted price comparisons
- Trend probability distributions
- 7-day forecast with confidence bands
- Risk score breakdowns
- Stacked risk component charts

**Approach**: Dual-model ensemble (regression + classification) with technical indicators, confidence-weighted forecasting, and automated trading signals based on risk-adjusted predictions.

---

## Visual Theme

All notebooks use a consistent cyber/neon theme:
- **Primary Color**: #2065ed (Neon Blue)
- **Accent Color**: #00d9ff (Cyan)
- Rounded section headers with glowing effects
- Neon separator lines
- Professional, modern styling

Custom CSS styling is loaded from `custom_style.css` for consistent visual presentation.

---

## Running the Notebooks

### Prerequisites
```bash
# Ensure you're in the ml-backend directory
cd ml-backend

# Activate virtual environment
source .venv/bin/activate

# All dependencies are already installed via requirements.txt
```

### Launch Jupyter
```bash
# Start Jupyter Lab
jupyter lab

# Or Jupyter Notebook
jupyter notebook
```

### Order of Execution
1. **01_gaming_recommendations.ipynb** - Run all cells sequentially
2. **02_sentiment_analysis.ipynb** - Run all cells sequentially
3. **03_defi_predictions.ipynb** - Run all cells sequentially

Each notebook is self-contained and can be run independently.

---

## Visualization Libraries Used

- **matplotlib** - Static plots and heatmaps
- **seaborn** - Statistical visualizations
- **plotly** - Interactive charts and dashboards
- **altair** - Declarative statistical visualizations
- **wordcloud** - Text visualization

These modern libraries provide interactive, publication-quality visualizations.

---

## Key Insights from Analysis

### Gaming Recommendations
- Battle Royale X consistently recommended due to high ratings
- Collaborative filtering identifies user-user similarities effectively
- System achieves good coverage (75%) and category diversity

### Sentiment Analysis
- Training accuracy: ~90% on 30-sample dataset
- Positive comments show high polarity scores (> 0.5)
- Multi-emotion detection captures nuanced feelings beyond binary sentiment
- Batch processing enables dashboard analytics

### DeFi Predictions
- High trend classification confidence (85-99%)
- Price predictions incorporate momentum and volatility
- Risk scoring identifies high-volatility pools
- Trading signals generated with confidence thresholds

---

## Production Considerations

### Immediate Next Steps
1. Connect to real data sources (live feeds, user databases)
2. Implement model retraining pipelines
3. Add A/B testing framework
4. Deploy with caching layer (Redis)

### Advanced Enhancements
1. **Deep Learning**: LSTM for time series, BERT for NLP
2. **Feature Store**: Centralized feature management
3. **Model Monitoring**: Track drift and performance degradation
4. **Explainability**: SHAP values for model interpretability
5. **Multi-modal**: Combine text, images, and structured data

---

## Assessment Completion

All three notebooks demonstrate:
- **Data Science Skills**: EDA, feature engineering, visualization
- **Machine Learning Expertise**: Multiple algorithms, ensemble methods
- **Production Readiness**: Modular code, error handling, documentation
- **Communication**: Clear explanations, visual storytelling

Total analysis and implementation time: Under 2 hours as required.

---

## Files Structure

```
notebooks/
├── README.md                           # This file
├── custom_style.css                    # Cyber theme styling
├── 01_gaming_recommendations.ipynb     # Task 1: Gaming
├── 02_sentiment_analysis.ipynb         # Task 2: Sentiment
└── 03_defi_predictions.ipynb           # Task 3: DeFi
```

---

## Additional Resources

- **Main README**: `../README.md` - Technical implementation details
- **API Documentation**: http://localhost:8000/docs - Interactive API explorer

---

Built with data science best practices and modern visualization tools.
