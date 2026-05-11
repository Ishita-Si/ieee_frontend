import Link from "next/link";
import PillNav from "@/components/ui/PillNav";
import Footer from "@/components/ui/Footer";
import { ArrowRight, Code2, Zap, Trophy, Calendar, Users, Target, Rocket, Terminal } from "lucide-react";

export const metadata = {
  title: "KodeKurrent 2.0 — Hackathon | IEEE RGIPT",
  description:
    "KodeKurrent 2.0 is IEEE RGIPT's flagship hackathon. Build, innovate, and compete in 24 hours of intense coding.",
};

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "/#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const timeline = [
  { phase: "Registration Starts", date: "25 March, 2026", icon: Users, done: false },
  { phase: "Phase 1", date: "25 March - 5 April 2026", icon: Target, done: false },
  { phase: "Phase 2 & Opening Ceremony", date: "11-13 April (Opening 7PM 11th)", icon: Code2, done: false },
  { phase: "KodeKurrent 24-hr Hackathon", date: "10:30 PM 11th April - 10:30 PM 12th April", icon: Rocket, done: false },
  { phase: "Valedictory Ceremony", date: "13th April 2026", icon: Trophy, done: false },
];

const organizers = [
  { name: "Organizer Name", role: "Lead Organizer", team: "KodeKurrent Team" },
  { name: "Organizer Name", role: "Technical Head", team: "KodeKurrent Team" },
  { name: "Organizer Name", role: "Design Lead", team: "KodeKurrent Team" },
  { name: "Organizer Name", role: "Event Manager", team: "KodeKurrent Team" },
];

const tracks = [
  {
    title: "Web & App Dev",
    description: "Build full-stack web apps or mobile solutions that solve real-world problems.",
    gradient: "from-blue-600/80 to-indigo-600/80",
    icon: "🌍", // Changed to Earth for space theme
  },
  {
    title: "AI & ML",
    description: "Leverage machine learning, NLP, or computer vision to create intelligent solutions.",
    gradient: "from-fuchsia-600/80 to-purple-600/80",
    icon: "🧠",
  },
  {
    title: "Cybersecurity",
    description: "Design solutions that defend against threats and secure digital infrastructure.",
    gradient: "from-cyan-500/80 to-blue-600/80",
    icon: "🛡️",
  },
  {
    title: "Open Innovation",
    description: "Build anything that solves a real problem — any tech stack, any domain.",
    gradient: "from-orange-500/80 to-pink-600/80",
    icon: "🚀", // Changed to Rocket
  },
];

const prizes = [
  { place: "1st", amount: "₹15,000", extras: "Certificates, IEEE Goodies, Internship Opportunities", color: "from-yellow-300 to-amber-500" },
  { place: "2nd", amount: "₹10,000", extras: "Certificates, IEEE Goodies", color: "from-slate-300 to-slate-400" },
  { place: "3rd", amount: "₹5,000", extras: "Certificates, IEEE Goodies", color: "from-orange-400 to-red-500" },
];

