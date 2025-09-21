import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Smile, Meh, Frown, Calendar } from "lucide-react";
import { API_BASE } from '@/lib/api';

const SentimentAnalysis = () => {
  const [sentimentData, setSentimentData] = useState({ positive: 0, neutral: 0, negative: 0, total: 0 });
  const [trendData, setTrendData] = useState<any[]>([]);
  const [wordCloudWords, setWordCloudWords] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [sampleComplaints, setSampleComplaints] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<number>(30);



  useEffect(() => {
    const fetchData = async (days: number) => {
      const urlParams = `?days=${days}`;
      try {
        const [summaryRes, trendRes, wordCloudRes, topicsRes, complaintsRes] = await Promise.all([
          fetch(`${API_BASE}/api/sentiment/summary${urlParams}`).then(r => r.json()),
          fetch(`${API_BASE}/api/sentiment/trend${urlParams}`).then(r => r.json()),
          fetch(`${API_BASE}/api/sentiment/wordcloud${urlParams}`).then(r => r.json()),
          fetch(`${API_BASE}/api/sentiment/topics${urlParams}`).then(r => r.json()),
          fetch(`${API_BASE}/api/sentiment/complaints${urlParams}`).then(r => r.json()),
        ]);

        // Summary
        setSentimentData(summaryRes);

        // Trend
        const combined = trendRes.days.map((day: string, idx: number) => {
          const positive = trendRes.positive[idx] || 0;
          const neutral = trendRes.neutral[idx] || 0;
          const negative = trendRes.negative[idx] || 0;
          const total = positive + neutral + negative;
          return {
            day,
            positive: total > 0 ? (positive / total) * 100 : 0,
            neutral: total > 0 ? (neutral / total) * 100 : 0,
            negative: total > 0 ? (negative / total) * 100 : 0,
          };
        });
        setTrendData(combined);

        // Word Cloud
        setWordCloudWords(wordCloudRes.words.map((w: any) => ({ text: w.text, size: Math.log(w.value + 1) * 10 })));

        // Topics
        setTopics(topicsRes);

        // Sample complaints
        setSampleComplaints(complaintsRes);

      } catch (err) {
        console.error("API fetch error:", err);

        // fallback demo data
        setSentimentData({ positive: 60, neutral: 25, negative: 15, total: 100 });
        setTrendData([
          { day: "Day 1", positive: 60, neutral: 25, negative: 15 },
          { day: "Day 2", positive: 58, neutral: 27, negative: 15 },
          { day: "Day 3", positive: 62, neutral: 22, negative: 16 },
        ]);
        setWordCloudWords([
          { text: "water", size: 20 },
          { text: "traffic", size: 15 },
          { text: "electricity", size: 25 },
        ]);
        setTopics([
          { name: "Traffic delays", percentage: 40, sentiment: "negative" },
          { name: "Cleanliness", percentage: 30, sentiment: "positive" },
        ]);
        setSampleComplaints([
          {
            raw: "Street lights not working",
            processed: "Street light issue",
            sentiment: "negative",
            confidence: 90,
            category: "Infrastructure",
          },
          {
            raw: "Water supply delayed",
            processed: "Water delay",
            sentiment: "negative",
            confidence: 85,
            category: "Utilities",
          },
        ]);
      }
    };

    fetchData(timeRange);
  }, [timeRange, API_BASE]);

  const getSentimentColor = (sentiment: string) =>
    sentiment === "positive" ? "text-success" : sentiment === "negative" ? "text-destructive" : "text-warning";

  const getSentimentIcon = (sentiment: string) =>
    sentiment === "positive" ? <Smile className="w-4 h-4" /> : sentiment === "negative" ? <Frown className="w-4 h-4" /> : <Meh className="w-4 h-4" />;

  return (
    <section id="sentiment" className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-space-medium to-space-deep">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground heading-glow mb-2">Sentiment Analysis</h1>
            <p className="text-muted-foreground">Public sentiment monitoring and topic analysis</p>
          </div>
          <div className="flex items-center space-x-2">
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                variant={timeRange === days ? "default" : "outline"}
                onClick={() => setTimeRange(days)}
                className="border-card-border bg-space-medium/50"
              >
                <Calendar className="w-4 h-4 mr-2" /> Last {days} Days
              </Button>
            ))}
          </div>
        </div>

        {/* Top Row: Overall Sentiment, Trend, Word Cloud */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Overall Sentiment */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Overall Sentiment</h3>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="12" opacity="0.2" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--success))" strokeWidth="12" strokeDasharray={`${sentimentData.positive} 251.2`} strokeLinecap="round" className="glow-success" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--warning))" strokeWidth="12" strokeDasharray={`${sentimentData.neutral} 251.2`} strokeDashoffset={`-${sentimentData.positive}`} strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--destructive))" strokeWidth="12" strokeDasharray={`${sentimentData.negative} 251.2`} strokeDashoffset={`-${sentimentData.positive + sentimentData.neutral}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{sentimentData.total}</div>
                  <div className="text-xs text-muted-foreground">Total Reviews</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smile className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">Positive</span>
                </div>
                <span className="font-semibold text-success">{sentimentData.positive}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Meh className="w-4 h-4 text-warning" />
                  <span className="text-sm text-muted-foreground">Neutral</span>
                </div>
                <span className="font-semibold text-warning">{sentimentData.neutral}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Frown className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-muted-foreground">Negative</span>
                </div>
                <span className="font-semibold text-destructive">{sentimentData.negative}%</span>
              </div>
            </div>
          </Card>

          {/* Sentiment Trend */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Sentiment Trend</h3>
            <div className="relative h-40 bg-space-deep rounded-lg p-4 flex items-center justify-center">
              {trendData.length > 1 ? (
                <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={120 - (y / 100) * 120} x2="300" y2={120 - (y / 100) * 120} stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
                  ))}
                  <polyline fill="none" stroke="hsl(var(--success))" strokeWidth="2" points={trendData.map((d, i) => `${(i / (trendData.length - 1)) * 300},${120 - (d.positive / 100) * 120}`).join(" ")} className="glow-success" />
                  <polyline fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" points={trendData.map((d, i) => `${(i / (trendData.length - 1)) * 300},${120 - (d.negative / 100) * 120}`).join(" ")} />
                  <polyline fill="none" stroke="hsl(var(--warning))" strokeWidth="2" points={trendData.map((d, i) => `${(i / (trendData.length - 1)) * 300},${120 - (d.neutral / 100) * 120}`).join(" ")} />
                </svg>
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  Not enough data to display a trend.<br />
                  (Requires at least 2 days of data)
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Day 1</span>
              <span>Day {trendData.length > 0 ? trendData.length : 1}</span>
            </div>
          </Card>

          {/* Word Cloud */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Topic Word Cloud</h3>
            <div className="relative h-48 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-space-deep rounded-lg p-4 overflow-hidden">
              {wordCloudWords.length > 0 ? wordCloudWords.map((word, index) => (
                <span key={index} className="font-medium text-blue-400 transition-all duration-300 hover:text-foreground hover:scale-110 cursor-pointer" style={{ fontSize: `${word.size}px` }}>
                  {word.text}
                </span>
              )) : <div className="text-muted-foreground text-sm">No topics to display.</div>}
            </div>
          </Card>
        </div>

        {/* Bottom Row: Topics + Complaints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Analysis */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Topic Analysis</h3>
            <div className="space-y-4">
              {topics.length > 0 ? topics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getSentimentIcon(topic.sentiment)}
                      <span className="text-sm text-foreground">{topic.name}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{topic.percentage}%</span>
                  </div>
                  <div className="w-full bg-space-deep rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${topic.sentiment === 'positive' ? 'bg-success' : topic.sentiment === 'negative' ? 'bg-destructive' : 'bg-warning'}`} style={{ width: `${topic.percentage}%` }}></div>
                  </div>
                </div>
              )) : <div className="text-muted-foreground text-sm">No topics to analyze.</div>}
            </div>
          </Card>

          {/* Complaint Explorer */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Complaint Explorer</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {sampleComplaints.length > 0 ? sampleComplaints.map((complaint, index) => (
                <div key={index} className="p-4 bg-space-light rounded-lg border border-card-border hover:bg-space-medium transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getSentimentColor(complaint.sentiment)} bg-transparent border`}>{complaint.sentiment.toUpperCase()}</Badge>
                    <span className="text-xs text-muted-foreground">{complaint.confidence}% confidence</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Raw Input:</div>
                      <div className="text-foreground">{complaint.raw}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto rotate-90" />
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Processed:</div>
                      <div className="text-muted-foreground">{complaint.processed}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-card-border">
                      <div>
                        <div className="text-xs text-muted-foreground">Category:</div>
                        <div className="font-medium text-foreground">{complaint.category}</div>
                      </div>
                      <div className={`flex items-center space-x-1 ${getSentimentColor(complaint.sentiment)}`}>
                        {getSentimentIcon(complaint.sentiment)}
                        <span className="font-medium">{complaint.sentiment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : <div className="text-muted-foreground text-sm">No complaints to display.</div>}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SentimentAnalysis;
