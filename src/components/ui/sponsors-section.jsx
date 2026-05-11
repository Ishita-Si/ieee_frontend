"use client";

import Image from 'next/image';

/**
 * SponsorsSection — Infinite scroll via CSS animation (no rAF loop).
 * The old version ran requestAnimationFrame every frame and mutated
 * scrollLeft which forces layout recalculation. This uses CSS
 * `@keyframes` + `transform: translateX`, which runs on the compositor.
 */
const SponsorsSection = ({ sponsors = [] }) => {
  const defaultSponsors = sponsors.length > 0 ? sponsors : [
    { id: 1, name: 'Sponsor 1', logo: '/logo.png', url: '#' },
    { id: 2, name: 'Sponsor 2', logo: '/logo.png', url: '#' },
    { id: 3, name: 'Sponsor 3', logo: '/logo.png', url: '#' },
    { id: 4, name: 'Sponsor 4', logo: '/logo.png', url: '#' },
    { id: 5, name: 'Sponsor 5', logo: '/logo.png', url: '#' },
    { id: 6, name: 'Sponsor 6', logo: '/logo.png', url: '#' },
  ];

  // Duplicate for seamless loop
  const items = [...defaultSponsors, ...defaultSponsors];

  return (
    <section className="w-full py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
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

        {/* CSS-animated infinite scroll — no JS animation loop */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

          <div className="sponsors-track">
            {items.map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="sponsors-item"
              >
                {sponsor.url && sponsor.url !== '#' ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full h-full flex items-center justify-center p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
                    aria-label={`Visit ${sponsor.name}`}
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={160}
                      height={80}
                      className="object-contain max-w-[85%] max-h-[85%] w-auto h-auto grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
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

        <style>{`
          .sponsors-track {
            display: flex;
            gap: 2rem;
            align-items: center;
            width: max-content;
            animation: sponsors-scroll 28s linear infinite;
            will-change: transform;
          }
          .sponsors-track:hover {
            animation-play-state: paused;
          }
          .sponsors-item {
            flex-shrink: 0;
            width: clamp(140px, 20vw, 200px);
            height: clamp(80px, 12vw, 120px);
          }
          @keyframes sponsors-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .sponsors-track { animation: none; }
          }
        `}</style>
      </div>
    </section>
  );
};

export default SponsorsSection;
