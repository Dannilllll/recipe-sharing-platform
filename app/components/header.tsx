'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function Header() {
  const { user, profile, signOut, loading } = useAuth()
  
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍳</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RecipeShare</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/recipes" className="text-gray-600 hover:text-orange-600 transition-colors">
              Browse Recipes
            </Link>
            <a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">About</a>
          </nav>
          <div className="flex space-x-4">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
            ) : user ? (
              <>
                <span className="text-gray-600">Welcome, {profile?.full_name || profile?.username || 'User'}!</span>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/profile/saved"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Saved
                </Link>
                <button 
                  onClick={signOut}
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
