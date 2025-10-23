"""
Sentiment Analysis for User Comments
Uses TextBlob and custom ML model for analyzing user sentiment
"""

import numpy as np
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
from typing import Dict, List, Any
from datetime import datetime


class SentimentAnalyzer:
    """Sentiment analysis for user comments with context awareness"""

    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.categories = ['gaming', 'defi', 'nft', 'governance', 'general']

    def initialize_with_mock_data(self):
        """Initialize with mock comment data"""

        # Mock training data - user comments with labeled sentiments
        self.training_data = [
            # Positive comments
            ("This game is amazing! Best play-to-earn experience ever!", "positive", "gaming"),
            ("Love the DeFi pools, great APY and easy to use", "positive", "defi"),
            ("Incredible NFT collection, the art is stunning", "positive", "nft"),
            ("The governance system is very fair and transparent", "positive", "governance"),
            ("Best platform for crypto gaming, highly recommend", "positive", "general"),
            ("Rewards are awesome, keep up the good work!", "positive", "gaming"),
            ("Excellent liquidity, transactions are super fast", "positive", "defi"),
            ("These NFTs are fire! Already made profit", "positive", "nft"),
            ("Love how the community votes on proposals", "positive", "governance"),
            ("User interface is beautiful and intuitive", "positive", "general"),

            # Negative comments
            ("Game is too difficult, can't win anything", "negative", "gaming"),
            ("DeFi fees are too high, not worth it", "negative", "defi"),
            ("NFT prices are overvalued, avoid this collection", "negative", "nft"),
            ("Voting system is confusing and complicated", "negative", "governance"),
            ("Platform is laggy and slow, needs optimization", "negative", "general"),
            ("Matchmaking is terrible, always lose", "negative", "gaming"),
            ("Lost money in this pool, bad investment", "negative", "defi"),
            ("NFT art quality is poor, disappointed", "negative", "nft"),
            ("My vote didn't count, system is broken", "negative", "governance"),
            ("Customer support is non-existent", "negative", "general"),

            # Neutral comments
            ("The game has potential but needs more features", "neutral", "gaming"),
            ("DeFi pools are standard, nothing special", "neutral", "defi"),
            ("NFT collection is okay, might improve later", "neutral", "nft"),
            ("Governance system works as expected", "neutral", "governance"),
            ("Platform is functional but could be better", "neutral", "general"),
            ("Game mechanics are interesting but unbalanced", "neutral", "gaming"),
            ("APY is average compared to other platforms", "neutral", "defi"),
            ("NFTs are priced fairly for the market", "neutral", "nft"),
            ("Voting process is straightforward", "neutral", "governance"),
            ("Interface is clean but lacks some features", "neutral", "general"),
        ]

        # Build and train model
        self._train_model()

        print("Sentiment Analyzer initialized with mock data")

    def _train_model(self):
        """Train sentiment classification model"""

        # Prepare training data
        texts = [item[0] for item in self.training_data]
        labels = [item[1] for item in self.training_data]

        # Create pipeline: TF-IDF + Naive Bayes
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(
                max_features=1000,
                ngram_range=(1, 2),
                stop_words='english'
            )),
            ('classifier', MultinomialNB(alpha=0.1))
        ])

        # Train model
        self.model.fit(texts, labels)

        print(f"Model trained on {len(texts)} samples")

    def analyze_comment(self, text: str, category: str = "general") -> Dict[str, Any]:
        """
        Analyze sentiment of a single comment

        Args:
            text: Comment text
            category: Category context (gaming, defi, nft, governance, general)

        Returns:
            Dictionary with sentiment analysis results
        """

        # Get TextBlob sentiment (baseline)
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity  # -1 to 1
        subjectivity = blob.sentiment.subjectivity  # 0 to 1

        # Get ML model prediction
        if self.model:
            sentiment_pred = self.model.predict([text])[0]
            confidence = np.max(self.model.predict_proba([text])[0])
        else:
            # Fallback if model not trained
            if polarity > 0.1:
                sentiment_pred = "positive"
            elif polarity < -0.1:
                sentiment_pred = "negative"
            else:
                sentiment_pred = "neutral"
            confidence = abs(polarity)

        # Combine both approaches for final sentiment
        if sentiment_pred == "positive" and polarity > 0:
            final_sentiment = "positive"
            final_confidence = (confidence + polarity) / 2
        elif sentiment_pred == "negative" and polarity < 0:
            final_sentiment = "negative"
            final_confidence = (confidence + abs(polarity)) / 2
        else:
            final_sentiment = sentiment_pred
            final_confidence = confidence * 0.7

        # Extract key phrases
        key_phrases = self._extract_key_phrases(text)

        # Emotion detection
        emotions = self._detect_emotions(text, polarity, subjectivity)

        return {
            "text": text,
            "sentiment": final_sentiment,
            "confidence": float(final_confidence),
            "polarity": float(polarity),
            "subjectivity": float(subjectivity),
            "category": category,
            "key_phrases": key_phrases,
            "emotions": emotions,
            "timestamp": datetime.now().isoformat()
        }

    def analyze_batch(self, comments: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Analyze multiple comments and return aggregate statistics

        Args:
            comments: List of dicts with 'text' and 'category' keys

        Returns:
            Aggregate sentiment analysis
        """

        results = []
        sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
        category_sentiments = {cat: [] for cat in self.categories}
        total_polarity = 0

        for comment in comments:
            text = comment.get('text', '')
            category = comment.get('category', 'general')

            analysis = self.analyze_comment(text, category)
            results.append(analysis)

            sentiment_counts[analysis['sentiment']] += 1
            category_sentiments[category].append(analysis['sentiment'])
            total_polarity += analysis['polarity']

        # Calculate aggregate metrics
        total = len(comments)
        avg_polarity = total_polarity / total if total > 0 else 0

        # Category breakdown
        category_breakdown = {}
        for cat, sentiments in category_sentiments.items():
            if sentiments:
                category_breakdown[cat] = {
                    "positive": sentiments.count("positive"),
                    "negative": sentiments.count("negative"),
                    "neutral": sentiments.count("neutral"),
                    "total": len(sentiments)
                }

        return {
            "total_comments": total,
            "sentiment_distribution": {
                "positive": sentiment_counts["positive"],
                "negative": sentiment_counts["negative"],
                "neutral": sentiment_counts["neutral"],
                "positive_pct": round(sentiment_counts["positive"] / total * 100, 1),
                "negative_pct": round(sentiment_counts["negative"] / total * 100, 1),
                "neutral_pct": round(sentiment_counts["neutral"] / total * 100, 1)
            },
            "average_polarity": round(avg_polarity, 3),
            "overall_sentiment": "positive" if avg_polarity > 0.1 else "negative" if avg_polarity < -0.1 else "neutral",
            "category_breakdown": category_breakdown,
            "individual_results": results,
            "timestamp": datetime.now().isoformat()
        }

    def _extract_key_phrases(self, text: str) -> List[str]:
        """Extract important phrases from text"""

        blob = TextBlob(text)
        noun_phrases = list(blob.noun_phrases)

        # Get top 3 noun phrases
        return noun_phrases[:3] if noun_phrases else []

    def _detect_emotions(self, text: str, polarity: float, subjectivity: float) -> Dict[str, float]:
        """Detect emotional tone from text"""

        text_lower = text.lower()
        emotions = {}

        # Keyword-based emotion detection
        emotion_keywords = {
            'joy': ['amazing', 'love', 'awesome', 'great', 'excellent', 'best', 'wonderful', 'fantastic'],
            'anger': ['terrible', 'worst', 'hate', 'awful', 'horrible', 'disgusting', 'angry'],
            'sadness': ['disappointed', 'sad', 'unfortunate', 'poor', 'bad', 'lost'],
            'fear': ['worried', 'concerned', 'afraid', 'risky', 'dangerous', 'unsafe'],
            'surprise': ['wow', 'incredible', 'unbelievable', 'shocking', 'unexpected'],
            'trust': ['reliable', 'trustworthy', 'transparent', 'fair', 'honest']
        }

        for emotion, keywords in emotion_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                emotions[emotion] = min(score / len(keywords), 1.0)

        # Add intensity based on polarity and subjectivity
        if polarity > 0.5 and subjectivity > 0.5:
            emotions['enthusiasm'] = min((polarity + subjectivity) / 2, 1.0)
        elif polarity < -0.5 and subjectivity > 0.5:
            emotions['frustration'] = min((abs(polarity) + subjectivity) / 2, 1.0)

        return emotions

    def get_trending_topics(self, comments: List[str]) -> List[Dict[str, Any]]:
        """Extract trending topics from comments"""

        all_phrases = []
        for comment in comments:
            blob = TextBlob(comment)
            all_phrases.extend(blob.noun_phrases)

        # Count frequency
        phrase_counts = {}
        for phrase in all_phrases:
            phrase_counts[phrase] = phrase_counts.get(phrase, 0) + 1

        # Sort by frequency
        trending = sorted(phrase_counts.items(), key=lambda x: x[1], reverse=True)[:10]

        return [{"topic": topic, "mentions": count} for topic, count in trending]

    def save_model(self, filepath: str):
        """Save model to disk"""
        model_data = {
            'model': self.model,
            'training_data': self.training_data,
            'categories': self.categories
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")

    def load_model(self, filepath: str):
        """Load model from disk"""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.training_data = model_data['training_data']
        self.categories = model_data['categories']
        print(f"Model loaded from {filepath}")


# Test the sentiment analyzer
if __name__ == "__main__":
    analyzer = SentimentAnalyzer()
    analyzer.initialize_with_mock_data()

    # Test single comment
    print("\nTesting single comment analysis:")
    result = analyzer.analyze_comment(
        "This DeFi platform is absolutely amazing! Best yields I've seen!",
        category="defi"
    )
    print(f"  Sentiment: {result['sentiment']} (confidence: {result['confidence']:.2f})")
    print(f"  Polarity: {result['polarity']:.2f}, Subjectivity: {result['subjectivity']:.2f}")
    print(f"  Emotions: {result['emotions']}")

    # Test batch analysis
    print("\nTesting batch analysis:")
    mock_comments = [
        {"text": "Love this gaming platform!", "category": "gaming"},
        {"text": "NFT marketplace needs improvement", "category": "nft"},
        {"text": "Great DeFi experience overall", "category": "defi"},
        {"text": "Terrible customer support", "category": "general"},
    ]
    batch_result = analyzer.analyze_batch(mock_comments)
    print(f"  Overall sentiment: {batch_result['overall_sentiment']}")
    print(f"  Distribution: {batch_result['sentiment_distribution']}")

    # Save model
    analyzer.save_model("models/sentiment_analyzer.pkl")
