import { LucideIcon } from "lucide-react";

interface NotificationItem {
  icon: LucideIcon;
  title: string;
  message: string;
  variant?: "blue" | "amber" | "purple" | "red" | "green";
  borderColor?: string;
}

interface NotificationsListProps {
  notifications: NotificationItem[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const getVariantStyles = (variant: string = 'blue') => {
    const styles = {
      blue: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10",
      amber: "border-l-amber-500 bg-amber-50 dark:bg-amber-900/10",
      purple: "border-l-purple-500 bg-purple-50 dark:bg-purple-900/10",
      red: "border-l-red-500 bg-red-50 dark:bg-red-900/10",
      green: "border-l-green-500 bg-green-50 dark:bg-green-900/10",
    };
    
    const iconColors = {
      blue: "text-blue-600 dark:text-blue-400",
      amber: "text-amber-600 dark:text-amber-400",
      purple: "text-purple-600 dark:text-purple-400",
      red: "text-red-600 dark:text-red-400",
      green: "text-green-600 dark:text-green-400",
    };
    
    return {
      container: styles[variant as keyof typeof styles],
      icon: iconColors[variant as keyof typeof iconColors],
    };
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification, index) => {
        const variantStyles = getVariantStyles(notification.variant);
        
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg border-l-4 p-4 ${variantStyles.container}`}
          >
            <div className="flex items-start">
              {notification.icon && (
                <notification.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${variantStyles.icon}`}
                />
              )}
              <div>
                <div className="text-sm font-medium">{notification.title}</div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 