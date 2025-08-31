import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'https://test.timelock.live/api/:path*',
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https' as const,
				hostname: 'raw.githubusercontent.com',
			},
			{
				protocol: 'https' as const,
				hostname: 'cryptologos.cc',
			},
			{
				protocol: 'https' as const,
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https' as const,
				hostname: 'pbs.twimg.com',
			},
			{
				protocol: 'https' as const,
				hostname: 'logos.covalenthq.com',
			},
			{
				protocol: 'https' as const,
				hostname: 'www.datocms-assets.com',
			},
			{
				protocol: 'https' as const,
				hostname: 'cdn.moralis.io',
			},
		],
	},
};

export default withNextIntl(nextConfig);
