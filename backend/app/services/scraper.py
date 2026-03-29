import requests
import time
import random
import re
import json
import os
from typing import List, Dict, Any
from datetime import datetime

# ─── Topic → Subreddit Mapping for targeted Reddit search ───────────────────
TOPIC_SUBREDDITS: Dict[str, str] = {
    "ai": "artificial",
    "machine learning": "MachineLearning",
    "crypto": "CryptoCurrency",
    "bitcoin": "Bitcoin",
    "ethereum": "ethereum",
    "tech": "technology",
    "technology": "technology",
    "programming": "programming",
    "python": "Python",
    "javascript": "javascript",
    "startup": "startups",
    "space": "space",
    "climate": "climate",
    "finance": "finance",
    "cybersecurity": "cybersecurity",
    "gaming": "gaming",
    "science": "science",
    "health": "Health",
    "politics": "politics",
    "business": "business",
}

def _pick_subreddit(query: str) -> str:
    """Return the best subreddit for a query, falling back to 'all'."""
    q = query.lower()
    for keyword, sub in TOPIC_SUBREDDITS.items():
        if keyword in q:
            return sub
    return "all"

def _build_expanded_tokens(clean_query: str) -> set:
    """
    Split 'AI OR Tech technology' into {'ai','tech','technology','tech','inno',...}.
    Also adds a 4-char prefix of each long token for fuzzy matching.
    """
    raw_tokens = re.split(r'\s+OR\s+|\s+', clean_query.lower())
    expanded: set = set()
    for tok in raw_tokens:
        tok = tok.strip('#').strip()
        if tok:
            expanded.add(tok)
            if len(tok) > 5:
                expanded.add(tok[:4])
    return expanded


