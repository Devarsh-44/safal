/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Set STATIC_EXPORT=1 to produce a static `out/` folder (demo mode only, no server needed).
  ...(process.env.STATIC_EXPORT ? { output: 'export', trailingSlash: true } : {}),
};

export default nextConfig;
