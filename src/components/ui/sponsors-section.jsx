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
                    className="group relative w-full h-full flex flex-col items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden backdrop-blur-sm transition-all duration-500"
                    aria-label={`Visit ${sponsor.name}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="flex-1 flex items-center justify-center p-5 sm:p-6 w-full relative z-10">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full py-3 px-4 bg-white/[0.03] border-t border-white/[0.05] flex items-center justify-center relative z-10 backdrop-blur-md transition-colors group-hover:bg-white/[0.06]">
                      <span className="text-sm sm:text-base font-medium tracking-wide text-white/70 group-hover:text-white transition-colors">{sponsor.name}</span>
                    </div>
                  </a>
                ) : (
                  <div className="group relative w-full h-full flex flex-col items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden backdrop-blur-sm transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="flex-1 flex items-center justify-center p-5 sm:p-6 w-full relative z-10">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full py-3 px-4 bg-white/[0.03] border-t border-white/[0.05] flex items-center justify-center relative z-10 backdrop-blur-md transition-colors group-hover:bg-white/[0.06]">
                      <span className="text-sm sm:text-base font-medium tracking-wide text-white/70 group-hover:text-white transition-colors">{sponsor.name}</span>
                    </div>
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
            width: clamp(160px, 20vw, 220px);
            height: clamp(200px, 25vw, 260px);
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
