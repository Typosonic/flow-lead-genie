
import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider as QueryClientProvider
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AgentBuilder from "@/pages/AgentBuilder";
import AgentLibrary from "@/pages/AgentLibrary";
import SpyTools from "@/pages/SpyTools";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import MVPChecklist from "@/pages/MVPChecklist";
import Infrastructure from "@/pages/Infrastructure";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex h-screen bg-background">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <AppSidebar />
                      <SidebarInset>
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="agents" element={<AgentBuilder />} />
                          <Route path="library" element={<AgentLibrary />} />
                          <Route path="spy-tools" element={<SpyTools />} />
                          <Route path="infrastructure" element={<Infrastructure />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="mvp-checklist" element={<MVPChecklist />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </SidebarInset>
                    </SidebarProvider>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  )
}

export default App
