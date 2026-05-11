"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Calendar } from 'lucide-react';

const Beams = dynamic(
  () => import('@/components/ui/Beams'),
  { ssr: false }
);

const Hero = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = ""
}) => {
  return (
    <div
      className={`relative w-full min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black -mb-px pt-20 sm:pt-24 md:pt-28 lg:pt-32 ${className}`}
    >
      {/* CSS Beams Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Beams
          beamWidth={2.5}
          beamHeight={24}
          beamNumber={12}
          lightColor="#ffffff"
          speed={1.6}
          noiseIntensity={1.4}
          scale={0.2}
          rotation={49}
        />
      </div>

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.7s ease-out forwards; }
        .animate-fade-in-up   { animation: fade-in-up 0.9s ease-out forwards; opacity: 0; }
        .animation-delay-800  { animation-delay: 0.5s; }
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
          display: inline-block;
        }
        @supports not (-webkit-background-clip: text) {
          .gradient-text { color: #ffffff; -webkit-text-fill-color: #ffffff; }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center justify-center text-white w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        {trustBadge && (
          <div className="mb-6 sm:mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 border border-white/30 rounded-full text-xs sm:text-sm">
              {trustBadge.icons && (
                <div className="flex">
                  {trustBadge.icons.map((icon, index) => (
                    <span key={index} className="text-white">{icon}</span>
                  ))}
                </div>
              )}
              <span className="text-white whitespace-nowrap">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 max-w-6xl mx-auto w-full flex flex-col items-center">
          {/* IEEE Logo */}
          {headline?.line1 && (
            <div className="flex items-center justify-center px-2">
              <img
                src="/ieee logo.png"
                alt="IEEE Logo"
                className="h-24 sm:h-20 md:h-24 lg:h-32 xl:h-40 2xl:h-48 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          )}

          {/* Student Branch Text */}
          {headline?.line2 && (
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-[1.1] tracking-tight px-2 text-center">
              {headline.line2}
            </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center w-full">
              <p className="text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 font-medium leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {buttons && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 animate-fade-in-up animation-delay-800 w-full sm:w-auto px-4 sm:px-0">
              {buttons.primary && (
                <button
                  onClick={buttons.primary.onClick}
                  className="w-full sm:w-auto px-4 sm:px-8 md:px-10 py-2 sm:py-3.5 md:py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 text-white rounded-lg sm:rounded-2xl font-semibold text-xs sm:text-base md:text-lg transition-colors active:scale-[0.98] touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  {buttons.primary.text}
                  <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                </button>
              )}
              {buttons.secondary && (
                <button
                  onClick={buttons.secondary.onClick}
                  className="w-full sm:w-auto px-4 sm:px-8 md:px-10 py-2 sm:py-3.5 md:py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white rounded-lg sm:rounded-2xl font-semibold text-xs sm:text-base md:text-lg transition-colors active:scale-[0.98] touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Calendar className="w-3 h-3 sm:w-5 sm:h-5" />
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
