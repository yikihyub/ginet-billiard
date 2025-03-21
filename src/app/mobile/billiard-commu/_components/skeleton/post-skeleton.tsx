import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { filterTags } from '../filter/filter-tags';

export default function PostSkeleton() {
  return (
    <>
      <div className="scrollbar-hide no-scrollbar flex gap-2 overflow-x-auto bg-white p-3">
        {filterTags.map((tag) => (
          <Button
            key={tag.id}
            variant="outline"
            className="whitespace-nowrap rounded-full"
          >
            {tag.name}
          </Button>
        ))}
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-start justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="mb-3 h-16 w-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
