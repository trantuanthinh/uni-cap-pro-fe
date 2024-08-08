/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	compiler: {
		removeConsole: true, // Console statements will be removed in production
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'aniyuki.com',
				pathname: '**',
			},
		],
	},
	productionBrowserSourceMaps: false,
	optimizeFonts: false,
	reactStrictMode: true,

	async rewrites() {
		return [
			{
				source: '/api/:slug*',
				destination: `http://localhost:5130/api/:slug*`,
			},
		];
	},
};

export default nextConfig;
