'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, profile, loading, updateProfile: updateAuthProfile } = useAuth()
  const router = useRouter()
  
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setFullName(profile.full_name || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  // Clear messages when switching edit modes
  useEffect(() => {
    if (!isEditing) {
      setError('')
      setSuccess('')
    }
  }, [isEditing])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  const handleSave = async () => {
    if (!username.trim() || !fullName.trim()) {
      setError('Username and full name are required')
      return
    }

    setSaveLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Updating profile with:', {
        username: username.trim(),
        full_name: fullName.trim(),
        bio: bio.trim() || null,
      })

      const { error } = await updateAuthProfile({
        username: username.trim(),
        full_name: fullName.trim(),
        bio: bio.trim() || null,
      })

      if (error) {
        console.error('Profile update error:', error)
        setError(error.message || 'Failed to update profile. Please try again.')
        return
      }

      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleCancel = () => {
    setUsername(profile?.username || '')
    setFullName(profile?.full_name || '')
    setBio(profile?.bio || '')
    setIsEditing(false)
    setError('')
    setSuccess('')
    setSaveLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account information</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                  placeholder="Enter your username"
                />
              ) : (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black">
                  {profile?.username || 'Not set'}
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black">
                  {profile?.full_name || 'Not set'}
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-black"
                  placeholder="Tell us about yourself, your cooking experience, favorite cuisines..."
                />
              ) : (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[60px] text-black">
                  {profile?.bio || 'No bio added yet'}
                </div>
              )}
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saveLoading}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/dashboard"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold">🏠</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Dashboard</h3>
                  <p className="text-sm text-gray-600">View community recipes</p>
                </div>
              </Link>
              
              <Link
                href="/recipes/create"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold">📝</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create Recipe</h3>
                  <p className="text-sm text-gray-600">Share your culinary creation</p>
                </div>
              </Link>

              <Link
                href="/profile/saved"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold">❤️</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Saved Recipes</h3>
              <p className="text-sm text-gray-600">View recipes you&apos;ve liked</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
