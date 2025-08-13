import { supabase } from '@/lib/supabase'
import { Comment, CommentInsert, CommentUpdate, Like, LikeInsert, CommentWithUser, RecipeStats, Recipe } from '@/types/database'

// ========================================
// COMMENTS API FUNCTIONS
// ========================================

/**
 * Get comments for a recipe with user information
 */
export async function getRecipeComments(recipeId: string): Promise<CommentWithUser[]> {
  try {
    const { data, error } = await supabase
      .from('comments_with_users')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error fetching comments:', error)
    throw error
  }
}

/**
 * Create a new comment
 */
export async function createComment(comment: CommentInsert): Promise<Comment> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating comment:', error)
    throw error
  }
}

/**
 * Update a comment
 */
export async function updateComment(commentId: string, updates: CommentUpdate): Promise<Comment> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId)
      .select()
      .single()

    if (error) {
      console.error('Error updating comment:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating comment:', error)
    throw error
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

/**
 * Get comment count for a recipe
 */
export async function getRecipeCommentCount(recipeId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .rpc('get_recipe_comment_count', { recipe_uuid: recipeId })

    if (error) {
      console.error('Error getting comment count:', error)
      throw error
    }

    return data || 0
  } catch (error) {
    console.error('Error getting comment count:', error)
    return 0
  }
}

// ========================================
// LIKES API FUNCTIONS
// ========================================

/**
 * Get likes for a recipe
 */
export async function getRecipeLikes(recipeId: string): Promise<Like[]> {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching likes:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error fetching likes:', error)
    throw error
  }
}

/**
 * Like a recipe
 */
export async function likeRecipe(like: LikeInsert): Promise<Like> {
  try {
    const { data, error } = await supabase
      .from('likes')
      .insert(like)
      .select()
      .single()

    if (error) {
      console.error('Error liking recipe:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error liking recipe:', error)
    throw error
  }
}

/**
 * Unlike a recipe
 */
export async function unlikeRecipe(userId: string, recipeId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)

    if (error) {
      console.error('Error unliking recipe:', error)
      throw error
    }
  } catch (error) {
    console.error('Error unliking recipe:', error)
    throw error
  }
}

/**
 * Check if user has liked a recipe
 */
export async function hasUserLikedRecipe(userId: string, recipeId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('has_user_liked_recipe', { 
        recipe_uuid: recipeId, 
        user_uuid: userId 
      })

    if (error) {
      console.error('Error checking if user liked recipe:', error)
      throw error
    }

    return data || false
  } catch (error) {
    console.error('Error checking if user liked recipe:', error)
    return false
  }
}

/**
 * Get like count for a recipe
 */
export async function getRecipeLikeCount(recipeId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .rpc('get_recipe_like_count', { recipe_uuid: recipeId })

    if (error) {
      console.error('Error getting like count:', error)
      throw error
    }

    return data || 0
  } catch (error) {
    console.error('Error getting like count:', error)
    return 0
  }
}

/**
 * Toggle like for a recipe (like if not liked, unlike if liked)
 */
export async function toggleRecipeLike(userId: string, recipeId: string): Promise<{ liked: boolean; likeCount: number }> {
  try {
    const hasLiked = await hasUserLikedRecipe(userId, recipeId)
    
    if (hasLiked) {
      await unlikeRecipe(userId, recipeId)
    } else {
      await likeRecipe({ user_id: userId, recipe_id: recipeId })
    }

    const newLikeCount = await getRecipeLikeCount(recipeId)
    
    return {
      liked: !hasLiked,
      likeCount: newLikeCount
    }
  } catch (error) {
    console.error('Error toggling recipe like:', error)
    throw error
  }
}

// ========================================
// RECIPE STATS FUNCTIONS
// ========================================

/**
 * Get recipe statistics (likes and comments count)
 */
export async function getRecipeStats(recipeId: string): Promise<RecipeStats | null> {
  try {
    const { data, error } = await supabase
      .from('recipe_stats')
      .select('*')
      .eq('recipe_id', recipeId)
      .single()

    if (error) {
      console.error('Error fetching recipe stats:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching recipe stats:', error)
    return null
  }
}

/**
 * Get multiple recipes with their stats
 */
export async function getRecipesWithStats(limit: number = 10, offset: number = 0): Promise<RecipeStats[]> {
  try {
    const { data, error } = await supabase
      .from('recipe_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching recipes with stats:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error fetching recipes with stats:', error)
    throw error
  }
}

// ========================================
// USER SAVED (LIKED) RECIPES
// ========================================

/**
 * Get all recipes liked by a user
 */
export async function getUserLikedRecipes(userId: string): Promise<Recipe[]> {
  try {
    type Row = { recipe_id: string; recipes: Recipe }
    const { data, error } = await supabase
      .from('likes')
      .select(
        `recipe_id, recipes(*, profiles!recipes_user_id_fkey(username, full_name))`
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching liked recipes:', error)
      throw error
    }

    const rows = (data || []) as unknown as Row[]
    return rows.map((r) => r.recipes)
  } catch (error) {
    console.error('Error fetching liked recipes:', error)
    throw error
  }
}

/**
 * Get stats for a list of recipe ids
 */
export async function getStatsForRecipes(recipeIds: string[]): Promise<RecipeStats[]> {
  if (recipeIds.length === 0) return []
  try {
    const { data, error } = await supabase
      .from('recipe_stats')
      .select('*')
      .in('recipe_id', recipeIds)

    if (error) {
      console.error('Error fetching stats for recipes:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error fetching stats for recipes:', error)
    throw error
  }
}
