"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { infos } from "@/config/landing";
// import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import { PlanTripModal } from "@/components/modals/plan-trip-modal";
// import InfoLanding from "@/components/sections/info-landing";
// import Powered from "@/components/sections/powered";
// import PreviewLanding from "@/components/sections/preview-landing";
// import Testimonials from "@/components/sections/testimonials";

export default function IndexPage() {
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);

  // Use a more robust approach to handle duplicate headers
  useEffect(() => {
    // Function to handle headers
    const handleHeaders = () => {
      const headers = document.querySelectorAll('header');
      if (headers.length > 1) {
        // Keep only the first header
        for (let i = 1; i < headers.length; i++) {
          headers[i].remove(); // Actually remove them instead of just hiding
        }
      }
    };

    // Run immediately
    handleHeaders();
    
    // Also set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(handleHeaders);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Clean up
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Our header - this will be kept */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">YourFirstMate</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground">
              Blog
            </Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground">
              Documentation
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlanningModalOpen(true)}
                className={cn(
                  buttonVariants({ 
                    variant: "default",
                    size: "sm" 
                  }),
                  "rounded-full px-4"
                )}
              >
                Plan Trip
              </button>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ 
                    variant: "outline",
                    size: "sm" 
                  }),
                  "rounded-full"
                )}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero section with Go Planning button */}
      <HeroLanding onPlanClick={() => setIsPlanningModalOpen(true)} />

      {/* Features section */}
      <Features />

      {/* Modal */}
      <PlanTripModal 
        isOpen={isPlanningModalOpen}
        onClose={() => setIsPlanningModalOpen(false)}
      />
      
      {/* Remove these generic components */}
      {/* <PreviewLanding /> */}
      {/* <Powered /> */}
      {/* <BentoGrid /> */}
      {/* <InfoLanding data={infos[0]} reverse={true} /> */}
      
      {/* Remove generic testimonials */}
      {/* <Testimonials /> */}
    </>
  );
}
