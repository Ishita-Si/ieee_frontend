"use client"
import React from 'react';
import Link from 'next/link';
import { Trophy, Calendar, ArrowRight } from 'lucide-react';
import { achievementsData } from '@/data/achievements-data';
import Image from 'next/image';

const AchievementPreview = ({ achievement, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative border-b border-white/10 pb-8 hover:border-white/20 transition-all duration-300 cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-all">
          {achievement.photos && achievement.photos[0] ? (
            <Image
              src={achievement.photos[0]}
              alt={achievement.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                if (e.target) {
                  e.target.style.display = 'none';
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white/20" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
              {achievement.category}
            </span>
            <div className="flex items-center gap-1 text-white/50 text-xs">
              <Calendar className="w-3 h-3" />
              <span>{achievement.date}</span>
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {achievement.title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4">
            {achievement.why?.substring(0, 150)}...
          </p>
          <div className="flex items-center gap-2 text-purple-300 text-sm font-medium group-hover:text-purple-200 transition-colors">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementsSection = () => {
  // Show only first 3 achievements on home page
  const featuredAchievements = achievementsData.slice(0, 3);

  return (
    <section id="achievements" className="relative w-full bg-black/0 py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Trophy className="w-5 h-5 text-purple-300" />
            <span className="text-purple-300 text-sm font-semibold">Our Achievements</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Our Achievements
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
            Discover how we organize events, why we do them, and celebrate our winners
          </p>
        </div>

        {/* Achievements List */}
        <div className="space-y-0 mb-12">
          {featuredAchievements.map((achievement) => (
            <AchievementPreview
              key={achievement.id}
              achievement={achievement}
              onClick={() => {
                window.location.href = `/achievements#${achievement.id}`;
              }}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:scale-105 active:scale-95"
          >
            View All Achievements
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
