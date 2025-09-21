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
import { API_BASE } from '@/lib/api';

const Analytics = () => {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [confidence, setConfidence] = useState<number>(0);


  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await fetch(`${API_BASE}/electricity`);
        const data = await res.json();

        setForecastData(
          data.forecast.map((item: any) => ({
            time: item.timestamp,
            value: item.value,
          }))
        );
        setFeatureImportance(data.feature_importance || []);
        setStats(data.stats || {});
        setConfidence(data.stats?.accuracy || 0);
      } catch (error) {
        console.error("Error fetching forecast:", error);

        // fallback demo data
        setForecastData([
          { time: "08:00", value: 10 },
          { time: "09:00", value: 20 },
          { time: "10:00", value: 50 },
          { time: "11:00", value: 80 },
        ]);
        setFeatureImportance([
          { feature: "Historical Patterns", importance: 0.85 },
          { feature: "Weather Conditions", importance: 0.72 },
        ]);
        setStats({
          training_data: "1,440 points",
          last_updated: "5 min ago",
          prediction_range: "48 hours",
          model_type: "Neural Network",
          rmse: 5.2,
          mae: 3.1,
          mape: "4.2%",
        });
        setConfidence(92);
      }
    };

    fetchForecast();
  }, [API_BASE]);

  return (
    <section
      id="analytics"
      className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-space-deep to-space-medium"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Top Row: Forecast + Confidence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forecast Timeline */}
          <div className="lg:col-span-2">
            <Card className="card-space p-6 h-[500px]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  Forecast Timeline
                </h2>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">
                    Next {stats.prediction_range || "48 hours"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Projected electricity demand across time, based on historical
                patterns and predictive modeling.
              </p>

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
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#22c55e" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Model Confidence */}
          <Card className="card-space p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-heading font-semibold text-foreground">
                Model Confidence
              </h2>
              <Target className="w-5 h-5 text-primary" />
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Indicates the reliability of the model’s predictions based on
              validation results and past performance.
            </p>

            <div className="flex justify-center items-center mb-6">
              <div className="relative w-32 h-32">
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
                    strokeDasharray={`${confidence * 3.14} 314`}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_hsl(var(--success-glow))]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center mb-4">
              <p
                className={`text-sm font-medium ${
                  confidence > 85
                    ? "text-success"
                    : confidence > 65
                    ? "text-yellow-500"
                    : "text-red-900"
                }`}
              >
                {confidence > 85
                  ? "High Confidence"
                  : confidence > 65
                  ? "Medium Confidence"
                  : "Low Confidence"}
              </p>
              <p className="text-xs text-muted-foreground">
                Based on {stats.training_data || "1,440"} data points
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground mb-4">
              <div>
                <div className="h-2 w-full bg-red-700 rounded"></div>
                Low
              </div>
              <div>
                <div className="h-2 w-full bg-yellow-400 rounded"></div>
                Medium
              </div>
              <div>
                <div className="h-2 w-full bg-green-500 rounded"></div>
                High
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <p className="font-semibold text-foreground">{stats.rmse}</p>
                <p className="text-muted-foreground">RMSE</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{stats.mae}</p>
                <p className="text-muted-foreground">MAE</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{stats.mape}</p>
                <p className="text-muted-foreground">MAPE</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Row: Explainability + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Explainability */}
          <div className="lg:col-span-2">
            <Card className="card-space p-6 h-full">
              <div className="flex items-center justify-between mb-2">
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
              <p className="text-sm text-muted-foreground mb-6">
                Explains which features most influence the model’s predictions.
              </p>

              <div className="space-y-4">
                {featureImportance.map((item, index) => (
                  <div key={index} className="space-y-2">
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
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Model Stats */}
          <Card className="card-space p-6 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-semibold text-foreground">
                Model Stats
              </h3>
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Key metadata about the forecasting model.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Training Data</span>
                <span className="text-sm font-medium text-foreground">
                  {stats.training_data || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium text-foreground">
                  {stats.last_updated || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Prediction Range</span>
                <span className="text-sm font-medium text-foreground">
                  {stats.prediction_range || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Model Type</span>
                <span className="text-sm font-medium text-foreground">
                  {stats.model_type || "Unknown"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
