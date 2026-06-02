"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HERO,
  HERO_GALLERY,
  MARQUEE_GALLERY,
  MISSION,
  OFFERINGS,
  TIMELINE,
  CTA,
} from "@/data/about-data";

const t = {
  page: "min-h-screen bg-[#050505] text-white font-sans",
  grain:
    "fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]",
  section: "py-16 px-4 sm:px-8 max-w-7xl mx-auto",
  divider: "border-b border-white/10",
  band: "bg-white/[0.02] border-y border-white/10",
  label: "text-purple-400 text-xs font-bold uppercase tracking-[0.2em]",
  h1: "text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05]",
  h2: "text-3xl sm:text-4xl font-bold text-white",
  body: "text-zinc-400 leading-relaxed",
  primaryBtn:
    "inline-flex items-center justify-center px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-purple-50 transition-colors",
  secondaryBtn:
    "inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-colors",
  statPill:
    "px-4 py-2 rounded-full text-sm border border-white/10 bg-white/5 text-white inline-flex items-baseline gap-2",
  statValue: "font-bold text-white",
  statLabel: "text-zinc-400 text-xs uppercase tracking-wider",
  timelineLine: "border-l border-white/10",
  timelineDot:
    "absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-[#050505] shadow-[0_0_0_4px_#050505]",
  yearBadge:
    "text-pink-400 font-mono text-xs border border-pink-500/20 px-2 py-0.5 rounded bg-pink-500/5",
};

const blobStyles = `
  @keyframes about-blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .about-animate-blob {
    animation: about-blob 20s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }
  .about-animation-delay-2000 { animation-delay: 2s; }
  .about-animation-delay-4000 { animation-delay: 4s; }
`;

const marqueeStyles = `
  @keyframes about-marquee-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .about-marquee-track {
    display: flex;
    width: max-content;
    gap: 1rem;
    animation: about-marquee-scroll 45s linear infinite;
  }
  .about-marquee-track:hover {
    animation-play-state: paused;
  }
  @media (prefers-reduced-motion: reduce) {
    .about-marquee-track {
      animation: none;
      flex-wrap: wrap;
      width: 100%;
      justify-content: center;
    }
  }
`;

function AboutPhoto({ src, alt, className = "", priority = false }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function AboutBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <style>{blobStyles}</style>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 about-animate-blob" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 about-animate-blob about-animation-delay-2000" />
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 about-animate-blob about-animation-delay-4000" />
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className={`${t.label} mb-3`}>{children}</p>;
}

