/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
});

const nextConfig = {
    experimental: {
        swcPlugins: [
            [
                'next-superjson-plugin',
                {
                    excluded: [],
                },
            ],
        ],
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['picsum.photos', 'lh3.googleusercontent.com'],
    },
    i18n: {
        locales: ['en', 'fr'],
        defaultLocale: 'fr',
    },
    output: 'standalone',
};

module.exports = withPWA(nextConfig);
