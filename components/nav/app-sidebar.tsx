"use client"

import * as React from "react"
import {
  Clock,
  Frame,
  ListTodo,
  BellDot,
  Settings2,
  FileCode,
  Shield,
  Box,
  House
} from "lucide-react"
import Logo from "@/public/logo.png"
import { NavMain } from '@/components/nav/nav-main'
import { NavUser } from '@/components/nav/nav-user'
import { TeamSwitcher } from '@/components/nav/team-switcher'
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
    name: "support",
    email: "m@example.com",
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
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Security",
      //     url: "#",
      //   },
      //   {
      //     title: "Notifications",
      //     url: "#",
      //   },
      // ],
    },
     {
      title: "Ecosystem",
      url: "ecosystem",
      icon: Box,
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Security",
      //     url: "#",
      //   },
      //   {
      //     title: "Notifications",
      //     url: "#",
      //   },
      // ],
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
        <img src={Logo.src} alt="Timelock Logo" />
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
