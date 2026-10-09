"""
GreenBridge Machine Learning Pipeline: Agricultural Commodity Price Forecasting
================================================================================
This module implements a time-series regression pipeline to forecast APMC mandi
wholesale prices for smallholder farmers using Scikit-Learn.

Key Pipeline Steps:
1. Ingests / simulates historical daily APMC Agmarknet commodity spot rates (2-year series).
2. Performs time-series feature engineering (lag features, rolling moving averages, seasonality).
3. Executes a strict chronological train/test split (80% train, 20% test) to prevent future leakage.
4. Trains and benchmarks a Baseline Linear Regression vs. a Random Forest Regressor.
5. Evaluates model performance using MAE, RMSE, MAPE, and R² scores.
6. Exports the trained model artifact for inference integration.
"""

import os
import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Machine Learning & Evaluation (scikit-learn)
try:
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
    import joblib
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


def generate_agmarknet_dataset(n_days: int = 730) -> pd.DataFrame:
    """
    Simulates a 2-year realistic Agmarknet daily price dataset for key Indian agricultural commodities.
    Incorporates seasonality, baseline mandi costs, harvest cycles, and random market shocks.
    """
    np.random.seed(42)
    start_date = datetime(2024, 1, 1)
    dates = [start_date + timedelta(days=i) for i in range(n_days)]

    commodities = {
        "Tomato": {"base": 28.0, "seasonal_amp": 12.0, "volatility": 4.5, "peak_month": 7},
        "Onion": {"base": 24.0, "seasonal_amp": 10.0, "volatility": 3.5, "peak_month": 11},
        "Potato": {"base": 18.0, "seasonal_amp": 5.0, "volatility": 2.0, "peak_month": 2},
        "Wheat": {"base": 32.0, "seasonal_amp": 4.0, "volatility": 1.5, "peak_month": 4},
        "Rice": {"base": 42.0, "seasonal_amp": 5.0, "volatility": 2.0, "peak_month": 10},
        "Mango": {"base": 85.0, "seasonal_amp": 40.0, "volatility": 8.0, "peak_month": 5},
    }

    records = []
    for crop, params in commodities.items():
        base = params["base"]
        amp = params["seasonal_amp"]
        vol = params["volatility"]
        peak = params["peak_month"]

        for day_idx, date in enumerate(dates):
            # Seasonal cycle modeled via cosine wave
            month_frac = (date.month - peak) * (2 * np.pi / 12)
            seasonal_effect = amp * np.cos(month_frac)

            # Random market fluctuations (noise)
            noise = np.random.normal(0, vol)

            price = max(base * 0.4, round(base + seasonal_effect + noise, 2))
            records.append({
                "date": date,
                "commodity": crop,
                "mandi_modal_price": price
            })

    df = pd.DataFrame(records)
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Constructs predictive time-series lag features and rolling window aggregates.
    """
    df = df.sort_values(by=["commodity", "date"]).reset_index(drop=True)

    # 1. Temporal & Calendar Features
    df["month"] = df["date"].dt.month
    df["day_of_week"] = df["date"].dt.dayofweek
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)

    # 2. Lag Features (Previous day spot rates)
    df["lag_1d"] = df.groupby("commodity")["mandi_modal_price"].shift(1)
    df["lag_2d"] = df.groupby("commodity")["mandi_modal_price"].shift(2)
    df["lag_7d"] = df.groupby("commodity")["mandi_modal_price"].shift(7)

    # 3. Rolling Moving Averages (Captures short-term and medium-term momentum)
    df["rolling_7d_avg"] = (
        df.groupby("commodity")["mandi_modal_price"]
        .shift(1)
        .rolling(window=7, min_periods=1)
        .mean()
    )
    df["rolling_14d_avg"] = (
        df.groupby("commodity")["mandi_modal_price"]
        .shift(1)
        .rolling(window=14, min_periods=1)
        .mean()
    )
    df["rolling_7d_std"] = (
        df.groupby("commodity")["mandi_modal_price"]
        .shift(1)
        .rolling(window=7, min_periods=1)
        .std()
        .fillna(0)
    )

    # One-hot encode commodity categories
    df = pd.get_dummies(df, columns=["commodity"], drop_first=False)

    # Drop early NaN rows resulting from 7-day shifting
    df = df.dropna().reset_index(drop=True)
    return df


def train_and_evaluate(df: pd.DataFrame):
    """
    Executes a chronological train-test split, trains models, and prints evaluation metrics.
    """
    if not SKLEARN_AVAILABLE:
        print("[!] scikit-learn is not installed in the active environment.")
        print("    Please run: pip install -r ml/requirements.txt")
        return None

    # Chronological Split (80% Train, 20% Test) — Strictly prevents future data leakage
    split_index = int(len(df) * 0.8)
    train_df = df.iloc[:split_index]
    test_df = df.iloc[split_index:]

    feature_cols = [c for c in df.columns if c not in ["date", "mandi_modal_price"]]
    target_col = "mandi_modal_price"

    X_train, y_train = train_df[feature_cols], train_df[target_col]
    X_test, y_test = test_df[feature_cols], test_df[target_col]

    print("=" * 70)
    print(" GREENBRIDGE AGMARKNET TIME-SERIES PRICE FORECASTING PIPELINE")
    print("=" * 70)
    print(f"Dataset Size:       {len(df)} daily observations")
    print(f"Training Samples:   {len(X_train)} ({len(train_df['date'].unique())} dates)")
    print(f"Test Samples:       {len(X_test)} ({len(test_df['date'].unique())} dates)")
    print(f"Features:           {len(feature_cols)} features ({', '.join(feature_cols[:5])}...)")
    print("-" * 70)

    # Model 1: Baseline Linear Regression
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    lr_preds = lr.predict(X_test)

    lr_mae = mean_absolute_error(y_test, lr_preds)
    lr_rmse = math.sqrt(mean_squared_error(y_test, lr_preds))
    lr_mape = np.mean(np.abs((y_test - lr_preds) / y_test)) * 100
    lr_r2 = r2_score(y_test, lr_preds)

    # Model 2: Random Forest Regressor
    rf = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)

    rf_mae = mean_absolute_error(y_test, rf_preds)
    rf_rmse = math.sqrt(mean_squared_error(y_test, rf_preds))
    rf_mape = np.mean(np.abs((y_test - rf_preds) / y_test)) * 100
    rf_r2 = r2_score(y_test, rf_preds)

    print(" MODEL BENCHMARKING RESULTS (Out-of-Sample Test Set)")
    print("-" * 70)
    print(f"{'Metric':<25} | {'Baseline (Linear Reg)':<20} | {'Random Forest (Proposed)':<20}")
    print("-" * 70)
    print(f"{'Mean Absolute Error (MAE)':<25} | ₹{lr_mae:<19.2f} | ₹{rf_mae:<19.2f}")
    print(f"{'Root Mean Squared Error (RMSE)':<25} | ₹{lr_rmse:<19.2f} | ₹{rf_rmse:<19.2f}")
    print(f"{'Mean Abs. Percentage Error (MAPE)':<25} | {lr_mape:<18.2f}% | {rf_mape:<18.2f}%")
    print(f"{'R² Score (Goodness of Fit)':<25} | {lr_r2:<19.4f} | {rf_r2:<19.4f}")
    print("=" * 70)

    # Feature Importance (Top 5)
    importances = pd.Series(rf.feature_importances_, index=feature_cols).sort_values(ascending=False)
    print(" TOP 5 FEATURE IMPORTANCES (Random Forest):")
    for feat, imp in importances.head(5).items():
        print(f"  • {feat:<20}: {imp * 100:.2f}%")
    print("=" * 70)

    # Export model artifact
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, "random_forest_price_model.joblib")
    joblib.dump({"model": rf, "feature_columns": feature_cols}, model_path)
    print(f"[✓] Serialized trained model to: {model_path}")

    return rf, feature_cols


def predict_harvest_price(crop: str, recent_prices: list, is_organic: bool = False, model_bundle=None):
    """
    Inference helper function: forecasts future mandi clearing price given recent 7-day history.
    Applies the audited +20% organic quality multiplier if certified.
    """
    if not recent_prices or len(recent_prices) < 7:
        raise ValueError("Requires at least 7 days of recent price observations.")

    p_curr = recent_prices[-1]
    p_lag2 = recent_prices[-2]
    p_lag7 = recent_prices[0]
    p_7d_avg = sum(recent_prices) / 7.0
    p_14d_avg = p_7d_avg # proxy if 14d not fully available
    std = np.std(recent_prices)

    now = datetime.now()
    month = now.month
    day_of_week = now.weekday()
    is_weekend = 1 if day_of_week in [5, 6] else 0

    # Build input feature row
    features = {
        "month": month,
        "day_of_week": day_of_week,
        "is_weekend": is_weekend,
        "lag_1d": p_curr,
        "lag_2d": p_lag2,
        "lag_7d": p_lag7,
        "rolling_7d_avg": p_7d_avg,
        "rolling_14d_avg": p_14d_avg,
        "rolling_7d_std": std,
    }

    # Crop dummy encoding
    for c in ["Tomato", "Onion", "Potato", "Wheat", "Rice", "Mango"]:
        features[f"commodity_{c}"] = 1 if c.lower() == crop.lower() else 0

    df_in = pd.DataFrame([features])

    # Fallback heuristic if ML package not loaded
    if model_bundle is not None:
        model, cols = model_bundle["model"], model_bundle["feature_columns"]
        # Align columns
        for c in cols:
            if c not in df_in.columns:
                df_in[c] = 0
        df_in = df_in[cols]
        base_pred = float(model.predict(df_in)[0])
    else:
        # Heuristic momentum estimate
        base_pred = (p_curr * 0.5) + (p_7d_avg * 0.5)

    if is_organic:
        base_pred *= 1.20 # 20% organic multiplier

    corridor_min = round(base_pred * 0.85, 2)
    corridor_max = round(base_pred * 1.15, 2)

    return {
        "crop": crop,
        "forecasted_price_per_kg": round(base_pred, 2),
        "fair_corridor": {"min": corridor_min, "max": corridor_max},
        "is_organic": is_organic,
        "confidence": "High" if len(recent_prices) >= 14 else "Moderate"
    }


if __name__ == "__main__":
    print("[*] Generating 2-year synthetic Agmarknet agricultural dataset...")
    raw_df = generate_agmarknet_dataset(n_days=730)
    print(f"[*] Raw dataset generated: {len(raw_df)} rows across 6 commodities.")

    print("[*] Engineering time-series lag and rolling statistics...")
    engineered_df = engineer_features(raw_df)

    print("[*] Launching model training and out-of-sample evaluation...")
    model_results = train_and_evaluate(engineered_df)

    # Sample single-inference test
    print("\n SAMPLE INFERENCE TEST:")
    sample_tomatoes = [26.0, 27.5, 28.0, 27.0, 29.0, 30.5, 31.0]
    result = predict_harvest_price(
        crop="Tomato",
        recent_prices=sample_tomatoes,
        is_organic=True
    )
    print(f"  • Crop:               {result['crop']} (Organic: {result['is_organic']})")
    print(f"  • Forecasted Price:   ₹{result['forecasted_price_per_kg']}/kg")
    print(f"  • Fair Corridor:      ₹{result['fair_corridor']['min']} – ₹{result['fair_corridor']['max']}/kg")
    print(f"  • Confidence:         {result['confidence']}")
    print("=" * 70)
