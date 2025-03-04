import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CustomSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function CustomSwitch({ checked, onCheckedChange }: CustomSwitchProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-blue-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </Switch>
  );
}