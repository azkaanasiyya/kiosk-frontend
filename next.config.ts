import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/kiosk",
  images: {
    unoptimized: true,  
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;