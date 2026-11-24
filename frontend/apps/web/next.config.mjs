/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  transpilePackages: ["@repo/ui"],
  reactStrictMode: true,
};

export default nextConfig;
