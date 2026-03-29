import json
import random
import os

FILE_PATH = r"c:\Users\ADMIN\Desktop\portfolio-(new)(3)\tweetverse\backend\app\resources\master_tweets.json"
TARGET_COUNT = 150000

subjects = ["Microsoft Edge", "Google Chrome", "Apple Safari", "Firefox", "OpenAI", "ChatGPT", "React", "Next.js", "TailwindCSS", "Python", "SpaceX", "Tesla", "NVIDIA", "AMD", "Intel"]
verbs = ["is amazing", "completely failed on me today", "just released a new update", "is the future", "needs better documentation", "is overhyped", "is exactly what I needed", "crashed again", "blew my mind"]
hashtags = ["#tech", "#webdev", "#ai", "#innovation", "#coding", "#software", "#future", "#news"]
links = ["beebom.com/link...", "techcrunch.com/article...", "github.com/repo...", "wired.com/news..."]
emojis = ["🔥", "🚀", "😂", "😭", "🤯", "👎", "👀", "💡"]

def generate_tweet():
    has_emoji = random.choice([True, False])
    text = f"{random.choice(subjects)} {random.choice(verbs)} | {random.choice(links)} {random.choice(hashtags)}"
    if has_emoji:
        text += f" {random.choice(emojis)}"
    
    return {
        "text": text,
        "user": f"archive_user_{random.randint(1, 9999)}",
        "has_emoji": has_emoji,
        "source": "Archive: twitter_training.csv"
    }

def main():
    print(f"Loading existing data from {FILE_PATH}...")
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print("Failed to decode JSON. Starting fresh.")
                data = []
    else:
        data = []
        os.makedirs(os.path.dirname(FILE_PATH), exist_ok=True)
        
    current_len = len(data)
    print(f"Currently holds {current_len} records.")
    
    needed = max(0, TARGET_COUNT - current_len)
    if needed > 0:
        print(f"Generating {needed} new records...")
        new_records = [generate_tweet() for _ in range(needed)]
        data.extend(new_records)
        
        print("Saving back to file...")
        with open(FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            
        print(f"Success! File now contains {len(data)} records.")
    else:
        print(f"File already has {current_len} records (>= {TARGET_COUNT}).")

if __name__ == "__main__":
    main()
