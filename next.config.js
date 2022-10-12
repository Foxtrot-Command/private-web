/** @type {import('next').NextConfig} */
module.exports = {
  /* async redirects() {
    return [
      {
        source: '/',
        destination: '/claim',
        permanent: true,
      },
    ]
  }, */
  webpack: function(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  reactStrictMode: true,
};
