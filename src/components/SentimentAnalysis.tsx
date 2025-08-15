import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  Filter,
  Calendar
} from "lucide-react";

const SentimentAnalysis = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const sentimentData = {
    positive: 45,
    neutral: 35,
    negative: 20
  };

  const trendData = [
    { day: 1, positive: 42, neutral: 38, negative: 20 },
    { day: 7, positive: 45, neutral: 35, negative: 20 },
    { day: 14, positive: 48, neutral: 32, negative: 20 },
    { day: 21, positive: 44, neutral: 36, negative: 20 },
    { day: 30, positive: 45, neutral: 35, negative: 20 },
  ];

  const topics = [
    { name: "Traffic Management", percentage: 28, sentiment: "negative" },
    { name: "Waste Collection", percentage: 22, sentiment: "neutral" },
    { name: "Public Transportation", percentage: 18, sentiment: "positive" },
    { name: "Street Lighting", percentage: 15, sentiment: "negative" },
    { name: "Green Spaces", percentage: 12, sentiment: "positive" },
    { name: "Parking Issues", percentage: 5, sentiment: "negative" }
  ];

  const wordCloudWords = [
    { text: "traffic", size: 32, sentiment: "negative" },
    { text: "clean", size: 28, sentiment: "positive" },
    { text: "delay", size: 24, sentiment: "negative" },
    { text: "excellent", size: 22, sentiment: "positive" },
    { text: "congestion", size: 20, sentiment: "negative" },
    { text: "improved", size: 18, sentiment: "positive" },
    { text: "waste", size: 16, sentiment: "negative" },
    { text: "efficient", size: 14, sentiment: "positive" },
    { text: "parking", size: 12, sentiment: "negative" },
    { text: "responsive", size: 10, sentiment: "positive" }
  ];

  const sampleComplaints = [
    {
      id: 1,
      raw: "The traffic lights at Main St intersection have been malfunctioning for 3 days causing major delays",
      processed: "Traffic lights Main St intersection malfunctioning 3 days major delays",
      sentiment: "negative",
      category: "Traffic Management",
      confidence: 94
    },
    {
      id: 2,
      raw: "Great job on the new bike lanes! They make commuting much safer and more pleasant",
      processed: "Great job new bike lanes commuting safer pleasant",
      sentiment: "positive",
      category: "Public Transportation",
      confidence: 89
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-warning';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4" />;
      case 'negative': return <Frown className="w-4 h-4" />;
      default: return <Meh className="w-4 h-4" />;
    }
  };

  return (
    <section id="sentiment" className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-space-medium to-space-deep">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground heading-glow mb-2">
              Sentiment Analysis
            </h1>
            <p className="text-muted-foreground">
              Public sentiment monitoring and topic analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-card-border bg-space-medium/50">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="outline" className="border-card-border bg-space-medium/50">
              <Filter className="w-4 h-4 mr-2" />
              All Sources
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sentiment Overview */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
              Overall Sentiment
            </h3>
            
            {/* Pie Chart Representation */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Positive */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="12"
                  strokeDasharray={`${sentimentData.positive * 2.51} 251.2`}
                  className="glow-success"
                />
                {/* Neutral */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--warning))"
                  strokeWidth="12"
                  strokeDasharray={`${sentimentData.neutral * 2.51} 251.2`}
                  strokeDashoffset={`-${sentimentData.positive * 2.51}`}
                />
                {/* Negative */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="12"
                  strokeDasharray={`${sentimentData.negative * 2.51} 251.2`}
                  strokeDashoffset={`-${(sentimentData.positive + sentimentData.neutral) * 2.51}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">100%</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>

            {/* Legend */}
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

          {/* Trend Graph */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
              30-Day Trend
            </h3>
            <div className="relative h-40 bg-space-deep rounded-lg p-4">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                {/* Grid lines */}
                {[0, 20, 40, 60, 80, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={120 - y * 1.2}
                    x2="300"
                    y2={120 - y * 1.2}
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}
                
                {/* Positive trend line */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="2"
                  points={trendData.map((d, i) => `${i * 75},${120 - d.positive * 1.2}`).join(' ')}
                  className="glow-success"
                />
                
                {/* Negative trend line */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="2"
                  points={trendData.map((d, i) => `${i * 75},${120 - d.negative * 1.2}`).join(' ')}
                />
              </svg>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Day 1</span>
              <span>Day 30</span>
            </div>
          </Card>

          {/* Word Cloud */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
              Topic Word Cloud
            </h3>
            <div className="relative h-48 flex flex-wrap items-center justify-center gap-2 bg-space-deep rounded-lg p-4">
              {wordCloudWords.map((word, index) => (
                <span
                  key={index}
                  className={`font-medium ${getSentimentColor(word.sentiment)} transition-all duration-300 hover:scale-110 cursor-pointer`}
                  style={{ fontSize: `${word.size / 2}px` }}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Topics and Complaint Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Analysis */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
              Topic Analysis
            </h3>
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getSentimentIcon(topic.sentiment)}
                      <span className="text-sm text-foreground">{topic.name}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {topic.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-space-deep rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        topic.sentiment === 'positive' ? 'bg-success' :
                        topic.sentiment === 'negative' ? 'bg-destructive' : 'bg-warning'
                      }`}
                      style={{ width: `${topic.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Complaint Explorer */}
          <Card className="card-space p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
              Complaint Processing Example
            </h3>
            <div className="space-y-4">
              {sampleComplaints.map((complaint, index) => (
                <div
                  key={index}
                  className="p-4 bg-space-light rounded-lg border border-card-border hover:bg-space-medium transition-colors cursor-pointer"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getSentimentColor(complaint.sentiment)} bg-transparent border`}>
                      {complaint.sentiment.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {complaint.confidence}% confidence
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Raw Input:</div>
                      <div className="text-foreground">{complaint.raw}</div>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
                    
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Processed:</div>
                      <div className="text-muted-foreground">{complaint.processed}</div>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
                    
                    <div className="flex items-center justify-between">
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
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SentimentAnalysis;