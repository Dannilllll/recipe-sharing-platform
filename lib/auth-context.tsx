'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Profile } from '@/types/database'
import { testDatabaseConnection } from './test-db'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: { message?: string } | null }>
  signUp: (email: string, password: string, userData?: { username?: string; full_name?: string }) => Promise<{ error: { message?: string } | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: { message?: string } | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Auth context: Initializing...')
    // Test database connection on mount
    testDatabaseConnection()
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth context: Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        console.log('Auth context: User found, fetching profile for:', session.user.id)
        fetchProfile(session.user.id)
      } else {
        console.log('Auth context: No user found, setting profile to null')
        setProfile(null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth context: Auth state change:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user?.id) {
        console.log('Auth context: User authenticated, fetching profile')
        await fetchProfile(session.user.id)
      } else {
        console.log('Auth context: User signed out, clearing profile')
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Don't log errors for missing profiles during initial load
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
        // Set profile to null if not found
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Auth context: Attempting sign in with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('Auth context: Sign in result:', { data, error })
      return { error: error ? { message: error.message } : null }
    } catch (err) {
      console.error('Auth context: Sign in error:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return { error: { message } }
    }
  }

  const signUp = async (email: string, password: string, userData?: { username?: string; full_name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { error: error ? { message: error.message } : null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: 'No user logged in' } }

    console.log('Auth context: Updating profile for user:', user.id, 'with updates:', updates)

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    console.log('Auth context: Profile update result:', { data, error })

    if (!error && data) {
      setProfile(data)
      console.log('Auth context: Profile state updated with:', data)
    }

    return { error: error ? { message: error.message } : null }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return default values during SSR
    return {
      user: null,
      profile: null,
      session: null,
      loading: true,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
      updateProfile: async () => ({ error: null }),
    }
  }
  return context
}
