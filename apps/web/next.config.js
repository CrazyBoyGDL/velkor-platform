/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
