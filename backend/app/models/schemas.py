from pydantic import BaseModel
from typing import List, Dict, Optional, Any, Union

class SentimentScores(BaseModel):
    neg: float
    neu: float
    pos: float
    compound: float

class Tweet(BaseModel):
    id: Union[int, str]
    text: str
    likes: int = 0
    retweets: int = 0
    replies: int = 0
    viral_score: float = 0.0
    sentiment: Optional[str] = None
    sentiment_scores: Optional[SentimentScores] = None
    user: Optional[str] = None
    name: Optional[str] = None
    timestamp: Optional[float] = None
    simulated: Optional[bool] = None
    # Predictive insights (optional, added by scraper)
    viral_velocity: Optional[float] = None
    predicted_reach: Optional[int] = None
    growth_probability: Optional[str] = None
    prediction_reason: Optional[str] = None
    url: Optional[str] = None
    quotes: Optional[int] = None

    class Config:
        extra = "allow"

class HashtagTrend(BaseModel):
    hashtag: str
    volume: int
    growth_rate: float

class SentimentBreakdown(BaseModel):
    positive: float
    neutral: float
    negative: float

class SentimentResponse(BaseModel):
    hashtag: str
    sentiment: SentimentBreakdown

class InsightResponse(BaseModel):
    top_keywords: List[str]
    public_mood: str
    thought_mining: str
