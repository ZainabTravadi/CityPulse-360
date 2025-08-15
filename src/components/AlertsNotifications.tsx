import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bell,
  Filter,
  MoreVertical,
  MapPin,
  Calendar,
  User,
  Activity
} from "lucide-react";

const AlertsNotifications = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const alerts = [
    {
      id: 1,
      title: "High Traffic Congestion Detected",
      description: "Traffic volume exceeding normal capacity by 45% in Downtown District",
      severity: "urgent",
      timestamp: "2 minutes ago",
      location: "Downtown District - Main St & 5th Ave",
      status: "active",
      assignedTo: "Traffic Control Team",
      estimatedResolution: "15 minutes"
    },
    {
      id: 2,
      title: "Air Quality Alert",
      description: "AQI levels above recommended threshold in Industrial Zone",
      severity: "warning",
      timestamp: "8 minutes ago",
      location: "Industrial Zone - Sector 7",
      status: "investigating",
      assignedTo: "Environmental Team",
      estimatedResolution: "45 minutes"
    },
    {
      id: 3,
      title: "Water Main Pressure Drop",
      description: "Significant pressure reduction detected in residential water supply",
      severity: "warning",
      timestamp: "15 minutes ago",
      location: "Residential Area B - Block 12",
      status: "in-progress",
      assignedTo: "Water Management",
      estimatedResolution: "2 hours"
    },
    {
      id: 4,
      title: "Street Light Maintenance Complete",
      description: "LED street light installation completed successfully",
      severity: "resolved",
      timestamp: "1 hour ago",
      location: "Commercial Hub - Oak Street",
      status: "resolved",
      assignedTo: "Maintenance Team",
      estimatedResolution: "Completed"
    },
    {
      id: 5,
      title: "Emergency Response Dispatch",
      description: "Fire department responding to commercial building alarm",
      severity: "urgent",
      timestamp: "1 hour ago",
      location: "Business District - Tower Plaza",
      status: "active",
      assignedTo: "Emergency Services",
      estimatedResolution: "30 minutes"
    },
    {
      id: 6,
      title: "Public Transport Delay",
      description: "Bus route 42 experiencing delays due to road construction",
      severity: "warning",
      timestamp: "2 hours ago",
      location: "Transit Route 42 - Central Station",
      status: "monitoring",
      assignedTo: "Transit Authority",
      estimatedResolution: "4 hours"
    },
    {
      id: 7,
      title: "Waste Collection Completed",
      description: "Scheduled waste collection completed ahead of schedule",
      severity: "resolved",
      timestamp: "3 hours ago",
      location: "Residential Area A - All Sectors",
      status: "resolved",
      assignedTo: "Sanitation Team",
      estimatedResolution: "Completed"
    },
    {
      id: 8,
      title: "Power Grid Optimization",
      description: "Electrical load balancing completed successfully",
      severity: "resolved",
      timestamp: "4 hours ago",
      location: "City-wide Grid Network",
      status: "resolved",
      assignedTo: "Power Grid Team",
      estimatedResolution: "Completed"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'warning': return 'bg-warning/20 text-warning border-warning/30';
      case 'resolved': return 'bg-success/20 text-success border-success/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'investigating': return 'bg-warning/20 text-warning border-warning/30';
      case 'in-progress': return 'bg-primary/20 text-primary border-primary/30';
      case 'monitoring': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'resolved': return 'bg-success/20 text-success border-success/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    return alert.severity === selectedFilter;
  });

  const urgentCount = alerts.filter(a => a.severity === 'urgent').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const resolvedCount = alerts.filter(a => a.severity === 'resolved').length;

  return (
    <section id="alerts" className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground heading-glow mb-2">
              Alerts & Notifications
            </h1>
            <p className="text-muted-foreground">
              Real-time alert monitoring and incident management
            </p>
          </div>
          
          {/* Stats Summary */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-destructive/20 rounded-lg border border-destructive/30">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">{urgentCount} Urgent</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-warning/20 rounded-lg border border-warning/30">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">{warningCount} Warning</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-success/20 rounded-lg border border-success/30">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">{resolvedCount} Resolved</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-space p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-heading font-semibold text-foreground">Filters</h3>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Alerts', count: alerts.length },
                  { id: 'urgent', label: 'Urgent', count: urgentCount },
                  { id: 'warning', label: 'Warning', count: warningCount },
                  { id: 'resolved', label: 'Resolved', count: resolvedCount }
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant="ghost"
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`
                      w-full justify-between text-left h-auto p-3 transition-all duration-300
                      ${selectedFilter === filter.id 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-space-light'
                      }
                    `}
                  >
                    <span>{filter.label}</span>
                    <Badge className="bg-space-medium text-foreground">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Quick Actions</h4>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Mark All as Read
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Alerts List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="card-space p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-heading font-semibold text-foreground">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadge(alert.status)}>
                        {alert.status.replace('-', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{alert.assignedTo}</span>
                    </div>
                  </div>

                  {alert.estimatedResolution !== 'Completed' && (
                    <div className="mt-4 p-3 bg-space-light rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Estimated Resolution:</span>
                        <span className="text-xs font-medium text-foreground">{alert.estimatedResolution}</span>
                      </div>
                      <div className="mt-2 w-full bg-space-deep rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-500 ${
                            alert.severity === 'urgent' ? 'bg-destructive' :
                            alert.severity === 'warning' ? 'bg-warning' : 'bg-primary'
                          }`}
                          style={{ 
                            width: alert.severity === 'urgent' ? '75%' : 
                                   alert.severity === 'warning' ? '50%' : '25%' 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <Card className="card-space p-12 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No alerts found
                </h3>
                <p className="text-muted-foreground">
                  No alerts match your current filter criteria.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlertsNotifications;