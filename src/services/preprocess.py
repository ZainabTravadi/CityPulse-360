# backend/preprocess.py
import re
import pandas as pd
from nltk.corpus import stopwords
import nltk

nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

def clean_text(text):
    text = re.sub(r"http\S+", "", text)       # remove URLs
    text = re.sub(r"[^a-zA-Z\s]", "", text)   # keep letters only
    text = text.lower()
    tokens = [w for w in text.split() if w not in stop_words]
    return " ".join(tokens)

def preprocess(df):
    df["clean_text"] = df["text"].apply(clean_text)
    return df

if __name__ == "__main__":
    df = pd.read_csv("feedback.csv")
    df = preprocess(df)
    df.to_csv("feedback_clean.csv", index=False)
    print("✅ feedback_clean.csv created")
