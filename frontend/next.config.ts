import type { NextConfig } from "next";

const path = require('path');

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.join(__dirname),
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kinogo.jp",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
