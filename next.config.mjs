/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.empowerwoman.az",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
