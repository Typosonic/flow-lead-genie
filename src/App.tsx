
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AgentLibrary from "./pages/AgentLibrary";
import AgentBuilder from "./pages/AgentBuilder";
import Infrastructure from "./pages/Infrastructure";
import SpyTools from "./pages/SpyTools";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import MVPChecklist from "./pages/MVPChecklist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          }>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes with sidebar */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/agent-library" element={
                <ProtectedRoute>
                  <AppLayout>
                    <AgentLibrary />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/agent-builder" element={
                <ProtectedRoute>
                  <AppLayout>
                    <AgentBuilder />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/infrastructure" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Infrastructure />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/spy-tools" element={
                <ProtectedRoute>
                  <AppLayout>
                    <SpyTools />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/mvp-checklist" element={
                <ProtectedRoute>
                  <AppLayout>
                    <MVPChecklist />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch all - redirect to appropriate page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
