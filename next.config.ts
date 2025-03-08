/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force standard Node.js environment for the server
  serverExternalPackages: ['mongodb', 'bcryptjs'],
  // Add image domain configuration
  images: {
    domains: ['placehold.co'],
  }
};

module.exports = nextConfig;