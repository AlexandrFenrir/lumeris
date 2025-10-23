"""
FastAPI Server for ML Backend
Serves gaming recommendations, sentiment analysis, and DeFi predictions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lumeris_ml_backend.gaming_recommender import GamingRecommender
from lumeris_ml_backend.sentiment_analyzer import SentimentAnalyzer
from lumeris_ml_backend.defi_predictor import DeFiPredictor

# Initialize FastAPI app
app = FastAPI(
    title="Lumeris ML Backend",
    description="AI/ML services for Lumeris DApp",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
gaming_recommender = GamingRecommender()
sentiment_analyzer = SentimentAnalyzer()
defi_predictor = DeFiPredictor()

# Pydantic models for request/response
class RecommendationRequest(BaseModel):
    user_id: str
    n_recommendations: int = 3

class SentimentRequest(BaseModel):
    text: str
    category: Optional[str] = "general"

class BatchSentimentRequest(BaseModel):
    comments: List[Dict[str, str]]

class DeFiPredictionRequest(BaseModel):
    pool_id: str
    days_ahead: Optional[int] = 7


@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    print("Starting Lumeris ML Backend...")

    # Initialize models with data from backend API
    gaming_recommender.initialize_with_mock_data()
    sentiment_analyzer.initialize_with_mock_data()
    defi_predictor.initialize_with_mock_data()

    # Note: We don't load pickled models as we're using fresh data from backend API

    print("All ML models initialized successfully!")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Lumeris ML Backend",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "gaming": "/api/gaming/recommendations",
            "sentiment": "/api/sentiment/analyze",
            "defi": "/api/defi/predictions"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "models_loaded": True}


# ==================== GAMING RECOMMENDATIONS ====================

@app.post("/api/gaming/recommendations")
async def get_game_recommendations(request: RecommendationRequest):
    """Get game recommendations for a user"""
    try:
        recommendations = gaming_recommender.recommend_for_user(
            request.user_id,
            request.n_recommendations
        )
        return {
            "success": True,
            "user_id": request.user_id,
            "recommendations": recommendations,
            "count": len(recommendations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/gaming/similar/{game_id}")
async def get_similar_games(game_id: str, n: int = 3):
    """Get similar games to a given game"""
    try:
        similar = gaming_recommender.get_similar_games(game_id, n)
        return {
            "success": True,
            "game_id": game_id,
            "similar_games": similar,
            "count": len(similar)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/gaming/games")
async def get_all_games():
    """Get all available games"""
    try:
        return {
            "success": True,
            "games": gaming_recommender.games,
            "count": len(gaming_recommender.games)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SENTIMENT ANALYSIS ====================

@app.post("/api/sentiment/analyze")
async def analyze_sentiment(request: SentimentRequest):
    """Analyze sentiment of a single comment"""
    try:
        result = sentiment_analyzer.analyze_comment(request.text, request.category)
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/sentiment/batch")
async def analyze_batch_sentiment(request: BatchSentimentRequest):
    """Analyze sentiment of multiple comments"""
    try:
        result = sentiment_analyzer.analyze_batch(request.comments)
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/sentiment/trending")
async def get_trending_topics(comments: List[str]):
    """Get trending topics from comments"""
    try:
        trending = sentiment_analyzer.get_trending_topics(comments)
        return {
            "success": True,
            "trending_topics": trending,
            "count": len(trending)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== DEFI PREDICTIONS ====================

@app.post("/api/defi/predict")
async def predict_defi_trend(request: DeFiPredictionRequest):
    """Predict market trend for a specific pool"""
    try:
        prediction = defi_predictor.predict_pool_trend(
            request.pool_id,
            request.days_ahead
        )
        return {
            "success": True,
            "prediction": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/defi/predictions/all")
async def predict_all_pools():
    """Get predictions for all pools"""
    try:
        predictions = defi_predictor.predict_all_pools()
        return {
            "success": True,
            "predictions": predictions,
            "count": len(predictions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/defi/pools")
async def get_all_pools():
    """Get all available pools"""
    try:
        return {
            "success": True,
            "pools": defi_predictor.pools,
            "count": len(defi_predictor.pools)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== MODEL MANAGEMENT ====================

@app.post("/api/models/save")
async def save_models():
    """Save all models to disk"""
    try:
        models_dir = "models"
        os.makedirs(models_dir, exist_ok=True)

        gaming_recommender.save_model(f"{models_dir}/gaming_recommender.pkl")
        sentiment_analyzer.save_model(f"{models_dir}/sentiment_analyzer.pkl")
        defi_predictor.save_model(f"{models_dir}/defi_predictor.pkl")

        return {
            "success": True,
            "message": "All models saved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
