// import { GalleryVerticalEnd } from "lucide-react"
import {useTranslations} from 'next-intl';
import { LoginForm } from "./login-form"
// import LocaleSwitcher from '@/components/layout/LocaleSwitcher';

export default function LoginPage() {
    const t = useTranslations('loginPage'); 
     
  return (
    
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <div>
          <h1>{t('title')}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
          <div style={{marginTop: 24}}>
     
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
