"use client";

import { cn } from "@/lib/utils";
import { 
  Navigation, 
  Wind, 
  Anchor, 
  Ship,
  BarChart, 
  Route,
  Map,
  Sun,
  Trophy,
  AlertTriangle,
  Compass,
  ArrowUp,
  BookOpen,
  RotateCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Features() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <MaxWidthWrapper className="space-y-20">
          <HeaderSection
            label="Features"
          title="Sailing made simple."
          subtitle="Everything you need to sail with confidence, from route planning to real-time data and intelligent insights."
        />

        {/* Step 1: Research & Plan - Updated text */}
        <div className="flex flex-col lg:flex-row items-start gap-10">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="text-orange-500 font-medium">RESEARCH & PLAN</div>
            <h2 className="text-3xl font-bold tracking-tight">Manage Your Journeys</h2>
            <p className="text-muted-foreground">Create, save, and optimize your sailing journeys with AI-powered insights.</p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-2 mr-3">
                  <Map className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-medium">Save and Edit your Journeys</h3>
                  <p className="text-sm text-muted-foreground">Build a collection of your favorite routes and customize them anytime.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-2 mr-3">
                  <Route className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-medium">Get AI assessments for routes</h3>
                  <p className="text-sm text-muted-foreground">Receive intelligent analysis of weather conditions and route safety.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-2 mr-3">
                  <Anchor className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-medium">Import from Google Maps</h3>
                  <p className="text-sm text-muted-foreground">Add any location from Google Maps to your sailing itinerary.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-2 mr-3">
                  <Navigation className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-medium">Set coordinates precisely</h3>
                  <p className="text-sm text-muted-foreground">Create custom waypoints using exact latitude and longitude.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Enhanced Routes Card */}
          <div className="w-full lg:w-1/2 pt-4">
            <div className="rounded-2xl border bg-background p-6 overflow-hidden shadow-sm">
              <div className="flex items-start mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3 mr-4">
                  <Navigation className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-normal text-foreground">
                    AI enhanced journeys
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Discover optimal sailing paths with our AI-powered insights for safer, more enjoyable journeys.
                  </p>
                </div>
              </div>
              
              {/* Simplified route visualization */}
              <div className="relative bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 mt-2 mb-4">
                  <div className="relative">
                  {/* Main horizontal line with colored segments */}
                  <div className="relative h-1 w-full mb-10">
                    {/* Base gray line */}
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
                    
                    {/* Athens to Poros - Green segment */}
                    <div className="absolute left-[8%] w-[24%] h-full bg-green-500 rounded-sm"></div>
                    
                    {/* Poros to Hydra - Yellow segment */}
                    <div className="absolute left-[32%] w-[26%] h-full bg-yellow-500 rounded-sm"></div>
                    
                    {/* Hydra to Spetses - Red segment */}
                    <div className="absolute left-[58%] w-[34%] h-full bg-red-500 rounded-sm"></div>
                    
                    {/* Dots at ports */}
                    <div className="absolute left-[8%] top-0 w-4 h-4 -mt-1.5 -ml-2 bg-purple-500 rounded-full">
                      <div className="absolute inset-[3px] bg-white rounded-full"></div>
                    </div>
                    <div className="absolute left-[32%] top-0 w-4 h-4 -mt-1.5 -ml-2 bg-purple-500 rounded-full">
                      <div className="absolute inset-[3px] bg-white rounded-full"></div>
                    </div>
                    <div className="absolute left-[58%] top-0 w-4 h-4 -mt-1.5 -ml-2 bg-purple-500 rounded-full">
                      <div className="absolute inset-[3px] bg-white rounded-full"></div>
                    </div>
                    <div className="absolute left-[92%] top-0 w-4 h-4 -mt-1.5 -ml-2 bg-purple-500 rounded-full">
                      <div className="absolute inset-[3px] bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* City labels */}
                  <div className="flex justify-between px-5 -mt-7">
                    <div className="text-[11px] font-medium text-center -ml-8">
                      Athens
                      <div className="text-[9px] text-gray-500">Start Point</div>
                    </div>
                    <div className="text-[11px] font-medium text-center -ml-4">
                      Poros
                    </div>
                    <div className="text-[11px] font-medium text-center -ml-4">
                      Hydra
                    </div>
                    <div className="text-[11px] font-medium text-center -mr-8">
                      Spetses
                      <div className="text-[9px] text-gray-500">End Point</div>
                    </div>
                  </div>
                  
                  {/* Tags directly on the segments */}
                  <div className="flex px-8 -mt-6">
                    <div className="flex-1 flex justify-center">
                      <div className="rounded-full bg-green-500 text-white text-[9px] px-2 py-0.5">Comfortable</div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="rounded-full bg-yellow-500 text-white text-[9px] px-2 py-0.5">Moderate</div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="rounded-full bg-red-500 text-white text-[9px] px-2 py-0.5">Challenging</div>
                    </div>
                  </div>
                  
                  {/* ETA tags */}
                  <div className="flex justify-between px-14 mt-2">
                    <div className="rounded-full bg-blue-500 text-white text-[9px] px-2 py-0.5">
                      ETA: 3h 20m
                    </div>
                    <div className="rounded-full bg-blue-500 text-white text-[9px] px-2 py-0.5">
                      ETA: 2h 25m
                    </div>
                    <div className="rounded-full bg-blue-500 text-white text-[9px] px-2 py-0.5">
                      ETA: 3h 15m
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add AI Assessment notification with subtle purple gradient border */}
              <div className="mt-5 rounded-lg overflow-hidden relative">
                {/* Subtle gradient border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6366f1]/70 to-[#a855f7]/70"></div>
                
                {/* White background with small inset to show gradient border */}
                <div className="absolute inset-[1px] rounded-lg bg-white dark:bg-slate-900"></div>
                
                {/* Content */}
                <div className="relative p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {/* Purple dot indicator */}
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                    <span className="text-sm font-medium">AI Assessment</span>
                  </div>
                  
                  <div className="text-sm font-medium mb-2">
                    Predominant conditions: <span className="text-red-500">Challenging Sailing</span>
                  </div>

                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      WARNING: 1 day have potentially dangerous conditions for your skill level.
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    This journey may not be safe for your experience level. Consider rescheduling or choosing a different route.
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    The prevailing northerly winds (Meltemi-like conditions, even though it is not the peak Meltemi season), combined with the predicted wind speeds and wave heights, present significant challenges that exceed the capabilities of your skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Monitor */}
        <div className="flex flex-col-reverse lg:flex-row items-start gap-10">
          {/* Real-time Data Card */}
          <div className="w-full lg:w-1/2 pt-4">
            <div className="rounded-2xl border bg-background p-6 overflow-hidden shadow-sm">
              {/* Header */}
              <div className="flex items-start mb-6">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 rounded-full p-3 mr-4">
                  <BarChart className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-normal text-foreground mb-1">
                    Real-time data
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Get all critical metrics at your fingertips—weather, course, speed, and navigation data for informed decisions.
                  </p>
                </div>
              </div>

              {/* All metrics grid with consistent spacing */}
              <div className="grid grid-cols-1 gap-2">
                {/* First row - SOG, TWS, TWA */}
                <div className="grid grid-cols-3 gap-2">
                  {/* SOG with Comfortable tag */}
                  <div className="relative">
                    <Badge className="absolute -top-2 left-2 z-10 bg-green-500 border-0 text-white font-medium text-[10px] px-2 py-0.5">
                      Comfortable
                    </Badge>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">SOG (Speed Over Ground)</div>
                      <div className="text-2xl font-medium mt-1">6.8 <span className="text-xs font-normal">knots</span></div>
                      <div className="mt-2 h-8">
                        <svg viewBox="0 0 100 25" className="w-full h-full">
                          <path d="M0,18 L25,17 L50,15 L75,13 L100,10" 
                            fill="none" stroke="#3b82f6" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* TWS */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">TWS (True Wind Speed)</div>
                    <div className="text-2xl font-medium mt-1">14.6 <span className="text-xs font-normal">knots</span></div>
                    <div className="mt-2 h-8">
                      <svg viewBox="0 0 100 25" className="w-full h-full">
                        <path d="M0,12 L10,10 L20,15 L30,8 L40,13 L50,10 L60,14 L70,9 L80,12 L90,10 L100,13" 
                          fill="none" stroke="#818cf8" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* TWA - Updated with better wind direction icon */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">TWA (True Wind Angle)</div>
                    <div className="text-2xl font-medium mt-1">45° <span className="text-xs font-normal">port</span></div>
                    <div className="flex justify-center items-center h-8 mt-1">
                      <div className="relative w-8 h-8">
                        <div className="absolute inset-0 border border-slate-200 dark:border-slate-700 rounded-full"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-500 transform -translate-y-1/2 -rotate-45 origin-left"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second row - HDG, COG, Points of Sail */}
                <div className="grid grid-cols-3 gap-2">
                  {/* HDG */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">HDG (Heading)</div>
                    <div className="text-xl font-medium mt-1">135°</div>
                    <div className="flex justify-center items-center h-6 mt-1">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-slate-700 dark:text-slate-300 transform rotate-[135deg]">
                          <path fill="currentColor" d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* COG */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">COG (Course Over Ground)</div>
                    <div className="text-xl font-medium mt-1">140°</div>
                    <div className="flex justify-center items-center h-6 mt-1">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <ArrowUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 transform rotate-[140deg]" />
                      </div>
                    </div>
                  </div>

                  {/* Points of Sail - Restored line illustration */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Points of Sail</div>
                    <div className="text-xl font-medium mt-1">Beam Reach</div>
                    <div className="relative h-8 mt-2">
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 dark:bg-slate-700"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 text-[10px] text-blue-500">WIND</div>
                    </div>
                  </div>
                </div>

                {/* Third row - Wave Height & Period, Swell Direction, Next High Tide */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Wave Height & Period */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">Wave Height & Period</div>
                      <Badge 
                        variant="secondary"
                        className="bg-blue-50 hover:bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 h-auto font-medium"
                      >
                        Smooth
                      </Badge>
                    </div>
                    <div className="text-xl font-medium mt-1">1.2 <span className="text-xs font-normal">m</span></div>
                    <div className="text-[10px] text-muted-foreground">8s period</div>
                    <div className="mt-2 h-8">
                      <svg viewBox="0 0 100 25" className="w-full h-full">
                        <path d="M0,12 Q25,6 50,12 Q75,18 100,12" 
                          fill="none" stroke="#6366f1" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Swell Direction */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Swell Direction</div>
                    <div className="text-xl font-medium mt-1">125° <span className="text-xs font-normal">SE</span></div>
                    <div className="mt-2 h-8">
                      <div className="relative w-full h-full">
                        <svg viewBox="0 0 100 25" className="w-full h-full transform rotate-[125deg]">
                          <path d="M10,12 Q25,6 50,12 Q75,18 90,12" 
                            fill="none" stroke="#60a5fa" strokeWidth="2" />
                          <path d="M80,10 L90,12 L80,14" 
                            fill="none" stroke="#60a5fa" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Next High Tide */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Next High Tide</div>
                    <div className="text-xl font-medium mt-1">14:35</div>
                    <div className="mt-3 relative h-5 bg-blue-100 dark:bg-blue-900/30 rounded-md overflow-hidden">
                      <div className="absolute left-0 bottom-0 w-1/3 h-full bg-blue-200 dark:bg-blue-800/50"></div>
                      <div className="absolute left-[33%] top-0 h-full w-0.5 bg-blue-500"></div>
                      <div className="absolute left-[33%] top-[-4px] transform -translate-x-1/2">
                        <span className="text-[9px] text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-1 rounded">Now</span>
                      </div>
                      <div className="absolute right-1 bottom-0">
                        <span className="text-[9px] text-blue-700 dark:text-blue-300">2h left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="text-blue-500 font-medium">MONITOR</div>
            <h2 className="text-3xl font-bold">Custom Data</h2>
            <p className="text-muted-foreground">Get critical sailing metrics at your fingertips for informed decision-making.</p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 mr-3">
                  <Wind className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Weather conditions</h3>
                  <p className="text-sm text-muted-foreground">Real-time wind, waves, and weather data specific to your location.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 mr-3">
                  <Ship className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Vessel performance</h3>
                  <p className="text-sm text-muted-foreground">Track speed, heading, and other critical boat performance metrics.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 mr-3">
                  <Sun className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Tides and currents</h3>
                  <p className="text-sm text-muted-foreground">Accurate tide predictions and current patterns for your journey.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 mr-3">
                  <BarChart className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Visualized trends</h3>
                  <p className="text-sm text-muted-foreground">See how conditions will evolve over time with clear data visualizations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assistance Section */}
        <div className="flex flex-col lg:flex-row items-start gap-10">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="text-green-500 font-medium">ASSISTANCE</div>
            <h2 className="text-3xl font-bold">Actionable Assistance</h2>
            <p className="text-muted-foreground">Receive intelligent recommendations and alerts tailored to your skill level.</p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2 mr-3">
                  <AlertTriangle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Safety alerts</h3>
                  <p className="text-sm text-muted-foreground">Get warnings about dangerous conditions or navigation hazards.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2 mr-3">
                  <Navigation className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Tactical recommendations</h3>
                  <p className="text-sm text-muted-foreground">Receive suggestions on course changes to optimize your sail.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2 mr-3">
                  <Ship className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Vessel-specific advice</h3>
                  <p className="text-sm text-muted-foreground">Get guidance customized to your boat's characteristics.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2 mr-3">
                  <Trophy className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Skill development tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor your progress and improve your sailing abilities.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Personalized Guidance Card */}
          <div className="w-full lg:w-1/2 pt-4">
            <div className="rounded-2xl border bg-background p-6 overflow-hidden shadow-sm">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3 mr-4">
                  <Anchor className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-normal text-foreground">
                    Personalised guidance
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Receive tailored advice for your skill level, vessel type, and local maritime regulations.
                  </p>
                </div>
              </div>
              
              {/* Notifications UI */}
              <div className="space-y-3 mt-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1 bg-blue-500"></div>
                  <div className="flex items-start">
                    <RotateCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">Tactical Recommendation</div>
                      <p className="text-xs text-muted-foreground">Consider changing course by 15° to optimize for wind conditions.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1 bg-amber-500"></div>
                  <div className="flex items-start">
                    <Wind className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">Weather Update</div>
                      <p className="text-xs text-muted-foreground">Wind shift expected in 3 hours. Prepare for 15 knots from NW.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1 bg-purple-500"></div>
                  <div className="flex items-start">
                    <Ship className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">Vessel Alert</div>
                      <p className="text-xs text-muted-foreground">Prepare to reef. Wind increasing to 20 knots within next 30 minutes.</p>
                    </div>
                  </div>
                </div>
                
                {/* Add Pilot Book notification */}
                <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1 bg-red-500"></div>
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">Pilot Information</div>
                      <p className="text-xs text-muted-foreground">
                        Approaching Piraeus Approach Fairway. COLREGs Rules 9 & 10 apply. Maintain radio watch on VHF Ch. 12.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </MaxWidthWrapper>
    </section>
  );
}

