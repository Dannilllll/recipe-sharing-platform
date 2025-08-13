import { getRecipes } from '@/lib/recipes'
import RecipeList from '@/app/components/recipes/recipe-list'
import Link from 'next/link'

export default async function RecipesPage() {
  // Get initial recipes for server-side rendering
  const { recipes, count } = await getRecipes(1, 12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
              <p className="mt-2 text-gray-600">
                Discover delicious recipes from our community
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/recipes/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Recipe
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeList initialRecipes={recipes} initialCount={count} />
      </div>
    </div>
  )
}
