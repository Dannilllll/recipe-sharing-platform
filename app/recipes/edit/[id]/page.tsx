import { notFound } from 'next/navigation'
import { getRecipe } from '@/lib/recipes'
import RecipeForm from '@/app/components/recipes/recipe-form'

interface EditRecipePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params
  const recipe = await getRecipe(id)

  if (!recipe) {
    notFound()
  }

  // Check if user is authenticated and is the creator
  // For now, we'll handle this in the client component
  // In a production app, you'd want to check this server-side

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <RecipeForm recipe={recipe} mode="edit" />
      </div>
    </div>
  )
}
