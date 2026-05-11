"use client"

import Link from "next/link";
import PillNav from "@/components/ui/PillNav";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const perks = [
  {
    title: "Chapter Access",
    copy: "Hands-on labs, mentorship pods, and sprint rooms across RAS, Computer Society, WIE, and COMSIC.",
  },
  {
    title: "Mentor Pairing",
    copy: "Quarterly mentor rotations with alumni and industry partners to guide projects and research papers.",
  },
  {
    title: "Flagship Slots",
    copy: "Guaranteed shortlisting for IEEE-hosted hackathons, RoboQuest qualifiers, and Urjotsav showcases.",
  },
  {
    title: "Resource Library",
    copy: "Access to IEEE digital library, premium tooling credits, and internal documentation vault.",
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PillNav items={navItems} />
      <main className="px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        <section className="max-w-5xl mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Membership Portal</p>
          <h1 className="text-4xl sm:text-5xl font-semibold">Join the IEEE RGIPT Member Network</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Tap into the build culture that powers our robotics labs, code clinics, and research cohorts. Choose how you
            want to get started below.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition"
            >
              Sign up
            </Link>
            <Link
              href="/signin"
              className="px-6 py-3 rounded-full border border-white/40 text-white font-semibold hover:border-white transition"
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 shadow-[0_25px_80px_rgba(15,23,42,0.3)]"
            >
              <h3 className="text-xl font-semibold">{perk.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{perk.copy}</p>
            </div>
          ))}
        </section>

        <section className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-cyan-500/30 p-10 space-y-6 shadow-[0_45px_120px_rgba(56,189,248,0.20)]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.5em] text-white/70">Member Portal</p>
            <h2 className="text-3xl font-semibold">Annual Fee • ₹2,200</h2>
            <p className="text-white/80">
              On successful registration you’ll see the payment portal below. Razorpay integration will be connected to
              accept secure payments soon.
            </p>
          </div>
          <div className="rounded-2xl bg-black/50 border border-white/10 p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">Status</p>
              <p className="text-2xl font-semibold text-white mt-1">Awaiting Payment</p>
            </div>
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition"
            >
              Open Payment Portal
            </button>
          </div>
          <p className="text-xs text-white/70">
            Need help or a waiver? Reach out at{" "}
            <a href="mailto:ieee@rgipt.ac.in" className="underline">
              ieee@rgipt.ac.in
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}

