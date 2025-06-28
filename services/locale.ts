import {Locale} from '@/i18n/config';

// next-intl 中间件通常会查找名为 'NEXT_LOCALE' 的 cookie。
// 如果您在中间件中配置了不同的名称，请在此处更新。
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * 设置用户的区域设置偏好。
 * 这通常通过设置一个 cookie 来完成，然后 next-intl 中间件会读取该 cookie
 * 来确定要使用的区域设置。
 * @param locale 要设置的新区域设置。
 */
export function setUserLocale(locale: Locale) {
  // 设置 cookie，有效期为一年。
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=31536000;SameSite=Lax`;

  // 设置 cookie 后，需要重新加载页面或进行导航以使更改生效。
  // window.location.reload() 是一个简单的方法，它将导致浏览器
  // 使用新的 cookie 值重新请求页面，然后 next-intl 中间件将处理区域设置切换。
  // 您的 LocaleSwitcherSelect 组件中使用的 `useTransition` 会帮助处理此重载期间的UI状态。
  window.location.reload();
}

// 注意：确保您的 next-intl 中间件 (通常在 middleware.ts 或 i18n.ts 中配置)
// 已配置为从 cookie 中读取区域设置。