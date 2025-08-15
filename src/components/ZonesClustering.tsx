import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Wind,
  Droplets,
  MessageSquare,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Activity
} from "lucide-react";

const ZonesClustering = () => {
  const [selectedZone, setSelectedZone] = useState<any>(null);

  const zones = [
    {
      id: 1,
      name: "Downtown District",
      priority: "high",
      color: "destructive",
      position: { top: "35%", left: "45%" },
      aqi: 78,
      complaints: 12,
      waterUsage: 89,
      recommendations: [
        "Deploy additional traffic controllers",
        "Increase air quality monitoring",
        "Schedule maintenance for water systems"
      ]
    },
    {
      id: 2,
      name: "Residential Area B",
      priority: "normal",
      color: "primary",
      position: { top: "60%", left: "30%" },
      aqi: 45,
      complaints: 3,
      waterUsage: 67,
      recommendations: [
        "Regular maintenance checks",
        "Community engagement programs"
      ]
    },
    {
      id: 3,
      name: "Eco Park Zone",
      priority: "eco",
      color: "success",
      position: { top: "25%", left: "70%" },
      aqi: 22,
      complaints: 1,
      waterUsage: 34,
      recommendations: [
        "Expand green initiatives",
        "Install additional sensors"
      ]
    },
    {
      id: 4,
      name: "Industrial District",
      priority: "high",
      color: "destructive",
      position: { top: "70%", left: "55%" },
      aqi: 92,
      complaints: 18,
      waterUsage: 156,
      recommendations: [
        "Immediate emission control measures",
        "Schedule industrial equipment inspection",
        "Increase water conservation protocols"
      ]
    },
    {
      id: 5,
      name: "Commercial Hub",
      priority: "normal",
      color: "warning",
      position: { top: "45%", left: "25%" },
      aqi: 58,
      complaints: 7,
      waterUsage: 78,
      recommendations: [
        "Monitor peak hour traffic",
        "Optimize waste collection routes"
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/80 border-destructive';
      case 'eco': return 'bg-success/80 border-success';
      default: return 'bg-primary/80 border-primary';
    }
  };

  const getStatusColor = (value: number, type: string) => {
    if (type === 'aqi') {
      if (value > 80) return 'text-destructive';
      if (value > 50) return 'text-warning';
      return 'text-success';
    }
    if (type === 'complaints') {
      if (value > 10) return 'text-destructive';
      if (value > 5) return 'text-warning';
      return 'text-success';
    }
    if (type === 'water') {
      if (value > 100) return 'text-destructive';
      if (value > 75) return 'text-warning';
      return 'text-success';
    }
    return 'text-foreground';
  };

  return (
    <section id="zones" className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground heading-glow mb-2">
            Zones & Clustering
          </h1>
          <p className="text-muted-foreground">
            Interactive zone management with AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="card-space p-6 h-full relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  City Zone Map
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-muted-foreground">High Priority</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Normal</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">Eco Zone</span>
                  </div>
                </div>
              </div>

              {/* Map Background */}
              <div className="relative w-full h-[600px] bg-gradient-to-br from-space-deep to-space-medium rounded-lg border border-card-border overflow-hidden">
                <div className="absolute inset-0 city-lights opacity-20"></div>
                
                {/* Zone Markers */}
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ top: zone.position.top, left: zone.position.left }}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className={`
                      w-6 h-6 rounded-full ${getPriorityColor(zone.priority)} 
                      flex items-center justify-center transition-all duration-300 
                      group-hover:scale-125 group-hover:shadow-lg pulse-glow
                    `}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {zone.name}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Zone Details Panel */}
          <div className="lg:col-span-1">
            <Card className="card-space p-6 h-full">
              {selectedZone ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-heading font-semibold text-foreground">
                      Zone Details
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedZone(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">{selectedZone.name}</h4>
                      <Badge className={`${getPriorityColor(selectedZone.priority)} text-white`}>
                        {selectedZone.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>

                    <Separator />

                    {/* Metrics */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Air Quality Index</span>
                        </div>
                        <span className={`font-semibold ${getStatusColor(selectedZone.aqi, 'aqi')}`}>
                          {selectedZone.aqi}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Active Complaints</span>
                        </div>
                        <span className={`font-semibold ${getStatusColor(selectedZone.complaints, 'complaints')}`}>
                          {selectedZone.complaints}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Water Usage %</span>
                        </div>
                        <span className={`font-semibold ${getStatusColor(selectedZone.waterUsage, 'water')}`}>
                          {selectedZone.waterUsage}%
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* AI Recommendations */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Activity className="w-4 h-4 text-primary" />
                        <h5 className="font-medium text-foreground">AI Recommendations</h5>
                      </div>
                      <div className="space-y-2">
                        {selectedZone.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 mt-0.5 text-success flex-shrink-0" />
                            <span className="text-muted-foreground">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    Select a Zone
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Click on any zone marker to view detailed metrics and AI recommendations
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZonesClustering;