'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Recipe } from '@/types/database'
import { deleteRecipe, isRecipeCreator } from '@/lib/recipes'

interface RecipeActionsProps {
  recipe: Recipe
}

export default function RecipeActions({ recipe }: RecipeActionsProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isCreator, setIsCreator] = useState(false)

  // Check if user is the creator
  useEffect(() => {
    const checkCreator = async () => {
      if (user && recipe) {
        const creator = await isRecipeCreator(recipe.id, user.id)
        setIsCreator(creator)
      }
    }
    checkCreator()
  }, [user, recipe])

  const handleEdit = () => {
    router.push(`/recipes/edit/${recipe.id}`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const success = await deleteRecipe(recipe.id)
      if (success) {
        router.push('/recipes')
      } else {
        alert('Failed to delete recipe. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('An error occurred while deleting the recipe.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Don't show actions if user is not the creator
  if (!isCreator) {
    return null
  }

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleEdit}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Recipe
      </button>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {isDeleting ? 'Deleting...' : 'Delete Recipe'}
      </button>
    </div>
  )
}
