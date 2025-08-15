import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  MapPin,
  Filter,
  Eye,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  FileSpreadsheet
} from "lucide-react";
import { format } from "date-fns";

const Reports = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDataType, setSelectedDataType] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const locations = [
    "All Locations",
    "Downtown District",
    "Residential Area A",
    "Residential Area B", 
    "Industrial Zone",
    "Commercial Hub",
    "Eco Park Zone"
  ];

  const dataTypes = [
    "All Data Types",
    "Traffic Analytics",
    "Environmental Data",
    "Utility Consumption",
    "Public Safety",
    "Citizen Complaints",
    "Infrastructure Status"
  ];

  const availableReports = [
    {
      id: 1,
      title: "Monthly Traffic Analysis",
      description: "Comprehensive traffic flow analysis with congestion patterns and peak hour insights",
      type: "Traffic Analytics",
      location: "Downtown District",
      dateRange: "Nov 1-30, 2024",
      status: "ready",
      lastGenerated: "2 hours ago",
      size: "2.4 MB",
      format: "PDF"
    },
    {
      id: 2,
      title: "Air Quality Trends Report",
      description: "Environmental monitoring data with AQI trends and pollution source analysis",
      type: "Environmental Data",
      location: "Industrial Zone",
      dateRange: "Oct 15 - Nov 15, 2024",
      status: "generating",
      lastGenerated: "In progress",
      size: "1.8 MB",
      format: "Excel"
    },
    {
      id: 3,
      title: "Utility Consumption Overview",
      description: "Water and electricity usage patterns across residential and commercial zones",
      type: "Utility Consumption",
      location: "All Locations",
      dateRange: "Q3 2024",
      status: "ready",
      lastGenerated: "1 day ago",
      size: "3.2 MB",
      format: "PDF"
    },
    {
      id: 4,
      title: "Citizen Complaint Summary",
      description: "Analysis of public complaints with sentiment trends and resolution metrics",
      type: "Public Safety",
      location: "All Locations",
      dateRange: "Last 30 days",
      status: "ready",
      lastGenerated: "4 hours ago",
      size: "1.1 MB",
      format: "Excel"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-success/20 text-success border-success/30';
      case 'generating': return 'bg-warning/20 text-warning border-warning/30';
      case 'error': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Traffic Analytics': return <BarChart3 className="w-4 h-4" />;
      case 'Environmental Data': return <LineChart className="w-4 h-4" />;
      case 'Utility Consumption': return <PieChart className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <section id="reports" className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-space-deep to-space-medium">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground heading-glow mb-2">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and export analytics data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters & Controls */}
          <div className="lg:col-span-1">
            <Card className="card-space p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-heading font-semibold text-foreground">Filters</h3>
              </div>
              
              <div className="space-y-4">
                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="bg-space-medium border-card-border">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Select location" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data Type Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Data Type</label>
                  <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                    <SelectTrigger className="bg-space-medium border-card-border">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Select data type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-space-medium border-card-border"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-space-medium border-card-border"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {dateTo ? format(dateTo, "MMM dd, yyyy") : "To date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Quick Generate</h4>
                <Button className="w-full justify-start bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-gradient-to-r from-success to-success-glow hover:from-success-glow hover:to-success text-success-foreground border-success"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </Card>
          </div>

          {/* Reports List & Preview */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Available Reports */}
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
                  Available Reports
                </h3>
                <div className="space-y-4">
                  {availableReports.map((report) => (
                    <Card 
                      key={report.id} 
                      className={`card-space p-4 cursor-pointer transition-all duration-300 ${
                        selectedReport?.id === report.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{report.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{report.dateRange}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{report.lastGenerated}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{report.size} • {report.format}</span>
                        </div>
                      </div>

                      {report.status === 'ready' && (
                        <div className="flex items-center space-x-2 mt-3">
                          <Button size="sm" variant="ghost" className="text-primary hover:text-primary-glow">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="ghost" className="text-success hover:text-success-glow">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* Report Preview */}
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
                  Live Report Preview
                </h3>
                <Card className="card-space p-6 h-[600px]">
                  {selectedReport ? (
                    <div className="space-y-6">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                          {getTypeIcon(selectedReport.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-heading font-semibold text-foreground">
                            {selectedReport.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            {selectedReport.description}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium text-foreground">{selectedReport.type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <p className="font-medium text-foreground">{selectedReport.location}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date Range:</span>
                            <p className="font-medium text-foreground">{selectedReport.dateRange}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Format:</span>
                            <p className="font-medium text-foreground">{selectedReport.format}</p>
                          </div>
                        </div>

                        {/* Sample Preview Content */}
                        <div className="bg-space-deep rounded-lg p-4 space-y-3">
                          <h5 className="font-medium text-foreground">Report Contents:</h5>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Executive Summary</li>
                            <li>• Data Analysis & Trends</li>
                            <li>• Key Performance Indicators</li>
                            <li>• Insights & Recommendations</li>
                            <li>• Appendix & Methodology</li>
                          </ul>
                        </div>

                        {selectedReport.status === 'ready' && (
                          <div className="flex space-x-3">
                            <Button className="flex-1 bg-gradient-to-r from-primary to-primary-glow">
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </Button>
                            <Button variant="outline" className="border-card-border">
                              <Eye className="w-4 h-4 mr-2" />
                              Full Preview
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                      <h4 className="text-lg font-heading font-semibold text-foreground mb-2">
                        Select a Report
                      </h4>
                      <p className="text-muted-foreground">
                        Choose a report from the list to view details and preview options
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reports;