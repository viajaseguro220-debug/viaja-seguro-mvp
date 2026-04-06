/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@viajaseguro/shared'],
  experimental: {
    workerThreads: true
  }
};

module.exports = nextConfig;
