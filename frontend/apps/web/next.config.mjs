/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui"],
  reactStrictMode: true,
};

export default nextConfig;
