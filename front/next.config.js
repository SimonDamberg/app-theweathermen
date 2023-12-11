/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
}

module.exports = nextConfig
