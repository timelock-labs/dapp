"use client"

import * as React from "react"
import {
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  Clock,
  Shield,
  Zap,
} from "lucide-react"

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
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Timelock UI",
      logo: Clock,
      plan: "Enterprise",
    },
    {
      name: "Multi-Chain",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "DeFi Tools",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Timelock Management",
      url: "#",
      icon: Clock,
      isActive: true,
    },
    {
      title: "Token Management",
      url: "#",
      icon: Zap,
    },
    {
      title: "Analytics",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
        {
          title: "Statistics",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Security",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
      ],
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
        <TeamSwitcher teams={data.teams} />
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