function SectionShell({ children, className = "", band = false, divider = true }) {
  return (
    <section
      className={[
        band ? t.band : "",
        divider && !band ? t.divider : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={t.section}>{children}</div>
    </section>
  );
}

function HeroSection() {
  return (
    <SectionShell divider>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className={`${t.label} mb-4`}>{HERO.eyebrow}</p>
          <h1 className={`${t.h1} mb-6`}>{HERO.title}</h1>
          <p className={`${t.body} text-lg max-w-xl mb-8`}>{HERO.subtitle}</p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link href={HERO.primaryCta.href} className={t.primaryBtn}>
              {HERO.primaryCta.label}
            </Link>
            <Link href={HERO.secondaryCta.href} className={t.secondaryBtn}>
              {HERO.secondaryCta.label}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {HERO.stats.map((stat) => (
              <div key={stat.label} className={t.statPill}>
                <span className={t.statValue}>{stat.value}</span>
                <span className={t.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {HERO_GALLERY.map((item) => (
            <div
              key={item.src}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
            >
              <AboutPhoto
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function GallerySlide({ src, alt }) {
  return (
    <div className="relative flex-shrink-0 w-72 sm:w-80 h-52 sm:h-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
      <AboutPhoto src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function GallerySection() {
  const slides = [...MARQUEE_GALLERY, ...MARQUEE_GALLERY];

  return (
    <SectionShell divider className="overflow-hidden">
      <style>{marqueeStyles}</style>
      <SectionLabel>LIFE AT IEEE</SectionLabel>
      <h2 className={`${t.h2} mb-8`}>Moments from our events</h2>

      <div className="relative -mx-4 sm:-mx-8 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="about-marquee-track py-2">
          {slides.map((item, index) => (
            <GallerySlide
              key={`${item.src}-${index}`}
              src={item.src}
              alt={item.alt}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function PillarCard({ title, description, accent, glow, badge, ring }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 sm:p-7 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl ${glow} ${ring}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div
        className={`absolute left-0 top-0 right-0 h-0.5 bg-gradient-to-r ${badge} opacity-70 group-hover:opacity-100 transition-opacity`}
      />
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${accent} opacity-70 group-hover:w-1.5 transition-all`}
      />

      <div className="relative pl-3">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-purple-100">
          {title}
        </h3>
        <p className={`${t.body} text-sm leading-relaxed`}>{description}</p>
      </div>

      <div
        className={`pointer-events-none absolute -right-10 -bottom-10 h-28 w-28 rounded-full ${accent} opacity-[0.12] blur-3xl group-hover:opacity-25 transition-opacity`}
      />
    </article>
  );
}

function MissionSection() {
  return (
    <SectionShell divider>
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <SectionLabel>{MISSION.label}</SectionLabel>
          <h2 className={`${t.h2} mb-4`}>{MISSION.title}</h2>
          <p className={t.body}>{MISSION.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Excellence", "Community", "Impact"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-300"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-6 h-px w-full max-w-[12rem] bg-gradient-to-r from-purple-500 via-pink-500 to-transparent" />
        </div>

        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
          {MISSION.pillars.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function ProgramCard({ title, description, tag, stripe, tint }) {
  return (
    <article
      className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-xl hover:shadow-purple-500/10"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tint} opacity-80`} />
      <div
        className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${stripe}`}
      />

      <div className="relative flex flex-1 flex-col">
        <span className="mb-4 inline-flex w-fit rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
          {tag}
        </span>
        <h3 className="mb-3 text-xl font-bold leading-snug text-white">
          {title}
        </h3>
        <p className={`${t.body} mb-6 flex-1 text-sm leading-relaxed`}>
          {description}
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 transition-colors hover:text-white"
        >
          Explore events
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  );
}

function OfferingsSection() {
  return (
    <SectionShell band divider={false}>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel>{OFFERINGS.label}</SectionLabel>
          <h2 className={t.h2}>{OFFERINGS.title}</h2>
        </div>
        <p className={`${t.body} max-w-sm text-sm sm:text-right`}>
          Workshops, hackathons, lectures, and IEEE programs built for every
          stage of your journey at RGIPT.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {OFFERINGS.programs.map((program) => (
          <ProgramCard key={program.title} {...program} />
        ))}
      </div>
    </SectionShell>
  );
}

function TimelineEntry({ year, title, description, isLast }) {
  return (
    <div
      className={`relative pl-8 ${isLast ? "pb-0" : "pb-12"} ${t.timelineLine}`}
    >
      <div className={t.timelineDot} />
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
        <span className={t.yearBadge}>{year}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className={`${t.body} text-sm max-w-xl`}>{description}</p>
    </div>
  );
}

function TimelineSection() {
  return (
    <SectionShell divider>
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div>
          <SectionLabel>{TIMELINE.label}</SectionLabel>
          <h2 className={t.h2}>{TIMELINE.title}</h2>
          <p className={`${t.body} mt-4 max-w-md`}>
            Our journey is marked by continuous growth and recognition on
            national and international platforms.
          </p>
        </div>

        <div className="pt-2">
          {TIMELINE.entries.map((entry, idx) => (
            <TimelineEntry
              key={entry.year}
              {...entry}
              isLast={idx === TIMELINE.entries.length - 1}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function CTASection() {
  return (
    <SectionShell band divider={false}>
      <div className="text-center max-w-2xl mx-auto">
        <SectionLabel>{CTA.label}</SectionLabel>
        <h2 className={`${t.h2} mb-4`}>{CTA.title}</h2>
        <p className={`${t.body} mb-10`}>{CTA.description}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={CTA.primaryCta.href} className={t.primaryBtn}>
            {CTA.primaryCta.label}
          </Link>
          <Link href={CTA.secondaryCta.href} className={t.secondaryBtn}>
            {CTA.secondaryCta.label}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

export default function AboutPage() {
  return (
    <div className={t.page}>
      <AboutBackground />
      <div className={t.grain} />
      <main className="relative z-10 pt-20 md:pt-24 pb-16">
        <HeroSection />
        <GallerySection />
        <MissionSection />
        <OfferingsSection />
        <TimelineSection />
        <CTASection />
      </main>
    </div>
  );
}
