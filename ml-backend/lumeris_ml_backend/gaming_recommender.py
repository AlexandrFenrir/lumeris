"""
Gaming Recommendation System
Uses collaborative filtering and content-based filtering for game recommendations
"""

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import joblib
from typing import List, Dict, Any
import json
from .data_fetcher import get_data_fetcher


class GamingRecommender:
    """Recommendation system for gaming section using hybrid approach"""

    def __init__(self):
        self.user_game_matrix = None
        self.game_features = None
        self.scaler = StandardScaler()
        self.user_profiles = {}
        self.game_metadata = {}

    def initialize_with_mock_data(self):
        """Initialize with gaming data from the backend API"""

        fetcher = get_data_fetcher()

        # Try to fetch real data from backend
        backend_games = fetcher.get_games()

        if backend_games:
            # Transform backend data to match our model format
            self.games = []
            for game in backend_games:
                # Map backend fields to our model
                self.games.append({
                    "id": game.get("id", ""),
                    "name": game.get("title", ""),
                    "category": game.get("genre", "").lower(),
                    "difficulty": self._estimate_difficulty(game),
                    "avg_playtime": self._estimate_playtime(game),
                    "reward_rate": self._calculate_reward_rate(game),
                    "player_count": game.get("players", 0),
                    "rating": self._estimate_rating(game)
                })
            print(f"Loaded {len(self.games)} games from backend API")
        else:
            # Fallback to mock data if backend is unavailable
            print("Backend unavailable, using fallback mock data")
            self.games = [
                {
                    "id": "game-1",
                    "name": "Stellar Conquest",
                    "category": "strategy",
                    "difficulty": "medium",
                    "avg_playtime": 45,
                    "reward_rate": 0.8,
                    "player_count": 15420,
                    "rating": 4.6
                },
                {
                    "id": "game-2",
                    "name": "Crypto Raiders",
                    "category": "rpg",
                    "difficulty": "hard",
                    "avg_playtime": 60,
                    "reward_rate": 0.9,
                    "player_count": 12350,
                    "rating": 4.7
                },
                {
                    "id": "game-3",
                    "name": "NFT Poker",
                    "category": "card",
                    "difficulty": "easy",
                    "avg_playtime": 20,
                    "reward_rate": 0.7,
                    "player_count": 8920,
                    "rating": 4.4
                },
                {
                    "id": "game-4",
                    "name": "Battle Royale X",
                    "category": "action",
                    "difficulty": "medium",
                    "avg_playtime": 30,
                    "reward_rate": 0.75,
                    "player_count": 25000,
                    "rating": 4.8
                }
            ]

        # Mock user play history (use actual game IDs from backend)
        game_ids = [g["id"] for g in self.games]

        # Create play history with available games
        if len(game_ids) >= 3:
            self.user_play_history = {
                "user_001": [
                    {"game_id": game_ids[0], "playtime": 120, "score": 8500, "wins": 15},
                    {"game_id": game_ids[1] if len(game_ids) > 1 else game_ids[0], "playtime": 200, "score": 12000, "wins": 8},
                    {"game_id": game_ids[2] if len(game_ids) > 2 else game_ids[0], "playtime": 60, "score": 3000, "wins": 10}
                ],
                "user_002": [
                    {"game_id": game_ids[0], "playtime": 80, "score": 6000, "wins": 10},
                    {"game_id": game_ids[1] if len(game_ids) > 1 else game_ids[0], "playtime": 150, "score": 15000, "wins": 20}
                ],
                "user_003": [
                    {"game_id": game_ids[1] if len(game_ids) > 1 else game_ids[0], "playtime": 250, "score": 18000, "wins": 12},
                    {"game_id": game_ids[2] if len(game_ids) > 2 else game_ids[0], "playtime": 100, "score": 9000, "wins": 15}
                ]
            }
        else:
            # Fallback for no games
            self.user_play_history = {}

        # Build game feature matrix
        self._build_game_features()

        # Build user-game interaction matrix
        self._build_user_game_matrix()

        print("Gaming Recommender initialized with data")

    def _estimate_difficulty(self, game: Dict) -> str:
        """Estimate difficulty based on game requirements"""
        requirements = game.get("requirements", {})
        min_level = requirements.get("minLevel", 0)

        if min_level >= 10:
            return "hard"
        elif min_level >= 5:
            return "medium"
        else:
            return "easy"

    def _estimate_playtime(self, game: Dict) -> int:
        """Estimate average playtime in minutes"""
        # Use genre as a proxy for playtime
        genre = game.get("genre", "").lower()
        playtime_map = {
            "rpg": 60,
            "strategy": 45,
            "racing": 20,
            "card": 25,
            "action": 30
        }
        return playtime_map.get(genre, 30)

    def _calculate_reward_rate(self, game: Dict) -> float:
        """Calculate reward rate based on daily rewards"""
        rewards = game.get("rewards", {})
        daily = rewards.get("daily", 0)

        # Normalize to 0-1 scale (assuming max 200 daily)
        return min(daily / 200, 1.0)

    def _estimate_rating(self, game: Dict) -> float:
        """Estimate rating based on player count"""
        players = game.get("players", 0)
        max_players = game.get("maxPlayers", 1)

        # Games with more players tend to be higher rated
        # Base rating + bonus for popularity
        base = 4.0
        popularity_bonus = (players / max_players) * 0.8
        return min(base + popularity_bonus, 5.0)

    def _build_game_features(self):
        """Build feature matrix for games"""

        # Category encoding
        categories = ['strategy', 'rpg', 'card', 'action']
        difficulties = ['easy', 'medium', 'hard']

        features_list = []

        for game in self.games:
            features = []

            # One-hot encode category
            features.extend([1 if game['category'] == cat else 0 for cat in categories])

            # One-hot encode difficulty
            features.extend([1 if game['difficulty'] == diff else 0 for diff in difficulties])

            # Numerical features (normalized)
            features.extend([
                game['avg_playtime'] / 100,  # Normalized
                game['reward_rate'],
                game['player_count'] / 30000,  # Normalized
                game['rating'] / 5.0
            ])

            features_list.append(features)
            self.game_metadata[game['id']] = game

        self.game_features = np.array(features_list)

        # Calculate game similarity matrix
        self.game_similarity = cosine_similarity(self.game_features)

    def _build_user_game_matrix(self):
        """Build user-game interaction matrix"""

        users = list(self.user_play_history.keys())
        games = [g['id'] for g in self.games]

        # Create matrix: rows=users, cols=games
        matrix = np.zeros((len(users), len(games)))

        for u_idx, user_id in enumerate(users):
            history = self.user_play_history[user_id]

            for play in history:
                game_idx = games.index(play['game_id'])

                # Engagement score: combination of playtime, wins, and score
                engagement = (
                    play['playtime'] / 300 +  # Normalized playtime
                    play['wins'] / 25 +  # Normalized wins
                    play['score'] / 20000  # Normalized score
                )

                matrix[u_idx][game_idx] = min(engagement, 5.0)  # Cap at 5

            # Store user profile
            self.user_profiles[user_id] = {
                'preferences': matrix[u_idx],
                'history': history
            }

        self.user_game_matrix = matrix

    def recommend_for_user(self, user_id: str, n_recommendations: int = 3) -> List[Dict[str, Any]]:
        """
        Generate game recommendations for a user

        Args:
            user_id: User identifier
            n_recommendations: Number of recommendations to return

        Returns:
            List of recommended games with scores
        """

        # If new user, use popularity-based recommendations
        if user_id not in self.user_profiles:
            return self._popularity_based_recommendations(n_recommendations)

        # Get user's play history
        user_history = self.user_play_history[user_id]
        played_game_ids = [play['game_id'] for play in user_history]

        # Collaborative filtering: find similar users
        user_idx = list(self.user_profiles.keys()).index(user_id)
        user_vector = self.user_game_matrix[user_idx].reshape(1, -1)

        # Calculate similarity with other users
        user_similarities = cosine_similarity(user_vector, self.user_game_matrix)[0]

        # Content-based filtering: based on played games
        content_scores = np.zeros(len(self.games))

        for play in user_history:
            game_idx = [g['id'] for g in self.games].index(play['game_id'])

            # Weight by user's engagement with this game
            engagement_weight = play['playtime'] / 300

            # Add similarity scores for similar games
            content_scores += self.game_similarity[game_idx] * engagement_weight

        # Collaborative scores
        collab_scores = np.zeros(len(self.games))
        for i, other_user_id in enumerate(self.user_profiles.keys()):
            if other_user_id != user_id:
                collab_scores += user_similarities[i] * self.user_game_matrix[i]

        # Hybrid: combine both approaches
        hybrid_scores = 0.6 * content_scores + 0.4 * collab_scores

        # Filter out already played games
        game_ids = [g['id'] for g in self.games]
        for played_id in played_game_ids:
            idx = game_ids.index(played_id)
            hybrid_scores[idx] = -1

        # Get top N recommendations
        top_indices = np.argsort(hybrid_scores)[::-1][:n_recommendations]

        recommendations = []
        for idx in top_indices:
            if hybrid_scores[idx] > 0:
                game = self.games[idx]
                recommendations.append({
                    "game_id": game['id'],
                    "name": game['name'],
                    "category": game['category'],
                    "difficulty": game['difficulty'],
                    "rating": game['rating'],
                    "player_count": game['player_count'],
                    "recommendation_score": float(hybrid_scores[idx]),
                    "reason": self._generate_reason(user_id, game, hybrid_scores[idx])
                })

        return recommendations

    def _popularity_based_recommendations(self, n: int) -> List[Dict[str, Any]]:
        """Recommendations for new users based on popularity"""

        # Sort by combined popularity metric
        sorted_games = sorted(
            self.games,
            key=lambda g: g['rating'] * np.log(g['player_count'] + 1),
            reverse=True
        )

        recommendations = []
        for game in sorted_games[:n]:
            recommendations.append({
                "game_id": game['id'],
                "name": game['name'],
                "category": game['category'],
                "difficulty": game['difficulty'],
                "rating": game['rating'],
                "player_count": game['player_count'],
                "recommendation_score": game['rating'],
                "reason": f"Popular choice with {game['player_count']:,} players"
            })

        return recommendations

    def _generate_reason(self, user_id: str, game: Dict, score: float) -> str:
        """Generate explanation for recommendation"""

        history = self.user_play_history[user_id]

        # Find most played category
        category_counts = {}
        for play in history:
            game_data = next(g for g in self.games if g['id'] == play['game_id'])
            cat = game_data['category']
            category_counts[cat] = category_counts.get(cat, 0) + play['playtime']

        fav_category = max(category_counts, key=category_counts.get)

        if game['category'] == fav_category:
            return f"Based on your love for {fav_category} games"
        elif game['rating'] >= 4.7:
            return f"Highly rated by the community ({game['rating']} stars)"
        elif game['player_count'] > 20000:
            return f"Trending with {game['player_count']:,} active players"
        else:
            return "You might enjoy this hidden gem"

    def get_similar_games(self, game_id: str, n: int = 3) -> List[Dict[str, Any]]:
        """Find similar games to a given game"""

        game_ids = [g['id'] for g in self.games]

        if game_id not in game_ids:
            return []

        game_idx = game_ids.index(game_id)
        similarities = self.game_similarity[game_idx]

        # Get top similar games (excluding itself)
        similarities[game_idx] = -1
        top_indices = np.argsort(similarities)[::-1][:n]

        similar_games = []
        for idx in top_indices:
            game = self.games[idx]
            similar_games.append({
                "game_id": game['id'],
                "name": game['name'],
                "category": game['category'],
                "similarity_score": float(similarities[idx])
            })

        return similar_games

    def save_model(self, filepath: str):
        """Save model to disk"""
        model_data = {
            'games': self.games,
            'user_play_history': self.user_play_history,
            'game_features': self.game_features,
            'game_similarity': self.game_similarity,
            'user_game_matrix': self.user_game_matrix,
            'user_profiles': self.user_profiles,
            'game_metadata': self.game_metadata
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")

    def load_model(self, filepath: str):
        """Load model from disk"""
        model_data = joblib.load(filepath)
        self.games = model_data['games']
        self.user_play_history = model_data['user_play_history']
        self.game_features = model_data['game_features']
        self.game_similarity = model_data['game_similarity']
        self.user_game_matrix = model_data['user_game_matrix']
        self.user_profiles = model_data['user_profiles']
        self.game_metadata = model_data['game_metadata']
        print(f"Model loaded from {filepath}")


# Initialize and train model
if __name__ == "__main__":
    recommender = GamingRecommender()
    recommender.initialize_with_mock_data()

    # Test recommendations
    print("\nTesting recommendations for user_001:")
    recs = recommender.recommend_for_user("user_001", n_recommendations=2)
    for rec in recs:
        print(f"  - {rec['name']} ({rec['category']}) - Score: {rec['recommendation_score']:.2f}")
        print(f"    Reason: {rec['reason']}")

    # Save model
    recommender.save_model("models/gaming_recommender.pkl")
