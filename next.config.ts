import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cctv-lorong.diskominfo.makassarkota.go.id",
      },
      {
        protocol: "https",
        hostname: "cctv-lorong.gwehjj.com",
      },
    ],
  },
};

export default nextConfig;
