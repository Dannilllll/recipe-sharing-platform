import { supabase } from './supabase'
import type { Database } from '@/types/database'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type Recipe = Tables<'recipes'>

// Profile operations
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export async function updateProfile(userId: string, updates: UpdateTables<'profiles'>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Recipe operations
export async function getRecipes(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey(username, full_name)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  return { data, error }
}

export async function getRecipe(id: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey(username, full_name)
    `)
    .eq('id', id)
    .single()
  
  return { data, error }
}

export async function createRecipe(recipe: InsertTables<'recipes'>) {
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipe)
    .select()
    .single()
  
  return { data, error }
}

export async function updateRecipe(id: string, updates: UpdateTables<'recipes'>) {
  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteRecipe(id: string) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
  
  return { error }
}

export async function getUserRecipes(userId: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Search operations
export async function searchRecipes(query: string, limit = 10) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!recipes_user_id_fkey(username, full_name)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,ingredients.ilike.%${query}%,instructions.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}
