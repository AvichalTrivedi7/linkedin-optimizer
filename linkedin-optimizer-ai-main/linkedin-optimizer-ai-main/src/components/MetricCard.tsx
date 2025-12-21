import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  description?: string;
  className?: string;
}

export const MetricCard = ({
  icon: Icon,
  label,
  value,
  trend,
  description,
  className,
}: MetricCardProps) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div
      className={cn(
        "glass-card p-4 transition-all duration-300 hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span className={cn("text-xs font-medium", getTrendColor())}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};
