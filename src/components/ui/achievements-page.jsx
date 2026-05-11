"use client"
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, Users, Award, ArrowRight, Image as ImageIcon, Target, Lightbulb, Users2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { achievementsData, getCategories } from '@/data/achievements-data';
import Image from 'next/image';

const AchievementTimelineItem = ({ achievement, index, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 mb-16 md:mb-24 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Timeline Line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/30 via-blue-500/30 to-purple-500/30 -translate-x-1/2" />
      
      {/* Timeline Dot */}
      <div className="hidden md:block absolute left-1/2 top-12 w-4 h-4 rounded-full bg-purple-500 border-4 border-black -translate-x-1/2 z-10" />

      {/* Content */}
      <div className={`flex-1 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
        {/* Date */}
        <div className={`flex items-center gap-2 text-white/60 text-sm mb-3 ${isEven ? 'md:justify-end' : ''}`}>
          <Calendar className="w-4 h-4" />
          <span>{achievement.date}</span>
        </div>

        {/* Title */}
        <h2 
          onClick={onClick}
          className="text-2xl md:text-3xl font-bold text-white mb-4 cursor-pointer hover:text-purple-300 transition-colors"
        >
          {achievement.title}
        </h2>

        {/* Category */}
        <div className={`inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4 ${isEven ? 'md:ml-auto' : ''}`}>
          {achievement.category}
        </div>

        {/* Stats */}
        <div className={`flex flex-wrap gap-3 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
          {achievement.stats && Object.entries(achievement.stats).slice(0, 2).map(([key, value]) => (
            <div key={key} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-white/60 capitalize">{key}: </span>
              <span className="text-xs font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>

        {/* Preview Description */}
        <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
          {achievement.why?.substring(0, 120)}...
        </p>

        {/* View Details Button */}
        <button
          onClick={onClick}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all hover:scale-105 ${isEven ? 'md:ml-auto' : ''}`}
        >
          <span>View Details</span>
          <ArrowRight className={`w-4 h-4 ${isEven ? 'md:rotate-180' : ''}`} />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 relative h-64 md:h-80 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={onClick}>
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
            <ImageIcon className="w-16 h-16 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    </div>
  );
};

const AchievementsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['All', ...getCategories()];
  const filteredAchievements = selectedCategory === 'All' 
    ? achievementsData 
    : achievementsData.filter(a => a.category === selectedCategory);

  const nextImage = () => {
    if (selectedAchievement && selectedAchievement.photos) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedAchievement.photos.length);
    }
  };

  const prevImage = () => {
    if (selectedAchievement && selectedAchievement.photos) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedAchievement.photos.length) % selectedAchievement.photos.length);
    }
  };

  return (
    <div className="relative min-h-screen py-24 md:py-28 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Trophy className="w-5 h-5 text-purple-300" />
            <span className="text-purple-300 text-sm font-semibold">Our Achievements</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Our Journey of Excellence
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
            Discover how we organize events, why we do them, and celebrate our winners
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {filteredAchievements.map((achievement, index) => (
            <AchievementTimelineItem
              key={achievement.id}
              achievement={achievement}
              index={index}
              onClick={() => {
                setSelectedAchievement(achievement);
                setCurrentImageIndex(0);
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70 text-lg">No achievements found in this category.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-black/95 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8">
            <button
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Image Gallery */}
              {selectedAchievement.photos && selectedAchievement.photos.length > 0 && (
                <div className="relative mb-8 rounded-xl overflow-hidden border border-white/10">
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={selectedAchievement.photos[currentImageIndex]}
                      alt={`${selectedAchievement.title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        if (e.target) {
                          e.target.style.display = 'none';
                        }
                      }}
                    />
                    {selectedAchievement.photos.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                          {currentImageIndex + 1} / {selectedAchievement.photos.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-4">
                    {selectedAchievement.category}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {selectedAchievement.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedAchievement.date}</span>
                    </div>
                  </div>
                </div>

                {/* Why Section */}
                {selectedAchievement.why && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-purple-400" />
                      Why We Organized This
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {selectedAchievement.why}
                    </p>
                  </div>
                )}

                {/* How Section */}
                {selectedAchievement.how && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      How We Organized It
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {selectedAchievement.how}
                    </p>
                  </div>
                )}

                {/* Winners Section */}
                {selectedAchievement.winners && selectedAchievement.winners.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Winners & Achievements
                    </h3>
                    <div className="space-y-3">
                      {selectedAchievement.winners.map((winner, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-purple-300 font-semibold">{winner.position} Place</span>
                              {winner.name && (
                                <div className="text-white font-medium mt-1">{winner.name}</div>
                              )}
                              {winner.members && (
                                <div className="text-white font-medium mt-1">{winner.members.join(', ')}</div>
                              )}
                              {winner.creator && (
                                <div className="text-white font-medium mt-1">{winner.creator}</div>
                              )}
                              {(winner.rollNo || winner.members) && (
                                <div className="text-white/60 text-sm mt-1">
                                  {winner.rollNo || `Team Members`}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-yellow-300 font-semibold">{winner.prize}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                {selectedAchievement.stats && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      Event Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(selectedAchievement.stats).map(([key, value]) => (
                        <div key={key} className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{value}</div>
                          <div className="text-xs text-white/60 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team */}
                {selectedAchievement.team && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Users2 className="w-5 h-5 text-blue-400" />
                      Organizing Team
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAchievement.team.map((member, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact */}
                {selectedAchievement.impact && (
                  <div className="p-5 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Impact</h3>
                    <p className="text-white/80">{selectedAchievement.impact}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
