'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

function PaginationContent({ currentPage, hasNext, hasPrevious }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-8 mb-4">
      {/* Show only Next button on first page, show both Previous and Next on other pages */}
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className={`
            px-6 py-2 rounded font-medium transition-colors cursor-pointer
            ${
              hasPrevious
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Previous
        </button>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`
          px-6 py-2 rounded font-medium transition-colors cursor-pointer
          ${
            hasNext
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        Next
      </button>
    </div>
  );
}

export default function Pagination(props: PaginationProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center gap-4 mt-8 mb-4">
        <div className="text-gray-600">加载中...</div>
      </div>
    }>
      <PaginationContent {...props} />
    </Suspense>
  );
}

