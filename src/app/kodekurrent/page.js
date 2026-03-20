import Link from "next/link";
import PillNav from "@/components/ui/PillNav";
import Footer from "@/components/ui/Footer";
import { ArrowRight, Code2, Zap, Trophy, Calendar, Users, Target } from "lucide-react";

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
  { phase: "Registration Opens", date: "Coming Soon", icon: Users, done: false },
  { phase: "Team Formation Deadline", date: "TBA", icon: Target, done: false },
  { phase: "Hackathon Begins", date: "TBA", icon: Zap, done: false },
  { phase: "Judging & Results", date: "TBA", icon: Trophy, done: false },
];

const tracks = [
  {
    title: "Web & App Dev",
    description: "Build full-stack web apps or mobile solutions that solve real-world problems.",
    gradient: "from-violet-500/80 to-fuchsia-600/80",
    icon: "🌐",
  },
  {
    title: "AI & ML",
    description: "Leverage machine learning, NLP, or computer vision to create intelligent solutions.",
    gradient: "from-cyan-400/80 to-blue-600/80",
    icon: "🤖",
  },
  {
    title: "Cybersecurity",
    description: "Design solutions that defend against threats and secure digital infrastructure.",
    gradient: "from-emerald-400/80 to-teal-600/80",
    icon: "🔐",
  },
  {
    title: "Open Innovation",
    description: "Build anything that solves a real problem — any tech stack, any domain.",
    gradient: "from-orange-400/80 to-red-600/80",
    icon: "💡",
  },
];

const prizes = [
  { place: "1st", amount: "₹15,000", extras: "Certificates, IEEE Goodies, Internship Opportunities", color: "from-yellow-400 to-amber-500" },
  { place: "2nd", amount: "₹10,000", extras: "Certificates, IEEE Goodies", color: "from-slate-300 to-slate-400" },
  { place: "3rd", amount: "₹5,000", extras: "Certificates, IEEE Goodies", color: "from-amber-600 to-orange-700" },
];

export default function KodekurrentPage() {
  return (
    <div className="w-full min-h-screen text-white relative overflow-x-hidden bg-black">
      <PillNav items={navItems} />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-32 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-sm font-mono tracking-widest mb-8">
            <Zap className="w-4 h-4" />
            IEEE RG-IPT PRESENTS
          </div>

          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none mb-4">
            <span className="bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-500 bg-clip-text text-transparent">KODE</span>
            <span className="text-white">KURRENT</span>
          </h1>
          <p className="text-3xl sm:text-4xl text-white/40 font-light tracking-widest mb-6">VERSION 2.0</p>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            24 hours. 4 tracks. Unlimited possibilities.
            Build something extraordinary at IEEE RGIPT's flagship hackathon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://kodekurrent.ieeergipt.in/register"
              target="_self"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:shadow-[0_0_50px_rgba(52,211,153,0.6)] transition-all hover:scale-105 active:scale-95"
            >
              Register Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white/80 hover:text-white rounded-2xl backdrop-blur-md transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/60"></div>
          <p className="font-mono text-xs tracking-widest text-white/60">SCROLL</p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="w-full py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-white/40 mb-4">What Is This?</p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">The Grid Calls</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-4">
            KodeKurrent 2.0 is IEEE RGIPT's premier hackathon — a high-stakes, high-energy 24-hour battle of wit
            and engineering. Teams of 2–4 members collaborate to build innovative projects from scratch,
            pushing the limits of technology under real competition conditions.
          </p>
          <p className="text-white/70 text-lg leading-relaxed">
            Whether you're a seasoned developer or a first-time hacker, KodeKurrent 2.0 is your arena.
            Register using your ieeergipt.in account — one identity, one platform.
          </p>
        </div>
      </section>

      {/* TRACKS */}
      <section className="w-full py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-white/40 mb-4">Competition Areas</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Tracks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track) => (
              <div key={track.title} className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/30 transition-all hover:scale-[1.02]">
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-3xl bg-gradient-to-br ${track.gradient}`}></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{track.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{track.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{track.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZES */}
      <section className="w-full py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-white/40 mb-4">What You Win</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Prizes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {prizes.map((prize, i) => (
              <div key={prize.place} className={`relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center ${i === 0 ? "sm:scale-105 shadow-[0_0_40px_rgba(251,191,36,0.2)]" : ""}`}>
                <div className={`inline-flex w-14 h-14 rounded-full bg-gradient-to-br ${prize.color} items-center justify-center mb-4 mx-auto`}>
                  <Trophy className="w-7 h-7 text-black" />
                </div>
                <p className="font-mono text-white/50 text-sm mb-1">{prize.place} Place</p>
                <p className={`text-4xl font-black mb-3 bg-gradient-to-r ${prize.color} bg-clip-text text-transparent`}>{prize.amount}</p>
                <p className="text-white/50 text-sm">{prize.extras}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="w-full py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-white/40 mb-4">Schedule</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Timeline</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10"></div>
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-6 relative">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${item.done ? "bg-emerald-500 border-emerald-500" : "bg-white/5 border-white/20"} z-10`}>
                    <item.icon className={`w-5 h-5 ${item.done ? "text-black" : "text-white/50"}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-lg">{item.phase}</h3>
                    <p className="font-mono text-sm text-white/40 mt-1 flex items-center gap-2">
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

      {/* CTA */}
      <section className="w-full py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 backdrop-blur-xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.04)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <Code2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-4">Ready to Hack?</h2>
              <p className="text-white/60 text-lg mb-8">
                Create your account on ieeergipt.in (or use your existing one) and register your team on KodeKurrent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://kodekurrent.ieeergipt.in/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:shadow-[0_0_50px_rgba(52,211,153,0.6)] transition-all hover:scale-105"
                >
                  Register on KodeKurrent
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white/80 hover:text-white rounded-2xl backdrop-blur-md transition-all"
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
  );
}
