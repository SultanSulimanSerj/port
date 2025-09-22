/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@saas-portal/shared"],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig;