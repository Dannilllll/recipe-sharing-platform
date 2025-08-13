import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  )
}

// Recipe Card Skeleton
export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-3" />
        
        {/* Description */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        
        {/* Meta Information */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        
        {/* Author */}
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Date */}
        <Skeleton className="h-3 w-20 mt-3" />
      </div>
    </div>
  )
}

// Recipe List Skeleton
export function RecipeListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Recipe Detail Skeleton
export function RecipeDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-gray-200">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-2/3 mb-6" />
        
        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        
        {/* Author and Date */}
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          <Skeleton className="h-4 w-32 mr-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="bg-gray-50 rounded-lg p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="bg-gray-50 rounded-lg p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Skeleton className="h-8 w-48 mb-6" />
      
      <div className="space-y-6">
        {/* Title */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        {/* Description */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-20 w-full" />
        </div>
        
        {/* Category and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        {/* Cooking Time */}
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        {/* Ingredients */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
        
        {/* Instructions */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-40 w-full" />
        </div>
        
        {/* Submit Button */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

// Search Skeleton
export function SearchSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex gap-3 mb-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}
