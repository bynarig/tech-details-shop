/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force standard Node.js environment for the server
  serverExternalPackages: ['mongodb', 'bcryptjs']
};

module.exports = nextConfig;