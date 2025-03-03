"use client"; // Convert to client component for interactivity

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { PlanTripModal } from "@/components/modals/plan-trip-modal";

// Define the confetti function type
declare global {
  interface Window {
    confetti?: any;
  }
}

interface HeroLandingProps {
  onPlanClick: () => void;
}

export default function HeroLanding({ onPlanClick }: HeroLandingProps) {
  // Stars count can be moved to a server component that loads this client component
  // For simplicity, we'll just use a default value for now
  const stars = 100;
  const [showConfetti, setShowConfetti] = useState(false);
  
  const launchConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Hide after 3 seconds
  }, []);

  return (
    <>
      {/* Keep the fixed positioning but use a larger number of confetti pieces with variation */}
      {showConfetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(80)].map((_, i) => {
            // Create random offsets for each confetti piece
            const xOffset = Math.random() * 40 - 20; // Between -20px and 20px
            const rotationSpeed = 0.5 + Math.random() * 1.5; // Random rotation speed
            
            return (
              <div 
                key={i} 
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#8c54ff', '#5ce1e6'][
                    Math.floor(Math.random() * 8)
                  ],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`, // Varied durations (2-4s)
                  width: `${Math.random() * 8 + 5}px`,
                  height: `${Math.random() * 8 + 5}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  '--x-offset': `${xOffset}px`, // Set the CSS variable for path offsets
                  '--rotation-speed': rotationSpeed, // Speed modifier for rotation
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}
    
      <section className="space-y-6 py-12 sm:py-20 lg:py-24">
        <div className="container flex max-w-5xl flex-col items-center gap-6 text-center">
          {/* Confetti button with updated text and gradient */}
          <div className="min-h-10 flex items-center justify-center mb-2">
            <button
              onClick={launchConfetti}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
                "px-4 cursor-pointer"
              )}
            >
              <span className="mr-3">🎉</span>
              <span>
                Introducing the{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold">
                  AI Co-Captain
                </span>
                {" "}for Every Sailor ⛵
              </span>
            </button>
          </div>

          {/* Main heading with improved leading */}
          <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px] leading-[1.05] max-w-4xl">
            Embark on a Stress-Free Sailing Adventure with{" "}
            <span className="text-gradient_indigo-purple font-extrabold">
              YourFirstMate
            </span>
          </h1>

          {/* Description with improved leading */}
          <p className="max-w-2xl text-balance leading-[1.6] text-muted-foreground sm:text-xl sm:leading-[1.7] mt-2 mb-4">
            AI-powered assistant tailored according to your experience and
            vessel, gathers all the weather, location, maritime information and
            provides real-time actionable alerts to simplify the complexities of
            sailing so you can focus on the adventure with the maximum comfort.
          </p>

          {/* Buttons with improved spacing */}
          <div className="flex justify-center space-x-3 md:space-x-4 mt-2">
            <button
              onClick={onPlanClick}
              className={cn(
                buttonVariants({ size: "lg", rounded: "full" }),
                "gap-2 px-6"
              )}
            >
              <span>Go Planning</span>
              <Icons.arrowRight className="size-4" />
            </button>
            <Link
              href="#"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                  rounded: "full",
                }),
                "px-6"
              )}
            >
              <span className="mr-2">📌</span>
              <p>
                <span className="hidden sm:inline-block">View</span> examples
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
