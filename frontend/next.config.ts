import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.openmoviedb.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
