import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/kiosk",
  images: {
    unoptimized: true,  
    remotePatterns: [
      {
        protocol: "http",
        // hostname: "localhost",
        hostname: "http://202.134.242.98/",
        port: "8001",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;