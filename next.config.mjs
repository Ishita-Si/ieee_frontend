/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Production output ─────────────────────────────────────────────────────
  // 'standalone' bundles only the necessary files for deployment.
  // Works great with Docker, Render, Railway, bare VPS etc.
  output: 'standalone',

  // ── Security ──────────────────────────────────────────────────────────────
  poweredByHeader: false, // remove X-Powered-By: Next.js header

  // ── Compiler ──────────────────────────────────────────────────────────────
  reactCompiler: true,
  swcMinify: true,       // Use SWC minifier (faster than Terser)

  // ── Experimental ─────────────────────────────────────────────────────────
  experimental: {
    webpackBuildWorker: true, // parallel webpack build workers
  },

  // ── Build timeouts ────────────────────────────────────────────────────────
  staticPageGenerationTimeout: 300,

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    unoptimized: false,
    // Add remote domains if you load external images:
    // domains: ['example.com'],
  },

  // ── HTTP headers ──────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
