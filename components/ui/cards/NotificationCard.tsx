import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NotificationCardProps {
  title: string;
  message: string;
  icon: LucideIcon;
  variant?: "blue" | "amber" | "purple" | "red" | "green" | "gradient";
  className?: string;
}

export function NotificationCard({
  title,
  message,
  icon: Icon,
  variant = "blue",
  className
}: NotificationCardProps) {
  const variants = {
    blue: "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20",
    amber: "border-l-4 border-l-amber-500 bg-amber-50/50",
    purple: "border-l-4 border-l-purple-500 bg-purple-50/50",
    red: "border-l-4 border-l-red-500 bg-red-50/50",
    green: "border-l-4 border-l-green-500 bg-green-50/50",
    gradient: "border-l-4 border-l-transparent bg-white [background-image:linear-gradient(to_bottom,#6366f1,#a855f7)] [border-image:linear-gradient(to_bottom,#6366f1,#a855f7)_1]",
  };

  const titleColors = {
    blue: "text-[#8B5CF6]",
    amber: "text-amber-500",
    purple: "text-purple-500",
    red: "text-red-500",
    green: "text-green-500",
    gradient: "text-primary",
  };

  return (
    <div className={cn(
      "p-3 rounded-lg",
      variants[variant],
      className
    )}>
      <div className="flex items-start">
        <Icon className={cn(
          "h-4 w-4 mr-2 flex-shrink-0 mt-0.5",
          variant === 'blue' ? "text-[#8B5CF6]" : variant === 'gradient' ? "text-primary" : "text-gray-500"
        )} />
        <div>
          <div className={cn("text-sm font-medium", titleColors[variant])}>{title}</div>
          <p className={cn(
            "text-xs",
            variant === 'blue' ? "text-[#8B5CF6]/90" : "text-gray-500"
          )}>{message}</p>
        </div>
      </div>
    </div>
  );
} 