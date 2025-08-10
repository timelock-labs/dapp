
import { redirect } from 'next/navigation';

export default async function Page() {
  // 重定向到登录页面
  redirect(`/login`);
}
