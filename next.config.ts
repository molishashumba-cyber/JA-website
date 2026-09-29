import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern, small formats to phones on slow data.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920],
  },
};

export default nextConfig;
