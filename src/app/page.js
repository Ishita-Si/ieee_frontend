"use client";

import { Suspense, useRef, useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PillNav from "@/components/ui/PillNav";
import Footer from "@/components/ui/Footer";

// Lazy load heavy components
const HeroGeometric = dynamic(() => import("@/components/ui/shape-landing-hero").then(mod => ({ default: mod.HeroGeometric })), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
});
const SponsorsSection = dynamic(() => import("@/components/ui/sponsors-section"), { 
  ssr: false 
});
const EventsSection = dynamic(() => import("@/components/ui/events-section"), { 
  ssr: false 
});
const PastEventsTimeline = dynamic(() => import("@/components/ui/past-events-timeline"), { 
  ssr: false 
});
const ContainerScroll = dynamic(() => import("@/components/ui/container-scroll-animation").then(mod => ({ default: mod.ContainerScroll })), { 
  ssr: false 
});

import { sponsorsData } from "@/data/sponsors-data";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const announcements = [
  {
    id: 1,
    image: "/images/posters/devwave.png",
    badge: "Bootcamp",
    title: "DEVWAVE 2026 — Now Open",
    description: "DEVWAVE 2026 is IEEE RGIPT's flagship full-stack development bootcamp. Learn modern web technologies, build real projects, and get mentored by senior developers and IEEE professionals.",
    description2: "Open to all undergraduate students. Limited seats available. Register now to secure your spot and get access to exclusive study material, live sessions, and project reviews.",
    primaryButton: { text: "Learn More", href: "/events/devwave-2026" },
    secondaryButton: { text: "Register Now", href: "/events/devwave-2026" }
  },
  {
    id: 2,
    image: "/images/posters/codenex.png",
    badge: "Bootcamp",
    title: "CodeNex 3.0 — DSA Program",
    description: "CodeNex 3.0 is IEEE RGIPT's 10-week structured DSA program designed to help you master data structures and algorithms from scratch to advanced, with weekly contests and interview-oriented practice.",
    description2: "Sharpen your problem-solving skills, prepare for technical interviews, and compete in weekly coding contests. Open to all students — register now to join the program.",
    primaryButton: { text: "Learn More", href: "/events/codenex-3" },
    secondaryButton: { text: "Register Now", href: "/events/codenex-3" }
  },
  {
    id: 3,
    image: "/images/posters/9.png",
    badge: "Workshop",
    title: "Technical Workshop Series",
    description: "Join us for an intensive technical workshop series covering the latest trends in robotics, AI, and automation. Learn from industry experts and get hands-on experience with cutting-edge technologies.",
    description2: "Our workshops are designed for all skill levels, from beginners to advanced practitioners. Register now to secure your spot!",
    primaryButton: { text: "Register Now", href: "/events" },
    secondaryButton: { text: "View Schedule", href: "/events" }
  },
  {
    id: 4,
    image: "/images/posters/2.png",
    badge: "Competition",
    title: "IEEE Robotics Competition 2025",
    description: "Showcase your robotics skills in our annual competition. Compete with teams from across the region and win exciting prizes. Registration is now open!",
    description2: "This year's competition features new challenges and categories. Whether you're a beginner or an expert, there's a category for you.",
    primaryButton: { text: "Register", href: "/events" },
    secondaryButton: { text: "Learn More", href: "/events" }
  },
];

