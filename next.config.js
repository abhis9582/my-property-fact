/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "8005"
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apis.mypropertyfact.com",
        port: "8080",
        pathname: "/**"
      },
    ],
  },
};

module.exports = nextConfig;