/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["https://ipfs.io/"],
    },
    staticPageGenerationTimeout: 100,
}

module.exports = nextConfig
