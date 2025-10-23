"""
DeFi Market Trend Predictor
Predicts price trends, APY changes, and liquidity movements for DeFi pools
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
import joblib
from typing import Dict, List, Any
from datetime import datetime, timedelta
from .data_fetcher import get_data_fetcher


class DeFiPredictor:
    """Predictive model for DeFi market trends"""

    def __init__(self):
        self.price_model = None
        self.trend_classifier = None
        self.scaler = StandardScaler()
        self.pools_data = {}

    def initialize_with_mock_data(self):
        """Initialize with DeFi pool data from the backend API"""

        fetcher = get_data_fetcher()

        # Try to fetch real data from backend
        backend_pools = fetcher.get_defi_pools()

        if backend_pools:
            # Transform backend data to match our model format
            self.pools = []
            for pool in backend_pools:
                # Extract tokens from pair
                tokens = pool.get("pair", "/").split("/")
                token_a = tokens[0] if len(tokens) > 0 else "TOKEN_A"
                token_b = tokens[1] if len(tokens) > 1 else "TOKEN_B"

                # Estimate current price based on TVL and volume
                tvl = pool.get("tvl", 0)
                volume = pool.get("volume24h", 0)
                price = self._estimate_price(token_a, tvl, volume)

                self.pools.append({
                    "id": pool.get("id", ""),
                    "name": pool.get("pair", ""),
                    "token_a": token_a,
                    "token_b": token_b,
                    "current_price": price,
                    "tvl": tvl,
                    "volume_24h": volume,
                    "apy": pool.get("apy", 0),
                    "fee_tier": pool.get("fees", 0.3)
                })
            print(f"Loaded {len(self.pools)} DeFi pools from backend API")
        else:
            # Fallback to mock data if backend is unavailable
            print("Backend unavailable, using fallback mock data")
            self.pools = [
                {
                    "id": "pool_001",
                    "name": "ETH/USDC",
                    "token_a": "ETH",
                    "token_b": "USDC",
                    "current_price": 3500.0,
                    "tvl": 25000000,
                    "volume_24h": 5000000,
                    "apy": 12.5,
                    "fee_tier": 0.3
                },
                {
                    "id": "pool_002",
                    "name": "BTC/USDT",
                    "token_a": "BTC",
                    "token_b": "USDT",
                    "current_price": 65000.0,
                    "tvl": 50000000,
                    "volume_24h": 10000000,
                    "apy": 8.2,
                    "fee_tier": 0.3
                },
                {
                    "id": "pool_003",
                    "name": "LUMERIS/ETH",
                    "token_a": "LUMERIS",
                    "token_b": "ETH",
                    "current_price": 2.5,
                    "tvl": 5000000,
                    "volume_24h": 800000,
                    "apy": 45.3,
                    "fee_tier": 1.0
                },
                {
                    "id": "pool_004",
                    "name": "USDC/USDT",
                    "token_a": "USDC",
                    "token_b": "USDT",
                    "current_price": 1.0,
                    "tvl": 100000000,
                    "volume_24h": 20000000,
                    "apy": 3.5,
                    "fee_tier": 0.01
                }
            ]

        # Generate historical data (simulated)
        self.historical_data = self._generate_historical_data()

        # Train models
        self._train_models()

        print("DeFi Predictor initialized with data")

    def _estimate_price(self, token: str, tvl: float, volume: float) -> float:
        """Estimate token price based on TVL and volume"""
        # Rough estimation based on token type
        price_map = {
            "Lumeris": 2.45,
            "ETH": 3500.0,
            "BTC": 65000.0,
            "USDC": 1.0,
            "USDT": 1.0,
            "GAMING": 0.85
        }

        # Return known price or estimate
        if token in price_map:
            return price_map[token]

        # Simple estimation based on TVL
        if tvl > 50000000:
            return 50000.0
        elif tvl > 10000000:
            return 5000.0
        elif tvl > 1000000:
            return 100.0
        else:
            return 1.0

    def _generate_historical_data(self, days: int = 30) -> pd.DataFrame:
        """Generate simulated historical price and metrics data"""

        data = []
        base_date = datetime.now() - timedelta(days=days)

        for pool in self.pools:
            pool_id = pool['id']
            base_price = pool['current_price']
            base_tvl = pool['tvl']
            base_volume = pool['volume_24h']
            base_apy = pool['apy']

            for day in range(days):
                date = base_date + timedelta(days=day)

                # Simulate price movement (random walk with trend)
                price_change = np.random.normal(0, 0.02)  # 2% std deviation
                trend = 0.001 if day < days/2 else -0.001  # Slight trend
                price = base_price * (1 + price_change + trend * day)

                # Simulate TVL changes
                tvl_change = np.random.normal(0, 0.01)
                tvl = base_tvl * (1 + tvl_change)

                # Volume correlates with volatility
                volatility = abs(price_change)
                volume = base_volume * (1 + np.random.normal(volatility, 0.1))

                # APY inversely correlates with TVL
                apy = base_apy * (base_tvl / tvl) * (1 + np.random.normal(0, 0.05))

                # Calculate technical indicators
                # Simple moving average (7-day window)
                if day >= 7:
                    recent_prices = [d['price'] for d in data if d['pool_id'] == pool_id][-7:]
                    sma_7 = np.mean(recent_prices) if recent_prices else price
                else:
                    sma_7 = price

                # Price momentum
                if day >= 1:
                    prev_price = [d['price'] for d in data if d['pool_id'] == pool_id][-1] if data else price
                    momentum = (price - prev_price) / prev_price
                else:
                    momentum = 0

                # Volume/TVL ratio
                volume_tvl_ratio = volume / tvl if tvl > 0 else 0

                data.append({
                    'pool_id': pool_id,
                    'date': date,
                    'price': price,
                    'tvl': tvl,
                    'volume_24h': volume,
                    'apy': apy,
                    'sma_7': sma_7,
                    'momentum': momentum,
                    'volume_tvl_ratio': volume_tvl_ratio,
                    'volatility': abs(price_change)
                })

        return pd.DataFrame(data)

    def _train_models(self):
        """Train prediction models on historical data"""

        df = self.historical_data.copy()

        # Prepare features
        feature_columns = ['price', 'tvl', 'volume_24h', 'apy', 'sma_7', 'momentum', 'volume_tvl_ratio', 'volatility']

        # Add lagged features (t-1)
        for pool_id in df['pool_id'].unique():
            pool_mask = df['pool_id'] == pool_id
            pool_df = df[pool_mask].copy()

            for col in ['price', 'volume_24h']:
                df.loc[pool_mask, f'{col}_lag1'] = pool_df[col].shift(1)

        df = df.dropna()  # Remove rows with NaN

        feature_columns.extend(['price_lag1', 'volume_24h_lag1'])

        X = df[feature_columns].values

        # Target 1: Next day price (regression)
        y_price = df.groupby('pool_id')['price'].shift(-1)

        # Target 2: Trend direction (classification: up/down/stable)
        def classify_trend(row):
            future_price = df[(df['pool_id'] == row['pool_id']) & (df['date'] > row['date'])].head(1)
            if future_price.empty:
                return 'stable'
            future_val = future_price['price'].values[0]
            change = (future_val - row['price']) / row['price']
            if change > 0.02:
                return 'up'
            elif change < -0.02:
                return 'down'
            else:
                return 'stable'

        y_trend = df.apply(classify_trend, axis=1)

        # Remove last row (no future data)
        X = X[:-len(self.pools)]
        y_price_clean = y_price.dropna().values
        y_trend_clean = y_trend[:-len(self.pools)].values

        # Normalize features
        X_scaled = self.scaler.fit_transform(X)

        # Train price prediction model (Random Forest Regressor)
        self.price_model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.price_model.fit(X_scaled, y_price_clean)

        # Train trend classification model (Gradient Boosting)
        self.trend_classifier = GradientBoostingClassifier(
            n_estimators=100,
            max_depth=5,
            random_state=42
        )
        self.trend_classifier.fit(X_scaled, y_trend_clean)

        print(f"Models trained on {len(X)} samples")

    def predict_pool_trend(self, pool_id: str, days_ahead: int = 7) -> Dict[str, Any]:
        """
        Predict market trends for a specific pool

        Args:
            pool_id: Pool identifier
            days_ahead: Number of days to predict ahead

        Returns:
            Prediction results with confidence scores
        """

        pool = next((p for p in self.pools if p['id'] == pool_id), None)
        if not pool:
            return {"error": "Pool not found"}

        # Get latest data for this pool
        latest_data = self.historical_data[
            self.historical_data['pool_id'] == pool_id
        ].iloc[-1]

        # Prepare features
        features = np.array([[
            latest_data['price'],
            latest_data['tvl'],
            latest_data['volume_24h'],
            latest_data['apy'],
            latest_data['sma_7'],
            latest_data['momentum'],
            latest_data['volume_tvl_ratio'],
            latest_data['volatility'],
            latest_data['price'],  # lag1
            latest_data['volume_24h']  # lag1
        ]])

        features_scaled = self.scaler.transform(features)

        # Predict price
        predicted_price = self.price_model.predict(features_scaled)[0]
        price_change_pct = ((predicted_price - latest_data['price']) / latest_data['price']) * 100

        # Predict trend
        trend_proba = self.trend_classifier.predict_proba(features_scaled)[0]
        trend_classes = self.trend_classifier.classes_
        trend_prediction = trend_classes[np.argmax(trend_proba)]
        trend_confidence = np.max(trend_proba)

        # Generate multi-day forecast
        forecast = self._generate_forecast(latest_data, days_ahead)

        # Calculate risk metrics
        risk_score = self._calculate_risk_score(latest_data, trend_prediction)

        # Generate trading signals
        signals = self._generate_trading_signals(
            latest_data, predicted_price, trend_prediction, risk_score
        )

        return {
            "pool_id": pool_id,
            "pool_name": pool['name'],
            "current_price": float(latest_data['price']),
            "predicted_price": float(predicted_price),
            "price_change_pct": float(price_change_pct),
            "trend": trend_prediction,
            "trend_confidence": float(trend_confidence),
            "trend_probabilities": {
                trend_classes[i]: float(trend_proba[i])
                for i in range(len(trend_classes))
            },
            "forecast": forecast,
            "risk_score": risk_score,
            "trading_signals": signals,
            "timestamp": datetime.now().isoformat()
        }

    def _generate_forecast(self, latest_data: pd.Series, days: int) -> List[Dict[str, float]]:
        """Generate multi-day price forecast"""

        forecast = []
        current_price = latest_data['price']

        for day in range(1, days + 1):
            # Simple forecast with decreasing confidence
            confidence = max(0.5, 1.0 - (day * 0.1))

            # Extrapolate based on momentum
            momentum = latest_data['momentum']
            predicted_change = momentum * day * 0.5  # Dampened momentum

            # Add some noise
            noise = np.random.normal(0, 0.01 * day)

            predicted_price = current_price * (1 + predicted_change + noise)

            forecast.append({
                "day": day,
                "predicted_price": float(predicted_price),
                "confidence": float(confidence)
            })

        return forecast

    def _calculate_risk_score(self, data: pd.Series, trend: str) -> Dict[str, Any]:
        """Calculate risk metrics for the pool"""

        # Volatility risk
        volatility_risk = min(data['volatility'] * 100, 10)

        # Liquidity risk (inverse of TVL)
        liquidity_risk = max(0, 10 - np.log10(data['tvl']))

        # Trend risk
        trend_risk = 3 if trend == 'down' else 1 if trend == 'up' else 2

        # Overall risk score (0-10)
        overall_risk = (volatility_risk * 0.4 + liquidity_risk * 0.3 + trend_risk * 0.3)

        risk_level = "low" if overall_risk < 3 else "medium" if overall_risk < 6 else "high"

        return {
            "overall_score": float(overall_risk),
            "level": risk_level,
            "volatility_risk": float(volatility_risk),
            "liquidity_risk": float(liquidity_risk),
            "trend_risk": float(trend_risk)
        }

    def _generate_trading_signals(
        self, data: pd.Series, predicted_price: float, trend: str, risk_score: Dict
    ) -> List[Dict[str, Any]]:
        """Generate actionable trading signals"""

        signals = []
        current_price = data['price']

        # Price momentum signal
        if data['momentum'] > 0.02:
            signals.append({
                "type": "buy",
                "reason": "Strong positive momentum",
                "strength": "strong",
                "confidence": 0.8
            })
        elif data['momentum'] < -0.02:
            signals.append({
                "type": "sell",
                "reason": "Strong negative momentum",
                "strength": "strong",
                "confidence": 0.8
            })

        # Trend following signal
        if trend == 'up' and risk_score['level'] != 'high':
            signals.append({
                "type": "buy",
                "reason": "Upward trend with acceptable risk",
                "strength": "medium",
                "confidence": 0.7
            })
        elif trend == 'down':
            signals.append({
                "type": "sell",
                "reason": "Downward trend predicted",
                "strength": "medium",
                "confidence": 0.7
            })

        # APY opportunity signal
        if data['apy'] > 30:
            signals.append({
                "type": "stake",
                "reason": f"High APY: {data['apy']:.1f}%",
                "strength": "medium",
                "confidence": 0.65
            })

        # Risk warning
        if risk_score['level'] == 'high':
            signals.append({
                "type": "warning",
                "reason": "High risk detected - exercise caution",
                "strength": "strong",
                "confidence": 0.9
            })

        return signals if signals else [{
            "type": "hold",
            "reason": "No strong signals detected",
            "strength": "weak",
            "confidence": 0.5
        }]

    def predict_all_pools(self) -> List[Dict[str, Any]]:
        """Get predictions for all pools"""

        predictions = []
        for pool in self.pools:
            pred = self.predict_pool_trend(pool['id'])
            predictions.append(pred)

        return predictions

    def save_model(self, filepath: str):
        """Save models to disk"""
        model_data = {
            'price_model': self.price_model,
            'trend_classifier': self.trend_classifier,
            'scaler': self.scaler,
            'pools': self.pools,
            'historical_data': self.historical_data
        }
        joblib.dump(model_data, filepath)
        print(f"Models saved to {filepath}")

    def load_model(self, filepath: str):
        """Load models from disk"""
        model_data = joblib.load(filepath)
        self.price_model = model_data['price_model']
        self.trend_classifier = model_data['trend_classifier']
        self.scaler = model_data['scaler']
        self.pools = model_data['pools']
        self.historical_data = model_data['historical_data']
        print(f"Models loaded from {filepath}")


# Test the predictor
if __name__ == "__main__":
    predictor = DeFiPredictor()
    predictor.initialize_with_mock_data()

    # Test prediction
    print("\nTesting DeFi predictions for pool_001 (ETH/USDC):")
    result = predictor.predict_pool_trend("pool_001", days_ahead=7)
    print(f"  Current: ${result['current_price']:.2f}")
    print(f"  Predicted: ${result['predicted_price']:.2f} ({result['price_change_pct']:+.2f}%)")
    print(f"  Trend: {result['trend']} (confidence: {result['trend_confidence']:.2f})")
    print(f"  Risk: {result['risk_score']['level']} ({result['risk_score']['overall_score']:.2f}/10)")
    print(f"  Signals: {len(result['trading_signals'])} signals generated")

    # Save model
    predictor.save_model("models/defi_predictor.pkl")
