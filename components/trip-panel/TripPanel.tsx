import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from "@/components/shared/icons";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useTripPanel } from './hooks/useTripPanel';
import { TripPanelContent } from './components/TripPanelContent';
import { SaveTripModal } from './components/SaveTripModal';
import { UnsavedChangesModal } from './components/UnsavedChangesModal';
import { useResizablePanel } from './hooks/useResizablePanel';
import { useMediaQuery } from './hooks/useMediaQuery';

import { useTrip } from '@/context/trip-context';
import { useSession } from "next-auth/react";
import { TripPanelProps } from '@/types';
import { SailingDestination, Port } from '@/types';

const MIN_WIDTH = 300;
const MAX_WIDTH = 800;
const NAVBAR_HEIGHT = {
  MOBILE: '3.5rem', // 56px
  DESKTOP: '3.5rem' // 64px
};

export interface TripPanelHandle {
  getCurrentDestinations: () => SailingDestination[];
}

export const TripPanel = forwardRef<TripPanelHandle, TripPanelProps>(
  (props, ref) => {
    const {
      isOpen,
      isEditMode,
      onClose,
      onTripStart,
      portsData,
      mapRef,
      isPanelMinimized,
      onMinimizeChange
    } = props;
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const { setCurrentDestination, clearDestination } = useTrip();
    const panelRef = useRef<HTMLDivElement | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const { width, setIsResizing } = useResizablePanel({
      minWidth: MIN_WIDTH,
      maxWidth: MAX_WIDTH,
      defaultWidth: 500,
      isMobile
    });

    const tripPanelHook = useTripPanel({
      mapRef,
      isEditMode,
      onTripStart,
      portsData,
      onClose: () => {
        clearDestination();
        onClose();
      },
      onDestinationSelect: (port: Port) => {
        setCurrentDestination(port.port);
      }
    });

    useImperativeHandle(ref, () => ({
      getCurrentDestinations: () => tripPanelHook.selectedDestinations
    }));

    if (!isOpen && !isPanelMinimized) return null;

    return (
      <>
        {/* Panel Minimize/Maximize Buttons - Outside the panel */}
        {!isMobile && (
          <div className="fixed left-0 top-1/2 z-50 -translate-y-1/2">
            {isPanelMinimized ? (
              <Button
                variant="secondary"
                className={cn(buttonVariants({ variant: "secondary" }), "h-32 rounded-l-none rounded-r-lg shadow-lg")}
                onClick={() => onMinimizeChange(false)}
              >
                <Icons.chevronRight className="size-6" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                className={cn(buttonVariants({ variant: "secondary" }), "h-32 rounded-l-none rounded-r-lg shadow-lg")}
                style={{ marginLeft: `${width}px` }}
                onClick={() => onMinimizeChange(true)}
              >
                <Icons.chevronLeft className="size-6" />
              </Button>
            )}
          </div>
        )}
    
        {/* Main Panel Content */}
        {!isPanelMinimized && (
          <>
            <div
              ref={panelRef}
              className={cn(
                "fixed z-[60] bg-card text-card-foreground shadow-lg transition-all duration-300",
                "border-border",
                isMobile
                  ? "inset-x-0 top-14 border-t pb-20"
                  : "left-0 top-14 border-r md:top-14"
              )}
              style={{
                width: isMobile ? '100%' : `${width}px`,
                height: isMobile
                  ? 'calc(100vh - 3.5rem)'
                  : `calc(100vh - ${NAVBAR_HEIGHT.DESKTOP})`,
                maxHeight: '100vh'
              }}
            >
              {!isMobile && (
                <div
                  className="absolute right-0 top-0 z-50 h-full w-1 cursor-ew-resize hover:bg-primary/20"
                  onMouseDown={() => setIsResizing(true)}
                />
              )}

              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(buttonVariants({ variant: "ghost" }), "absolute right-2 top-2 z-[200]")}
                  onClick={() => tripPanelHook.handleClose()}
                >
                  <Icons.close className="size-5" />
                </Button>
              )}
              <ScrollArea className="h-full">
                <TripPanelContent
                  isAuthenticated={isAuthenticated}
                  portsData={portsData}
                  tripPanelHook={tripPanelHook}
                />
              </ScrollArea>
            </div>

            {/* Modals - Outside the panel container */}
            <SaveTripModal
              initialName={
                tripPanelHook.savedTrips.find(
                  (trip) => trip.id === tripPanelHook.currentTripId
                )?.name
              }
              isOpen={tripPanelHook.isSaveModalOpen}
              isUpdate={!!tripPanelHook.currentTripId}
              onClose={() => tripPanelHook.setIsSaveModalOpen(false)}
              onSave={tripPanelHook.handleSaveTrip}
            />

            <UnsavedChangesModal
              isOpen={tripPanelHook.showUnsavedChangesModal}
              onClose={() => tripPanelHook.setShowUnsavedChangesModal(false)}
              onDontSave={tripPanelHook.closePanel}
              onSave={() => {
                tripPanelHook.setShowUnsavedChangesModal(false);
                tripPanelHook.setIsSaveModalOpen(true);
              }}
            />
          </>
        )}

        {/* Mobile Close/Minimize Buttons */}
        {!isPanelMinimized && isMobile && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className={cn(buttonVariants({ variant: "secondary" }), "fixed bottom-6 left-4 z-[200] shadow-lg")}
              onClick={() => tripPanelHook.handleClose()}
            >
              <Icons.close className="size-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={cn(buttonVariants({ variant: "secondary" }), "fixed bottom-6 right-4 z-[200] shadow-lg")}
              onClick={() => onMinimizeChange(true)}
            >
              <ChevronDown className="size-6" />
            </Button>
          </>
        )}
      </>
    );
  }
);

TripPanel.displayName = 'TripPanel';

export default TripPanel;