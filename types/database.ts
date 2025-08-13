export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          recipe_id: string
          content: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          recipe_id: string
          content: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          recipe_id?: string
          content?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          recipe_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          recipe_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          username: string | null
          full_name: string | null
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          description: string | null
          ingredients: string
          cooking_time: number | null
          difficulty: Database['public']['Enums']['recipe_difficulty']
          category: string | null
          instructions: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          description?: string | null
          ingredients: string
          cooking_time?: number | null
          difficulty?: Database['public']['Enums']['recipe_difficulty']
          category?: string | null
          instructions: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          description?: string | null
          ingredients?: string
          cooking_time?: number | null
          difficulty?: Database['public']['Enums']['recipe_difficulty']
          category?: string | null
          instructions?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      comments_with_users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          content: string
          parent_id: string | null
          recipe_id: string
          user_id: string
          username: string | null
          full_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_stats: {
        Row: {
          recipe_id: string
          title: string
          like_count: number
          comment_count: number
          created_at: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_recipe_comment_count: {
        Args: {
          recipe_uuid: string
        }
        Returns: number
      }
      get_recipe_like_count: {
        Args: {
          recipe_uuid: string
        }
        Returns: number
      }
      has_user_liked_recipe: {
        Args: {
          recipe_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      recipe_difficulty: 'easy' | 'medium' | 'hard'
    }
  }
}

// Type aliases for easier use
export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']

export type Like = Database['public']['Tables']['likes']['Row']
export type LikeInsert = Database['public']['Tables']['likes']['Insert']
export type LikeUpdate = Database['public']['Tables']['likes']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Recipe = Database['public']['Tables']['recipes']['Row']
export type RecipeInsert = Database['public']['Tables']['recipes']['Insert']
export type RecipeUpdate = Database['public']['Tables']['recipes']['Update']

export type CommentWithUser = Database['public']['Views']['comments_with_users']['Row']
export type RecipeStats = Database['public']['Views']['recipe_stats']['Row']
