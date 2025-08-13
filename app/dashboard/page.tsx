'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getRecipes } from '@/lib/recipes'
import { getRecipesWithStats } from '@/lib/social'
import type { Recipe, RecipeStats } from '@/types/database'

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeStats, setRecipeStats] = useState<RecipeStats[]>([])
  const [loadingRecipes, setLoadingRecipes] = useState(true)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  // Fetch recipes from other users
  useEffect(() => {
    if (user) {
      fetchRecipes()
    }
  }, [user])

  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true)
      const [result, stats] = await Promise.all([
        getRecipes(1, 6), // Get first 6 recipes
        getRecipesWithStats(6, 0)
      ])
      // Filter out recipes created by the current user
      const otherUsersRecipes = result.recipes.filter(recipe => recipe.user_id !== user?.id)
      setRecipes(otherUsersRecipes)
      setRecipeStats(stats)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoadingRecipes(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Recipes
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover delicious recipes shared by our community
          </p>
          <Link
            href="/recipes/create"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Share Your Recipe
          </Link>
        </div>

        {/* Recipes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Recipes</h2>
          <p className="text-gray-600 mb-6">
            Discover delicious recipes shared by our community
          </p>
        </div>

        {/* Recipes Grid */}
        {loadingRecipes ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share a recipe with the community!
            </p>
            <Link
              href="/recipes/create"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200"
            >
              Create First Recipe
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => {
              const stats = recipeStats.find(s => s.recipe_id === recipe.id)
              return (
                <div key={recipe.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>
                
                {recipe.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {recipe.description}
                  </p>
                )}
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {recipe.ingredients}
                  </p>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>⏱️ {recipe.cooking_time || 'N/A'} min</span>
                  {recipe.category && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    By {recipe.profiles?.username || recipe.profiles?.full_name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Social Stats */}
                {stats && (
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="text-red-500">❤️</span>
                      <span>{stats.like_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500">💬</span>
                      <span>{stats.comment_count}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/profile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600 text-sm">Update your profile & bio</p>
          </Link>
          
          <Link href="/recipes/create" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Recipe</h3>
            <p className="text-gray-600 text-sm">Share your culinary masterpiece</p>
          </Link>
          
          <Link href="/my-recipes" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Recipes</h3>
            <p className="text-gray-600 text-sm">Manage your shared recipes</p>
          </Link>
          
          <Link href="/recipes" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse All</h3>
            <p className="text-gray-600 text-sm">Explore all community recipes</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
