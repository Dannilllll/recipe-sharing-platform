'use client'

import { useState, useEffect } from 'react'
import { Heart, HeartOff } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toggleRecipeLike, hasUserLikedRecipe, getRecipeLikeCount } from '@/lib/social'

interface LikeButtonProps {
  recipeId: string
  initialLikeCount?: number
  initialIsLiked?: boolean
  onLikeChange?: (liked: boolean, count: number) => void
}

export default function LikeButton({ 
  recipeId, 
  initialLikeCount = 0, 
  initialIsLiked = false,
  onLikeChange 
}: LikeButtonProps) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)

  // Sync with server state on mount
  useEffect(() => {
    if (user) {
      const checkLikeStatus = async () => {
        try {
          const [liked, count] = await Promise.all([
            hasUserLikedRecipe(user.id, recipeId),
            getRecipeLikeCount(recipeId)
          ])
          setIsLiked(liked)
          setLikeCount(count)
        } catch (error) {
          console.error('Error checking like status:', error)
        }
      }
      checkLikeStatus()
    }
  }, [user, recipeId])

  const handleLikeToggle = async () => {
    if (!user) {
      // Redirect to sign in or show auth modal
      return
    }

    setIsLoading(true)
    try {
      const result = await toggleRecipeLike(user.id, recipeId)
      setIsLiked(result.liked)
      setLikeCount(result.likeCount)
      onLikeChange?.(result.liked, result.likeCount)
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert optimistic update
      setIsLiked(!isLiked)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
        isLiked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
    >
      {isLiked ? (
        <Heart className="w-5 h-5 fill-current" />
      ) : (
        <HeartOff className="w-5 h-5" />
      )}
      <span className="font-medium">
        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
      </span>
    </button>
  )
}
