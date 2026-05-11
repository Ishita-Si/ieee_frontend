"use client";

import { useEffect } from 'react';
import { initSmoothScroll } from '@/lib/smoothScroll';

/**
 * Component to initialize smooth scrolling on mount
 */
export default function SmoothScrollInit() {
  useEffect(() => {
    // Ensure smooth scroll is enabled globally
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
      if (document.body) {
        document.body.style.scrollBehavior = 'smooth';
      }
    }

    // Initialize smooth scroll for anchor links
    initSmoothScroll();

    // Handle hash links on page load
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return null;
}

