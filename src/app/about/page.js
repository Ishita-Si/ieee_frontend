"use client"
import PillNav from "@/components/ui/PillNav";
import AboutPage from "@/components/ui/about-page";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function AboutRoute() {
  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="relative z-10 w-full bg-black">
        <PillNav items={navItems} />
        <AboutPage />
      </div>
    </div>
  );
}

