import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  // 配置默认语言
  defaultLocale: 'en',
  localePrefix: 'never', // 不在路径中添加语言前缀
});

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://16.163.43.186:8080/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [new URL('https://raw.githubusercontent.com/**')],
  },
};

export default withNextIntl(nextConfig);
