/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The app has no remote images; turning the optimizer off also removes the
  // image-optimization attack surface flagged by recent Next.js advisories.
  images: { unoptimized: true },
};

export default nextConfig;
