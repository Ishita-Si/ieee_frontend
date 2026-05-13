'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Bootcamp events — DEVWAVE 2026 and CodeNex 3.0 (current active events)
const events = [
  {
    name: 'DEVWAVE 2026',
    slug: 'devwave-2026',
    image: '/images/posters/devwave.png',
    route: '/events/devwave-2026',
    color: '#7c3aed',
    tag: 'Bootcamp',
    attendees: '100+',
    timeline: 'Jun 2026',
  },
  {
    name: 'CodeNex 3.0',
    slug: 'codenex-3',
    image: '/images/posters/codenex.png',
    route: '/events/codenex-3',
    color: '#2563eb',
    tag: 'Bootcamp',
    attendees: '80+',
    timeline: 'Jul 2026',
  },
];

// Minimal CSS for card animations
const styles = `
    @keyframes activeGlow {
        0%, 100% { 
            box-shadow: 
                0 30px 80px rgba(0, 0, 0, 0.6),
                0 0 60px var(--card-color),
                inset 0 0 40px rgba(255, 255, 255, 0.1);
        }
        50% { 
            box-shadow: 
                0 35px 100px rgba(0, 0, 0, 0.7),
                0 0 100px var(--card-color),
                inset 0 0 60px rgba(255, 255, 255, 0.15);
        }
    }
    
    .event-card-active {
        animation: activeGlow 3s infinite ease-in-out;
    }
    
    @keyframes progressBar {
        from { width: 0%; }
        to { width: 100%; }
    }
    
    .event-card-progress::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        width: 100%;
        background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0.5)
        );
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        z-index: 20;
        border-radius: 2px;
        animation: progressBar 3s linear;
    }
`;

const EventsSection = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoplayInterval = useRef(null);
  const minSwipeDistance = 50;

  const startAutoplay = () => {
    if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    autoplayInterval.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % events.length);
    }, 3000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
      autoplayInterval.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const getPosition = (index) => {
    if (index === currentIndex) return 'active';
    if (index === (currentIndex - 1 + events.length) % events.length) return 'prev';
    if (index === (currentIndex + 1) % events.length) return 'next';
    return 'hidden';
  };

  // Navigate directly to the event page — NO auth gate here.
  // The event page itself handles auth state properly.
  const handleCardClick = (index) => {
    if (index === currentIndex) {
      router.push(events[index].route);
    } else {
      stopAutoplay();
      setCurrentIndex(index);
      setTimeout(() => startAutoplay(), 100);
    }
  };

  const handlePrevious = () => {
    stopAutoplay();
    setCurrentIndex(prev => (prev - 1 + events.length) % events.length);
    setTimeout(() => startAutoplay(), 100);
  };

  const handleNext = () => {
    stopAutoplay();
    setCurrentIndex(prev => (prev + 1) % events.length);
    setTimeout(() => startAutoplay(), 100);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (dist > minSwipeDistance) handleNext();
    else if (dist < -minSwipeDistance) handlePrevious();
  };

  const getCardStyle = (index, event) => {
    const pos = getPosition(index);
    let transform = '';
    if (pos === 'active') transform = 'translateX(0) translateZ(0) scale(1.1) rotateY(0)';
    else if (pos === 'prev') transform = 'translateX(-280px) translateZ(-200px) scale(0.8) rotateY(25deg)';
    else if (pos === 'next') transform = 'translateX(280px) translateZ(-200px) scale(0.8) rotateY(-25deg)';
    return { transform, '--card-color': event.color };
  };

  return (
    <section id="events" className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-10 overflow-hidden font-sans">
      <style>{styles}</style>

      <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 relative z-10 px-2 pb-8 sm:pb-12 md:pb-16">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 tracking-tight px-2"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #7c3aed 35%, #a855f7 65%, #60a5fa 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.6))',
          }}
        >
          Upcoming IEEE Programs
        </h2>
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto px-2">
          <div className="w-20 sm:w-24 md:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-4 sm:mb-6 shadow-lg shadow-blue-400/50" />
        </div>
      </div>

      <div
        className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] flex items-center justify-center mt-4 sm:mt-6 md:mt-10 lg:mt-12 xl:mt-16 w-full max-w-8xl mx-auto px-2"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-2 lg:left-8 w-12 h-12 lg:w-[60px] lg:h-[60px] rounded-full bg-white/10 border-2 border-white/20 items-center justify-center cursor-pointer z-[15] transition-colors text-white/60 text-xl lg:text-2xl hover:bg-white/25 hover:border-white/50 hover:text-white active:scale-95"
          onClick={handlePrevious}
          aria-label="Previous event"
        >←</button>

        <div className="flex items-center justify-center relative w-full h-full" style={{ perspective: '2500px' }}>
          {events.map((event, index) => {
            const position = getPosition(index);
            const isActive = position === 'active';
            const isPrevNext = position === 'prev' || position === 'next';
            return (
              <div
                key={event.name}
                className={`
                  absolute rounded-2xl md:rounded-3xl overflow-hidden
                  transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  border-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-black/20
                  w-[85vw] max-w-[340px] aspect-[3/4]
                  sm:w-[380px] md:w-[420px]
                  ${isActive ? 'opacity-100 z-10 cursor-pointer border-white/30 event-card-active event-card-progress md:scale-110' : ''}
                  ${isPrevNext ? 'hidden md:block opacity-60 z-[5] grayscale-[40%] blur-[0.5px] cursor-pointer border-white/15 hover:opacity-90' : ''}
                  ${position === 'hidden' ? 'opacity-0 pointer-events-none' : ''}
                `}
                style={getCardStyle(index, event)}
                onClick={() => handleCardClick(index)}
              >
                <div className="w-full h-full relative">
                  <img
                    src={event.image}
                    alt={event.name}
                    className={`w-full h-full object-cover transition-transform duration-600 ${isActive ? 'scale-105' : ''}`}
                    loading="lazy"
                    decoding="async"
                  />
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-xs text-white">
                          {event.tag}
                        </span>
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-xs text-white">
                          {event.timeline}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-1">{event.name}</h3>
                      <p className="text-xs sm:text-sm text-white/80">{event.attendees} attendees</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-2 lg:right-8 w-12 h-12 lg:w-[60px] lg:h-[60px] rounded-full bg-white/10 border-2 border-white/20 items-center justify-center cursor-pointer z-[15] transition-colors text-white/60 text-xl lg:text-2xl hover:bg-white/25 hover:border-white/50 hover:text-white active:scale-95"
          onClick={handleNext}
          aria-label="Next event"
        >→</button>
      </div>

      <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-12 z-20 px-2">
        {events.map((event, index) => (
          <button
            key={event.name}
            className={`
              w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full cursor-pointer transition-all border-2
              ${currentIndex === index
                ? 'scale-[1.3] sm:scale-[1.4] border-white/50'
                : 'bg-white/30 border-transparent hover:bg-white/60 hover:scale-110'
              }
            `}
            style={currentIndex === index ? { background: event.color, boxShadow: `0 0 15px ${event.color}` } : {}}
            onClick={() => {
              stopAutoplay();
              setCurrentIndex(index);
              setTimeout(() => startAutoplay(), 100);
            }}
            aria-label={`Go to ${event.name}`}
          />
        ))}
      </div>

      <p className="md:hidden text-center text-[10px] sm:text-xs text-white/50 mt-3 sm:mt-4 px-2">
        ← Swipe to navigate →
      </p>
    </section>
  );
};

export default EventsSection;