const chapterCards = [
  {
    id: "ras",
    title: "IEEE RAS",
    subtitle: "Robotics & Automation Society",
    description:
      "Autonomous systems, bio-mechanics labs, and rapid prototyping rigs driven by our RAS fellows.",
    accent: "from-cyan-400/80 via-blue-500/80 to-purple-600/80",
    href: "/chapters/ras",
  },
  {
    id: "cs",
    title: "IEEE CS",
    subtitle: "Computer Society",
    description:
      "Flagship hackathons, full-stack build weeks, and low-level labs curated by the Computer Society.",
    accent: "from-violet-500/80 via-fuchsia-500/80 to-pink-500/80",
    href: "/chapters/code-club",
  },
  {
    id: "wie",
    title: "IEEE WIE",
    subtitle: "Women in Engineering",
    description:
      "Leadership cohorts, industry mentorship, and inclusive labs amplifying women technologists.",
    accent: "from-rose-400/80 via-orange-400/80 to-amber-400/80",
    href: "/chapters/women",
  },
  {
    id: "comsic",
    title: "IEEE COMSOC",
    subtitle: "Comms & Signal Society",
    description:
      "Deep dives into SDR, radar labs, and futuristic comms challenges across the COMSOC stack.",
    accent: "from-emerald-400/80 via-teal-400/80 to-sky-400/80",
    href: "/chapters/comsoc",
  },
];

