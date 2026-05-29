/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['127.0.0.1', '172.20.10.12', 'localhost'],
};

export default nextConfig;
