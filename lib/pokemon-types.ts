// Pokemon type definitions
export type PokemonType = 
  | 'normal'
  | 'fighting'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'rock'
  | 'bug'
  | 'ghost'
  | 'steel'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'psychic'
  | 'ice'
  | 'dragon'
  | 'dark'
  | 'fairy'
  | 'stellar'
  | 'unknown';

// All Pokemon types list
export const POKEMON_TYPES: PokemonType[] = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
  'stellar',
  'unknown',
];

// Pokemon data type
export interface Pokemon {
  id: number;
  name: string;
  image: string; // Static image
  animatedImage?: string; // Animated GIF
  types: PokemonType[];
}

// API response types
export interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
      'showdown'?: {
        front_default: string;
      };
    };
    versions?: {
      'generation-v'?: {
        'black-white'?: {
          animated?: {
            front_default: string;
          };
        };
      };
    };
  };
  types: Array<{
    type: {
      name: PokemonType;
    };
  }>;
}

