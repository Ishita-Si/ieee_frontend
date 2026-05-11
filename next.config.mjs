/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Production output ─────────────────────────────────────────────────────
  output: 'standalone',

  // ── Security ──────────────────────────────────────────────────────────────
  poweredByHeader: false,

  // ── Compiler ──────────────────────────────────────────────────────────────
  reactCompiler: true,
  swcMinify: true,

  // ── Experimental ─────────────────────────────────────────────────────────
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ['lucide-react', 'gsap', 'motion'],
  },

  // ── Build timeouts ────────────────────────────────────────────────────────
  staticPageGenerationTimeout: 300,

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ── HTTP headers ──────────────────────────────────────────────────────────
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Long-lived cache for Next.js static chunks (_next/static)
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Long-lived cache for public static assets (images, fonts, videos, data JSON)
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        source: '/videos/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        source: '/data/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=600' }],
      },
      {
        source: '/(.*)\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;
