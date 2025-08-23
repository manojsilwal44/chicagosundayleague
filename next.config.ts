import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Temporarily disabled to fix Webpack module resolution error
    // optimizePackageImports: [
    //   "@mui/material",
    //   "@mui/icons-material",
    //   "@mui/x-date-pickers",
    // ],
  },
};

export default nextConfig;
