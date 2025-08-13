import { FormSkeleton } from '@/app/components/ui/skeleton'

export default function EditRecipeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <FormSkeleton />
      </div>
    </div>
  )
}
