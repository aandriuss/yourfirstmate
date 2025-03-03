"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Icons } from "@/components/shared/icons";

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanTripModal({ isOpen, onClose }: PlanTripModalProps) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [destination, setDestination] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const sailingLevels = [
    { id: 'inside', label: 'Inside waters' },
    { id: 'coastal', label: 'Coastal' },
    { id: 'open', label: 'Open seas' },
    { id: 'ocean', label: 'Ocean master' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-1">New trip</h2>
          <p className="text-sm text-muted-foreground">You can change these details at any time.</p>
        </div>

        <div className="p-6 space-y-4">
          {/* AI Trip Planner Switch with gradient */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">AI trip planner</label>
              <p className="text-xs text-muted-foreground">Get intelligent route suggestions and safety alerts</p>
            </div>
            <CustomSwitch
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
            />
          </div>

          {/* Informational block - positioned under the switcher */}
          {aiEnabled ? (
            <div className="rounded-md border border-[#6366f1] p-3 bg-[#6366f1]/5">
              <p className="text-xs text-[#6366f1]">
                AI mode: We'll analyze weather patterns, sailing conditions, and your experience level to suggest the optimal route.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manual mode: Add your destinations one by one to create a custom journey with multiple stops.
              </p>
            </div>
          )}

          {/* Where are you going? - Regular styling */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Where are you going?</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for a destination" 
                className="pl-9"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          {/* Add Stop Button - Only show if AI is disabled */}
          {!aiEnabled && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Add stop
              </Button>
            </div>
          )}

          {/* Sailing Level Selection */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Select your sailing level</label>
            <div className="flex flex-wrap gap-2">
              {sailingLevels.map((level) => (
                <Badge
                  key={level.id}
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    selectedLevel === level.id && "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
                  )}
                  onClick={() => setSelectedLevel(level.id)}
                >
                  {level.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Create Trip Button */}
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              size="lg"
              disabled={!destination.trim()}
              variant={destination.trim() ? "default" : "outline"}
            >
              Create new trip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 