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
import Image from "next/image"
import Logo from "@/public/logo.png"
import { NavMain } from '@/components/nav/nav-main'
import { NavUser } from '@/components/nav/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  user: {
    name: "support@timelock.com",
    email: "support@timelock.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Timelock UI",
      logo: House,
      plan: "",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "home",
      icon: House,
      // isActive: true,
    },
    {
      title: "Transactions",
      url: "transactions",
      icon: ListTodo,
    },
    {
      title: "Timelocks",
      url: "timelocks",
      icon: Clock,
     
    },
    {
      title: "ABI-Lib",
      url: "ABI-Lib",
      icon: FileCode,
    },
      {
      title: "Notify",
      url: "notify",
      icon: BellDot,
    },
     {
      title: "Ecosystem",
      url: "ecosystem",
      icon: Box,
    },
  ],
  projects: [
    {
      name: "Multi-Sig Wallet",
      url: "#",
      icon: Shield,
    },
    {
      name: "Token Vesting",
      url: "#",
      icon: Clock,
    },
    {
      name: "Governance",
      url: "#",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <Image src={Logo} alt="Timelock Logo" className="h-8 w-[136px]" /> */}
        <div className="logo-font font-xl font-bold text-xl">TimeLocker</div>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

  )
}
