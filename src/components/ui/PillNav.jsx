"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { handleAnchorClick, smoothScrollTo } from '@/lib/smoothScroll';
import { authService } from '@/lib/auth';
import { User, LogIn } from 'lucide-react';
import './PillNav.css';

const PillNav = ({
  items = [],
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Separate IEEE (home) item from other items
  const ieeeItem = items?.find(item => item.href === "/" || item.label === "IEEE");
  const otherItems = items?.filter(item => item.href !== "/" && item.label !== "IEEE") || [];
  const navItems = ieeeItem ? [ieeeItem, ...otherItems] : otherItems;
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease
        });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  // Check authentication status — use cached user data to avoid network call on every route change
  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      // Try localStorage cache first (set by authService on login)
      try {
        const cached = localStorage.getItem('userData');
        if (cached) {
          setUser(JSON.parse(cached));
          return;
        }
      } catch (_) {}
      // Only fetch if no cache
      authService.getCurrentUser()
        .then(userData => { if (userData) setUser(userData); })
        .catch(() => {});
    }
  }, [pathname]);

  const handleEnter = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href) =>
    href?.startsWith('http://') ||
    href?.startsWith('https://') ||
    href?.startsWith('//') ||
    href?.startsWith('mailto:') ||
    href?.startsWith('tel:');

  const isAnchorLink = (href) => href?.startsWith('#');
  
  const isRouterLink = (href) => href && !isExternalLink(href) && !isAnchorLink(href);

  const handleLinkClick = (e, href) => {
    if (isAnchorLink(href)) {
      // If we're on a different page, navigate first then scroll
      if (pathname !== '/') {
        e.preventDefault();
        router.push('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          smoothScrollTo(href, { offset: 80 });
        }, 100);
      } else {
        // On same page, just scroll
        handleAnchorClick(e, href, { offset: 80 });
      }
    }
  };
  
  const isActive = (item) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(item.href);
  };

  const cssVars = {
    ['--base']: 'transparent',
    ['--pill-bg']: 'transparent',
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor
  };

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {/* IEEE Logo */}
        {ieeeItem && (
          isRouterLink(ieeeItem.href) ? (
            <Link
              className="pill-logo"
              href={ieeeItem.href}
              aria-label="Home"
              role="menuitem"
              ref={el => {
                logoRef.current = el;
              }}
            >
              <img
                src="/logo.png"
                alt="IEEE Logo"
                ref={logoImgRef}
                style={{
                  filter: 'brightness(0) invert(1)',
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%'
                }}
              />
            </Link>
          ) : (
            <a
              className="pill-logo"
              href={ieeeItem.href || '#'}
              aria-label="Home"
              ref={el => {
                logoRef.current = el;
              }}
            >
              <img
                src="/ieee logo.png"
                alt="IEEE Logo"
                ref={logoImgRef}
                style={{
                  filter: 'brightness(0) invert(1)',
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%'
                }}
              />
            </a>
          )
        )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {otherItems.map((item, i) => {
              const active = isActive(item);
              return (
                <li key={item.href || `item-${i}`} role="none">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={`pill${active ? ' is-active' : ''}`}
                      aria-label={item.ariaLabel || item.label}
                    >
                      <span className="pill-label">{item.label}</span>
                    </Link>
                  ) : isAnchorLink(item.href) ? (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={`pill${active ? ' is-active' : ''}`}
                      aria-label={item.ariaLabel || item.label}
                      onClick={(e) => handleLinkClick(e, item.href)}
                    >
                      <span className="pill-label">{item.label}</span>
                    </a>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={`pill${active ? ' is-active' : ''}`}
                      aria-label={item.ariaLabel || item.label}
                    >
                      <span className="pill-label">{item.label}</span>
                    </a>
                  )}
                </li>
              );
            })}
            {/* Profile/Login Link - Desktop */}
            <li role="none">
              {isAuthenticated ? (
                <Link
                  role="menuitem"
                  href="/dashboard"
                  className={`pill${pathname === '/dashboard' ? ' is-active' : ''}`}
                  aria-label="Profile"
                >
                  <span className="pill-label flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {user?.full_name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
              ) : (
                <Link
                  role="menuitem"
                  href="/signin"
                  className={`pill${pathname === '/signin' ? ' is-active' : ''}`}
                  aria-label="Login"
                >
                  <span className="pill-label flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </span>
                </Link>
              )}
            </li>
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {navItems.map((item, i) => {
            const active = isActive(item);
            return (
              <li key={item.href || `mobile-item-${i}`}>
                {isRouterLink(item.href) ? (
                  <Link
                    href={item.href}
                    className={`mobile-menu-link${active ? ' is-active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : isAnchorLink(item.href) ? (
                  <a
                    href={item.href}
                    className={`mobile-menu-link${active ? ' is-active' : ''}`}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleLinkClick(e, item.href);
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    href={item.href}
                    className={`mobile-menu-link${active ? ' is-active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
          {/* Profile/Login Link */}
          <li>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="mobile-menu-link flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                {user?.full_name?.split(' ')[0] || 'Profile'}
              </Link>
            ) : (
              <Link
                href="/signin"
                className="mobile-menu-link flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
