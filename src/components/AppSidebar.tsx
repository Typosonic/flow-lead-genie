
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Calendar,
  Home,
  Bot,
  Users,
  BarChart3,
  Settings,
  Zap,
  Search,
  Container,
  CheckSquare,
  Loader2
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import UserProfileDropdown from "@/components/UserProfileDropdown"
import { useAuth } from "@/contexts/AuthContext"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Agent Library",
    url: "/agent-library",
    icon: Bot,
  },
  {
    title: "Agent Builder",
    url: "/agent-builder",
    icon: Zap,
  },
  {
    title: "Infrastructure",
    url: "/infrastructure",
    icon: Container,
  },
  {
    title: "Spy Tools",
    url: "/spy-tools",
    icon: Search,
  },
  {
    title: "MVP Checklist",
    url: "/mvp-checklist",
    icon: CheckSquare,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { collapsed } = useSidebar()
  const location = useLocation()
  const { user, loading } = useAuth()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"

  if (loading) {
    return (
      <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible>
        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand-500" />
                <span className="font-bold text-brand-500">Agent-flow</span>
              </div>
            )}
            {collapsed && <Bot className="h-5 w-5 text-brand-500" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {user && (
        <SidebarFooter>
          <div className="flex items-center justify-between p-2">
            {!collapsed && (
              <div className="flex items-center gap-2 flex-1">
                <UserProfileDropdown />
              </div>
            )}
            {collapsed && <UserProfileDropdown />}
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
