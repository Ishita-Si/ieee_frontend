"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * Sponsors Section with Infinite Scrolling Animation
 * Displays sponsor logos in a continuous left-to-right scrolling animation
 */
const SponsorsSection = ({ sponsors = [] }) => {
  const scrollContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const isUserInteractingRef = useRef(false);

  // Default sponsors if none provided (placeholder images)
  const defaultSponsors = sponsors.length > 0 ? sponsors : [
    { id: 1, name: 'Sponsor 1', logo: '/logo.png', url: '#' },
    { id: 2, name: 'Sponsor 2', logo: '/logo.png', url: '#' },
    { id: 3, name: 'Sponsor 3', logo: '/logo.png', url: '#' },
    { id: 4, name: 'Sponsor 4', logo: '/logo.png', url: '#' },
    { id: 5, name: 'Sponsor 5', logo: '/logo.png', url: '#' },
    { id: 6, name: 'Sponsor 6', logo: '/logo.png', url: '#' },
  ];

  // Duplicate sponsors for seamless infinite scroll
  const duplicatedSponsors = [...defaultSponsors, ...defaultSponsors];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || defaultSponsors.length === 0) return;

    // Responsive scroll speed based on screen size
    const getScrollSpeed = () => {
      if (typeof window === 'undefined') return 0.5;
      const width = window.innerWidth;
      if (width < 640) return 0.3; // Mobile: slower
      if (width < 1024) return 0.4; // Tablet: medium
      return 0.5; // Desktop: normal
    };

    let scrollSpeed = getScrollSpeed();
    let lastTime = performance.now();
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameTime) {
        // Pause animation if user is interacting (mobile)
        if (isUserInteractingRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        // Update scroll speed on resize
        scrollSpeed = getScrollSpeed();
        
        // Calculate the width of one set of sponsors
        const singleSetWidth = container.scrollWidth / 2;
        scrollPositionRef.current += scrollSpeed;

        // When we've scrolled through one complete set, reset to 0 for seamless loop
        if (scrollPositionRef.current >= singleSetWidth) {
          scrollPositionRef.current = scrollPositionRef.current - singleSetWidth;
        }

        container.scrollLeft = scrollPositionRef.current;
        lastTime = currentTime - (deltaTime % frameTime);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      scrollSpeed = getScrollSpeed();
    };

    window.addEventListener('resize', handleResize);

    // Pause animation on user interaction (mobile touch)
    const handleTouchStart = () => {
      isUserInteractingRef.current = true;
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 2000); // Resume after 2 seconds
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Start animation after a short delay
    const startTimeout = setTimeout(() => {
      lastTime = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(startTimeout);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [defaultSponsors.length]);

  return (
    <section className="w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/50 mb-4">
            Our Partners
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
            Our Sponsors
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-3xl mx-auto">
            We are grateful to our sponsors who support our mission and enable us to create impactful events and initiatives.
          </p>
        </div>

        {/* Infinite Scrolling Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center overflow-hidden sponsors-scroll-container"
            style={{
              width: '200%', // Double width for seamless loop
              willChange: 'scroll-position',
            }}
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 'clamp(140px, 20vw, 200px)',
                  height: 'clamp(80px, 12vw, 120px)',
                }}
              >
                {sponsor.url && sponsor.url !== '#' ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-full h-full flex items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    aria-label={`Visit ${sponsor.name}`}
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={160}
                      height={80}
                      className="object-contain max-w-[85%] max-h-[85%] w-auto h-auto grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="group relative w-full h-full flex items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={160}
                      height={80}
                      className="object-contain max-w-[85%] max-h-[85%] w-auto h-auto grayscale opacity-70"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;

