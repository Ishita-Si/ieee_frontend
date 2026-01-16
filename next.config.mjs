/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Increase timeout for build/compilation
  experimental: {
    // Increase webpack timeout
    webpackBuildWorker: true,
  },
  
  // Optimize build performance
  swcMinify: true,
  
  // Increase static page generation timeout
  staticPageGenerationTimeout: 300,
  
  // Optimize images
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
