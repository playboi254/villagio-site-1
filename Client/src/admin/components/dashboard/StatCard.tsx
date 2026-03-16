import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/admin/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  iconColor?: "primary" | "accent" | "success" | "warning" | "info";
}

const iconColorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export function StatCard({ title, value, change, icon: Icon, iconColor = "primary" }: StatCardProps) {
  return (
    <Card className="hover-lift bg-card shadow-card border-0">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <p
                className={`text-sm font-medium flex items-center gap-1 ${
                  change.trend === "up" ? "text-success" : "text-destructive"
                }`}
              >
                <span>{change.trend === "up" ? "↑" : "↓"}</span>
                <span>{Math.abs(change.value)}%</span>
                <span className="text-muted-foreground font-normal">vs last month</span>
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconColorClasses[iconColor]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
