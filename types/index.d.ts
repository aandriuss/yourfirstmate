import { User } from "@prisma/client";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

// subcriptions
export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

// compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
};

// landing sections
export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
};

export type FeatureLdg = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
};

export type TestimonialType = {
  name: string;
  job: string;
  image: string;
  review: string;
};

import { RefObject } from 'react';

export interface Destination {
  id: string;
  name: string;
  distance?: number;
  comfortLevel?: 'High' | 'Medium' | 'Low';
  time?: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  image?: string;
  rating?: number;
  description?: string;
  distanceNM?: number;
  sailingHours?: number;
  day?: number;
}

export interface TripDestination extends Destination {}

export interface SailingDestination {
  day: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  destination: string;
  distanceNM: number;
  duration: string;
  comfortLevel: string;
  safety: string;
}

export interface Port {
  port: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  top: string;
  comfortScore: string;
}

export interface SavedTrip {
  id: string;
  name: string;
  destinations: SailingDestination[];
  createdAt: string;
  updatedAt: string;
}

export interface TripPanelProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onTripStart: (coordinates: { lat: number; lon: number }) => void;
  portsData: Port[];
  mapRef: RefObject<mapboxgl.Map>;
  isPanelMinimized: boolean;
  onMinimizeChange: (minimized: boolean) => void;
}
