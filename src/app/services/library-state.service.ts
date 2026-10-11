import { Injectable, signal, computed } from '@angular/core';
import { MovieDetail, GenreInfo } from '../models/movie.model';
import { MovieService } from './movie.service';
import { AudioEngineService } from './audio-engine.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryStateService {
  // Storefront Entrance State (Entering the shop)
  readonly isInsideStore = signal<boolean>(false);

  // Shop View Mode: 'wall-rack' | 'crate-flip' | '3d-corridor'
  readonly shopViewMode = signal<'wall-rack' | 'crate-flip' | '3d-corridor'>('wall-rack');

  // Current active genre aisle ID (e.g. 'sci-fi')
  readonly activeAisleId = signal<string>('sci-fi');
  
  // Selected movie for 3D CD Inspection Deck
  readonly selectedMovie = signal<MovieDetail | null>(null);

  // CD Inspection Deck state: 'closed' | 'pulling' | 'opened'
  readonly inspectionState = signal<'closed' | 'pulling' | 'opened'>('closed');

  // Search Terminal state
  readonly isTerminalOpen = signal<boolean>(false);

  // Cart / Borrowed CDs list
  readonly borrowedCds = signal<MovieDetail[]>([]);

  // Cart drawer open state
  readonly isCartOpen = signal<boolean>(false);

  // Library restock trigger timestamp per genre
  readonly restockCounters = signal<{ [genreId: string]: number }>({});

  // Global library restock spinner
  readonly isRestockingAll = signal<boolean>(false);

  // Video trailer modal movie
  readonly trailerMovie = signal<MovieDetail | null>(null);

  // Computed active genre
  readonly activeGenre = computed<GenreInfo>(() => {
    return this.movieService.getGenreById(this.activeAisleId()) || this.movieService.GENRES[0];
  });

  constructor(
    private movieService: MovieService,
    private audio: AudioEngineService
  ) {
    const savedCart = localStorage.getItem('cinevault_cart');
    if (savedCart) {
      try {
        this.borrowedCds.set(JSON.parse(savedCart));
      } catch {
        // safe
      }
    }
  }

  // Push doors & Enter the CD Shop
  enterShop(): void {
    this.audio.playDoorBell();
    this.isInsideStore.set(true);
  }

  // Go back to storefront
  exitToStorefront(): void {
    this.audio.playDoorBell();
    this.isInsideStore.set(false);
  }

  // Set browse mode
  setViewMode(mode: 'wall-rack' | 'crate-flip' | '3d-corridor'): void {
    this.audio.playCrateFlip();
    this.shopViewMode.set(mode);
  }

  // Switch active aisle
  setAisle(genreId: string): void {
    if (this.activeAisleId() === genreId) return;
    this.activeAisleId.set(genreId);
    this.audio.playAisleWalk();
  }

  // Step aisle to next or previous
  stepAisle(delta: number): void {
    const genres = this.movieService.GENRES;
    const currentIndex = genres.findIndex(g => g.id === this.activeAisleId());
    let nextIndex = (currentIndex + delta) % genres.length;
    if (nextIndex < 0) nextIndex = genres.length - 1;
    this.setAisle(genres[nextIndex].id);
  }

  // Open 3D CD Inspection Deck
  inspectMovie(movie: MovieDetail): void {
    this.audio.playSlide();
    this.selectedMovie.set(movie);
    this.inspectionState.set('pulling');
    
    setTimeout(() => {
      this.audio.playCaseOpen();
      this.inspectionState.set('opened');
      this.audio.playDiscSpin();
    }, 450);
  }

  // Close 3D CD Inspection Deck
  closeInspection(): void {
    if (this.selectedMovie()) {
      this.audio.playSlide();
      this.inspectionState.set('closed');
      setTimeout(() => {
        this.selectedMovie.set(null);
      }, 300);
    }
  }

  // Restock specific rack
  restockRack(genreId: string): void {
    this.audio.playRestockShuffle();
    const current = this.restockCounters();
    this.restockCounters.set({
      ...current,
      [genreId]: (current[genreId] || 0) + 1
    });
  }

  // Restock all racks across the library
  restockAll(): void {
    this.audio.playRestockShuffle();
    this.isRestockingAll.set(true);
    const updated: { [genreId: string]: number } = {};
    const current = this.restockCounters();
    this.movieService.GENRES.forEach(g => {
      updated[g.id] = (current[g.id] || 0) + 1;
    });
    this.restockCounters.set(updated);
    setTimeout(() => {
      this.isRestockingAll.set(false);
    }, 800);
  }

  // Toggle Cart/Borrowed CDs drawer
  toggleCart(): void {
    this.isCartOpen.set(!this.isCartOpen());
  }

  // Add / Remove from borrowed CDs
  toggleBorrowMovie(movie: MovieDetail): void {
    const current = this.borrowedCds();
    const exists = current.some(m => m.Title === movie.Title);
    let updated: MovieDetail[];
    if (exists) {
      updated = current.filter(m => m.Title !== movie.Title);
    } else {
      updated = [movie, ...current];
      this.audio.playBookmark(); // Plays cash register sound
    }
    this.borrowedCds.set(updated);
    localStorage.setItem('cinevault_cart', JSON.stringify(updated));
  }

  isMovieBorrowed(movie: MovieDetail): boolean {
    return this.borrowedCds().some(m => m.Title === movie.Title);
  }

  // Toggle Search Terminal
  toggleTerminal(state?: boolean): void {
    const next = state !== undefined ? state : !this.isTerminalOpen();
    this.isTerminalOpen.set(next);
    if (next) {
      this.audio.playCaseOpen();
    }
  }

  // Trailer modal
  openTrailer(movie: MovieDetail): void {
    this.trailerMovie.set(movie);
  }

  closeTrailer(): void {
    this.trailerMovie.set(null);
  }
}
