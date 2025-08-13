import RecipeForm from '@/app/components/recipes/recipe-form'

export default function CreateRecipePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <RecipeForm mode="create" />
      </div>
    </div>
  )
}
