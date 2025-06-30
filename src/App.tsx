
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import Index from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import AgentLibrary from "./pages/AgentLibrary"
import AgentBuilder from "./pages/AgentBuilder"
import Infrastructure from "./pages/Infrastructure"
import SpyTools from "./pages/SpyTools"
import MVPChecklist from "./pages/MVPChecklist"
import Settings from "./pages/Settings"
import Auth from "./pages/Auth"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import { AppSidebar } from "./components/AppSidebar"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <div className="flex h-screen w-full">
                        <AppSidebar />
                        <main className="flex-1 overflow-auto">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/agent-library" element={<AgentLibrary />} />
                            <Route path="/agent-builder" element={<AgentBuilder />} />
                            <Route path="/infrastructure" element={<Infrastructure />} />
                            <Route path="/spy-tools" element={<SpyTools />} />
                            <Route path="/mvp-checklist" element={<MVPChecklist />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
