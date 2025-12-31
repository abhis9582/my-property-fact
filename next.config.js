/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8005",
        pathname: "/get/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8005",
        pathname: "/fetch-image/**",
      },
      {
        protocol: "https",
        hostname: "apis.mypropertyfact.in",
        pathname: "/get/images/**",
      },
      {
        protocol: "https",
        hostname: "apis.mypropertyfact.in",
        pathname: "/fetch-image/**",
      },
    ],
    // Cache optimized images for 60 seconds
    minimumCacheTTL: 60,
    // Add device sizes and image sizes for better optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Configure allowed quality values for Next.js 16 compatibility
    qualities: [75, 80, 85, 90, 95, 100],
    // Disable image optimization if backend is slow (uncomment if needed)
    // unoptimized: true,
  },
  // Enable CSS optimization without experimental features
  compiler: {
    styledComponents: true,
  },
  // Optimize production builds
  swcMinify: true,
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['@mui/material', '@coreui/react', 'react-bootstrap'],
  },
};

module.exports = nextConfig;