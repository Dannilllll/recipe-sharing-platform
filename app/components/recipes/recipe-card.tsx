'use client'

import Link from 'next/link'
import { Recipe, RecipeStats } from '@/types/database'
import { Heart, MessageCircle } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe & {
    profiles?: {
      username: string
      full_name: string
    }
  }
  stats?: RecipeStats
  showAuthor?: boolean
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'hard':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatCookingTime = (minutes: number | null) => {
  if (!minutes) return 'N/A'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export default function RecipeCard({ recipe, stats, showAuthor = true }: RecipeCardProps) {
  const truncatedDescription = recipe.description 
    ? recipe.description.length > 120 
      ? `${recipe.description.substring(0, 120)}...` 
      : recipe.description
    : ''

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {recipe.title}
            </h3>
          </div>

          {/* Description */}
          {truncatedDescription && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {truncatedDescription}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Category */}
            {recipe.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {recipe.category}
              </span>
            )}

            {/* Difficulty */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </span>

            {/* Cooking Time */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatCookingTime(recipe.cooking_time)}
            </span>
          </div>

          {/* Author */}
          {showAuthor && recipe.profiles && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{recipe.profiles.full_name}</span>
            </div>
          )}

          {/* Social Stats */}
          {stats && (
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{stats.like_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span>{stats.comment_count}</span>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="mt-3 text-xs text-gray-400">
            {new Date(recipe.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </Link>
    </div>
  )
}
