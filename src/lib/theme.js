/**
 * Unified Theme Configuration for IEEE RGIPT Website
 * This ensures consistent styling across all pages and components
 */

export const theme = {
  // Colors - Primary Purple/Blue Gradient Theme
  colors: {
    primary: {
      purple: "from-purple-500",
      blue: "to-blue-500",
      gradient: "from-purple-500 to-blue-500",
      gradientExtended: "from-purple-600 via-blue-600 to-purple-600",
    },
    text: {
      primary: "text-white",
      secondary: "text-white/90",
      tertiary: "text-white/70",
      muted: "text-white/60",
      accent: "text-white/50",
    },
    background: {
      base: "bg-black",
      card: "bg-white/5",
      cardHover: "bg-white/10",
      overlay: "bg-black/60",
      section: "bg-black/0",
    },
    border: {
      default: "border-white/10",
      hover: "border-white/20",
      active: "border-white/30",
      accent: "border-white/15",
    },
    gradient: {
      // For text gradients
      heading: "from-purple-400 to-blue-400",
      headingExtended: "from-cyan-400 via-blue-500 to-purple-600",
      // For backgrounds
      glow: "from-purple-500/30 via-blue-500/30 to-purple-500/30",
    },
  },

  // Spacing - Consistent padding and margins
  spacing: {
    section: {
      mobile: "py-8 sm:py-12 md:py-16 lg:py-20",
      default: "py-12 sm:py-16 md:py-20 lg:py-24",
      large: "py-16 sm:py-20 md:py-24 lg:py-28",
    },
    container: {
      mobile: "px-4 sm:px-6 md:px-8 lg:px-12",
      default: "px-4 sm:px-6 md:px-8 lg:px-12",
      narrow: "px-3 sm:px-4 md:px-6 lg:px-8",
    },
    card: {
      mobile: "p-4 sm:p-5 md:p-6",
      default: "p-5 sm:p-6 md:p-8",
      large: "p-6 sm:p-8 md:p-10",
    },
    gap: {
      small: "gap-3 sm:gap-4",
      default: "gap-4 sm:gap-5 md:gap-6",
      large: "gap-6 sm:gap-8 md:gap-10",
    },
  },

  // Border Radius - Consistent rounded corners
  radius: {
    small: "rounded-xl",
    default: "rounded-2xl",
    large: "rounded-3xl",
    xl: "rounded-[32px]",
    full: "rounded-full",
  },

  // Shadows - Consistent depth
  shadows: {
    card: "shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
    cardHover: "shadow-[0_30px_120px_rgba(0,0,0,0.6)]",
    glow: "shadow-lg shadow-purple-500/40",
    glowHover: "shadow-2xl shadow-purple-500/50",
  },

  // Typography - Consistent text sizes
  typography: {
    heading: {
      h1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
      h2: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
      h3: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
      h4: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
    },
    body: {
      large: "text-base sm:text-lg md:text-xl",
      default: "text-sm sm:text-base md:text-lg",
      small: "text-xs sm:text-sm",
      tiny: "text-[10px] sm:text-xs",
    },
    label: {
      default: "text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] lg:tracking-[0.65em]",
    },
  },

  // Effects - Consistent visual effects
  effects: {
    backdrop: "backdrop-blur-xl",
    backdropStrong: "backdrop-blur-2xl",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    glassHover: "bg-white/10 backdrop-blur-xl border border-white/20",
  },
};

// Helper function to combine theme classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};


