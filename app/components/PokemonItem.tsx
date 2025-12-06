'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Pokemon } from '@/lib/pokemon-types';

interface PokemonItemProps {
  pokemon: Pokemon;
}

// Pure rendering component with no side effects
export default function PokemonItem({ pokemon }: PokemonItemProps) {
  // Prefer animated GIF, fallback to static image if not available
  const [imageUrl, setImageUrl] = useState(pokemon.animatedImage || pokemon.image);
  const [hasError, setHasError] = useState(false);

  // Fallback to static image if GIF fails to load
  const handleError = () => {
    if (pokemon.animatedImage && pokemon.image && imageUrl === pokemon.animatedImage) {
      setImageUrl(pokemon.image);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="bg-white p-4">
    <h3 className=" text-gray-900 capitalize text-center">
        {pokemon.name}
    </h3>
      <div className="relative w-full aspect-square  flex items-center justify-center overflow-hidden">
        {imageUrl && !hasError ? (
          <Image
            src={imageUrl}
            alt={pokemon.name}
            width={35}
            height={53}
            className="object-contain w-20"
            unoptimized
            onError={handleError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>
        <p className="text-base text-black text-center">
          Number: {pokemon.id}
        </p>
    </div>
  );
}

