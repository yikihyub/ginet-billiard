import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/desktop',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;