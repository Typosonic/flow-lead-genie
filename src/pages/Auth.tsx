
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { useAuth } from '@/contexts/AuthContext'

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
  }

  return (
    <AuthLayout>
      {isSignup ? (
        <SignupForm onToggleMode={toggleMode} />
      ) : (
        <LoginForm onToggleMode={toggleMode} />
      )}
    </AuthLayout>
  )
}

export default Auth
