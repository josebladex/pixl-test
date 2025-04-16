import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', // Puedes ajustar este valor según tus necesidades
    },
  },
};

export default nextConfig;
