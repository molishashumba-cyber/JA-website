import type { NextConfig } from "next";
import { normaliseSupabaseUrl } from "./src/lib/supabase/config";

const supabaseHost = (() => {
  try {
    const url = normaliseSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    return url ? new URL(url) : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    // Serve modern, small formats to phones on slow data.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920],
    // Photos and logos uploaded through the admin area (Supabase Storage).
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      ...(supabaseHost && !supabaseHost.hostname.endsWith(".supabase.co")
        ? [
            {
              protocol: supabaseHost.protocol.replace(":", "") as "http" | "https",
              hostname: supabaseHost.hostname,
              port: supabaseHost.port,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
