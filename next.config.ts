import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,          // avoid double-mount for Three.js / GSAP
  async headers() {
    return [
      {
        source: '/hero.mp4',
        headers: [
          { key: 'Accept-Ranges', value: 'bytes' },
          { key: 'Cache-Control',  value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
