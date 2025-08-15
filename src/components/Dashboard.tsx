import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import KPICard from "./KPICard";
import {
  Car,
  Wind,
  Droplets,
  Zap,
  MessageSquare,
  Calendar,
  ChevronDown,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const [selectedToggle, setSelectedToggle] = useState('traffic');

  const kpiData = [
    {
      title: "Traffic Congestion",
      value: "68",
      unit: "%",
      trend: "down" as const,
      trendValue: "5% from yesterday",
      icon: <Car className="w-5 h-5" />,
      status: "warning" as const
    },
    {
      title: "Air Quality Index",
      value: "42",
      unit: "AQI",
      trend: "up" as const,
      trendValue: "8% from yesterday",
      icon: <Wind className="w-5 h-5" />,
      status: "good" as const
    },
    {
      title: "Water Usage",
      value: "2.4",
      unit: "ML",
      trend: "neutral" as const,
      trendValue: "Normal range",
      icon: <Droplets className="w-5 h-5" />,
      status: "good" as const
    },
    {
      title: "Electricity Load",
      value: "847",
      unit: "MW",
      trend: "up" as const,
      trendValue: "12% from yesterday",
      icon: <Zap className="w-5 h-5" />,
      status: "critical" as const
    },
    {
      title: "Active Complaints",
      value: "23",
      unit: "",
      trend: "down" as const,
      trendValue: "15% from yesterday",
      icon: <MessageSquare className="w-5 h-5" />,
      status: "good" as const
    }
  ];

  const predictions = [
    {
      type: "Traffic Spike",
      location: "Downtown District",
      time: "2:30 PM",
      confidence: 94,
      severity: "high"
    },
    {
      type: "Air Quality Drop",
      location: "Industrial Zone",
      time: "4:15 PM",
      confidence: 87,
      severity: "medium"
    },
    {
      type: "Water Shortage Risk",
      location: "Residential Area B",
      time: "6:00 PM",
      confidence: 76,
      severity: "low"
    },
    {
      type: "Power Grid Stress",
      location: "Commercial District",
      time: "7:45 PM",
      confidence: 91,
      severity: "high"
    }
  ];

  const toggleOptions = [
    { id: 'traffic', label: 'Traffic', color: 'primary' },
    { id: 'pollution', label: 'Pollution', color: 'warning' },
    { id: 'water', label: 'Water', color: 'secondary' },
    { id: 'electricity', label: 'Electricity', color: 'success' },
    { id: 'complaints', label: 'Complaints', color: 'destructive' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-success/20 text-success border-success/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  return (
    <section id="dashboard" className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground heading-glow">
              City Overview
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring and intelligence dashboard
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-card-border bg-space-medium/50 hover:bg-space-light"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Last 24 hours
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive City Map */}
          <div className="lg:col-span-2">
            <Card className="card-space p-6 h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  Live City Map
                </h2>
                <div className="flex items-center space-x-2">
                  {toggleOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedToggle(option.id)}
                      className={`
                        text-xs px-3 py-1 transition-all duration-300
                        ${selectedToggle === option.id
                          ? `bg-${option.color}/20 text-${option.color} border border-${option.color}/30`
                          : 'text-muted-foreground hover:text-foreground hover:bg-space-light'
                        }
                      `}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="relative w-full h-full bg-gradient-to-br from-space-deep to-space-medium rounded-lg border border-card-border overflow-hidden">
                <div className="absolute inset-0 city-lights opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapPin className="w-16 h-16 mx-auto text-primary opacity-60" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        Interactive City Map
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Showing {selectedToggle} data overlay
                      </p>
                    </div>
                    {/* Sample data points */}
                    <div className="grid grid-cols-2 gap-4 mt-8 text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full pulse-glow"></div>
                          <span className="text-muted-foreground">High Activity Zone</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-warning rounded-full"></div>
                          <span className="text-muted-foreground">Medium Activity</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-muted-foreground">Normal Range</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full glow-secondary"></div>
                          <span className="text-muted-foreground">Low Activity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Predictions Panel */}
          <div className="lg:col-span-1">
            <Card className="card-space p-6 h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  AI Predictions
                </h2>
                <Activity className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4 overflow-y-auto h-[500px]">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="p-4 bg-space-light rounded-lg border border-card-border hover:bg-space-medium transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground text-sm">
                          {prediction.type}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {prediction.location}
                        </p>
                      </div>
                      <Badge className={`text-xs px-2 py-1 ${getSeverityColor(prediction.severity)}`}>
                        <span className="flex items-center space-x-1">
                          {getSeverityIcon(prediction.severity)}
                          <span className="capitalize">{prediction.severity}</span>
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        ETA: {prediction.time}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          Confidence:
                        </span>
                        <span className="text-xs font-medium text-success">
                          {prediction.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Confidence bar */}
                    <div className="mt-3 w-full bg-space-deep rounded-full h-1">
                      <div
                        className="bg-success h-1 rounded-full transition-all duration-500 group-hover:glow-success"
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;