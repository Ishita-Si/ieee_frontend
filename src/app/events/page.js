"use client"
import PillNav from "@/components/ui/PillNav";
import EventsPage from "@/components/ui/events-page";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "/" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function EventsRoute() {
  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="relative z-10 w-full bg-black">
        <PillNav items={navItems} />
        {/* Match home page section padding: py-4 sm:py-8 md:py-12 lg:py-16 and px-4 sm:px-6 md:px-8 lg:px-12 */}
        <div className="w-full py-4 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12">
          <EventsPage isOpen={true} isFullPage={true} />
        </div>
      </div>
    </div>
  );
}