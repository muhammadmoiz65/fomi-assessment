/** @type {import('next').NextConfig} */
const nextConfig = {
  // Size build/static-generation workers to available memory and keep the
  // worker count low. Helps the production build complete on memory-tight
  // machines; has no effect on the shipped app.
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Mock imagery is served from Lorem Picsum. A real deployment would
    // point these patterns at Fomi's own generation / CDN origins.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
