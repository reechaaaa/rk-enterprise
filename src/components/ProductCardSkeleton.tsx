// src/components/Skeleton.tsx or src/components/ProductCardSkeleton.tsx

import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

interface SkeletonProps {
    view: 'grid' | 'list';
}

export const ProductCardSkeleton: React.FC<SkeletonProps> = ({ view }) => {
    // A simple gray box placeholder
    const isGrid = view === 'grid';

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${isGrid ? 'flex flex-col' : 'flex flex-row h-44'}`}>
            <div className={`bg-gray-200 ${isGrid ? 'w-full h-44' : 'w-1/3 h-full'}`}></div>
            <div className="p-4 flex-grow space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    );
};