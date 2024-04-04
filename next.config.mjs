/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: "/post/:id",
        destination: "/post",
      },
    ];
  },
};

export default nextConfig;
