"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import Footer from "@/components/ui/Footer";
import { bootcampService } from "@/lib/bootcamp";
import { useAuth } from "@/components/providers/SessionProvider";
import { authService } from "@/lib/auth";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "/#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const SLUG_POSTER_MAP = {
  'robotics-workshop-2026': '/images/posters/robotics-workshop.png',
  'devwave-2026': '/images/posters/devwave.png',
  'codenex-3': '/images/posters/codenex.png',
};

const STATIC_EVENTS_MAP = {
  'robotics-workshop-2026': {
    slug: 'robotics-workshop-2026',
    title: 'Introduction to Robotics',
    category: 'Workshop',
    tagline: 'Hands-On Robotics Workshop for First-Year RGIPT Students',
    duration: '22 August 2026 (Tentative)',
    banner_url: '/images/posters/robotics-workshop.png',
    short_description: 'An interactive, hands-on introduction to Robotics & Automation, giving first-year students practical exposure to how sensors, electronics, programming, microcontrollers and control logic come together to build a functional Line Following Robot (LFR) system.',
    description: 'An interactive, hands-on introduction to Robotics & Automation, giving first-year students practical exposure to how sensors, electronics, programming, microcontrollers and control logic come together to build a functional robotic system.\n\nOrganized by IEEE RGIPT Student Branch in collaboration with Science & Technology (S&T) Council, RGIPT.\nFor: Newly admitted First-Year Students, RGIPT.',
    highlights: [
      'Robotics Fundamentals & Basic Robotic Components',
      'Line Following Robots (LFR) Architecture',
      'Sensors & Microcontrollers Integration',
      'Control Logic, Electronics & Programming',
      'Hands-on experience with working LFR robots',
      'Mentorship from IEEE RGIPT & S&T Council members'
    ],
    topics: ['Robotics', 'Automation', 'Sensors', 'Microcontrollers', 'LFR', 'Electronics', 'Control Logic'],
    registrationDisabled: true,
    isUpcoming: true,
    statusNote: 'Registration Opening Soon — Details will be announced by IEEE RGIPT & S&T Council.'
  },
  'devwave-2026': {
    slug: 'devwave-2026',
    title: 'DEVWAVE 2026',
    category: 'Bootcamp',
    tagline: 'Full-Stack Development & UI/UX Bootcamp',
    duration: 'May 2026',
    banner_url: '/images/posters/devwave.png',
    short_description: 'IEEE RGIPT\'s flagship full-stack development bootcamp exploring UI/UX, frontend, backend, and React.',
    description: 'DEVWAVE 2026 was IEEE RGIPT\'s flagship full-stack development bootcamp. Students explored UI/UX, frontend, backend, and React development with mentorship from senior developers.',
    highlights: [
      'UI/UX Design Principles',
      'Modern Frontend Development (React / Next.js)',
      'Backend APIs & Database Architecture',
      'Hands-On Project Mentorship'
    ],
    topics: ['Full-Stack', 'React', 'Node.js', 'UI/UX', 'Web Development'],
    registrationDisabled: true,
    isCompleted: true,
    statusNote: 'Event Completed — Check out past highlights in the event archive.'
  },
  'codenex-3': {
    slug: 'codenex-3',
    title: 'CodeNex 3.0',
    category: 'Bootcamp',
    tagline: 'Master Data Structures & Algorithms Step by Step',
    duration: 'May 2026 (10-Week Program)',
    banner_url: '/images/posters/codenex.png',
    short_description: 'A 10-week structured DSA learning program focused on problem-solving, coding logic, interview preparation, contests, and guided practice.',
    description: 'CodeNex 3.0 was IEEE RGIPT\'s 10-week structured DSA program designed to master data structures and algorithms with weekly contests and interview preparation.',
    highlights: [
      'Weekly Coding Contests',
      'Practice Problems & Solution Guides',
      'Interview Preparation & Mock Sessions',
      'Data Structures & Algorithms Mastery'
    ],
    topics: ['DSA', 'Algorithms', 'Competitive Programming', 'Interview Prep', 'C++ / Java / Python'],
    registrationDisabled: true,
    isCompleted: true,
    statusNote: 'Event Completed — Check out past archives in the event portal.'
  }
};

function bannerSrc(url, slug) {
  if (!url || url.match(/\/images\/posters\/(?:4|6)\.png$/)) {
    return SLUG_POSTER_MAP[slug] || '/images/posters/devwave.png';
  }
  return url;
}

