"""
Data Fetcher - Connects to Lumeris Backend API
Fetches real data from the backend instead of using mock data
"""

import requests
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)


class BackendDataFetcher:
    """Fetches data from the Lumeris backend API"""

    def __init__(self, backend_url: str = "http://localhost:3001"):
        self.backend_url = backend_url
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json"
        })

    def _make_request(self, endpoint: str) -> Optional[Dict[str, Any]]:
        """Make a GET request to the backend API"""
        try:
            url = f"{self.backend_url}{endpoint}"
            response = self.session.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()

            if data.get("success"):
                return data.get("data")
            else:
                logger.error(f"API returned error for {endpoint}: {data}")
                return None

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch {endpoint}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching {endpoint}: {e}")
            return None

    def get_games(self) -> List[Dict[str, Any]]:
        """Fetch all games from backend"""
        data = self._make_request("/api/gaming/games")
        return data if data else []

    def get_game_by_id(self, game_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a specific game by ID"""
        return self._make_request(f"/api/gaming/games/{game_id}")

    def get_gaming_leaderboard(self) -> List[Dict[str, Any]]:
        """Fetch gaming leaderboard"""
        data = self._make_request("/api/gaming/leaderboard")
        return data if data else []

    def get_user_stats(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Fetch user gaming statistics"""
        return self._make_request(f"/api/gaming/user/{user_id}/stats")

    def get_defi_pools(self) -> List[Dict[str, Any]]:
        """Fetch all DeFi pools from backend"""
        data = self._make_request("/api/defi/pools")
        return data if data else []

    def get_defi_pool_by_id(self, pool_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a specific DeFi pool by ID"""
        return self._make_request(f"/api/defi/pools/{pool_id}")

    def get_pool_analytics(self, pool_id: str) -> Optional[Dict[str, Any]]:
        """Fetch pool analytics data"""
        return self._make_request(f"/api/defi/pools/{pool_id}/analytics")

    def get_transactions(self) -> List[Dict[str, Any]]:
        """Fetch recent transactions"""
        data = self._make_request("/api/user/transactions")
        return data if data else []

    def get_users(self) -> List[Dict[str, Any]]:
        """Fetch all users"""
        data = self._make_request("/api/user/users")
        return data if data else []

    def health_check(self) -> bool:
        """Check if backend is reachable"""
        try:
            response = self.session.get(f"{self.backend_url}/health", timeout=3)
            return response.status_code == 200
        except:
            return False


# Singleton instance
_fetcher_instance = None


def get_data_fetcher(backend_url: str = "http://localhost:3001") -> BackendDataFetcher:
    """Get or create the data fetcher singleton"""
    global _fetcher_instance
    if _fetcher_instance is None:
        _fetcher_instance = BackendDataFetcher(backend_url)
    return _fetcher_instance
