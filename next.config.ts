import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "172.21.224.1"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
