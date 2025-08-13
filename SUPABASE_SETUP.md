# Supabase Database Setup Guide

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. Database Schema Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script

This will create:
- Two main tables: `profiles` and `recipes`
- Row Level Security (RLS) policies
- Database triggers and functions
- Proper indexes for performance

## 3. Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable Email authentication
3. Configure your email templates if needed
4. Set up any additional providers (Google, GitHub, etc.) if desired

## 4. Database Tables Overview

### Tables:
- **`profiles`**: User profiles (extends auth.users)
  - `id` (UUID, references auth.users)
  - `username` (TEXT, unique)
  - `full_name` (TEXT, nullable)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

- **`recipes`**: Recipe data
  - `id` (UUID, primary key)
  - `created_at` (TIMESTAMP)
  - `user_id` (UUID, references profiles)
  - `title` (TEXT)
  - `description` (TEXT, nullable)
  - `ingredients` (TEXT)
  - `cooking_time` (INTEGER, minutes)
  - `difficulty` (ENUM: 'easy', 'medium', 'hard')
  - `category` (TEXT, nullable)
  - `instructions` (TEXT)

### Features:
- Row Level Security (RLS) enabled on both tables
- Automatic profile creation on user signup
- Proper foreign key relationships
- Performance indexes
- Custom enum for difficulty levels

## 5. Testing the Setup

After running the schema, you can test by:

1. Creating a user account
2. Checking that a profile was automatically created
3. Creating a recipe
4. Viewing recipes with user information

## 6. Next Steps

- Implement authentication UI components
- Create recipe CRUD operations
- Build the recipe browsing interface
- Add search functionality
