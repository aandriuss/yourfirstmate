import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  icon: LucideIcon;
  iconColor?: "blue" | "purple" | "green" | "orange";
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SectionCard({
  icon: Icon,
  iconColor = "blue",
  title,
  description,
  children,
  className
}: SectionCardProps) {
  const iconColors = {
    blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-500",
    purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-500",
    green: "bg-green-100 dark:bg-green-900/20 text-green-500",
    orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-500",
  };

  return (
    <div className={cn("rounded-2xl border bg-background p-6 overflow-hidden shadow-sm", className)}>
      <div className="flex items-start mb-6">
        <div className={cn("rounded-full p-3 mr-4", iconColors[iconColor])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-normal text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
} 