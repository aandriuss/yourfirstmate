import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { TripProvider } from "@/context/trip-context";

export const metadata = constructMetadata({
  title: "Plan Your Trip",
  description: "Interactive map to plan your next adventure.",
});

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  // Get current user but don't restrict access - the map page should be public
  const user = await getCurrentUser();
  
  return (
    <TripProvider>
      {children}
    </TripProvider>
  );
}