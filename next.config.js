/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
  // Enable CSS optimization without experimental features
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;