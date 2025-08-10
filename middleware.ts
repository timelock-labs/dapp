// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';
// // import { NextResponse } from 'next/server';
// // import type { NextRequest } from 'next/server';

// // // 创建国际化中间件
// const intlMiddleware = createMiddleware(routing);

// // export default function middleware(request: NextRequest) {
// //   // 对于其他路径，使用国际化中间件
// //   return intlMiddleware(request);
// // }

// // export const config = {
// //   // Match all pathnames except for
// //   // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
// //   // - … the ones containing a dot (e.g. `favicon.ico`)
// //   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// // };

export default function middleware() {
	return;
}
// export const config = { matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)' };
