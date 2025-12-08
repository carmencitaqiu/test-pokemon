import Image from 'next/image';
import { Pokemon } from '@/lib/pokemon-types';

interface PokemonItemProps {
  pokemon: Pokemon;
}

// Server Component - Pure rendering component with no client-side state
export default function PokemonItem({ pokemon }: PokemonItemProps) {
  // Prefer animated image, fallback to static image if not available
  const imageUrl = pokemon.animatedImage || pokemon.image;

  return (
    <div className="bg-white p-4">
      <h3 className="text-gray-900 capitalize text-center">
        {pokemon.name}
      </h3>
      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={pokemon.name}
            width={35}
            height={53}
            className="object-contain w-20"
            unoptimized
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

