import asyncio
import json
import time
import random
# pyre-ignore[21]: Pyre cannot find libraries
import tweepy
from typing import Dict, Any, List
# pyre-ignore[21]: Pyre cannot find app modules
from app.services.thought_engine import ThoughtEngine
# pyre-ignore[21]: Pyre cannot find app modules
from app.services.scraper import ScraperService
# pyre-ignore[21]: Pyre cannot find app modules
from app.core.config import settings

# Simulation code removed as per user request.
# The system now strictly relies on X-API or Scraper data.


class TweetStreamListener(tweepy.StreamingClient):
    def __init__(self, bearer_token, thought_engine, websocket_manager, on_fatal_error=None):
        super().__init__(bearer_token)
        self.engine = thought_engine
        self.manager = websocket_manager
        self.loop = asyncio.get_event_loop()
        self.on_fatal_error = on_fatal_error

    def on_data(self, raw_data):
        data = json.loads(raw_data)
        tweet_data = data.get('data', {})
        includes = data.get('includes', {})
        users = includes.get('users', [])
        
        user = users[0] if users else {"username": "unknown", "name": "Unknown User"}
        
        metrics = tweet_data.get('public_metrics', {
            "retweet_count": 0, "reply_count": 0,
            "like_count": 0, "quote_count": 0
        })

        tweet = {
            "id": tweet_data.get('id'),
            "text": tweet_data.get('text'),
            "user": user.get('username'),
            "name": user.get('name'),
            "likes": metrics.get('like_count', 0),
            "retweets": metrics.get('retweet_count', 0),
            "replies": metrics.get('reply_count', 0),
            "timestamp": time.time()
        }

        state = self.engine.process_tweet(tweet)
        
        if state and self.manager:
            payload = {
                "tweet": tweet,
                "stats": state.get("stats", {}),
                "trending": state.get("trending", []),
                "spikes": state.get("spikes", []),
                "thoughts": state.get("thoughts", []),
                "predictions": state.get("predictions", []),
                "expressions": state.get("expressions", {}),
                "timestamp": state.get("timestamp", time.time())
            }
            asyncio.run_coroutine_threadsafe(self.manager.broadcast(payload), self.loop)

    def on_error(self, status_code):
        print(f"[X-API] Error: {status_code}")
        if status_code in [401, 402, 403]:
            print(f"[X-API] Fatal error {status_code} detected. Triggering fallback...")
            if self.on_fatal_error:
                self.on_fatal_error(status_code)
        return False

    def on_connection_error(self):
        print("[X-API] Connection Error. Reconnecting...")
        
    def on_request_error(self, status_code):
        print(f"[X-API] Request Error: {status_code}")
        if status_code == 402:
            print("[X-API] Credits Depleted (402). Switching to scraper...")
            if self.on_fatal_error:
                self.on_fatal_error(status_code)

