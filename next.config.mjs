/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Optional alternate build folder (e.g. NEXT_DIST_DIR=.next-build) when another process holds .next open.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  // Set STATIC_EXPORT=1 to produce a static `out/` folder (demo mode only, no server needed).
  ...(process.env.STATIC_EXPORT ? { output: 'export', trailingSlash: true } : {}),
};

export default nextConfig;
