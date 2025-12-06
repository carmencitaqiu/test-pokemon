'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Pokemon, PokemonType, PokemonApiResponse, PokemonDetailResponse } from '@/lib/pokemon-types';
import { POKEMON_LIMIT } from '@/lib/pokemon-constants';
import PokemonItem from '@/app/components/PokemonItem';

interface PokemonListProps {
  selectedTypes: PokemonType[];
  currentPage: number;
  onHasNextChange?: (hasNext: boolean) => void;
}

export default function PokemonList({ selectedTypes, currentPage, onHasNextChange }: PokemonListProps) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true); // Set initial state to true to ensure server and client consistency
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component renders content only after client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Wait for component to mount
    
    const fetchPokemons = async () => {
      if (selectedTypes.length === 0) {
        // If no types selected, fetch all Pokemon (with pagination support)
        setLoading(true);
        setError(null);
        try {
          const offset = (currentPage - 1) * POKEMON_LIMIT;
          const response = await api.get<PokemonApiResponse>(
            `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}&offset=${offset}`
          );
          
          // Notify parent component if there's a next page
          if (onHasNextChange) {
            onHasNextChange(!!response.data.next);
          }
          
          // Fetch detailed information for each Pokemon
          const pokemonDetails = await Promise.all(
            response.data.results.map(async (pokemon) => {
              const detailResponse = await api.get<PokemonDetailResponse>(pokemon.url);
              return detailResponse.data;
            })
          );

          const formattedPokemons: Pokemon[] = pokemonDetails.map((detail) => {
            // Get animated GIF URL (prefer generation-v animated version)
            const animatedImage = detail.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;
            
            // Fallback to static image if no animated version available
            const staticImage =
                               detail.sprites.other?.['showdown']?.front_default ||
                               detail.sprites.front_default || 
                               '';
            
            return {
              id: detail.id,
              name: detail.name,
              image: staticImage,
              animatedImage: animatedImage || undefined,
              types: detail.types.map((t) => t.type.name as PokemonType),
            };
          });

          setPokemons(formattedPokemons);
        } catch (err) {
          setError('Failed to fetch Pokemon data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        // Query Pokemon by selected types (with pagination support)
        setLoading(true);
        setError(null);
        try {
          // Fetch Pokemon for all selected types
          const typePromises = selectedTypes.map(async (type) => {
            const response = await api.get<{
              pokemon: Array<{ pokemon: { name: string; url: string } }>;
            }>(`https://pokeapi.co/api/v2/type/${type}`);
            return response.data.pokemon.map((p) => p.pokemon);
          });

          const typeResults = await Promise.all(typePromises);
          
          // Find Pokemon that match all selected types (intersection)
          let commonPokemons = typeResults[0];
          for (let i = 1; i < typeResults.length; i++) {
            const currentUrls = new Set(typeResults[i].map((p) => p.url));
            commonPokemons = commonPokemons.filter((p) => currentUrls.has(p.url));
          }

          // Calculate pagination
          const offset = (currentPage - 1) * POKEMON_LIMIT;
          const totalCount = commonPokemons.length;
          const limitedPokemons = commonPokemons.slice(offset, offset + POKEMON_LIMIT);
          
          // Notify parent component if there's a next page
          if (onHasNextChange) {
            onHasNextChange(offset + POKEMON_LIMIT < totalCount);
          }

          // Fetch detailed information
          const pokemonDetails = await Promise.all(
            limitedPokemons.map(async (pokemon) => {
              const detailResponse = await api.get<PokemonDetailResponse>(pokemon.url);
              return detailResponse.data;
            })
          );

          const formattedPokemons: Pokemon[] = pokemonDetails.map((detail) => {
            // Get animated GIF URL (prefer generation-v animated version)
            const animatedImage = detail.sprites.other?.['showdown']?.front_default;
            const staticImage = detail.sprites.front_default;
            
            return {
              id: detail.id,
              name: detail.name,
              image: staticImage,
              animatedImage: animatedImage || undefined,
              types: detail.types.map((t) => t.type.name as PokemonType),
            };
          });

          setPokemons(formattedPokemons);
        } catch (err) {
          setError('Failed to fetch Pokemon data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPokemons();
  }, [selectedTypes, currentPage, mounted, onHasNextChange]);

  // Show loading state before mount or while loading to ensure server and client rendering consistency
  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">No Pokemon data available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {pokemons.map((pokemon) => (
        <PokemonItem key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}

