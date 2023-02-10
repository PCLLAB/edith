/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {},
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

module.exports = nextConfig;
