/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "lh3.googleusercontent.com", "cloudflare-ipfs.com"],
  },
};

module.exports = nextConfig;
