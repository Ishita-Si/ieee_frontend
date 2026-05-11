/**
 * Smooth scroll utility for the website
 * Handles both anchor links and programmatic scrolling
 */

/**
 * Smoothly scroll to an element by ID or selector
 * @param {string} target - Element ID (with or without #) or CSS selector
 * @param {Object} options - Scroll options
 */
export const smoothScrollTo = (target, options = {}) => {
  const {
    offset = 0,
    duration = 800,
    easing = 'ease-in-out',
    behavior = 'smooth'
  } = options;

  // Remove # if present
  const selector = target.startsWith('#') ? target.slice(1) : target;
  const element = document.getElementById(selector) || document.querySelector(target);

  if (!element) {
    console.warn(`Element not found: ${target}`);
    return;
  }

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  // Use native smooth scroll if available
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: offsetPosition,
      behavior: behavior
    });
  } else {
    // Fallback for older browsers
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function
      let ease;
      switch (easing) {
        case 'ease-in-out':
          ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          break;
        case 'ease-out':
          ease = 1 - Math.pow(1 - progress, 3);
          break;
        case 'ease-in':
          ease = progress * progress;
          break;
        default:
          ease = progress;
      }

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
};

/**
 * Handle anchor link clicks with smooth scrolling
 * @param {Event} e - Click event
 * @param {string} href - Link href
 * @param {Object} options - Scroll options
 */
export const handleAnchorClick = (e, href, options = {}) => {
  if (!href || !href.startsWith('#')) return;

  e.preventDefault();
  const target = href;
  const offset = options.offset || 80; // Default offset for fixed nav

  smoothScrollTo(target, { ...options, offset });
};

/**
 * Initialize smooth scroll for all anchor links on the page
 */
export const initSmoothScroll = () => {
  if (typeof window === 'undefined') return;

  // Handle anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#' || href === '#!') return;

    // Don't interfere with Next.js router links
    if (link.hasAttribute('data-router-link')) return;

    handleAnchorClick(e, href, { offset: 80 });
  }, true);
};

