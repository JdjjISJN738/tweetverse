EMOJI_KNOWLEDGE = {
    # Emotion
    "😂": {"words": ["funny", "laugh", "joke", "lol", "hilarious"], "category": "emotion", "sentiment": 0.8},
    "😊": {"words": ["happy", "smile", "content", "joy", "cheerful"], "category": "emotion", "sentiment": 0.7},
    "😭": {"words": ["sad", "cry", "upset", "tearful", "depressed"], "category": "emotion", "sentiment": -0.8},
    "😡": {"words": ["angry", "rage", "mad", "furious", "annoyed"], "category": "emotion", "sentiment": -0.9},
    "😱": {"words": ["wow", "shocked", "surprise", "scared", "omg"], "category": "emotion", "sentiment": -0.2},
    "😲": {"words": ["stunned", "shocked", "amazed", "wow", "unbelievable"], "category": "emotion", "sentiment": 0.1},
    "😢": {"words": ["sad", "unhappy", "cry", "pout", "gloomy"], "category": "emotion", "sentiment": -0.7},
    "🤢": {"words": ["gross", "sick", "disgusting", "nauseous", "ew"], "category": "emotion", "sentiment": -0.8},
    
    # Love
    "❤️": {"words": ["love", "affection", "heart", "like", "passion"], "category": "love", "sentiment": 1.0},
    "😍": {"words": ["love", "crush", "adoration", "heart eyes", "amazing"], "category": "love", "sentiment": 0.9},
    "😘": {"words": ["kiss", "love", "smooch", "affection", "romantic"], "category": "love", "sentiment": 0.9},
    "💖": {"words": ["sparkle", "love", "cute", "affection", "sweet"], "category": "love", "sentiment": 0.9},
    "💔": {"words": ["heartbreak", "sad", "pain", "broken", "unhappy"], "category": "love", "sentiment": -0.9},
    
    # Gesture
    "👍": {"words": ["good", "yes", "agree", "correct", "approve"], "category": "gesture", "sentiment": 0.7},
    "👎": {"words": ["bad", "no", "disagree", "wrong", "disapprove"], "category": "gesture", "sentiment": -0.7},
    "🙌": {"words": ["celebrate", "praise", "yay", "success", "hands up"], "category": "gesture", "sentiment": 0.8},
    "🙏": {"words": ["please", "thank you", "pray", "grateful", "hope"], "category": "gesture", "sentiment": 0.5},
    "👊": {"words": ["bro", "cool", "fist bump", "together", "strong"], "category": "gesture", "sentiment": 0.6},
    "✌️": {"words": ["peace", "v", "victory", "cool", "bye"], "category": "gesture", "sentiment": 0.6},
    
    # Trend
    "🔥": {"words": ["trending", "hot", "viral", "amazing", "lit"], "category": "trend", "sentiment": 0.9},
    "🚀": {"words": ["moon", "launch", "success", "growth", "upward"], "category": "trend", "sentiment": 0.8},
    "📈": {"words": ["growth", "increase", "upward", "bullish", "profit"], "category": "trend", "sentiment": 0.7},
    "📉": {"words": ["decline", "downward", "loss", "bearish", "fall"], "category": "trend", "sentiment": -0.7},
    "💎": {"words": ["rare", "gem", "valuable", "pure", "special"], "category": "trend", "sentiment": 0.8},
    "💯": {"words": ["perfect", "real", "truth", "absolute", "best"], "category": "trend", "sentiment": 0.9},
    
    # Food
    "🍕": {"words": ["pizza", "food", "dinner", "delicious", "cheese"], "category": "food", "sentiment": 0.6},
    "🍔": {"words": ["burger", "food", "lunch", "yummy", "fast food"], "category": "food", "sentiment": 0.5},
    "🥑": {"words": ["avocado", "healthy", "food", "vegan", "green"], "category": "food", "sentiment": 0.6},
    "🍦": {"words": ["ice cream", "dessert", "sweet", "cold", "treat"], "category": "food", "sentiment": 0.7},
    "🍷": {"words": ["wine", "drink", "celebrate", "night", "classy"], "category": "food", "sentiment": 0.6},
    
    # Activity
    "🎮": {"words": ["gaming", "play", "fun", "video games", "controller"], "category": "activity", "sentiment": 0.7},
    "⚽": {"words": ["soccer", "sports", "game", "match", "play"], "category": "activity", "sentiment": 0.6},
    "🎨": {"words": ["art", "creative", "design", "painting", "craft"], "category": "activity", "sentiment": 0.7},
    "🎬": {"words": ["movie", "film", "cinema", "show", "acting"], "category": "activity", "sentiment": 0.6},
    "🎧": {"words": ["music", "listening", "songs", "audio", "headphones"], "category": "activity", "sentiment": 0.7},
    
    # Travel
    "✈️": {"words": ["travel", "flight", "vacation", "trip", "holiday"], "category": "travel", "sentiment": 0.8},
    "🏝️": {"words": ["beach", "island", "vacation", "tropical", "paradise"], "category": "travel", "sentiment": 0.9},
    "🏔️": {"words": ["mountain", "snow", "hiking", "adventure", "climb"], "category": "travel", "sentiment": 0.7},
    "🚗": {"words": ["car", "road trip", "drive", "travel", "ride"], "category": "travel", "sentiment": 0.5},
    "🗺️": {"words": ["map", "explore", "travel", "location", "plan"], "category": "travel", "sentiment": 0.6},
    
    # Object
    "💻": {"words": ["laptop", "computer", "tech", "work", "coding"], "category": "object", "sentiment": 0.5},
    "📱": {"words": ["phone", "mobile", "tech", "device", "call"], "category": "object", "sentiment": 0.4},
    "💡": {"words": ["idea", "smart", "bright", "innovation", "light"], "category": "object", "sentiment": 0.8},
    "🎁": {"words": ["gift", "present", "surprise", "birthday", "treat"], "category": "object", "sentiment": 0.9},
    "📸": {"words": ["photo", "camera", "picture", "moment", "capture"], "category": "object", "sentiment": 0.6},
    "📦": {"words": ["box", "delivery", "shipping", "order", "package"], "category": "object", "sentiment": 0.3},
    
    # Weather
    "☀️": {"words": ["sunny", "hot", "warm", "summer", "bright"], "category": "weather", "sentiment": 0.8},
    "❄️": {"words": ["cold", "snow", "winter", "ice", "freezing"], "category": "weather", "sentiment": 0.4},
    "⛈️": {"words": ["storm", "rain", "thunder", "bad weather", "lightning"], "category": "weather", "sentiment": -0.6},
    "☁️": {"words": ["cloudy", "grey", "overcast", "dull", "so-so"], "category": "weather", "sentiment": 0.1},
    "🌈": {"words": ["rainbow", "beautiful", "diversity", "pride", "color"], "category": "weather", "sentiment": 0.9},
    
    # Business
    "💼": {"words": ["business", "work", "professional", "office", "career"], "category": "business", "sentiment": 0.4},
    "📊": {"words": ["chart", "data", "report", "stats", "analysis"], "category": "business", "sentiment": 0.5},
    "💰": {"words": ["money", "rich", "profit", "cash", "wealth"], "category": "business", "sentiment": 0.8},
    "🤝": {"words": ["deal", "partnership", "agreement", "shake hands", "together"], "category": "business", "sentiment": 0.8},
    "🏢": {"words": ["company", "building", "corporate", "office", "work"], "category": "business", "sentiment": 0.3},
}

