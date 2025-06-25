
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./Dashboard";
import AgentLibrary from "./AgentLibrary";
import SpyTools from "./SpyTools";
import OnboardingWalkthrough from "@/components/OnboardingWalkthrough";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

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
      case "spy":
        return <SpyTools />;
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">Configure your account and agent preferences.</p>
          </div>
        );
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
              <div className="text-sm text-muted-foreground">
                Welcome to Agent-flow AI Automation Platform
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
