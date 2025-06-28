// import { GalleryVerticalEnd } from "lucide-react"
import { useTranslations } from 'next-intl';
import { LoginForm } from "./login-form"
import TimeLockerSplitPage from './TimeLockerPage'
// import LocaleSwitcher from '@/components/layout/LocaleSwitcher';

export default function LoginPage() {
  const t = useTranslations('loginPage');

  return (
    <div  >
     <TimeLockerSplitPage />
    </div>
  )
}
