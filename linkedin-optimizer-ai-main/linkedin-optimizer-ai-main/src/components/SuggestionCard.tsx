import { cn } from "@/lib/utils";
import { LucideIcon, CheckCircle2, AlertCircle, Info, Lightbulb } from "lucide-react";

type SuggestionType = "success" | "warning" | "info" | "tip";

interface SuggestionCardProps {
  type: SuggestionType;
  title: string;
  description: string;
  className?: string;
}

const typeConfig: Record<SuggestionType, { icon: LucideIcon; bgColor: string; iconColor: string; borderColor: string }> = {
  success: {
    icon: CheckCircle2,
    bgColor: "bg-success/10",
    iconColor: "text-success",
    borderColor: "border-success/20",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-warning/10",
    iconColor: "text-warning",
    borderColor: "border-warning/20",
  },
  info: {
    icon: Info,
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  tip: {
    icon: Lightbulb,
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
    borderColor: "border-accent/20",
  },
};

export const SuggestionCard = ({
  type,
  title,
  description,
  className,
}: SuggestionCardProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01]",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className={cn("p-2 rounded-lg h-fit", config.bgColor)}>
        <Icon className={cn("w-5 h-5", config.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
