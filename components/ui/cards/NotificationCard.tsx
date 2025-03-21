import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NotificationCardProps {
  title: string;
  message: string;
  icon: LucideIcon;
  variant?: "blue" | "amber" | "purple" | "red" | "green";
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
    blue: "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/20 [&>div]:bg-blue-500 [&_svg]:text-blue-600 dark:[&_svg]:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/20 [&>div]:bg-amber-500 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-400",
    purple: "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/20 [&>div]:bg-purple-500 [&_svg]:text-purple-600 dark:[&_svg]:text-purple-400",
    red: "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/20 [&>div]:bg-red-500 [&_svg]:text-red-600 dark:[&_svg]:text-red-400",
    green: "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/20 [&>div]:bg-green-500 [&_svg]:text-green-600 dark:[&_svg]:text-green-400",
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border relative overflow-hidden",
      variants[variant],
      className
    )}>
      <div className="absolute top-0 left-0 h-full w-1" />
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
        <div>
          <div className="text-sm font-medium">{title}</div>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
} 