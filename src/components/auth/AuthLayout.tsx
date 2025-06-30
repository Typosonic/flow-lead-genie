
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Agent-flow</h1>
          <p className="text-muted-foreground">
            Deploy AI agents that convert leads automatically
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
