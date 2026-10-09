# GreenBridge | Machine Learning Price Forecasting Module

This directory contains the Python offline machine learning pipeline for **GreenBridge's Agricultural Commodity Price Forecasting Engine**.

---

## 1. Overview & Objective
In conventional Indian agricultural supply chains, smallholder farmers face severe price volatility and market opacity at APMC wholesale mandis. 

This ML module trains a **supervised time-series regression model** on 2 years of daily commodity spot rates to predict upcoming harvest clearing rates.

Key outcomes:
- **Baseline vs. Random Forest Regressor** benchmarking.
- Evaluated on a strict **chronological out-of-sample test split** (80% train, 20% test) to prevent future data leakage.
- Generates **fair-price corridors (±15%)** and applies an audited **+20% organic quality multiplier**.

---

## 2. Feature Engineering

| Feature | Type | Description |
|---|---|---|
| `lag_1d`, `lag_2d`, `lag_7d` | Lag | Prior 1-day, 2-day, and 7-day commodity spot rates |
| `rolling_7d_avg` | Moving Average | 7-day rolling mean capturing short-term price momentum |
| `rolling_14d_avg` | Moving Average | 14-day rolling mean capturing medium-term trends |
| `rolling_7d_std` | Volatility | 7-day standard deviation capturing market risk |
| `month`, `day_of_week` | Temporal | Seasonal cycle indicators (e.g. monsoon / harvest surge) |
| `commodity_*` | Categorical | One-hot encoded commodity indicator (Tomato, Onion, etc.) |

---

## 3. Model Benchmark Results (Out-of-Sample Test)

```
======================================================================
Metric                    | Baseline (Linear Reg) | Random Forest (Proposed)
======================================================================
Mean Absolute Error (MAE) | ₹3.82 / kg            | ₹1.46 / kg
Root Mean Squared (RMSE)  | ₹5.14 / kg            | ₹2.28 / kg
Mean Abs. Pct Error (MAPE)| 11.20%                | 4.65%
R² Score (Goodness of Fit)| 0.8841                | 0.9782
======================================================================
```

---

## 4. How to Run Locally

### Prerequisites
- Python 3.10+ installed

### Step-by-Step Execution:
```bash
# 1. Navigate to the ml directory
cd ml

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train the model and run evaluation
python price_forecasting.py
```

---

## 5. Inference Usage
The module exposes an easy-to-use inference function:

```python
from price_forecasting import predict_harvest_price

result = predict_harvest_price(
    crop="Tomato",
    recent_prices=[26.0, 27.5, 28.0, 27.0, 29.0, 30.5, 31.0],
    is_organic=True
)

print(result)
# Output:
# {
#   'crop': 'Tomato',
#   'forecasted_price_per_kg': 35.40,
#   'fair_corridor': {'min': 30.09, 'max': 40.71},
#   'is_organic': True,
#   'confidence': 'High'
# }
```
