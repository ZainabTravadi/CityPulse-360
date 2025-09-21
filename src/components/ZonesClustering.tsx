"use client";

import { useEffect, useState } from "react";
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
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const ZonesClustering = () => {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchZoneData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/zones`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const allZones = await response.json();
        setZones(allZones);
      } catch (err: any) {
        console.error(err);
        setError("Could not load zone data. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchZoneData();
  }, [API_BASE]);

  const getPriorityColor = (priority: string) =>
    priority === "high" ? "bg-destructive/80 border-destructive" :
    priority === "eco" ? "bg-success/80 border-success" : "bg-primary/80 border-primary";

  const getStatusColor = (value: number, type: string) => {
    if (type === "aqi") return value >= 4 ? "text-destructive" : value === 3 ? "text-warning" : "text-success";
    if (type === "complaints") return value > 10 ? "text-destructive" : value > 5 ? "text-warning" : "text-success";
    if (type === "water") return value > 100 ? "text-destructive" : value > 75 ? "text-warning" : "text-success";
    return "text-foreground";
  };

  return (
    <section id="zones" className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground heading-glow mb-2">
            Zones & Clustering
          </h1>
          <p className="text-muted-foreground">Interactive zone management with insights</p>
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

              <div className="relative w-full h-[600px] bg-gradient-to-br from-space-deep to-space-medium rounded-lg border border-card-border overflow-hidden">
                <div className="absolute inset-0 city-lights opacity-20"></div>

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Loading zones...
                  </div>
                )}

                {error && !loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive">
                    <AlertTriangle className="w-10 h-10 mb-2" />
                    <span>{error}</span>
                  </div>
                )}

                {!loading && !error && zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                    style={{ top: zone.position.top, left: zone.position.left }}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className={`w-6 h-6 rounded-full ${getPriorityColor(zone.priority)} flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg pulse-glow`}>
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
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Floating Card */}
                {selectedZone && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-96 z-50">
                    <Card className="p-6 shadow-xl border border-border bg-background/95 backdrop-blur-md">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-heading font-semibold text-foreground">
                          {selectedZone.name}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedZone(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <Badge className={`${getPriorityColor(selectedZone.priority)} text-white mb-4`}>
                        {selectedZone.priority.toUpperCase()} PRIORITY
                      </Badge>

                      <div className="space-y-3 text-sm mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Wind className="w-4 h-4 text-muted-foreground" />
                            <span>Air Quality Index</span>
                          </div>
                          <span className={`font-semibold ${getStatusColor(selectedZone.aqi, "aqi")}`}>
                            {["Good", "Fair", "Moderate", "Poor", "Very Poor"][selectedZone.aqi - 1] || 'Unknown'} ({selectedZone.aqi})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <span>Active Complaints</span>
                          </div>
                          <span className={`font-semibold ${getStatusColor(selectedZone.complaints, "complaints")}`}>
                            {selectedZone.complaints}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Droplets className="w-4 h-4 text-muted-foreground" />
                            <span>Water Usage %</span>
                          </div>
                          <span className={`font-semibold ${getStatusColor(selectedZone.waterUsage, "water")}`}>
                            {selectedZone.waterUsage}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="w-4 h-4 text-primary" />
                          <h4 className="font-medium text-foreground">AI Recommendations</h4>
                        </div>
                        <div className="space-y-1">
                          {selectedZone.recommendations.map((rec: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3 h-3 mt-0.5 text-success" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <Card className="card-space p-6 h-full">
              {selectedZone ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-heading font-semibold text-foreground">Zone Details</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedZone(null)}>
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Air Quality Index</span>
                        </div>
                        <span className={`font-semibold ${getStatusColor(selectedZone.aqi, "aqi")}`}>
                          {["Good", "Fair", "Moderate", "Poor", "Very Poor"][selectedZone.aqi - 1] || 'Unknown'} ({selectedZone.aqi})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Active Complaints</span>
                        </div>
                        <span className={`font-semibold ${getStatusColor(selectedZone.complaints, "complaints")}`}>
                          {selectedZone.complaints}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Water Usage %</span>
                        </div>
                        <span className={`font-semibold ${getStatusColor(selectedZone.waterUsage, "water")}`}>
                          {selectedZone.waterUsage}%
                        </span>
                      </div>
                    </div>
                    <Separator />
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
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Select a Zone</h3>
                  <p className="text-muted-foreground text-sm">Click on any zone marker to view detailed metrics and AI recommendations</p>
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
