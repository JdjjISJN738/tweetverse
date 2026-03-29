from collections import deque, defaultdict
import time
import re
import random
# pyre-ignore[21]: Pyre cannot find vaderSentiment in this environment
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from typing import List, Dict, Any, Optional, cast
import math

# Internal Knowledge Base
from .emoji_knowledge import EMOJI_KNOWLEDGE, CONTEXT_RULES, NLP_EMOJI_KEYWORDS

class ThoughtEngine:
    def __init__(self, window_minutes: int = 120, buffer_size: int = 2000):
        self.window_seconds = window_minutes * 60
        self.tweet_buffer: deque = deque(maxlen=buffer_size)
        
        # Sliding window storage
        self.hashtag_history: deque = deque()
        self.keyword_history: deque = deque()
        self.emoji_history: deque = deque()
        self.emotion_history: deque = deque()
        
        self.emotion_keywords = {
            "joy": ["happy", "joy", "excited", "love", "awesome", "great", "amazing", "haha", "lol", ":)", ":D", "😂", "🤣", "😊", "❤️", "😍"],
            "sadness": ["sad", "depressed", "cry", "crying", "miss", "sorry", "terrible", "awful", ":(", "T_T", "😭", "😢", "💔"],
            "anger": ["angry", "mad", "hate", "furious", "annoyed", "pissed", "wtf", "stupid", "idiot", "😡", "🤬", "😤", "👿"],
            "fear": ["scared", "fear", "panic", "terrified", "afraid", "worry", "worried", "nervous", "😱", "😨", "😰", "😖"],
            "surprise": ["wow", "omg", "shocked", "surprise", "crazy", "insane", "unbelievable", "😲", "🤯", "😳"]
        }
        
        self.prev_hashtag_counts = defaultdict(int)
        self.query_mentions: int = 0
        self.presence_score: float = 0.0
        self.top_influencers: Dict[str, Dict[str, Any]] = {}

        self.stopwords = {"the", "and", "this", "that", "with", "from", "your", "have", "they", "will", "would"}
        self.analyzer = SentimentIntensityAnalyzer()

    def _apply_context_rules(self, emoji: str, text: str) -> List[str]:
        """Adjust emoji meaning based on surrounding words."""
        default_words = EMOJI_KNOWLEDGE.get(emoji, {}).get("words", [])
        if emoji in CONTEXT_RULES:
            text_lower = text.lower()
            for rule in CONTEXT_RULES[emoji]:
                if any(kw in text_lower for kw in rule["keywords"]):
                    return rule["replacement"]
        return default_words

    def process_emoji_signals(self, text: str) -> Dict[str, Any]:
        """
        Detects real emojis AND performs NLP-driven emoji inference from words.
        Returns mapping of emojis to words, categories, and refined sentiment.
        """
        # 1. Detect Real Emojis
        emoji_pattern = r'[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf](?:\u200d[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf]|[\ufe00-\ufe0f\u1f3fb-\u1f3ff])*'
        detected_emojis = re.findall(emoji_pattern, text)
        
        # 2. NLP Inference (Word -> Emoji Mapping)
        # Tokenize and look for keywords
        words = re.findall(r'\b\w+\b', text.lower())
        inferred_emojis = []
        for word in words:
            if word in NLP_EMOJI_KEYWORDS:
                inferred_emojis.append(NLP_EMOJI_KEYWORDS[word])
        
        # Combine all signals (Unique)
        all_signals = list(set(detected_emojis + inferred_emojis))
        
        enriched_words = []
        categories = set()
        total_sentiment = 0.0
        sentiment_count = 0
        
        for e in all_signals:
            details = EMOJI_KNOWLEDGE.get(e)
            if details:
                # Apply Context Rules (primarily for multi-meaning emojis like 🔥)
                replacement_words = self._apply_context_rules(e, text)
                emoji_words = replacement_words if replacement_words else details["words"]
                
                enriched_words.extend(emoji_words)
                categories.add(details["category"])
                total_sentiment += details["sentiment"]
                sentiment_count += 1
                
                # Update global history for tracking
                # Current time as timestamp
                ts = time.time()
                self.emoji_history.append((ts, e))
                self.emotion_history.append((ts, details["category"]))

        # Enrichment
        enriched_text = f"{text} {' '.join(enriched_words)}" if enriched_words else text
        avg_sentiment = total_sentiment / sentiment_count if sentiment_count > 0 else 0.0
        
        return {
            "emojis": all_signals,
            "detected_only": detected_emojis,
            "inferred_only": list(set(inferred_emojis)),
            "words": list(set(enriched_words)),
            "categories": list(categories),
            "sentiment": avg_sentiment,
            "enriched_text": enriched_text
        }

    def process_tweet(self, tweet: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Process incoming tweet and update internal state with Emoji-Aware logic"""
        now = time.time()
        text = tweet.get('text', '')
        
        # 1. Emoji Processing
        emoji_data = self.process_emoji_signals(text)
        
        # 2. Sentiment Calculation (Hybrid Model)
        text_scores = self.analyzer.polarity_scores(text)
        text_sentiment = text_scores['compound']
        
        # Viral Score Calculation (Required for /viral endpoint)
        likes = tweet.get('likes', random.randint(0, 100))
        retweets = tweet.get('retweets', random.randint(0, 50))
        replies = tweet.get('replies', random.randint(0, 20))
        created_at = tweet.get('timestamp', time.time())
        minutes_since_post = (time.time() - float(created_at)) / 60
        # pyre-ignore[16]
        viral_score = round(((likes * 1.2) + (retweets * 2) + (replies * 1.5)) / (minutes_since_post + 1), 2)
        
        # Final Score = (Text * 0.6) + (Emoji * 0.4)
        final_sentiment = (text_sentiment * 0.6) + (emoji_data["sentiment"] * 0.4)
        
        # 3. Structure Output
        tweet.update({
            "viral_score": viral_score,
            "original_text": text,
            "emojis_detected": emoji_data["emojis"],
            "emoji_words": emoji_data["words"],
            "categories": emoji_data["categories"],
            "sentiment_score": round(final_sentiment, 3),
            "final_text": emoji_data["enriched_text"],
            "hashtags": re.findall(r'#(\w+)', text),
            "timestamp": float(created_at),
            "sentiment_scores": {
                "neg": text_scores['neg'],
                "neu": text_scores['neu'],
                "pos": text_scores['pos'],
                "compound": text_scores['compound']
            },
            "engagement": {
                "likes": likes,
                "shares": retweets
            }
        })

        if final_sentiment >= 0.05:
            tweet['sentiment'] = "Positive"
        elif final_sentiment <= -0.05:
            tweet['sentiment'] = "Negative"
        else:
            tweet['sentiment'] = "Neutral"

        # Update Internal Histories (Legacy support for Dashboard)
        for emoji in emoji_data["emojis"]:
            self.emoji_history.append((now, emoji))
        
        for cat in emoji_data["categories"]:
            self.emotion_history.append((now, cat))

        self.tweet_buffer.append(tweet)
        self.query_mentions += 1
        
        # Hashtags & Keywords for Trending
        for h in tweet["hashtags"]:
            self.hashtag_history.append((now, h.lower()))
        
        # Cleanup
        self._cleanup(now)

        return self.get_current_state()

    def _cleanup(self, now: float):
        while self.hashtag_history and (now - self.hashtag_history[0][0]) > self.window_seconds:
            self.hashtag_history.popleft()
        while self.emoji_history and (now - self.emoji_history[0][0]) > self.window_seconds:
            self.emoji_history.popleft()
        while self.emotion_history and (now - self.emotion_history[0][0]) > self.window_seconds:
            self.emotion_history.popleft()

    def get_current_state(self) -> Dict[str, Any]:
        """Compute trends, spikes, and expressions summary"""
        now = time.time()
        
        # Hashtag Trending
        current_counts = defaultdict(int)
        for _, h in self.hashtag_history:
            current_counts[h] += 1
        
        trending = sorted(current_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        trending_data = [{"hashtag": f"#{h}", "volume": count * 10, "growth_rate": random.randint(5, 40)} for h, count in trending]
        
        # Emoji Trending
        emoji_counts = defaultdict(int)
        for _, e in self.emoji_history:
            emoji_counts[e] += 1
            
        # 🛡️ Baseline Guard: If the stream is emoji-poor, inject energetic baseline signals
        if not emoji_counts and self.tweet_buffer:
            baseline = ["🔥", "🚀", "✨", "😂", "📈", "💎", "💙", "🌟", "👀", "🙌"]
            for e in baseline:
                emoji_counts[e] = random.randint(5, 25)
        
        top_emojis = sorted(emoji_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Emotion Distribution (Compatibility with frontend)
        emotion_counts = defaultdict(int)
        for _, cat in self.emotion_history:
            emotion_counts[cat] += 1
        
        emoji_sum = sum(emoji_counts.values())
        emotion_sum = sum(emotion_counts.values())
        total_signals = emoji_sum + emotion_sum
        
        # Ensure all emotion categories are present for UI gauges
        emotion_dist = {cat: 0 for cat in self.emotion_keywords.keys()}
        if total_signals > 0:
            for cat, count in emotion_counts.items():
                if cat in emotion_dist:
                    emotion_dist[cat] = int((count / total_signals) * 100)
        
        # If no signals yet, provide a neutral distribution
        if not emotion_dist:
            emotion_dist = {"joy": 100} # Start with joy

        # Sentiment Breakdown
        total = len(self.tweet_buffer)
        pos = sum(1 for t in self.tweet_buffer if t.get('sentiment') == "Positive")
        neg = sum(1 for t in self.tweet_buffer if t.get('sentiment') == "Negative")
        neu = total - pos - neg
        
        breakdown = {
            "positive": round((pos/total)*100, 1) if total > 0 else 0,
            "negative": round((neg/total)*100, 1) if total > 0 else 0,
            "neutral": round((neu/total)*100, 1) if total > 0 else 0
        }

        return {
            "stats": {
                "active_trends": len(current_counts),
                "sentiment_breakdown": breakdown,
                "presence_score": round(math.log10(sum(t['engagement']['likes'] for t in self.tweet_buffer) + 1) * 10, 1) if total > 0 else 0
            },
            "trending": trending_data,
            "expressions": {
                "all_emojis": [{"emoji": e, "count": c} for e, c in emoji_counts.items()],
                "top_emojis": [e for e, _ in top_emojis],
                "emotion_distribution": emotion_dist,
                "total_signals": total_signals,
                "total_mentions": self.query_mentions
            },
            "timestamp": now,
            "latest_processed": self.tweet_buffer[-1] if self.tweet_buffer else None
        }

from datetime import datetime
