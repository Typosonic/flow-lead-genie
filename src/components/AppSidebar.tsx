
import { Bot, Brain, Eye, HelpCircle, LayoutDashboard, Settings, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    key: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agent Library",
    key: "agents",
    icon: Bot,
  },
  {
    title: "Spy Tools",
    key: "spy",
    icon: Eye,
  },
  {
    title: "Settings",
    key: "settings",
    icon: Settings,
  },
  {
    title: "Help",
    key: "help",
    icon: HelpCircle,
  },
];

interface AppSidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function AppSidebar({ currentPage = "dashboard", onNavigate }: AppSidebarProps) {
  const handleNavigation = (pageKey: string) => {
    if (onNavigate) {
      onNavigate(pageKey);
    }
  };

  return (
    <Sidebar className="border-r border-border/40 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/40 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Agent-flow</h1>
            <p className="text-xs text-muted-foreground">AI Automation</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.key)}
                    className={`w-full rounded-xl hover:bg-sidebar-accent transition-all duration-200 group cursor-pointer ${
                      currentPage === item.key ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 px-3 py-3">
                      <item.icon className={`h-5 w-5 transition-colors ${
                        currentPage === item.key 
                          ? 'text-brand-500' 
                          : 'text-muted-foreground group-hover:text-brand-500'
                      }`} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              <button className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-blue-600 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Deploy Agent
                </div>
              </button>
              <button className="w-full rounded-xl border border-border/40 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent">
                View Analytics
              </button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
