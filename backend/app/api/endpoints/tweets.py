# pyre-ignore[21]
from fastapi import APIRouter, Query, Request
from typing import List
# pyre-ignore[21]
from app.models.schemas import HashtagTrend, Tweet, SentimentResponse, InsightResponse
# pyre-ignore[21]
import random
import uuid

router = APIRouter()

# ─── Helper: ensure every outgoing record has an 'id' ────────────────────────
def _sanitize(tweets: list) -> list:
    """Inject a unique id into any record that lacks one, preventing ResponseValidationError."""
    out = []
    for i, t in enumerate(tweets):
        record = dict(t)
        if not record.get("id"):
            record["id"] = f"archive_{uuid.uuid4().hex[:12]}"
        out.append(record)
    return out

@router.get("/stats")
def get_global_stats(request: Request):
    engine = request.app.state.thought_engine
    return engine.get_current_state()

from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str

@router.post("/search")
async def update_search_query(request: Request, body: SearchRequest):
    """
    Update the global stream search query.
    This triggers the scraper/stream to focus on the new topic.
    """
    twitter_stream = request.app.state.twitter_stream
    await twitter_stream.update_query(body.query)
    return {"status": "success", "query": body.query}

@router.get("/trending", response_model=List[HashtagTrend])
def get_trending(request: Request):
    engine = request.app.state.thought_engine
    state = engine.get_current_state()
    if state["trending"]:
        return [HashtagTrend(hashtag=t["hashtag"], volume=t["volume"], growth_rate=t["growth_rate"]) for t in state["trending"]]
    
    if hasattr(engine, 'cached_global_trends') and engine.cached_global_trends:
        return [HashtagTrend(hashtag=t, volume=0, growth_rate=0.0) for t in engine.cached_global_trends[:10]]

    return []

@router.get("/tweets", response_model=List[Tweet])
def get_tweets(request: Request, hashtag: str = Query(..., description="Hashtag to search for")):
    engine = request.app.state.thought_engine
    real_tweets = [t for t in list(engine.tweet_buffer) if hashtag.lower().replace("#", "") in t['text'].lower()]
    if real_tweets:
        return _sanitize(real_tweets[:10])
    return []

@router.get("/sentiment", response_model=SentimentResponse)
def analyze_sentiment(request: Request, hashtag: str = Query(..., description="Hashtag to analyze")):
    engine = request.app.state.thought_engine
    tweets = [t for t in list(engine.tweet_buffer) if hashtag.lower().replace("#", "") in t['text'].lower()]
    
    if not tweets:
        return {
            "hashtag": hashtag,
            "sentiment": {"positive": 0.0, "neutral": 100.0, "negative": 0.0}
        }

    pos = len([t for t in tweets if t['sentiment'] == "Positive"])
    neu = len([t for t in tweets if t['sentiment'] == "Neutral"])
    neg = len([t for t in tweets if t['sentiment'] == "Negative"])
    total = len(tweets)
    
    return {
        "hashtag": hashtag,
        "sentiment": {
            # pyre-ignore[6]
            "positive": round((pos/total) * 100, 1),
            # pyre-ignore[6]
            "neutral": round((neu/total) * 100, 1),
            # pyre-ignore[6]
            "negative": round((neg/total) * 100, 1)
        }
    }

@router.get("/viral", response_model=List[Tweet])
def get_viral_tweets(request: Request):
    engine = request.app.state.thought_engine
    tweets = list(engine.tweet_buffer)
    if tweets:
        sorted_tweets = sorted(tweets, key=lambda x: x.get('viral_score', 0), reverse=True)
        return _sanitize(sorted_tweets[:5])
    return []

@router.get("/insights", response_model=InsightResponse)
def get_insights(request: Request, hashtag: str = Query(..., description="Hashtag for insights")):
    engine = request.app.state.thought_engine
    state = engine.get_current_state()
    
    thoughts = state["thoughts"]
    if thoughts:
        return InsightResponse(
            top_keywords=thoughts[:5],
            public_mood=f"Highly active discussions around {', '.join(thoughts[:3])}",
            thought_mining=f"The current stream analysis for {hashtag} reveals a strong focus on {thoughts[0] if thoughts else 'innovation'}."
        )

    return InsightResponse(
        top_keywords=["trending", "active", "realtime"],
        public_mood="Scanning stream...",
        thought_mining="Waiting for live data from X-API to generate deep insights."
    )