class TwitterStream:
    def __init__(self, thought_engine: ThoughtEngine, websocket_manager=None):
        self.engine = thought_engine
        self.manager = websocket_manager
        self.client = None
        self.scraper = ScraperService()
        self.current_task = None
        self.current_query = "Trending OR Social OR Tech"
        self._sim_id_counter = 0
        self.connection_status = "initializing"
        self.processed_ids = set() # Track IDs to avoid duplicates
        try:
            self.loop = asyncio.get_event_loop()
        except RuntimeError:
            self.loop = None

    async def update_query(self, new_query: str):
        """Update the search query and restart the stream/scraper"""
        if new_query == self.current_query:
            return
            
        print(f"[STREAM] Updating query to: {new_query}")
        self.current_query = new_query
        
        # Clear old data from engine so results are fresh for the new query
        self.engine.tweet_buffer.clear()
        self.engine.hashtag_history.clear()
        self.engine.keyword_history.clear()
        self.engine.emoji_history.clear()
        self.engine.emotion_history.clear()
        self.engine.prev_hashtag_counts.clear()
        self.engine.query_mentions = 0
        
        # Stop existing stream/task
        self.stop()
        if self.current_task:
            self.current_task.cancel()
            
        # Restart with new query and deeper initial fetch
        print(f"[STREAM] Performing deep initial fetch for: {new_query}")
        self.current_task = asyncio.create_task(self.start_hybrid_ingestion(new_query))

    async def start_hybrid_ingestion(self, query: str = None):
        if query:
            self.current_query = query
        else:
            query = self.current_query

        print(f"[STREAM] Initializing X-API Real-time Stream for: {query}...")
        
        # Immediate fallback if token is empty or placeholder
        if not settings.TWITTER_BEARER_TOKEN or "PLACEHOLDER" in settings.TWITTER_BEARER_TOKEN:
            print("[WARN] Invalid X-API Token detected. Switching to Smart Fallback.")
            self.connection_status = "scraper"
            # Populate real tags initially even in fallback
            real_trends = await asyncio.to_thread(self.scraper.get_current_trends)
            if real_trends:
                self.engine.cached_global_trends = real_trends
            await self._start_scraper_stream(query)
            return

        try:
            self.client = TweetStreamListener(
                settings.TWITTER_BEARER_TOKEN, self.engine, self.manager,
                on_fatal_error=lambda code: asyncio.run_coroutine_threadsafe(
                    self.handle_fatal_x_error(code), self.loop or asyncio.get_event_loop()
                )
            )
            # Pre-fetch trends to ensure UI adapts immediately
            real_trends = await asyncio.to_thread(self.scraper.get_current_trends)
            if real_trends:
                self.engine.cached_global_trends = real_trends

            rules = self.client.get_rules()
            # pyre-ignore[16]: rules.data might be None
            if rules and rules.data:
                # pyre-ignore[16]: rules.data might be None
                self.client.delete_rules([r.id for r in rules.data])
            
            print(f"[OK] X-API Connected Successfully for: {query}")
            self.connection_status = "x-api"
            
            import threading
            stream_thread = threading.Thread(
                target=self.client.filter, 
                kwargs={"tweet_fields": ["public_metrics", "created_at"], "expansions": ["author_id"]},
                daemon=True
            )
            stream_thread.start()
            
        except Exception as e:
            await self._start_scraper_stream(query)

    async def handle_fatal_x_error(self, status_code: int):
        """Callback triggered from listener thread when X-API fails fatally"""
        print(f"[STREAM] Handling X-API fatal error {status_code}...")
        self.connection_status = "scraper"
        
        # Stop X-API client if it exists
        self.stop()
        
        # Start scraper stream if not already running a task for this
        # Note: We use the current_query
        if self.current_task:
            self.current_task.cancel()
        
        self.current_task = asyncio.create_task(self._start_scraper_stream(self.current_query))

    async def _start_scraper_stream(self, query: str):
        """
        Tries Nitter scraper first. If all instances are dead,
        falls back to generating intelligent simulated tweets
        based on the user's search query.
        """
        print(f"[SCRAPER] Fetching social data for: {query}")
        
        # Try scraper once
        scraper_works = False
        try:
            real_tweets = await asyncio.to_thread(self.scraper.get_real_tweets, query, limit=15)
            if real_tweets:
                scraper_works = True
                print(f"[OK] Scraper returned {len(real_tweets)} tweets!")
        except Exception as e:
            print(f"[WARN] Scraper failed: {e}")

        if scraper_works:
            # Use real scraper data
            await self._run_scraper_loop(query)
        else:
            # All external sources are down — Sleep and retry later
            print("[WARN] All external sources unavailable. Waiting to retry...")
            await asyncio.sleep(60)
            await self._start_scraper_stream(query)

    async def _run_scraper_loop(self, query: str):
        """Loop that uses the scraper to fetch and stream real-time enriched data."""
        while True:
            try:
                # Update status for heartbeat
                if self.manager:
                    await self.manager.broadcast({
                        "connection_status": self.connection_status,
                        "status_message": f"Analyzing signals for: {query.strip('#').split(' OR ')[0].strip()}..."
                    })
                
                real_tweets = await asyncio.to_thread(self.scraper.get_real_tweets, query, limit=15)
                if not real_tweets:
                    await asyncio.sleep(5)
                    continue

                # Process tweets one by one with 1-3s delay as requested
                for tweet in real_tweets:
                    tweet_id = tweet.get('id')
                    if tweet_id in self.processed_ids:
                        continue
                    
                    self.processed_ids.add(tweet_id)
                    if len(self.processed_ids) > 100:
                        self.processed_ids.clear()

                    # Process through Emoji-Aware Engine
                    state = self.engine.process_tweet(tweet)
                    
                    if state and self.manager:
                        # The engine has updated the 'tweet' object with the specific JSON structure requested
                        payload = {
                            "tweet": tweet, # This now contains enriched_text, categories, sentiment_score, etc.
                            "stats": state.get("stats", {}),
                            "trending": state.get("trending", []),
                            "expressions": state.get("expressions", {}),
                            "timestamp": state.get("timestamp", time.time()),
                            "connection_status": "scraper",
                            "status_message": f"Live Stream Active | {tweet.get('source', 'Social Feed')}"
                        }
                        await self.manager.broadcast(payload)
                    
                    # 1-3 second delay between posts for real-time simulation
                    await asyncio.sleep(random.uniform(1.0, 3.0))

            except asyncio.CancelledError:
                return
            except Exception as e:
                print(f"[ERROR] Scraper stream error: {e}")
                await asyncio.sleep(5)
            await asyncio.sleep(5) # Batch cooldown


    # Simulation methods removed

    def stop(self):
        if self.client:
            self.client.disconnect()

