"use client";

import React from "react";
import { Timeline } from "./timeline";

const timelineData = [
  {
    title: "September 2023",
    content: (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/60">
          <span className="h-px w-4 sm:w-6 bg-gradient-to-r from-white/30 to-transparent" />
          Orientation
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">IEEE SB Orientation</h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Kicked off the academic year by introducing freshers to the IEEE Student Branch roadmap, mentorship pods,
          and the impact tracks led by each chapter. Audience labs showcased hands-on demos that sparked 120+ new
          sign-ups.
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/70">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">600+ attendees</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">Live chapter booths</span>
        </div>
      </div>
    ),
  },
  {
    title: "October 2023",
    content: (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/60">
          <span className="h-px w-4 sm:w-6 bg-gradient-to-r from-white/30 to-transparent" />
          Workshop
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Computer Society Workshop 2.0</h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          A five-track immersion into CP+DSA, Web, Open Source, AI/ML, AR/VR, and App Dev. Every cohort shipped a
          mini-project, culminating in a showcase night with faculty reviews and peer awards.
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/70">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">40 hrs of labs</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">26 mentors</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">12 shipped apps</span>
        </div>
      </div>
    ),
  },
  {
    title: "November 2023",
    content: (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/60">
          <span className="h-px w-4 sm:w-6 bg-gradient-to-r from-white/30 to-transparent" />
          Hackathon
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">KodeKurrent Season 1 Finale</h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          A 48-hour on-campus hackathon that paired product strategists with builders to solve real campus problems.
          Highlights included rapid prototyping lounges, sponsor deep dives, and a live leaderboard on the lobby wall.
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/70">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">32 teams</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">7 sponsor challenges</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">₹2L prize pool</span>
        </div>
      </div>
    ),
  },
  {
    title: "January 2024",
    content: (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/60">
          <span className="h-px w-4 sm:w-6 bg-gradient-to-r from-white/30 to-transparent" />
          Robotics
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">RoboQuest Grand Relay</h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Line-follower relays plus an autonomous obstacle gauntlet designed by IEEE RAS. The finale featured a PID
          tuning pit stop and a "fix-within-15" challenge that drew huge crowds.
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/70">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">18 hardware squads</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">Custom track modules</span>
        </div>
      </div>
    ),
  },
  {
    title: "January 2025",
    content: (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/60">
          <span className="h-px w-4 sm:w-6 bg-gradient-to-r from-white/30 to-transparent" />
          Competition
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Data Visualisation Challenge 2.0</h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          A theme-anchored, case-driven data visualization challenge where participants navigated real-world datasets across healthcare, agriculture, and urban infrastructure to derive meaningful, high-impact insights. Winners showcased creativity, clarity, and impact in their visualizations.
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/70">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">100+ participants</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">₹15,000 prize pool</span>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15">Multiple tracks</span>
        </div>
      </div>
    ),
  },
];

const PastEventsTimeline = () => {
  return (
    <section className="relative w-full bg-black/0 py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 md:space-y-4 px-2">
        <p className="text-xs sm:text-sm uppercase tracking-[0.4em] sm:tracking-[0.65em] text-white/50">Heritage</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white px-2">
          Past events that <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">fuel our streak</span>
        </h2>
        <p className="text-white/70 text-sm sm:text-base px-2">
          A rolling log of releases, hackathons, and labs that shaped the IEEE RGIPT culture.
        </p>
      </div>

      <Timeline
        data={timelineData}
        variant="dark"
        title={null}
        description={null}
        className="mt-6 sm:mt-8 md:mt-10"
      />
    </section>
  );
};

export default PastEventsTimeline;


