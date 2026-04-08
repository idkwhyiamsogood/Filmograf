import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  className?: string;
}

export const CollectionSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <Card className={`relative w-48 overflow-visible border-none bg-transparent shadow-none ${className ?? ''}`}>
      <CardContent className="p-0">
        {/* Веерная композиция скелетонов */}
        <div className="relative mx-auto mb-3 h-64 w-36">
          <Skeleton
            className="absolute bottom-0 left-1/2 h-56 w-36 -translate-x-1/2 rotate-[10deg] rounded-lg"
            style={{ zIndex: 1, transformOrigin: 'bottom center' }}
          />
          <Skeleton
            className="absolute bottom-0 left-1/2 h-56 w-36 -translate-x-1/2 -rotate-[10deg] rounded-lg"
            style={{ zIndex: 2, transformOrigin: 'bottom center' }}
          />
          <Skeleton
            className="absolute bottom-0 left-1/2 h-56 w-36 -translate-x-1/2 rounded-lg"
            style={{ zIndex: 3, transformOrigin: 'bottom center' }}
          />
        </div>

        {/* Название */}
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};