export default function Home() {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const videoRef = useRef(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const announcementIntervalRef = useRef(null);
  const chaptersContainerRef = useRef(null);

  const toggleVideoAudio = () => {
    setIsVideoMuted((prev) => {
      const nextState = !prev;
      if (videoRef.current) {
        videoRef.current.muted = nextState;
        if (!nextState) {
          videoRef.current
            .play()
            .catch(() => {
              /* noop */
            });
        }
      }
      return nextState;
    });
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      setIsVideoPlaying(true);
      videoRef.current.play().catch(() => {
        /* noop */
      });
    }
  };

  const handleVideoPause = () => {
    if (videoRef.current && !isVideoHovered) {
      setIsVideoPlaying(false);
      videoRef.current.pause();
    }
  };

  const handleVideoMouseEnter = () => {
    setIsVideoHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        /* noop */
      });
    }
  };

  const handleVideoMouseLeave = () => {
    setIsVideoHovered(false);
    if (videoRef.current && !isVideoPlaying) {
      videoRef.current.pause();
    }
  };

  // Track visitor
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const sessionId = sessionStorage.getItem('visitor_session_id') || 
                         `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('visitor_session_id', sessionId);
        
        // Add timeout to prevent blocking
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/visitors/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            page_visited: window.location.pathname,
            referrer: document.referrer || '',
            session_id: sessionId
          }),
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        if (error.name !== 'AbortError') {
          console.log('Visitor tracking failed:', error);
        }
      }
    };
    
    // Delay tracking slightly to not block initial render
    const timer = setTimeout(trackVisitor, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play announcements
  useEffect(() => {
    announcementIntervalRef.current = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000); // Change every 5 seconds

    return () => {
      if (announcementIntervalRef.current) {
        clearInterval(announcementIntervalRef.current);
      }
    };
  }, []);

  const resetAnnouncementTimer = useCallback(() => {
    if (announcementIntervalRef.current) {
      clearInterval(announcementIntervalRef.current);
    }
    announcementIntervalRef.current = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
  }, []);

  const goToNextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    resetAnnouncementTimer();
  };

  const goToPreviousAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
    resetAnnouncementTimer();
  };

  const goToAnnouncement = (index) => {
    setCurrentAnnouncement(index);
    resetAnnouncementTimer();
  };

  // Nested scrolling for chapters section on mobile
  // Chapters container scrolls first, then page scrolls when at top/bottom
  useEffect(() => {
    const container = chaptersContainerRef.current;
    if (!container || typeof window === 'undefined') return;

    // Only apply on mobile
    const checkMobile = () => window.innerWidth < 768;
    if (!checkMobile()) return;

    let touchStartY = 0;
    let touchStartScrollTop = 0;

    const handleWheel = (e) => {
      if (!checkMobile()) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // If scrolling up and at top, allow page scroll
      if (e.deltaY < 0 && isAtTop) {
        return; // Allow default page scroll
      }

      // If scrolling down and at bottom, allow page scroll
      if (e.deltaY > 0 && isAtBottom) {
        return; // Allow default page scroll
      }

      // Otherwise, scroll the container and prevent page scroll
      e.preventDefault();
      e.stopPropagation();
      container.scrollTop += e.deltaY;
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartScrollTop = container.scrollTop;
    };

    const handleTouchMove = (e) => {
      if (!checkMobile()) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Check if we're at the top or bottom
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // If scrolling up at top, allow page scroll
      if (deltaY < 0 && isAtTop) {
        return; // Allow default page scroll
      }

      // If scrolling down at bottom, allow page scroll
      if (deltaY > 0 && isAtBottom) {
        return; // Allow default page scroll
      }

      // Otherwise, prevent page scroll and scroll container
      e.preventDefault();
      e.stopPropagation();
      container.scrollTop = touchStartScrollTop + deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="w-full min-h-screen text-white relative overflow-x-hidden" style={{ backgroundColor: '#FF0000' }}>
      <div className="relative z-10 w-full" style={{ backgroundColor: '#000000' }}>
        <PillNav items={navItems} />

        <HeroGeometric
          imageSrc="/ieee logo.png"
          imageAlt="IEEE"
        />

        {/* Announcement Section - Slider with 9:16 Images */}
        <section className="w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Slider Container */}
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentAnnouncement * 100}%)` }}
                >
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="min-w-full grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center"
                    >
                      {/* Image Poster - Left Side - 10:16 Aspect Ratio */}
                      <div className="relative w-full mx-auto max-w-sm md:max-w-md">
                        <div className="relative w-full" style={{ aspectRatio: '11/16' }}>
                          <img
                            src={announcement.image}
                            alt={announcement.title}
                            className="w-full h-full object-cover rounded-2xl md:rounded-3xl border border-white/10 shadow-lg"
                          />
                        </div>
                      </div>

                      {/* Text Content - Right Side */}
                      <div className="space-y-4 md:space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                          <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">
                            {announcement.badge}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                          {announcement.title}
                        </h2>
                        <p className="text-base md:text-lg text-white/70 leading-relaxed">
                          {announcement.description}
                        </p>
                        <p className="text-base md:text-lg text-white/70 leading-relaxed">
                          {announcement.description2}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link
                            href={announcement.primaryButton.href}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black font-semibold rounded-lg transition-all hover:scale-105 active:scale-95"
                          >
                            {announcement.primaryButton.text}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <Link
                            href={announcement.secondaryButton.href}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                          >
                            {announcement.secondaryButton.text}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={goToPreviousAnnouncement}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors active:scale-95"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </button>
              <button
                onClick={goToNextAnnouncement}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors active:scale-95"
                aria-label="Next announcement"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToAnnouncement(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentAnnouncement
                        ? "bg-white w-8"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to announcement ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Immersive IEEE video - Reduced padding */}
        <section className="w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
          <div 
            className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-black flex justify-center items-center"
            onMouseEnter={handleVideoMouseEnter}
            onMouseLeave={handleVideoMouseLeave}
          >
            <video
              ref={videoRef}
              className="w-full min-h-[40vh] md:min-h-[60vh] object-contain mx-auto"
              src="/videos/ieee_v2.mp4"
              loop
              playsInline
              muted={isVideoMuted}
              preload="metadata"
            />
            {!isVideoPlaying && !isVideoHovered && (
              <button
                onClick={handleVideoPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity hover:bg-black/30 group"
                aria-label="Play video"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </button>
            )}
            <button
              onClick={toggleVideoAudio}
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-sm font-semibold tracking-wide hover:bg-white/25 transition z-10"
            >
              {isVideoMuted ? "🔊 Audio" : "🔇 Mute"}
            </button>
          </div>
        </section>

        {/* IEEE Chapters showcase - Reduced padding and tighter spacing */}
        <section
          id="chapters"
          className="w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12"
        >
          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/50">
              Chapters
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
              IEEE Societies & Fellowships
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-3xl mx-auto">
              Scroll to explore the four verticals steering innovation at
              IEEE RGIPT — each tile jumps you into its deep dives, labs,
              and flagship releases.
            </p>
          </div>
          
          {/* Mobile: Vertical scrollable grid with scrollbar */}
          <div className="md:hidden">
            <div 
              ref={chaptersContainerRef}
              className="chapters-vertical-scroll max-h-[70vh] overflow-y-auto overflow-x-hidden"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className="grid grid-cols-1 gap-4 p-2">
                {chapterCards.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={chapter.href}
                    className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col justify-between hover:border-white/30 transition cursor-pointer"
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-3xl bg-gradient-to-br ${chapter.accent}`}
                    />
                    <div className="relative z-10 space-y-2">
                      <span
                        className={`inline-flex text-xs tracking-[0.4em] uppercase px-3 py-1 rounded-full bg-gradient-to-r ${chapter.accent} text-white/90`}
                      >
                        {chapter.title}
                      </span>
                      <h3 className="text-xl font-semibold">{chapter.subtitle}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="relative z-10 mt-4 text-sm font-semibold text-white/80 group-hover:text-white transition flex items-center gap-2">
                      Jump In
                      <span className="inline-flex w-7 h-7 rounded-full border border-white/30 items-center justify-center group-hover:translate-x-1 transition text-sm">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Original ContainerScroll */}
          <div className="hidden md:block">
            <ContainerScroll
              titleComponent={null}
            >
              <div className="grid grid-cols-2 gap-4 md:gap-5 h-full w-full p-4 md:p-6">
                {chapterCards.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={chapter.href}
                    className="group relative p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl h-full flex flex-col justify-between hover:border-white/30 transition cursor-pointer"
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-3xl bg-gradient-to-br ${chapter.accent}`}
                    />
                    <div className="relative z-10 space-y-2">
                      <span
                        className={`inline-flex text-xs tracking-[0.4em] uppercase px-3 md:px-4 py-1 rounded-full bg-gradient-to-r ${chapter.accent} text-white/90`}
                      >
                        {chapter.title}
                      </span>
                      <h3 className="text-xl md:text-2xl font-semibold">{chapter.subtitle}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="relative z-10 mt-4 text-sm font-semibold text-white/80 group-hover:text-white transition flex items-center gap-2">
                      Jump In
                      <span className="inline-flex w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/30 items-center justify-center group-hover:translate-x-1 transition text-sm">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </ContainerScroll>
          </div>
        </section>

        {/* Membership CTA - Reduced padding and tighter internal spacing */}
        <section className="w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto rounded-2xl md:rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 space-y-4 md:space-y-6 text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/60">
              Become A Member
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
              Access perks, labs, and the IEEE RGIPT portal
            </h2>
            <p className="text-white/70 text-base max-w-3xl mx-auto">
              Join us to unlock chapter-specific mentorship, lab reservations,
              and the unified payment portal (₹2200 via Razorpay) that keeps
              your membership active across all societies.
            </p> 
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/membership"
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-base text-white shadow-lg shadow-purple-500/40 hover:scale-[1.02] transition"
              >
                View Perks & Join
              </Link>
              <Link
                href="/signin"
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl border border-white/30 text-base text-white/90 hover:text-white hover:border-white/60 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl border border-white/30 text-base text-white/90 hover:text-white hover:border-white/60 transition"
              >
                Sign Up
              </Link>
            </div>
            <p className="text-xs text-white/60 pt-2">
              Secure Razorpay payments, instant receipts, and member dashboard
              access the moment your ₹2200 fee is confirmed.
            </p>
          </div>
        </section>

        {/* Sponsors Section - Infinite scrolling */}
        <SponsorsSection sponsors={sponsorsData} />

        {/* Events sections - Reduced padding */}
        <div className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
          <EventsSection />
        </div>

        
        <div className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
          <PastEventsTimeline />
        </div>

        <Footer />
      </div>
    </div>
  );
}
