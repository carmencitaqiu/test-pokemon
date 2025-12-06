'use client';

import { POKEMON_TYPES, PokemonType } from '@/lib/pokemon-types';

interface FiltersProps {
  selectedTypes: PokemonType[];
  onTypeToggle: (type: PokemonType) => void;
  totalCount?: number;
}

export default function Filters({ selectedTypes, onTypeToggle, totalCount }: FiltersProps) {
  return (
    <div className="bg-white mb-6">
      <div className="mb-4">
        <h2 className="text-2xl  text-gray-900 mb-2 text-center">
          Welcome to Pokemon world
        </h2>
        {totalCount !== undefined && (
          <p className="text-black text-base">
            Total count: {totalCount}
          </p>
        )}
      </div>
      
      <div className="flex items-start space-x-6 w-full">
        <span className="text-base font-medium text-gray-700 whitespace-nowrap">
          Types:
        </span>
        <div className="flex flex-wrap gap-5">
          {POKEMON_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => onTypeToggle(type)}
                className={`
                  p-4 border cursor-pointer whitespace-nowrap
                  ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

