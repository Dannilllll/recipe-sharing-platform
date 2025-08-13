'use client'

import { useState, useEffect } from 'react'
import { Recipe, RecipeStats } from '@/types/database'
import { getRecipes, searchRecipes } from '@/lib/recipes'
import { getRecipesWithStats } from '@/lib/social'
import RecipeCard from './recipe-card'
import RecipeSearch, { SearchFilters } from './recipe-search'
import { RecipeListSkeleton } from '@/app/components/ui/skeleton'

interface RecipeListProps {
  initialRecipes?: Recipe[]
  initialCount?: number
  showAuthor?: boolean
}

export default function RecipeList({ initialRecipes = [], initialCount = 0, showAuthor = true }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [recipeStats, setRecipeStats] = useState<RecipeStats[]>([])
  const [count, setCount] = useState(initialCount)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSearchMode, setIsSearchMode] = useState(false)

  const itemsPerPage = 12
  const totalPages = Math.ceil(count / itemsPerPage)

  const loadRecipes = async (page: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const [result, stats] = await Promise.all([
        getRecipes(page, itemsPerPage),
        getRecipesWithStats(itemsPerPage, (page - 1) * itemsPerPage)
      ])
      setRecipes(result.recipes)
      setRecipeStats(stats)
      setCount(result.count)
      setIsSearchMode(false)
    } catch (err) {
      setError('Failed to load recipes. Please try again.')
      console.error('Error loading recipes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true)
    setError(null)

    try {
      const searchResults = await searchRecipes(query, filters)
      setRecipes(searchResults)
      setCount(searchResults.length)
      setIsSearchMode(true)
      setCurrentPage(1)
    } catch (err) {
      setError('Failed to search recipes. Please try again.')
      console.error('Error searching recipes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    loadRecipes(1)
  }

  useEffect(() => {
    if (initialRecipes.length === 0) {
      loadRecipes(1)
    }
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadRecipes(page)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadRecipes(currentPage)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (isLoading && recipes.length === 0) {
    return (
      <div className="space-y-6">
        <RecipeSearch 
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isLoading={isLoading}
        />
        <RecipeListSkeleton count={8} />
      </div>
    )
  }

  if (recipes.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
        <p className="text-gray-500">Be the first to share a delicious recipe!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Component */}
      <RecipeSearch 
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={isLoading}
      />

      {/* Search Results Info */}
      {isSearchMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-blue-800">
              Found {count} recipe{count !== 1 ? 's' : ''} matching your search
            </span>
          </div>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => {
          const stats = recipeStats.find(s => s.recipe_id === recipe.id)
          return (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              stats={stats}
              showAuthor={showAuthor} 
            />
          )
        })}
      </div>

      {/* Pagination - Only show when not in search mode */}
      {totalPages > 1 && !isSearchMode && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {isLoading && recipes.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading recipes...
          </div>
        </div>
      )}
    </div>
  )
}
