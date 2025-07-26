import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://16.163.43.186:8080/api/:path*',
            },
        ];
    },
};

export default withNextIntl(nextConfig);
