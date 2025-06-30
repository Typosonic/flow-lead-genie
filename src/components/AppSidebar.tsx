import * as React from "react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarClose, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarNav } from "@/components/ui/sidebar"
import { useSidebar } from "@/components/providers/sidebar-provider"
import {
  LayoutDashboard,
  Bot,
  Library,
  Search,
  Settings,
  CheckSquare,
  Container
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useSidebar()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user-data", user?.id],
    queryFn: async () => {
      if (!user) return null

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error fetching user data:", error)
        throw error
      }

      return data
    },
    enabled: !!user,
  })

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Agent Builder", 
      url: "/agents",
      icon: Bot,
    },
    {
      title: "Agent Library",
      url: "/library", 
      icon: Library,
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
      title: "Settings",
      url: "/settings", 
      icon: Settings,
    },
    {
      title: "MVP Checklist",
      url: "/mvp-checklist",
      icon: CheckSquare,
    },
  ]

  return (
    <Sidebar className="h-screen" open={isOpen} onOpenChange={onClose}>
      <SidebarContent className="flex flex-col">
        <SidebarHeader>
          <Button variant="ghost" className="w-full justify-start pl-4">
            Agent-flow
          </Button>
          <SidebarClose onClick={onClose} />
        </SidebarHeader>
        <Separator />
        <ScrollArea>
          <SidebarNav>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                active={pathname === item.url}
                onClick={() => {
                  navigate(item.url)
                  onClose()
                }}
              />
            ))}
          </SidebarNav>
        </ScrollArea>
        <Separator />
        <SidebarFooter>
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 justify-start px-4 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData?.avatar_url} />
                  <AvatarFallback>{userData?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium leading-none">{userData?.full_name || "User"}</span>
                  <span className="text-xs text-muted-foreground">{userData?.email || "user@example.com"}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => supabase.auth.signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
