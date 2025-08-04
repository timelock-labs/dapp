
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 重定向到登录页面
  redirect(`/${locale}/login`);
}
