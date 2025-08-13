import { RecipeListSkeleton } from '@/app/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto mb-8"></div>
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>

        {/* Recipes Grid */}
        <RecipeListSkeleton count={6} />

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
