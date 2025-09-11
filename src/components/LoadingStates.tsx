import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const MessageSkeleton = () => (
  <div className="p-4 space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'justify-end'}`}>
        {i % 2 === 0 && <Skeleton className="w-10 h-10 rounded-full" />}
        <div className={`flex flex-col gap-2 ${i % 2 === 0 ? '' : 'items-end'}`}>
          <Skeleton className={`h-4 ${i % 2 === 0 ? 'w-32' : 'w-28'}`} />
          <Skeleton className={`h-6 ${i % 2 === 0 ? 'w-48' : 'w-40'} rounded-xl`} />
        </div>
        {i % 2 === 1 && <Skeleton className="w-10 h-10 rounded-full" />}
      </div>
    ))}
  </div>
);

export const ConversationSkeleton = () => (
  <div className="p-4 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    ))}
  </div>
);

export const ContactSkeleton = () => (
  <div className="p-4 space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

export const MomentsSkeleton = () => (
  <div className="p-4 space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const PullRefreshIndicator = ({ pullDistance }: { pullDistance: number }) => (
  <div 
    className="absolute top-0 left-0 right-0 flex justify-center items-center z-50 transition-all duration-200"
    style={{ 
      transform: `translateY(${Math.min(pullDistance - 50, 20)}px)`,
      opacity: pullDistance > 20 ? 1 : pullDistance / 20 
    }}
  >
    <div className={`w-8 h-8 rounded-full border-2 border-primary ${pullDistance > 60 ? 'animate-spin' : ''}`}>
      <div className="w-full h-full rounded-full border-t-2 border-primary animate-spin"></div>
    </div>
  </div>
);