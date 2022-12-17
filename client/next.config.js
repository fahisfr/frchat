/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["localhost", "lh3.googleusercontent.com", "cloudflare-ipfs.com"],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

module.exports = nextConfig;
