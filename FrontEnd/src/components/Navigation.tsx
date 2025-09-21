import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import cityPulseLogo from "@/assets/citypulse-logo.png";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onRefresh: () => void;
}


const Navigation = ({ activeSection, onNavigate, onRefresh }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Predictive Analytics' },
    { id: 'zones', label: 'Zones' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'alerts', label: 'Alerts' }
  ];


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space-deep/80 backdrop-blur-xl border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
  src={cityPulseLogo} 
  alt="CityPulse 360°" 
  className="w-12 h-13 opacity-90 brightness-150 contrast-150"
/>

            <span className="text-xl font-heading font-bold text-foreground">
              CityPulse <span className="text-primary">360°</span>
            </span>
          </div>

          {/* Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onNavigate(item.id)}
                className={`
                  px-4 py-2 text-sm font-medium transition-all duration-300
                  ${activeSection === item.id 
                    ? 'bg-primary/20 text-primary border border-primary/30 glow-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-space-light'
                  }
                `}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-card-border bg-space-medium/50 hover:bg-space-light"
              onClick={onRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
