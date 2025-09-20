import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bell,
  Filter,
  MoreVertical,
  MapPin,
  User,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const AlertsNotifications = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);

  // Use environment variable for backend URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/alerts`);
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [API_BASE]);

  const handleResolveAlert = async (alertId: number) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/alerts/${alertId}/resolve`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to resolve alert");

      const updatedAlert = await response.json();
      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert.id === alertId ? updatedAlert : alert
        )
      );
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "urgent":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "warning":
        return "bg-warning/20 text-warning border-warning/30";
      case "resolved":
        return "bg-success/20 text-success border-success/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4" />;
      case "warning":
        return <Clock className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "investigating":
        return "bg-warning/20 text-warning border-warning/30";
      case "in-progress":
        return "bg-primary/20 text-primary border-primary/30";
      case "monitoring":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "resolved":
        return "bg-success/20 text-success border-success/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active") return alert.status !== "resolved";
    if (selectedFilter === "resolved") return alert.status === "resolved";
    return alert.severity === selectedFilter;
  });

  const urgentCount = alerts.filter(
    (a) => a.severity === "urgent" && a.status !== "resolved"
  ).length;
  const warningCount = alerts.filter(
    (a) => a.severity === "warning" && a.status !== "resolved"
  ).length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;
  const activeCount = alerts.filter((a) => a.status !== "resolved").length;

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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-destructive/20 rounded-lg border border-destructive/30">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {urgentCount} Urgent
              </span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-warning/20 rounded-lg border border-warning/30">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">
                {warningCount} Warning
              </span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-success/20 rounded-lg border border-success/30">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                {resolvedCount} Resolved
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="card-space p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Filters
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { id: "all", label: "All Alerts", count: alerts.length },
                  { id: "active", label: "All Active", count: activeCount },
                  { id: "urgent", label: "Urgent", count: urgentCount },
                  { id: "warning", label: "Warning", count: warningCount },
                  { id: "resolved", label: "Resolved", count: resolvedCount },
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant="ghost"
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-full justify-between text-left h-auto p-3 transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-space-light"
                    }`}
                  >
                    <span>{filter.label}</span>
                    <Badge className="bg-space-medium text-foreground">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Alerts List */}
          <div className="lg:col-span-3 space-y-4">
            {loading && (
              <Card className="card-space p-12 text-center text-muted-foreground">
                Loading alerts...
              </Card>
            )}
            {!loading &&
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="card-space p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-heading font-semibold text-foreground">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadge(alert.status)}>
                        {alert.status.replace("-", " ")}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {alert.status !== "resolved" && (
                            <DropdownMenuItem
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Resolve Alert
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setSelectedAlert(alert)}
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {alert.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {alert.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {alert.assignedTo}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}

            {!loading && filteredAlerts.length === 0 && (
              <Card className="card-space p-12 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  All Clear!
                </h3>
                <p className="text-muted-foreground">
                  No alerts match your current filter criteria.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Details Popup */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent>
          {selectedAlert && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAlert.title}</DialogTitle>
                <DialogDescription>
                  Detailed information about this alert
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <p>
                  <strong>Status:</strong> {selectedAlert.status}
                </p>
                <p>
                  <strong>Severity:</strong> {selectedAlert.severity}
                </p>
                <p>
                  <strong>Description:</strong> {selectedAlert.description}
                </p>
                <p>
                  <strong>Location:</strong> {selectedAlert.location}
                </p>
                <p>
                  <strong>Assigned To:</strong> {selectedAlert.assignedTo}
                </p>
                <p>
                  <strong>Estimated Resolution:</strong>{" "}
                  {selectedAlert.estimatedResolution}
                </p>
                <p>
                  <strong>Timestamp:</strong> {selectedAlert.timestamp}
                </p>
              </div>
              <Separator />
              <div className="flex justify-end pt-2">
                <Button onClick={() => setSelectedAlert(null)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AlertsNotifications;
