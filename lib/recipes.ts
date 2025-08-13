import { supabase } from '@/lib/supabase'
import { Recipe, RecipeDifficulty } from '@/types/database'

export interface CreateRecipeData {
  title: string
  description?: string
  ingredients: string
  cooking_time?: number
  difficulty?: RecipeDifficulty
  category?: string
  instructions: string
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string
}

// Create a new recipe
export async function createRecipe(data: CreateRecipeData): Promise<Recipe | null> {
  try {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error creating recipe:', error)
      return null
    }

    return recipe
  } catch (error) {
    console.error('Error creating recipe:', error)
    return null
  }
}

// Get all recipes with pagination
export async function getRecipes(page = 1, limit = 12): Promise<{ recipes: Recipe[], count: number }> {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: recipes, error, count } = await supabase
      .from('recipes')
      .select('*, profiles(username, full_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching recipes:', error)
      return { recipes: [], count: 0 }
    }

    return { recipes: recipes || [], count: count || 0 }
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return { recipes: [], count: 0 }
  }
}

// Get a single recipe by ID
export async function getRecipe(id: string): Promise<Recipe | null> {
  try {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*, profiles(username, full_name)')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching recipe:', error)
      return null
    }

    return recipe
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

// Get recipes by user ID
export async function getUserRecipes(userId: string): Promise<Recipe[]> {
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user recipes:', error)
      return []
    }

    return recipes || []
  } catch (error) {
    console.error('Error fetching user recipes:', error)
    return []
  }
}

// Update a recipe
export async function updateRecipe(data: UpdateRecipeData): Promise<Recipe | null> {
  try {
    const { id, ...updateData } = data
    const { data: recipe, error } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating recipe:', error)
      return null
    }

    return recipe
  } catch (error) {
    console.error('Error updating recipe:', error)
    return null
  }
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting recipe:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return false
  }
}

// Check if user is the creator of a recipe
export async function isRecipeCreator(recipeId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('user_id')
      .eq('id', recipeId)
      .single()

    if (error) {
      console.error('Error checking recipe ownership:', error)
      return false
    }

    return data?.user_id === userId
  } catch (error) {
    console.error('Error checking recipe ownership:', error)
    return false
  }
}

// Search recipes
export async function searchRecipes(query: string, filters?: {
  category?: string
  difficulty?: RecipeDifficulty
  maxCookingTime?: number
}): Promise<Recipe[]> {
  try {
    let queryBuilder = supabase
      .from('recipes')
      .select('*, profiles(username, full_name)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,ingredients.ilike.%${query}%`)

    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category)
    }

    if (filters?.difficulty) {
      queryBuilder = queryBuilder.eq('difficulty', filters.difficulty)
    }

    if (filters?.maxCookingTime) {
      queryBuilder = queryBuilder.lte('cooking_time', filters.maxCookingTime)
    }

    const { data: recipes, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching recipes:', error)
      return []
    }

    return recipes || []
  } catch (error) {
    console.error('Error searching recipes:', error)
    return []
  }
}