# NLP Mapping: Key words to emojis for sentiment inference
NLP_EMOJI_KEYWORDS = {
    # Emotion
    "happy": "😊", "joy": "😂", "glad": "😊", "sad": "😢", "cry": "😭", 
    "angry": "😡", "mad": "💢", "hate": "😠", "curious": "🧐", "excited": "🤩",
    # Love/Social
    "love": "❤️", "kiss": "😘", "heart": "💖", "friend": "🤝", "together": "👨‍👩‍👧‍👦",
    # Trend/Business
    "viral": "🔥", "trending": "📈", "boom": "💥", "rich": "💰", "expensive": "💎",
    "success": "🏆", "win": "🥇", "growth": "🚀", "moon": "🌕", "bullish": "📈",
    # Tech/AI
    "ai": "🤖", "robot": "🤖", "data": "📊", "future": "🚀", "web": "🌐", 
    "crypto": "🚀", "bitcoin": "🪙", "code": "💻", "smart": "🧠",
    # Nature/Weather
    "beach": "🏝️", "sun": "☀️", "hot": "🔥", "cold": "❄️", "rain": "🌧️",
    # Verification/Status
    "good": "👍", "bad": "👎", "yes": "✅", "no": "❌", "done": "✔️",
    "wait": "⏳", "alert": "⚠️", "help": "🆘", "new": "🆕", "cool": "😎"
}

CONTEXT_RULES = {
    "🔥": [
        {"keywords": ["weather", "sun", "hot", "outside", "today"], "replacement": ["hot", "sunny", "burning"]},
        {"keywords": ["song", "movie", "post", "crypto", "ai", "trend"], "replacement": ["trending", "viral", "amazing"]}
    ]
}
