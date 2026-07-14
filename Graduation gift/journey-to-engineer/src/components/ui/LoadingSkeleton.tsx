export function MessageCardSkeleton() {
  return (
    <div className="glass-effect rounded-xl p-8 border border-celebration-gold/30 animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-gray-300 dark:bg-dark-500 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-dark-600 rounded-full w-24"></div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-4/6"></div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-32"></div>
    </div>
  )
}

export function TimelineEventSkeleton({ isEven }: { isEven: boolean }) {
  return (
    <div className={`flex gap-8 items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
        <div className="bg-white dark:bg-dark-600 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-dark-500 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-32 mb-3"></div>
          <div className="h-7 bg-gray-300 dark:bg-dark-500 rounded w-2/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-center flex-shrink-0">
        <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-dark-600 border-4 border-white"></div>
      </div>
      <div className="flex-1" />
    </div>
  )
}

export function AdminMessageSkeleton() {
  return (
    <div className="p-8 border-2 border-gold-100 rounded-xl animate-pulse">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-grow">
          <div className="mb-4">
            <div className="h-7 bg-gray-300 dark:bg-dark-500 rounded w-48 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-dark-600 rounded-full w-32"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-5 bg-gray-200 dark:bg-dark-600 rounded w-full"></div>
            <div className="h-5 bg-gray-200 dark:bg-dark-600 rounded w-5/6"></div>
            <div className="h-5 bg-gray-200 dark:bg-dark-600 rounded w-4/6"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-40"></div>
        </div>
        <div className="flex flex-col gap-3 flex-shrink-0">
          <div className="h-10 bg-gray-300 dark:bg-dark-600 rounded w-24"></div>
          <div className="h-10 bg-gray-200 dark:bg-dark-600 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

export function GalleryImageSkeleton() {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-300 dark:bg-dark-600 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400 dark:text-dark-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}
