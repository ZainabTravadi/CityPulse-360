import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Brain,
  Filter,
  Download,
  Settings
} from "lucide-react";

const Analytics = () => {
  const [selectedModel, setSelectedModel] = useState('complaints');

  const models = [
    { id: 'complaints', label: 'Complaint Prediction', accuracy: 94 },
    { id: 'water', label: 'Water Forecast', accuracy: 87 },
    { id: 'traffic', label: 'Traffic Forecast', accuracy: 91 }
  ];

  const featureImportance = [
    { feature: 'Historical Patterns', importance: 0.85 },
    { feature: 'Weather Conditions', importance: 0.72 },
    { feature: 'Population Density', importance: 0.68 },
    { feature: 'Time of Day', importance: 0.64 },
    { feature: 'Special Events', importance: 0.45 },
    { feature: 'Economic Indicators', importance: 0.32 }
  ];

  return (
    <section id="analytics" className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-space-deep to-space-medium">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground heading-glow">
              Predictive Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered forecasting and trend analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-card-border bg-space-medium/50 hover:bg-space-light"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              className="border-card-border bg-space-medium/50 hover:bg-space-light"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Model Selection */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {models.map((model) => (
            <Button
              key={model.id}
              variant="ghost"
              onClick={() => setSelectedModel(model.id)}
              className={`
                px-6 py-3 transition-all duration-300
                ${selectedModel === model.id
                  ? 'bg-primary/20 text-primary border border-primary/30 glow-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-space-light'
                }
              `}
            >
              <span className="mr-3">{model.label}</span>
              <Badge className="bg-success/20 text-success">
                {model.accuracy}%
              </Badge>
            </Button>
          ))}
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Time Series Forecast */}
          <div className="lg:col-span-2">
            <Card className="card-space p-6 h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  Forecast Timeline
                </h2>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">Next 48 hours</span>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="relative w-full h-[380px] bg-gradient-to-br from-space-deep to-space-light rounded-lg border border-card-border overflow-hidden">
                <div className="absolute inset-0 p-6">
                  {/* Y-axis labels */}
                  <div className="absolute left-2 top-6 bottom-6 flex flex-col justify-between text-xs text-muted-foreground">
                    <span>High</span>
                    <span>Medium</span>
                    <span>Low</span>
                  </div>
                  
                  {/* Chart content */}
                  <div className="ml-8 h-full relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 grid grid-rows-3 gap-0">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-b border-card-border/30 last:border-b-0"></div>
                      ))}
                    </div>
                    
                    {/* Sample data visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/20 to-primary/5 rounded-t-lg border-t-2 border-primary/50"></div>
                    <div className="absolute bottom-0 left-1/4 right-3/4 h-32 bg-gradient-to-t from-warning/20 to-warning/5 rounded-t-lg border-t-2 border-warning/50"></div>
                    <div className="absolute bottom-0 left-1/2 right-1/4 h-16 bg-gradient-to-t from-success/20 to-success/5 rounded-t-lg border-t-2 border-success/50"></div>
                    
                    {/* Confidence zones */}
                    <div className="absolute top-1/3 left-0 right-0 h-1/3 bg-secondary/10 border border-secondary/20 rounded"></div>
                    
                    {/* Time labels */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                      <span>Now</span>
                      <span>12h</span>
                      <span>24h</span>
                      <span>36h</span>
                      <span>48h</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Confidence Meter */}
          <div className="space-y-8">
            <Card className="card-space p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  Model Confidence
                </h2>
                <Target className="w-5 h-5 text-primary" />
              </div>
              
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="hsl(var(--space-light))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="hsl(var(--success))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${models.find(m => m.id === selectedModel)?.accuracy * 3.14} 314`}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_hsl(var(--success-glow))]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {models.find(m => m.id === selectedModel)?.accuracy}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-center">
                <p className="text-sm text-success font-medium">High Confidence</p>
                <p className="text-xs text-muted-foreground">
                  Based on {(Math.random() * 10000 + 5000).toFixed(0)} data points
                </p>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="card-space p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground">
                  Model Stats
                </h3>
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Training Data</span>
                  <span className="text-sm font-medium text-foreground">2.3M points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium text-foreground">5 min ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prediction Range</span>
                  <span className="text-sm font-medium text-foreground">48 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Model Type</span>
                  <span className="text-sm font-medium text-foreground">Neural Network</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature Importance */}
        <Card className="card-space p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Model Explainability
            </h2>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Feature Importance</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureImportance.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">
                    {item.feature}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(item.importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-space-deep rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${item.importance * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Analytics;