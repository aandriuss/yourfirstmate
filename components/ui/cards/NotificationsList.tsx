import { NotificationCard } from "./NotificationCard";
import { LucideIcon } from "lucide-react";

interface NotificationItem {
  icon: LucideIcon;
  title: string;
  message: string;
  variant: "blue" | "amber" | "purple" | "red" | "green" | "gradient";
}

interface NotificationsListProps {
  notifications: NotificationItem[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  return (
    <div className="space-y-2">
      {notifications.map((notification, index) => (
        <NotificationCard
          key={index}
          icon={notification.icon}
          title={notification.title}
          message={notification.message}
          variant={notification.variant}
        />
      ))}
    </div>
  );
} 