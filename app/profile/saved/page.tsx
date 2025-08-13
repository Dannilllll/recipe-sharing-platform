'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getUserLikedRecipes, getStatsForRecipes } from '@/lib/social'
import type { Recipe, RecipeStats } from '@/types/database'
import RecipeCard from '@/app/components/recipes/recipe-card'
import { RecipeListSkeleton } from '@/app/components/ui/skeleton'

export default function SavedRecipesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [stats, setStats] = useState<RecipeStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
      return
    }
    const load = async () => {
      if (!user) return
      setIsLoading(true)
      try {
        const liked = await getUserLikedRecipes(user.id)
        setRecipes(liked)
        const likedIds = liked.map(r => r.id)
        const likedStats = await getStatsForRecipes(likedIds)
        setStats(likedStats)
      } finally {
        setIsLoading(false)
      }
    }
    if (!loading && user) load()
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Recipes</h1>
            <p className="text-gray-600 mt-2">Recipes you've liked</p>
          </div>
          <Link
            href="/recipes"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Browse Recipes
          </Link>
        </div>

        {isLoading ? (
          <RecipeListSkeleton count={6} />
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❤️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved recipes yet</h3>
            <p className="text-gray-600 mb-6">Start liking recipes to see them here.</p>
            <Link
              href="/recipes"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700"
            >
              Discover Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => {
              const s = stats.find(st => st.recipe_id === recipe.id)
              return (
                <RecipeCard key={recipe.id} recipe={recipe} stats={s} />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}


