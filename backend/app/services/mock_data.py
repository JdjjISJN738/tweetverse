from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import random

analyzer = SentimentIntensityAnalyzer()

def get_sentiment_label(score: float):
    if score >= 0.05:
        return "Positive"
    elif score <= -0.05:
        return "Negative"
    return "Neutral"

def generate_mock_tweets(hashtag: str, count: int = 10):
    if not hashtag.startswith("#"):
        hashtag = f"#{hashtag}"
        
    sentiments = [
        "I love the new {hashtag} features!", 
        "{hashtag} is taking over everything.", 
        "Not sure about this {hashtag} trend...", 
        "The future is definitely {hashtag}.", 
        "{hashtag} is overrated, but interesting.",
        "Can't wait to see what's next for {hashtag}!",
        "Why is everyone talking about {hashtag} suddenly?"
    ]
    
    tweets = []
    for i in range(count):
        template = random.choice(sentiments)
        text = template.format(hashtag=hashtag)
        likes = random.randint(10, 1000)
        retweets = random.randint(5, 500)
        replies = random.randint(2, 200)
        viral_score = (likes * 0.4) + (retweets * 0.4) + (replies * 0.2)
        
        score = analyzer.polarity_scores(text)
        sentiment_label = get_sentiment_label(score['compound'])

        tweets.append({
            "id": i,
            "text": text,
            "likes": likes,
            "retweets": retweets,
            "replies": replies,
            "viral_score": round(viral_score, 2),
            "sentiment": sentiment_label,
            "sentiment_scores": score
        })
    return tweets

def get_insights_data(hashtag: str):
    display_hashtag = hashtag if hashtag.startswith("#") else f"#{hashtag}"
    lookup_hashtag = display_hashtag.lower().replace("#", "")
    
    insights_db = {
        "ai": {
            "top_keywords": ["automation", "future", "jobs", "efficiency", "robotics"],
            "public_mood": "Optimistic with concerns about workforce displacement",
            "thought_mining": "People are excited about AI's potential in healthcare but worried about privacy and job security."
        },
        "tech": {
            "top_keywords": ["gadgets", "innovation", "silicon valley", "startups", "software"],
            "public_mood": "Curious and fast-paced",
            "thought_mining": "High interest in sustainable tech and next-gen mobile devices."
        },
        "programming": {
            "top_keywords": ["python", "javascript", "coding", "debugging", "developer"],
            "public_mood": "Determined and collaborative",
            "thought_mining": "Developers are focusing more on full-stack frameworks and AI-assisted coding tools."
        }
    }
    
    default_insight = {
        "top_keywords": ["trending", "viral", "popular", "discussion", "update"],
        "public_mood": "Highly engaged",
        "thought_mining": f"The conversation around {display_hashtag} is growing rapidly with diverse opinions across different regions."
    }
    
    return insights_db.get(lookup_hashtag, default_insight)
