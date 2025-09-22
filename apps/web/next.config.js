/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@saas-portal/ui", "@saas-portal/shared", "@saas-portal/sdk"],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig;