import { GalleryVerticalEnd } from "lucide-react"
import {useTranslations} from 'next-intl';
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    const t = useTranslations('auth.loginPage'); // 'auth' 是文件名/命名空间,
     
  return (
    
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <div>
          <h1>{t('title')}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      
    </div>
  )
}
