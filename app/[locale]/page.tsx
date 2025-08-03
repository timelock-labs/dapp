
import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { locale: string } }) {
  // 重定向到登录页面
  redirect(`/${params.locale}/login`);
}
