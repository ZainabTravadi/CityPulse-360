import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Settings, Brain } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  const [selectedModel, setSelectedModel] = useState("complaints");
  const [forecastData, setForecastData] = useState<any[]>([]);

  const models = [
    { id: "complaints", label: "Complaint Prediction", accuracy: 94 },
    { id: "water", label: "Water Forecast", accuracy: 87 },
    { id: "traffic", label: "Traffic Forecast", accuracy: 91 },
  ];

  const featureImportance = [
    { feature: "Historical Patterns", importance: 0.85 },
    { feature: "Weather Conditions", importance: 0.72 },
    { feature: "Population Density", importance: 0.68 },
    { feature: "Time of Day", importance: 0.64 },
    { feature: "Special Events", importance: 0.45 },
    { feature: "Economic Indicators", importance: 0.32 },
  ];

  useEffect(() => {
  if (forecastData.length === 0) {
    setForecastData([
      { time: "08:00", value: 10 },
      { time: "09:00", value: 20 },
      { time: "10:00", value: 50 },
      { time: "11:00", value: 80 },
    ]);
  }
}, [forecastData]);


  return (
    <section
      id="analytics"
      className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-space-deep to-space-medium"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✅ Forecast Timeline updated */}
          <div className="lg:col-span-2">
            <Card className="card-space p-6 h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  Forecast Timeline
                </h2>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">
                    Next 48 hours
                  </span>
                </div>
              </div>

              {/* Recharts line chart */}
              <div className="w-full h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--card-border))"
                    />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--space-light))",
                        border: "1px solid hsl(var(--card-border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"   // bright green for visibility
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#22c55e" }} // show dots even if flat 
                    />
                  </LineChart>
                </ResponsiveContainer>
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
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 120 120"
                >
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
                    strokeDasharray={`${
                      models.find((m) => m.id === selectedModel)?.accuracy *
                      3.14
                    } 314`}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_hsl(var(--success-glow))]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {
                        models.find((m) => m.id === selectedModel)?.accuracy
                      }
                      %
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Accuracy
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-sm text-success font-medium">
                  High Confidence
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {(Math.random() * 10000 + 5000).toFixed(0)} data
                  points
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
                  <span className="text-sm text-muted-foreground">
                    Training Data
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    2.3M points
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    5 min ago
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Prediction Range
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    48 hours
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Model Type
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Neural Network
                  </span>
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
              <span className="text-sm text-muted-foreground">
                Feature Importance
              </span>
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