export default function KodekurrentPage() {
  return (
    <div className="w-full min-h-screen text-white relative overflow-x-hidden bg-[#070714]">
      {/* Dynamic Starry/Nebula Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-700/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[40%] bg-fuchsia-700/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-800/20 rounded-full blur-[120px]" />
        {/* Constellation Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10">
        <PillNav items={navItems} />

        {/* HERO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-32 overflow-hidden">
          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-indigo-300 text-sm font-mono tracking-widest mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Rocket className="w-4 h-4" />
              IEEE RG-IPT PRESENTS
            </div>

            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none mb-4 drop-shadow-2xl">
              <span className="bg-gradient-to-br from-indigo-300 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">KODE</span>
              <span className="text-white">KURRENT</span>
            </h1>
            <p className="text-3xl sm:text-4xl text-indigo-200/50 font-light tracking-widest mb-6 uppercase">VERSION 2.0</p>

            <p className="text-lg sm:text-xl text-indigo-100/70 max-w-2xl mx-auto leading-relaxed mb-12">
              24 hours. 4 tracks. Unlimited possibilities.
              Build something extraordinary at IEEE RGIPT's flagship hackathon.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://kodekurrent.ieeergipt.in/"
                target="_self"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                Launch Sequence
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-indigo-400/60 hover:bg-indigo-500/10 text-white/80 hover:text-white rounded-2xl backdrop-blur-md transition-all"
              >
                Explore Mission
              </a>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-indigo-400 to-white/80 animate-pulse"></div>
            <p className="font-mono text-xs tracking-widest text-indigo-200/60 uppercase">Descend</p>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="w-full py-20 px-4 sm:px-8 lg:px-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-indigo-300/50 mb-4 font-mono">Mission Briefing</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-md">The Cosmos Calls</h2>
            <p className="text-indigo-100/70 text-lg leading-relaxed mb-4">
              KodeKurrent 2.0 is IEEE RGIPT's premier hackathon — a high-stakes, high-energy 24-hour battle of wit
              and engineering. Teams of 2–4 members collaborate to build innovative projects from scratch,
              pushing the limits of technology under real competition conditions.
            </p>
            <p className="text-indigo-100/70 text-lg leading-relaxed">
              Whether you're a seasoned developer or a first-time hacker, KodeKurrent 2.0 is your arena.
              Register using your ieeergipt.in account — one identity, one platform.
            </p>
          </div>
        </section>

        {/* TRACKS */}
        <section className="w-full py-20 px-4 sm:px-8 lg:px-12 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.5em] text-indigo-300/50 mb-4 font-mono">Exploration Zones</p>
              <h2 className="text-4xl sm:text-5xl font-bold">Tracks</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <div key={track.title} className="group relative p-6 rounded-2xl border border-indigo-500/20 bg-[#0c0c20]/60 backdrop-blur-xl hover:border-indigo-400/50 transition-all hover:scale-[1.02]">
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur-2xl bg-gradient-to-br ${track.gradient}`}></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{track.icon}</div>
                    <h3 className="font-bold text-lg mb-2 text-indigo-100">{track.title}</h3>
                    <p className="text-indigo-200/60 text-sm leading-relaxed">{track.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRIZES */}
        <section className="w-full py-20 px-4 sm:px-8 lg:px-12 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.5em] text-indigo-300/50 mb-4 font-mono">Bounty</p>
              <h2 className="text-4xl sm:text-5xl font-bold">Stellar Prizes</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {prizes.map((prize, i) => (
                <div key={prize.place} className={`relative p-6 rounded-2xl border border-indigo-500/20 bg-[#0c0c20]/60 backdrop-blur-xl text-center ${i === 0 ? "sm:scale-105 shadow-[0_0_40px_rgba(251,191,36,0.15)] border-yellow-500/30" : ""}`}>
                  <div className={`inline-flex w-14 h-14 rounded-full bg-gradient-to-br ${prize.color} items-center justify-center mb-4 mx-auto shadow-lg`}>
                    <Trophy className="w-7 h-7 text-black" />
                  </div>
                  <p className="font-mono text-indigo-300/60 text-sm mb-1">{prize.place} Place</p>
                  <p className={`text-4xl font-black mb-3 bg-gradient-to-r ${prize.color} bg-clip-text text-transparent drop-shadow-sm`}>{prize.amount}</p>
                  <p className="text-indigo-200/60 text-sm">{prize.extras}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="w-full py-20 px-4 sm:px-8 lg:px-12 relative">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.5em] text-indigo-300/50 mb-4 font-mono">Flight Path</p>
              <h2 className="text-4xl sm:text-5xl font-bold">Timeline</h2>
            </div>
            <div className="relative">
              {/* Constellation Line */}
              <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent"></div>
              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-6 relative group">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${item.done ? "bg-indigo-500 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]" : "bg-[#0c0c20] border-indigo-500/30 group-hover:border-indigo-400/80 transition-colors"} z-10`}>
                      <item.icon className={`w-5 h-5 ${item.done ? "text-white" : "text-indigo-300/50 group-hover:text-indigo-300 transition-colors"}`} />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-semibold text-lg text-indigo-50">{item.phase}</h3>
                      <p className="font-mono text-sm text-indigo-300/60 mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ORGANISERS */}
        <section className="w-full py-20 px-4 sm:px-8 lg:px-12 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.5em] text-indigo-300/50 mb-4 font-mono">Command Center</p>
              <h2 className="text-4xl sm:text-5xl font-bold">Organising Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {organizers.map((org, i) => (
                <div key={i} className="group relative p-6 rounded-2xl border border-indigo-500/20 bg-[#0c0c20]/60 backdrop-blur-xl hover:border-indigo-400/50 transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/80"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-300 group-hover:scale-110 group-hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      <Terminal className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-200 transition-colors">{org.name}</h3>
                    <p className="text-indigo-300/80 text-sm font-medium mb-1">{org.role}</p>
                    <p className="font-mono text-xs text-indigo-200/40 uppercase tracking-wider">{org.team}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 px-4 sm:px-8 lg:px-12 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-fuchsia-950/20 backdrop-blur-xl p-12 overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)]">
              {/* Star overlay specific to CTA */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Code2 className="w-10 h-10 text-indigo-300" />
                  </div>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">Ready to Launch?</h2>
                <p className="text-indigo-200/70 text-lg mb-8 max-w-xl mx-auto">
                  Create your account on ieeergipt.in (or use your existing one) and register your team on KodeKurrent.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://kodekurrent.ieeergipt.in/"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all hover:scale-105"
                  >
                    Go to KodeKurrent Portal
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-indigo-400/30 hover:border-indigo-400/60 hover:bg-indigo-500/10 text-indigo-100/90 hover:text-white rounded-2xl backdrop-blur-md transition-all"
                  >
                    Create ieeergipt.in Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}