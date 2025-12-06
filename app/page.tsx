'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Filters from '@/app/components/Filters';
import PokemonList from '@/app/components/PokemonList';
import Pagination from '@/app/components/Pagination';
import { PokemonType } from '@/lib/pokemon-types';
import { api } from '@/lib/api';

function PokemonPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get selected types and page number from URL query parameters
  const selectedTypes = useMemo(() => {
    const typeParam = searchParams.get('type');
    if (!typeParam) return [];
    // Support multiple types, separated by commas
    return typeParam.split(',').filter(Boolean) as PokemonType[];
  }, [searchParams]);

  const currentPage = useMemo(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  }, [searchParams]);

  // Handle type toggle - update URL
  const handleTypeToggle = (type: PokemonType) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    if (currentTypes.length === 0) {
      params.delete('type');
    } else {
      params.set('type', currentTypes.join(','));
    }
    
    // Reset to first page when type changes
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  // Fetch total Pokemon count (for display)
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const response = await api.get<{ count: number }>(
          'https://pokeapi.co/api/v2/pokemon'
        );
        setTotalCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch total count:', error);
      }
    };

    fetchTotalCount();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="w-full p-4">
        {/* Filters component at the top */}
        <Filters
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          totalCount={totalCount}
        />

        {/* PokemonList component in the middle */}
        <PokemonList 
          selectedTypes={selectedTypes} 
          currentPage={currentPage}
          onHasNextChange={setHasNext}
        />

        {/* Pagination component at the bottom */}
        <Pagination
          currentPage={currentPage}
          hasNext={hasNext}
          hasPrevious={currentPage > 1}
        />
      </div>
    </div>
  );
}

export default function PokemonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    }>
      <PokemonPageContent />
    </Suspense>
  );
}

