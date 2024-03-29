/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "localhost",
      "lh3.googleusercontent.com",
      "cloudflare-ipfs.com",
      "frchatbackend.fahis.live",
    ],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
};

module.exports = nextConfig;
