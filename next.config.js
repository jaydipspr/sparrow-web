/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
	webpack: (config, { isServer }) => {
		// Prevent Mongoose and related Node.js modules from being bundled for client
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				async_hooks: false,
				fs: false,
				net: false,
				tls: false,
			};
			config.externals = [...(config.externals || []), 'mongoose'];
		}
		return config;
	},
};

module.exports = nextConfig;
