/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "8005",
  //       pathname: '/get/images/properties/**'
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apis.mypropertyfact.com",
        port: "8080",
        pathname: "/get/images/properties/**"
      },
    ],
  },
};

module.exports = nextConfig;