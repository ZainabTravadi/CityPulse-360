import pandas as pd
import random
from datetime import datetime, timedelta

# A list of sample feedback phrases
# In generate_data.py

SAMPLE_FEEDBACK = [
    # Negative
    "Parking is a nightmare", "Waste collection needs improvement",
    "Traffic is terrible today", "Congestion makes commuting slow",
    "Delays everywhere", "Street lights are often broken",

    # Positive
    "Service was very responsive", "The city looks clean and green",
    "Roads are efficient and smooth", "Excellent waste management",
    "Public transport improved a lot",

    # Neutral (New additions)
    "The new metro line schedule was released",
    "Public notice regarding the downtown festival",
    "Roadwork is planned for the main street next week",
    "A new public library branch is opening soon"
]

# --- Configuration ---
NUM_RECORDS = 500  # How many rows of data to create
DAYS_RANGE = 30    # How many days back the data should go
OUTPUT_FILENAME = "feedback_synthetic.csv" # The name of the new file

def generate_synthetic_data():
    """Creates a DataFrame with realistic feedback data over a date range."""
    print(f"Generating {NUM_RECORDS} records...")
    
    data = []
    start_date = datetime.now()

    for i in range(1, NUM_RECORDS + 1):
        # 1. Pick a random piece of feedback text
        text = random.choice(SAMPLE_FEEDBACK)

        # 2. Generate a random timestamp within the last 30 days
        random_days_ago = random.uniform(0, DAYS_RANGE)
        random_seconds_ago = random.uniform(0, 86400) # a full day in seconds
        timestamp = start_date - timedelta(days=random_days_ago, seconds=random_seconds_ago)
        
        data.append({
            "id": i,
            "text": text,
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })

    # 3. Create a pandas DataFrame and save it to a CSV file
    df = pd.DataFrame(data)
    df.to_csv(OUTPUT_FILENAME, index=False)
    
    print(f"Successfully created '{OUTPUT_FILENAME}' with {len(df)} records.")

if __name__ == "__main__":
    generate_synthetic_data()