export default function BootcampEventPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const isSignedIn = !!user || authService.isAuthenticated();
  const [event, setEvent] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPageLoading(true);
      const r = await bootcampService.getEventBySlug(slug);
      if (cancelled) return;
      if (!r.success) {
        if (STATIC_EVENTS_MAP[slug]) {
          setEvent(STATIC_EVENTS_MAP[slug]);
          setLoadError("");
        } else {
          setLoadError(r.error || "Program not found");
          setEvent(null);
        }
      } else {
        setEvent(r.event);
        setLoadError("");
      }
      setPageLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug || authLoading) return;
    (async () => {
      if (!isSignedIn) {
        setRegistered(false);
        setUpdates([]);
        return;
      }
      const st = await bootcampService.registrationStatus(slug);
      setRegistered(!!st.registered);
      if (st.registered) {
        setUpdatesLoading(true);
        const u = await bootcampService.getUpdates(slug);
        if (u.success) setUpdates(u.updates);
        setUpdatesLoading(false);
      } else {
        setUpdates([]);
      }
    })();
  }, [slug, user, authLoading, isSignedIn]);

  const handleRegister = async () => {
    if (!isSignedIn) {
      router.push(`/signin?redirect=${encodeURIComponent(`/events/${slug}`)}`);
      return;
    }
    setRegLoading(true);
    setToast("");
    const r = await bootcampService.register(slug);
    setRegLoading(false);
    if (r.success) {
      setToast("Registered successfully! Check your email for confirmation.");
      setRegistered(true);
      setUpdatesLoading(true);
      const u = await bootcampService.getUpdates(slug);
      if (u.success) setUpdates(u.updates);
      setUpdatesLoading(false);
    } else {
      setToast(r.error || "Could not register");
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className="min-h-screen bg-black text-white">
        <PillNav items={navItems} />
        <div className="max-w-xl mx-auto px-4 py-32 text-center">
          <p className="text-white/60 mb-6">{loadError || "Not found"}</p>
          <Link href="/events" className="text-purple-400 hover:underline">
            Back to events
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <PillNav items={navItems} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> All events
        </Link>

        <div className="rounded-2xl overflow-hidden border border-white/10 mb-10">
          <div className="aspect-[21/9] bg-white/5 relative">
            <img
              src={bannerSrc(event.banner_url, slug)}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="text-xs uppercase tracking-widest text-purple-300 mb-2">
                {event.category || "Program"}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold">{event.title}</h1>
              {event.tagline && (
                <p className="text-lg text-white/80 mt-2 max-w-2xl">{event.tagline}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-10 text-sm text-white/70">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Calendar className="w-4 h-4" />
            {event.duration}
          </span>
        </div>

        {toast && (
          <div
            className={`mb-8 px-4 py-3 rounded-lg border text-sm ${
              toast.includes("success")
                ? "border-green-500/40 bg-green-500/10 text-green-200"
                : "border-red-500/40 bg-red-500/10 text-red-200"
            }`}
          >
            {toast}
          </div>
        )}

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap">
            {event.description || event.short_description}
          </p>
        </div>

        {event.highlights?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> Highlights
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {event.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {event.topics?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {event.topics.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm bg-purple-500/15 border border-purple-500/30 text-purple-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {event.roadmap && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Learning roadmap</h2>
            <pre className="whitespace-pre-wrap text-white/75 font-sans text-sm leading-relaxed bg-white/5 border border-white/10 rounded-xl p-6">
              {event.roadmap}
            </pre>
          </section>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 mb-16">
          {event.registrationDisabled ? (
            event.isCompleted ? (
              <div>
                <h3 className="font-semibold text-lg text-purple-300">Event Completed</h3>
                <p className="text-white/60 text-sm mt-1">
                  {event.statusNote || "This program has concluded. Check out our active events and past highlights."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-cyan-300">Registration Opening Soon</h3>
                  <p className="text-white/60 text-sm mt-1">
                    {event.statusNote || "Registration details will be announced soon by IEEE RGIPT & S&T Council."}
                  </p>
                </div>
                <button
                  type="button"
                  disabled
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/60 font-semibold cursor-not-allowed text-sm min-w-[180px]"
                >
                  Registration Opening Soon
                </button>
              </div>
            )
          ) : registered ? (
            <div>
              <p className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Registered successfully
              </p>
              <p className="text-white/60 text-sm mb-6">
                You have full access to program updates below.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Join this program</h3>
                <p className="text-white/50 text-sm">
                  Sign in with your IEEE RGIPT account, then register in one click.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRegister}
                disabled={regLoading || authLoading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold disabled:opacity-50 min-w-[160px]"
              >
                {regLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : authLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : isSignedIn ? (
                  "Register now"
                ) : (
                  "Sign in to register"
                )}
              </button>
            </div>
          )}

          {registered && (
            <section className="mt-10 border-t border-white/10 pt-10">
              <h3 className="text-lg font-semibold mb-4">Program updates</h3>
              {updatesLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              ) : updates.length === 0 ? (
                <p className="text-white/50 text-sm">No updates posted yet.</p>
              ) : (
                <ul className="space-y-4">
                  {updates.map((u) => (
                    <li
                      key={u._id}
                      className="p-4 rounded-xl bg-black/40 border border-white/10"
                    >
                      <h4 className="font-medium text-white">{u.title}</h4>
                      {u.short_description && (
                        <p className="text-white/60 text-sm mt-1">{u.short_description}</p>
                      )}
                      <a
                        href={u.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-sm text-purple-400 hover:text-purple-300"
                      >
                        Open resource <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
