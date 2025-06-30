import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";
import AgentLibrary from "./AgentLibrary";
import AgentBuilder from "./AgentBuilder";
import SpyTools from "./SpyTools";
import MVPChecklist from "./MVPChecklist";
import Settings from "./Settings";
import OnboardingWalkthrough from "@/components/OnboardingWalkthrough";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const { user, signOut } = useAuth();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsOnboardingComplete(true);
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "agents":
        return <AgentLibrary />;
      case "builder":
        return <AgentBuilder />;
      case "spy":
        return <SpyTools />;
      case "checklist":
        return <MVPChecklist />;
      case "settings":
        return <Settings />;
      case "help":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
            <p className="text-muted-foreground">Get help and learn how to maximize your AI automation.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {showOnboarding && !isOnboardingComplete && (
        <OnboardingWalkthrough onComplete={handleOnboardingComplete} />
      )}
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar currentPage={currentPage} onNavigate={handleNavigation} />
          <main className="flex-1 flex flex-col">
            <div className="border-b border-border/40 bg-background/50 backdrop-blur-xl p-4 flex items-center justify-between">
              <SidebarTrigger className="hover:bg-muted/20 transition-colors" />
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.email}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
