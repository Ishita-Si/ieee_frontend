"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, User, LogIn } from 'lucide-react';
import { authService } from '@/lib/auth';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <div 
      className={`relative w-full min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black/0 -mb-px pt-20 sm:pt-24 md:pt-28 lg:pt-32 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Beams Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={49}
        />
      </div>
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes typewriter {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.5),
                         0 0 40px rgba(139, 92, 246, 0.3),
                         0 0 60px rgba(96, 165, 250, 0.2);
          }
          50% {
            text-shadow: 0 0 30px rgba(139, 92, 246, 0.8),
                         0 0 60px rgba(139, 92, 246, 0.5),
                         0 0 90px rgba(96, 165, 250, 0.4);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 1.2s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1.2s ease-out forwards;
          opacity: 0;
        }

        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          color: #ffffff; /* Fallback color for browsers that don't support background-clip */
          display: inline-block;
        }
        
        /* Fallback for browsers that don't support background-clip */
        @supports not (-webkit-background-clip: text) {
          .gradient-text {
            color: #ffffff;
            -webkit-text-fill-color: #ffffff;
          }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Login/Profile Button - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="group relative flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
          >
            <User className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium hidden sm:inline">
              {user?.full_name?.split(' ')[0] || 'Profile'}
            </span>
          </Link>
        ) : (
          <Link
            href="/signin"
            className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium hidden sm:inline">Login</span>
          </Link>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-white w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        {trustBadge && (
          <div className="mb-6 sm:mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-xs sm:text-sm hover:bg-white/15 transition-all duration-300">
              {trustBadge.icons && (
                <div className="flex">
                  {trustBadge.icons.map((icon, index) => (
                    <span key={index} className="text-white">
                      {icon}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-white whitespace-nowrap">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 max-w-6xl mx-auto w-full flex flex-col items-center">
          {/* IEEE Logo - Component 1 */}
          {headline?.line1 && (
            <div className="flex items-center justify-center px-2">
              <img
                src="/ieee logo.png"
                alt="IEEE Logo"
                className="h-24 sm:h-20 md:h-24 lg:h-32 xl:h-40 2xl:h-48 w-auto object-contain"
                style={{
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
          )}
          
          {/* Student Branch Text - Component 2 */}
          {headline?.line2 && (
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-[1.1] tracking-tight px-2 text-center">
              {headline.line2}
            </h1>
          )}
          
          {/* Subtitle - Component 4 */}
          {subtitle && (
            <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center w-full">
              <p className="text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 font-medium leading-relaxed relative block text-center">
                <span className="relative z-10 animate-glow-pulse">{subtitle}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 blur-2xl rounded-lg -z-10 animate-pulse" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              </p>
            </div>
          )}
          
          {/* Action Buttons - Smaller on Mobile, Original on Desktop */}
          {buttons && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 animate-fade-in-up animation-delay-800 w-full sm:w-auto px-4 sm:px-0">
              {buttons.primary && (
                <button 
                  onClick={buttons.primary.onClick}
                  className="group relative w-full sm:w-auto px-4 sm:px-8 md:px-10 py-2 sm:py-3.5 md:py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 text-white rounded-lg sm:rounded-2xl font-semibold text-xs sm:text-base md:text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98] touch-manipulation overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                    {buttons.primary.text}
                    <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              )}
              {buttons.secondary && (
                <button 
                  onClick={buttons.secondary.onClick}
                  className="group relative w-full sm:w-auto px-4 sm:px-8 md:px-10 py-2 sm:py-3.5 md:py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white rounded-lg sm:rounded-2xl font-semibold text-xs sm:text-base md:text-lg transition-all duration-300 hover:scale-[1.02] backdrop-blur-md active:scale-[0.98] touch-manipulation overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-5 sm:h-5" />
                    {buttons.secondary.text}
                  </span>
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
