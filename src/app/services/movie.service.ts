import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { GenreInfo, MovieDetail, MovieSearchResult } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_KEY = '8c44fadb';
  private readonly BASE_URL = 'https://www.omdbapi.com/';
  
  // Cache for movie details
  private movieCache = new Map<string, MovieDetail>();

  // Curated Genre metadata and deep movie seed lists
  readonly GENRES: GenreInfo[] = [
    {
      id: 'sci-fi',
      name: 'Sci-Fi & Cyberpunk',
      icon: '🚀',
      tagline: 'Futuristic galaxies, artificial intelligence, time dilation & cyber frontiers',
      accentColor: '#00f0ff',
      glowColor: 'rgba(0, 240, 255, 0.45)',
      seedTitles: [
        'Interstellar', 'The Matrix', 'Blade Runner 2049', 'Inception', 
        'Dune: Part One', 'Arrival', 'The Fifth Element', 'Alien', 
        '2001: A Space Odyssey', 'Terminator 2: Judgment Day', 'Edge of Tomorrow', 'Avatar',
        'Tenet', 'Gravity', 'Minority Report', 'Ex Machina', 'District 9', 'The Martian'
      ]
    },
    {
      id: 'action',
      name: 'Action & Blockbusters',
      icon: '💥',
      tagline: 'High-octane pursuits, legendary showdowns, martial arts & adrenaline',
      accentColor: '#ff4d00',
      glowColor: 'rgba(255, 77, 0, 0.45)',
      seedTitles: [
        'The Dark Knight', 'Mad Max: Fury Road', 'John Wick', 'Gladiator',
        'Avengers: Endgame', 'Top Gun: Maverick', 'Die Hard', 'Mission: Impossible - Fallout',
        'The Batman', 'Heat', 'Speed', 'Casino Royale', 'Raiders of the Lost Ark',
        'Kill Bill: Vol. 1', 'The Bourne Ultimatum', 'Spider-Man: Across the Spider-Verse'
      ]
    },
    {
      id: 'comedy',
      name: 'Comedy & Satire',
      icon: '😂',
      tagline: 'Cult laugh riots, witty mockumentaries, nostalgic slapstick & parodies',
      accentColor: '#ffd000',
      glowColor: 'rgba(255, 208, 0, 0.45)',
      seedTitles: [
        'The Grand Budapest Hotel', 'Superbad', 'The Big Lebowski', 'Shaun of the Dead',
        'Groundhog Day', 'Step Brothers', 'Ferris Bueller\'s Day Off', 'School of Rock',
        'Tropic Thunder', 'Mean Girls', 'The Hangover', 'Monty Python and the Holy Grail',
        'Hot Fuzz', 'Booksmart', 'Airplane!', 'Paddington 2', 'Knives Out'
      ]
    },
    {
      id: 'horror',
      name: 'Horror & Paranormal',
      icon: '👻',
      tagline: 'Psychological terror, haunted catacombs, cosmic dread & creatures',
      accentColor: '#ff0055',
      glowColor: 'rgba(255, 0, 85, 0.45)',
      seedTitles: [
        'The Shining', 'Hereditary', 'Get Out', 'A Quiet Place',
        'The Conjuring', 'Psycho', 'The Thing', 'Midsommar',
        'Halloween', 'Scream', 'It', 'The Exorcist',
        'Alien', 'The Babadook', 'Sinister', 'Talk to Me'
      ]
    },
    {
      id: 'animation',
      name: 'Animation & Anime',
      icon: '🎨',
      tagline: 'Studio Ghibli dreams, Pixar wonders, cyberpunk anime & stop-motion',
      accentColor: '#b026ff',
      glowColor: 'rgba(176, 38, 255, 0.45)',
      seedTitles: [
        'Spirited Away', 'Spider-Man: Into the Spider-Verse', 'WALL-E', 'Coco',
        'The Lion King', 'Ratatouille', 'Princess Mononoke', 'How to Train Your Dragon',
        'Toy Story', 'Inside Out', 'Your Name.', 'Up', 'Finding Nemo',
        'Akira', 'Fantastic Mr. Fox', 'Spider-Man: Across the Spider-Verse'
      ]
    },
    {
      id: 'thriller',
      name: 'Thriller & Mystery',
      icon: '🕵️',
      tagline: 'Gripping noir mysteries, undercover investigations & jaw-dropping twists',
      accentColor: '#00e5a3',
      glowColor: 'rgba(0, 229, 163, 0.45)',
      seedTitles: [
        'Se7en', 'Parasite', 'Shutter Island', 'Gone Girl',
        'Fight Club', 'The Prestige', 'Zodiac', 'Prisoners',
        'The Silence of the Lambs', 'Memento', 'No Country for Old Men', 'Nightcrawler',
        'Sicario', 'Oldboy', 'Gone Baby Gone', 'The Usual Suspects'
      ]
    },
    {
      id: 'drama',
      name: 'Drama & Masterpieces',
      icon: '🍿',
      tagline: 'Critically acclaimed storytelling, timeless classics & poignant biopics',
      accentColor: '#e0a96d',
      glowColor: 'rgba(224, 169, 109, 0.45)',
      seedTitles: [
        'The Shawshank Redemption', 'The Godfather', 'Forrest Gump', 'Oppenheimer',
        'Whiplash', 'Pulp Fiction', '12 Angry Men', 'Schindler\'s List',
        'Goodfellas', 'Casablanca', 'There Will Be Blood', 'The Green Mile',
        'Taxi Driver', 'One Flew Over the Cuckoo\'s Nest', 'The Social Network'
      ]
    },
    {
      id: 'fantasy',
      name: 'Fantasy & Mythic Lore',
      icon: '🧙',
      tagline: 'Enchanted realms, dragons, arcane wizardry & legendary quests',
      accentColor: '#8a2be2',
      glowColor: 'rgba(138, 43, 226, 0.45)',
      seedTitles: [
        'The Lord of the Rings: The Fellowship of the Ring', 'Harry Potter and the Sorcerer\'s Stone',
        'Pan\'s Labyrinth', 'The Princess Bride', 'Pirates of the Caribbean: The Curse of the Black Pearl',
        'The Lord of the Rings: The Return of the King', 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
        'Stardust', 'Big Fish', 'The Shape of Water', 'Labyrinth', 'Edward Scissorhands'
      ]
    },
    {
      id: 'romance',
      name: 'Romance & Heartfelt',
      icon: '💖',
      tagline: 'Soulmates, bittersweet love stories, romantic comedies & grand passions',
      accentColor: '#ff66b2',
      glowColor: 'rgba(255, 102, 178, 0.45)',
      seedTitles: [
        'Titanic', 'La La Land', 'Eternal Sunshine of the Spotless Mind', 'Before Sunrise',
        'Pride & Prejudice', 'Amélie', 'The Notebook', '500 Days of Summer',
        'Her', 'Roman Holiday', 'Crazy Rich Asians', 'About Time', 'Past Lives', 'Before Sunset'
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  getGenreById(genreId: string): GenreInfo | undefined {
    return this.GENRES.find(g => g.id === genreId) || this.GENRES[0];
  }

  // Fetch single movie by Title with OMDb & fallback cache
  getMovieDetail(title: string, customGenreKey?: string): Observable<MovieDetail> {
    const normalizedKey = title.trim().toLowerCase();
    if (this.movieCache.has(normalizedKey)) {
      return of(this.movieCache.get(normalizedKey)!);
    }

    const url = `${this.BASE_URL}?t=${encodeURIComponent(title)}&plot=full&apikey=${this.API_KEY}`;
    return this.http.get<MovieDetail>(url).pipe(
      map(data => {
        if (data && data.Response !== 'False') {
          const enriched: MovieDetail = {
            ...data,
            customGenreKey: customGenreKey || this.matchGenreKey(data.Genre),
            accentColor: this.getGenreColor(customGenreKey || this.matchGenreKey(data.Genre))
          };
          this.movieCache.set(normalizedKey, enriched);
          return enriched;
        } else {
          // Construct a fallback placeholder
          const fallback = this.generateFallbackMovie(title, customGenreKey);
          this.movieCache.set(normalizedKey, fallback);
          return fallback;
        }
      }),
      catchError(() => {
        const fallback = this.generateFallbackMovie(title, customGenreKey);
        this.movieCache.set(normalizedKey, fallback);
        return of(fallback);
      }),
      shareReplay(1)
    );
  }

  // Fetch a batch of movies for a specific genre rack with shuffle / restock
  getRackMovies(genreId: string, count: number = 8, shuffle: boolean = false): Observable<MovieDetail[]> {
    const genre = this.getGenreById(genreId);
    if (!genre) return of([]);

    let pool = [...genre.seedTitles];
    if (shuffle) {
      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }

    const selectedTitles = pool.slice(0, count);
    const requests = selectedTitles.map(t => this.getMovieDetail(t, genreId));
    return forkJoin(requests);
  }

  // Search movies by query
  searchMovies(query: string): Observable<MovieSearchResult[]> {
    if (!query || query.trim().length < 2) return of([]);

    const url = `${this.BASE_URL}?s=${encodeURIComponent(query.trim())}&type=movie&apikey=${this.API_KEY}`;
    return this.http.get<{ Search?: MovieSearchResult[]; Response?: string }>(url).pipe(
      map(res => {
        if (res && res.Search) {
          return res.Search.filter(m => m.Poster && m.Poster !== 'N/A');
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  private matchGenreKey(genreStr: string = ''): string {
    const lower = genreStr.toLowerCase();
    if (lower.includes('sci-fi')) return 'sci-fi';
    if (lower.includes('action')) return 'action';
    if (lower.includes('comedy')) return 'comedy';
    if (lower.includes('horror')) return 'horror';
    if (lower.includes('animation')) return 'animation';
    if (lower.includes('thriller') || lower.includes('mystery')) return 'thriller';
    if (lower.includes('fantasy')) return 'fantasy';
    if (lower.includes('romance')) return 'romance';
    return 'drama';
  }

  private getGenreColor(genreKey: string): string {
    const g = this.GENRES.find(item => item.id === genreKey);
    return g ? g.accentColor : '#00f0ff';
  }

  private generateFallbackMovie(title: string, genreKey: string = 'sci-fi'): MovieDetail {
    return {
      Title: title,
      Year: '2024',
      Rated: 'PG-13',
      Runtime: '135 min',
      Genre: genreKey.toUpperCase(),
      Director: 'CineVault Archives',
      Actors: 'Archive Collection',
      Plot: `Experience the critically acclaimed cinematic journey of ${title}. High-fidelity optical disc remastered for the CineVault 3D Collection.`,
      Poster: `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80`,
      imdbRating: '8.8',
      imdbVotes: '750,000',
      imdbID: `cv-${Math.random().toString(36).substring(2, 9)}`,
      customGenreKey: genreKey,
      accentColor: this.getGenreColor(genreKey)
    };
  }
}
