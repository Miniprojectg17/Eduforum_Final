/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Required for static export
  output: 'export',

  // 👇 Disable image optimization (since static export doesn’t support Next.js image loader)
  images: {
    unoptimized: true,
  },

  // 👇 Redirect all API routes to home (they’ll be handled by your backend, not static export)
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },

  // 👇 Optional: silence build warnings about dynamic routes
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
