import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  status?: 'good' | 'warning' | 'critical';
}

const KPICard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  icon, 
  status = 'good' 
}: KPICardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return status === 'critical' ? 'text-destructive' : 'text-success';
      case 'down':
        return status === 'good' ? 'text-destructive' : 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusGlow = () => {
    switch (status) {
      case 'critical':
        return 'border-destructive/30 shadow-[0_0_20px_hsl(var(--destructive)/0.3)]';
      case 'warning':
        return 'border-warning/30 shadow-[0_0_20px_hsl(var(--warning)/0.3)]';
      default:
        return 'border-success/30 shadow-[0_0_20px_hsl(var(--success)/0.3)]';
    }
  };

  return (
    <Card className={cn(
      "card-space p-6 interactive-glow group cursor-pointer",
      getStatusGlow()
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          {trend && trendValue && (
            <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-space-light rounded-lg group-hover:bg-space-medium transition-colors">
          <div className="text-primary">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KPICard;