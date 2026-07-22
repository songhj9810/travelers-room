import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uvklcjrrtxryptkzfitq.supabase.co",
      },
    ],
  },
}

export default nextConfig
