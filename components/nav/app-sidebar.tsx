"use client"

import * as React from "react"
import {
  Clock,
  Frame,
  ListTodo,
  BellDot,
  FileCode,
  Shield,
  Box,
  House
} from "lucide-react"
import { NavMain } from '@/components/nav/nav-main'
import { NavUser } from '@/components/nav/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import LanguageSwitcher from "../LanguageSwitcher"
import { useTranslations } from 'next-intl';
// import type { BaseComponentProps } from '@/types';


// interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

/**
 * Application sidebar component with navigation and user menu
 * 
 * @param props - AppSidebar component props
 * @returns JSX.Element
 */
export function AppSidebar({ ...props }: AppSidebarProps) {
  const t = useTranslations();
  const sidebarData = {
    navMain: [
      {
        title: t('sidebar.nav.home'),
        url: "home",
        icon: House,
      },
      {
        title: t('sidebar.nav.transactions'),
        url: "transactions",
        icon: ListTodo,
      },
      {
        title: t('sidebar.nav.timelock_contracts'),
        url: "timelocks",
        icon: Clock,
      },
      {
        title: t('sidebar.nav.abi_library'),
        url: "abi-lib",
        icon: FileCode,
      },
      {
        title: t('sidebar.nav.notifications'),
        url: "notify",
        icon: BellDot,
      },
      {
        title: t('sidebar.nav.ecosystem'),
        url: "ecosystem",
        icon: Box,
      },
    ],
    projects: [
      {
        name: t('sidebar.projects.multisig_wallet'),
        url: "#",
        icon: Shield,
      },
      {
        name: t('sidebar.projects.token_vesting'),
        url: "#",
        icon: Clock,
      },
      {
        name: t('sidebar.projects.governance'),
        url: "#",
        icon: Frame,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <Image src={Logo} alt="Timelock Logo" className="h-8 w-[136px]" /> */}
        <div className="logo-font font-xl font-bold text-xl">{t('sidebar.logo')}</div>

        {/* 如需团队切换功能请取消注释并确保 sidebarData.teams 存在 */}
{/* <TeamSwitcher teams={sidebarData.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {/* 项目区块 */}
        {/* 如需项目区块请取消注释并确保 NavProjects 组件已导入 */}
        {/* <NavProjects projects={sidebarData.projects} /> */}
      </SidebarContent>
      <div className="flex flex-col gap-8 justify-center items-center">
        <LanguageSwitcher />
        <SidebarFooter>
          <NavUser user={{
  name: "support@timelock.com",
  email: "support@timelock.com",
  avatar: "/avatars/shadcn.jpg"
}} />
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>

  )
}
