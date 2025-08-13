'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Recipe, RecipeDifficulty } from '@/types/database'
import { CreateRecipeData, UpdateRecipeData, createRecipe, updateRecipe } from '@/lib/recipes'

interface RecipeFormProps {
  recipe?: Recipe
  mode: 'create' | 'edit'
  onSuccess?: () => void
}

const DIFFICULTY_OPTIONS: { value: RecipeDifficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
]

const CATEGORY_OPTIONS = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Appetizer',
  'Soup',
  'Salad',
  'Bread',
  'Beverage',
  'Other'
]

export default function RecipeForm({ recipe, mode, onSuccess }: RecipeFormProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<CreateRecipeData>({
    title: recipe?.title || '',
    description: recipe?.description || '',
    ingredients: recipe?.ingredients || '',
    cooking_time: recipe?.cooking_time || undefined,
    difficulty: recipe?.difficulty || 'medium',
    category: recipe?.category || '',
    instructions: recipe?.instructions || ''
  })

  // Redirect to sign-in if not authenticated
  if (!loading && !user && mode === 'create') {
    router.push('/signin')
    return null
  }

  // For edit mode, check if user is the creator
  if (!loading && !user && mode === 'edit') {
    router.push('/signin')
    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required'
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required'
    }

    if (formData.cooking_time && formData.cooking_time <= 0) {
      newErrors.cooking_time = 'Cooking time must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setErrors({ submit: 'You must be logged in to create a recipe.' })
      return
    }
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      let result: Recipe | null = null

      if (mode === 'create') {
        const recipeDataWithUserId = {
          ...formData,
          user_id: user.id
        }
        result = await createRecipe(recipeDataWithUserId)
      } else if (recipe) {
        const updateData: UpdateRecipeData = {
          id: recipe.id,
          ...formData
        }
        result = await updateRecipe(updateData)
      }

      if (result) {
        onSuccess?.()
        if (mode === 'create') {
          router.push(`/recipes/${result.id}`)
        } else {
          router.push(`/recipes/${recipe?.id}`)
        }
      } else {
        setErrors({ submit: 'Failed to save recipe. Please try again.' })
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateRecipeData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {mode === 'create' ? 'Create New Recipe' : 'Edit Recipe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter recipe title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Brief description of your recipe"
          />
        </div>

        {/* Category and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value as RecipeDifficulty)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cooking Time */}
        <div>
          <label htmlFor="cooking_time" className="block text-sm font-medium text-gray-700 mb-2">
            Cooking Time (minutes)
          </label>
          <input
            type="number"
            id="cooking_time"
            value={formData.cooking_time || ''}
            onChange={(e) => handleInputChange('cooking_time', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            min="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
              errors.cooking_time ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 30"
          />
          {errors.cooking_time && <p className="mt-1 text-sm text-red-600">{errors.cooking_time}</p>}
        </div>

        {/* Ingredients */}
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients *
          </label>
          <textarea
            id="ingredients"
            value={formData.ingredients}
            onChange={(e) => handleInputChange('ingredients', e.target.value)}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
              errors.ingredients ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="List all ingredients with quantities (e.g., 2 cups flour, 1 tsp salt)"
          />
          {errors.ingredients && <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>}
        </div>

        {/* Instructions */}
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Instructions *
          </label>
          <textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => handleInputChange('instructions', e.target.value)}
            rows={8}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
              errors.instructions ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Step-by-step cooking instructions"
          />
          {errors.instructions && <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