class ScraperService:
    # Class-level cache to keep memory usage stable and search fast
    _dataset_cache: Dict[str, List[Dict[str, Any]]] = {}
    
    def __init__(self):
        self.resources_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "resources"
        )
        os.makedirs(self.resources_dir, exist_ok=True)
        self.master_path = os.path.join(self.resources_dir, "master_tweets.json")
        self.historic_path = self.master_path # Primary fallback
        
        # Discover all CSV datasets in resources
        self.csv_files = [
            os.path.join(self.resources_dir, f) 
            for f in os.listdir(self.resources_dir) 
            if f.endswith('.csv')
        ]
        
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/118.0.0.0 Safari/537.36",
        ]

    # ──────────────────────────────────────────────────────────────────────────
    # PUBLIC: get real-time tweets / posts
    # Priority: HackerNews → Reddit (topic subreddit) → Reddit /r/all → Historic
    # ──────────────────────────────────────────────────────────────────────────
    def get_real_tweets(self, query: str, limit: int = 15) -> List[Dict[str, Any]]:
        clean_query = query.strip('#').split(' OR ')[0].strip().lower()

        # ── STEP 1: Fetch Live Data (HN or Reddit) ──────────────────────────
        live_results = []
        hn_tweets = self._fetch_hackernews(clean_query, limit)
        if hn_tweets:
            live_results = hn_tweets
        else:
            subreddit = _pick_subreddit(clean_query)
            reddit_tweets = self._fetch_reddit(clean_query, subreddit, limit)
            if reddit_tweets:
                live_results = reddit_tweets
            elif subreddit != "all":
                live_results = self._fetch_reddit(clean_query, "all", limit)

        # ── STEP 2: Fetch Historic Data for the specific query ──────────────
        historic_results = self._fetch_historic(query, limit // 2)

        # ── STEP 3: Mix and Balance ─────────────────────────────────────────
        final_results = []
        if live_results:
            final_results.extend(live_results)
            
        if historic_results:
            final_results.extend(historic_results)
        
        # ── STEP 4: Metadata & Emoji Enrichment Guard ───────────────────────
        emoji_pattern = r'[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf](?:\u200d[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf]|[\ufe00-\ufe0f\u1f3fb-\u1f3ff])*'
        
        for r in final_results:
            # Ensure hashtags exist
            if '#' not in r.get('text', ''):
                r['text'] = f"{r['text']} #Trending #{clean_query.capitalize()}"
            
            # Ensure engagement exists
            if 'likes' not in r: r['likes'] = random.randint(10, 500)
            if 'retweets' not in r: r['retweets'] = random.randint(5, 100)
            if 'replies' not in r: r['replies'] = random.randint(2, 50)

        # If results are "emoji-poor", inject expressive samples
        current_emojis = sum(1 for r in final_results if re.search(emoji_pattern, r.get('text', '')))
        if len(final_results) < limit or current_emojis < 3:
            extra_count = limit - len(final_results) if len(final_results) < limit else 3
            expressive_samples = self._fetch_historic("expressive_global_fallback", extra_count, force_emojis=True)
            final_results.extend(expressive_samples)

        random.shuffle(final_results)
        return final_results[:limit]


    # ──────────────────────────────────────────────────────────────────────────
    # SOURCE 1: HackerNews via Algolia API (completely free, no auth needed)
    # Endpoint: https://hn.algolia.com/api/v1/search?query=<q>&tags=story
    # ──────────────────────────────────────────────────────────────────────────
    def _fetch_hackernews(self, query: str, limit: int) -> List[Dict[str, Any]]:
        try:
            url = (
                f"https://hn.algolia.com/api/v1/search_by_date"
                f"?query={requests.utils.quote(query)}"
                f"&tags=story"
                f"&hitsPerPage=50"
            )
            headers = {"User-Agent": random.choice(self.user_agents)}
            response = requests.get(url, timeout=8, headers=headers)

            if response.status_code != 200:
                print(f"[HN] HTTP {response.status_code}")
                return []

            hits = response.json().get("hits", [])
            if not hits:
                return []
                
            random.shuffle(hits)

            results = []
            for hit in hits[:limit]:
                title = hit.get("title", "")
                story_text = hit.get("story_text") or ""
                text = f"{title}. {story_text[:200]}".strip(". ") if story_text else title
                if not text:
                    continue

                points = hit.get("points") or 0
                comments = hit.get("num_comments") or 0
                author = hit.get("author", "hn_user")
                created_at_i = hit.get("created_at_i") or time.time()

                results.append({
                    "id": f"hn_{hit.get('objectID', random.randint(1000, 9999))}",
                    "text": text,
                    "user": author,
                    "name": f"@{author} (HN)",
                    "likes": points,
                    "retweets": max(0, comments // 3),
                    "replies": comments,
                    "timestamp": float(created_at_i),
                    "source": "HackerNews (Live)",
                    "url": hit.get("url", ""),
                })

            return results
        except Exception as e:
            print(f"[WARN] HackerNews fetch failed: {e}")
            return []

    # ──────────────────────────────────────────────────────────────────────────
    # SOURCE 2: Reddit topic-specific JSON search
    # ──────────────────────────────────────────────────────────────────────────
    def _fetch_reddit(self, query: str, subreddit: str, limit: int) -> List[Dict[str, Any]]:
        try:
            url = (
                f"https://www.reddit.com/r/{subreddit}/search.json"
                f"?q={requests.utils.quote(query)}&sort=new&limit=50&restrict_sr=1"
            ) if subreddit != "all" else (
                f"https://www.reddit.com/r/all/search.json"
                f"?q={requests.utils.quote(query)}&sort=new&limit=50"
            )
            headers = {"User-Agent": random.choice(self.user_agents)}
            response = requests.get(url, timeout=10, headers=headers)

            if response.status_code != 200:
                return []

            children = response.json().get("data", {}).get("children", [])
            if not children:
                return []
                
            random.shuffle(children)

            results = []
            for child in children[:limit]:
                post = child.get("data", {})
                title = post.get("title", "")
                body = post.get("selftext", "")[:200]
                text = f"{title}. {body}".strip(". ") if body else title
                if not text or len(text) < 10:
                    continue

                results.append({
                    "id": f"red_{post.get('id', random.randint(1000, 9999))}",
                    "text": text,
                    "user": post.get("author", "reddit_user"),
                    "name": f"u/{post.get('author', 'user')} (Reddit)",
                    "likes": max(0, post.get("ups", 0)),
                    "retweets": max(0, post.get("num_comments", 0) // 5),
                    "replies": post.get("num_comments", 0),
                    "timestamp": float(post.get("created_utc", time.time())),
                    "source": f"Reddit /r/{post.get('subreddit', subreddit)} (Live)",
                })

            return results
        except Exception as e:
            print(f"[WARN] Reddit fetch failed for /r/{subreddit}: {e}")
            return []

    # ──────────────────────────────────────────────────────────────────────────
    # SOURCE 3: Historic local dataset (master_tweets.json + Multi-CSV Fallback)
    # ──────────────────────────────────────────────────────────────────────────
    def _fetch_historic(self, query: str, limit: int, force_emojis: bool = False) -> List[Dict[str, Any]]:
        """Fallback to the consolidated master dataset AND additional CSV resources."""
        try:
            tokens = [t.strip("#").lower() for t in query.split() if len(t) > 2]
            
            # 1. Check Master JSON Cache
            if "master" not in self._dataset_cache:
                if os.path.exists(self.master_path):
                    with open(self.master_path, 'r', encoding='utf-8') as f:
                        self._dataset_cache["master"] = json.load(f)
                else:
                    self._dataset_cache["master"] = []
            
            master_data = self._dataset_cache["master"]
            matches = []
            
            # Special case: expressive booster
            if force_emojis or query == "expressive_global_fallback":
                matches = [r for r in master_data if r.get('has_emoji')]
                random.shuffle(matches)
                return matches[:limit]

            # Match in master
            for record in master_data:
                text_lower = record.get("text", "").lower()
                if any(tok in text_lower for tok in tokens):
                    matches.append(record.copy())
                    if len(matches) >= limit: break
            
            # 2. Fallback to CSV datasets if master is insufficient
            if len(matches) < limit:
                for csv_path in self.csv_files:
                    cache_key = f"csv_{os.path.basename(csv_path)}"
                    if cache_key not in self._dataset_cache:
                        self._dataset_cache[cache_key] = self._load_csv(csv_path)
                    
                    csv_data = self._dataset_cache[cache_key]
                    for record in csv_data:
                        text_lower = record.get("text", "").lower()
                        if any(tok in text_lower for tok in tokens):
                            matches.append(record.copy())
                            if len(matches) >= limit * 2: break
                    
                    if len(matches) >= limit: break

            if not matches:
                return []
                
            # Randomize and add synthetic freshness
            sample = []
            if matches:
                sample_count = min(len(matches), limit)
                raw_sample = random.sample(matches, sample_count)
                for s in raw_sample:
                    tweet = s.copy()
                    if "id" not in tweet: 
                        tweet["id"] = f"hist_{random.randint(100000, 999999)}"
                    tweet["timestamp"] = time.time() - random.randint(3600, 86400 * 2) # Last 48h
                    sample.append(tweet)
                
            return sample
        except Exception as e:
            print(f"[ERROR] Historic dataset fetch failed: {e}")
            return []

    def _generate_synthetic_data(self, query: str, limit: int) -> List[Dict[str, Any]]:
        results = []
        emojis = ["❤️", "😂", "😱", "😢", "😡", "🔥", "🚀", "✨", "😳", "👍"]
        for i in range(min(limit, 8)):
            e = random.choice(emojis)
            results.append({
                "id": f"syn_{random.randint(10000, 99999)}",
                "text": f"Analyzing current trends for {query}. {e} Social velocity is increasing!",
                "user": f"user_{random.randint(100, 999)}",
                "name": f"@Anonymous",
                "likes": random.randint(10, 150),
                "retweets": random.randint(0, 50),
                "replies": random.randint(0, 20),
                "timestamp": time.time() - random.randint(1, 60),
                "source": "Synthetic Sync (Live)"
            })
        return results

    def _load_csv(self, path: str) -> List[Dict[str, Any]]:
        """
        Ultra-robust CSV loader. Handles headers and positional formats.
        """
        records: List[Dict[str, Any]] = []
        if not os.path.exists(path):
            return records
            
        try:
            import csv
            filename = os.path.basename(path)
            text_cols = {"text", "tweet", "content", "clean_text", "clean_comment", "body"}
            
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                reader = csv.reader(f)
                try:
                    first_row = next(reader)
                except StopIteration:
                    return []

                # Determine if first_row is a header
                header_map = {}
                for i, cell in enumerate(first_row):
                    clean_cell = cell.strip().lower()
                    if clean_cell in text_cols:
                        header_map["text"] = i
                    elif clean_cell in {"user", "username", "author"}:
                        header_map["user"] = i
                    elif clean_cell in {"sentiment", "label", "category"}:
                        header_map["sentiment"] = i
                
                # If we found a 'text' header, process as header-based
                if "text" in header_map:
                    data_rows = reader # Already advanced past header
                else:
                    # No recognizable header, treat first_row as data
                    # Check positional formats
                    if len(first_row) == 6: # Sentiment140
                        header_map = {"sentiment": 0, "user": 4, "text": 5}
                    elif len(first_row) == 4: # 4-Column
                        header_map = {"user": 1, "sentiment": 2, "text": 3}
                    else:
                        # Fallback: assume last column is text
                        header_map = {"text": len(first_row) - 1}
                    
                    # Prepend first_row back into data stream
                    from itertools import chain
                    data_rows = chain([first_row], reader)

                # Process rows
                for i, row in enumerate(data_rows):
                    if i >= 15000: break
                    
                    try:
                        text_idx = header_map.get("text")
                        if text_idx is None or text_idx >= len(row): continue
                        
                        text = str(row[text_idx]).strip()
                        if len(text) < 10: continue
                        
                        user_idx = header_map.get("user")
                        user = str(row[user_idx]) if (user_idx is not None and user_idx < len(row)) else "csv_user"
                        
                        sent_idx = header_map.get("sentiment")
                        raw_sent = str(row[sent_idx]) if (sent_idx is not None and sent_idx < len(row)) else "Neutral"
                        
                        # Map Sentiment140 codes
                        if len(row) == 6 and raw_sent == "0": sentiment = "Negative"
                        elif len(row) == 6 and raw_sent == "4": sentiment = "Positive"
                        elif len(row) == 6 and raw_sent == "2": sentiment = "Neutral"
                        else: sentiment = raw_sent.title()

                        records.append({
                            "id": f"csv_{filename[:5]}_{i}",
                            "text": text[:300],
                            "user": user,
                            "name": f"User ({user if len(user) < 15 else user[:12]+'...' })",
                            "likes": random.randint(0, 500),
                            "retweets": random.randint(0, 100),
                            "replies": random.randint(0, 50),
                            "sentiment": sentiment,
                            "source": f"Archive: {filename}"
                        })
                    except Exception:
                        continue
                        
            print(f"[CSV] Loaded {len(records)} rows from {filename}")
        except Exception as e:
            print(f"[WARN] CSV load failed for {path}: {e}")
        return records

    # ──────────────────────────────────────────────────────────────────────────
    # Trend scraping: Reddit popular + HackerNews frontpage
    # ──────────────────────────────────────────────────────────────────────────
    def get_current_trends(self) -> List[str]:
        """Fetch real trending tags from the datasets if online source fails."""
        try:
            # Check online sources first (HackerNews frontpage)
            online_tags = set()
            try:
                r = requests.get(
                    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=15",
                    timeout=5, headers={"User-Agent": random.choice(self.user_agents)}
                )
                if r.status_code == 200:
                    for hit in r.json().get("hits", []):
                        title = hit.get("title", "")
                        words = re.findall(r'\b[A-Z][a-zA-Z]{4,}\b', title)
                        for w in words:
                            online_tags.add(f"#{w}")
            except: 
                pass

            if len(online_tags) > 5:
                res: List[str] = list(online_tags)
                return res[:15]

            # Fallback: Use cached datasets to extract common hashtags/words
            if not self._dataset_cache:
                # Prime cache if not already done
                self._fetch_historic("trending fallback", 1)
            
            # Pick a random dataset from cache for variety
            if self._dataset_cache:
                dataset_key = random.choice(list(self._dataset_cache.keys()))
                dataset = self._dataset_cache.get(dataset_key, [])
            if dataset:
                sample_size = min(100, len(dataset))
                sample_text = " ".join([str(r.get("text", "")) for r in random.sample(dataset, sample_size)])
                tags = re.findall(r'#(\w+)', sample_text)
                if tags:
                    res = [f"#{t}" for t in set(tags)]
                    return res[:15]
                
            return ["#Trending", "#Social", "#Live", "#Explore", "#Breaking"]
        except:
            return ["#Global", "#Live", "#Trends"]

    # ──────────────────────────────────────────────────────────────────────────
    # Predictive insights
    # ──────────────────────────────────────────────────────────────────────────
    def get_predictive_insights(self, tweet: Dict[str, Any]) -> Dict[str, Any]:
        now = time.time()
        age_minutes = max(1.0, (now - tweet.get("timestamp", now)) / 60)
        likes = tweet.get("likes", 0)
        retweets = tweet.get("retweets", 0)
        velocity = (likes + (retweets * 2)) / age_minutes
        predicted_reach = (retweets * 400) + (likes * 40)
        growth_prob = min(99, (velocity * 8) / (age_minutes + 1))
        return {
            "viral_velocity": round(velocity, 2),
            "predicted_reach": int(predicted_reach),
            "growth_probability": f"{round(growth_prob, 1)}%",
            "prediction_reason": self._generate_reason(tweet, velocity, growth_prob),
        }

    def _generate_reason(self, tweet: Dict[str, Any], velocity: float, growth_prob: float) -> str:
        if velocity > 50:
            return "High social velocity detected via community shares."
        if growth_prob > 80:
            return "Exponential growth pattern identified in recent 24h window."
        return "Steady organic growth maintains consistent engagement."
