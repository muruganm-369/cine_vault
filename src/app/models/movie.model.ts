export interface MovieDetail {
  Title: string;
  Year: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID: string;
  Type?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response?: string;
  Error?: string;
  // Custom enhanced fields
  customGenreKey?: string;
  accentColor?: string;
}

export interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface GenreInfo {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  accentColor: string;
  glowColor: string;
  seedTitles: string[];
}

export interface LibraryFilter {
  query: string;
  genre: string;
  minRating: number;
  yearRange: [number, number];
}
