import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { LibraryStateService } from '../../services/library-state.service';
import { MovieDetail, MovieSearchResult } from '../../models/movie.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (state.isTerminalOpen()) {
      <div class="terminal-modal-overlay" (click)="onOverlayClick($event)">
        
        <div class="terminal-desk-console" (click)="$event.stopPropagation()">
          
          <!-- Terminal Monitor Header -->
          <div class="monitor-header">
            <div class="terminal-brand">
              <span class="crt-dot"></span>
              <span class="crt-title">CINEVAULT // OPAC CATALOG TERMINAL v4.2</span>
            </div>
            <div class="header-right">
              <span class="database-status">STATUS: ONLINE [OMDb API CONNECTED]</span>
              <button class="terminal-close-btn" (click)="state.toggleTerminal(false)">✕</button>
            </div>
          </div>

          <!-- Terminal Search Form & Filters -->
          <div class="search-console-body">
            
            <div class="search-input-box">
              <span class="prompt-symbol">></span>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="onQueryChange($event)"
                placeholder="Search worldwide movie archive (e.g., Inception, Jurassic Park, Matrix...)" 
                class="terminal-input"
                autofocus>
              @if (isSearching()) {
                <span class="query-spinner">⚡ Searching...</span>
              }
            </div>

            <!-- Genre Filter Pills -->
            <div class="filter-genre-row">
              <span class="filter-label">GENRE FILTER:</span>
              <button 
                class="filter-pill" 
                [class.active]="selectedGenreFilter === ''"
                (click)="setGenreFilter('')">ALL</button>
              @for (g of movieService.GENRES; track g.id) {
                <button 
                  class="filter-pill"
                  [class.active]="selectedGenreFilter === g.id"
                  (click)="setGenreFilter(g.id)">
                  {{ g.icon }} {{ g.name }}
                </button>
              }
            </div>

            <!-- Terminal Results Grid -->
            <div class="search-results-viewport">
              @if (results().length === 0 && !isSearching() && searchQuery.trim().length >= 2) {
                <div class="terminal-empty-state">
                  <span class="empty-icon">📼</span>
                  <p>NO ARCHIVAL RECORD MATCHING "{{ searchQuery }}".</p>
                  <p class="empty-hint">Try searching another title or release year.</p>
                </div>
              }

              @if (results().length === 0 && searchQuery.trim().length < 2) {
                <div class="terminal-default-instructions">
                  <div class="instruction-box">
                    <h4>ARCHIVAL SEARCH COMMANDS</h4>
                    <p>• Type any film title, saga, or director name above.</p>
                    <p>• Select any movie CD card below to pull the physical disc from the vault onto the inspection table.</p>
                    <p>• Instant access to over 300,000+ movie titles via global OMDb index.</p>
                  </div>
                </div>
              }

              @if (results().length > 0) {
                <div class="results-grid">
                  @for (movie of results(); track movie.imdbID) {
                    <div class="result-cd-card" (click)="pullMovie(movie)">
                      <div class="card-poster-thumb">
                        <img 
                          [src]="movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80'" 
                          [alt]="movie.Title">
                        <div class="card-cd-rim"></div>
                      </div>
                      <div class="card-info">
                        <h4 class="card-title">{{ movie.Title }}</h4>
                        <div class="card-sub">{{ movie.Year }} • CD RECORD</div>
                        <button class="pull-cd-btn">
                          <span>💿 Pull CD</span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

          </div>

          <!-- Terminal Footer Status Bar -->
          <div class="monitor-footer">
            <span class="footer-msg">PRESS [ESC] TO EXIT TERMINAL // CLICK TO INSPECT ANY DISC</span>
            <span class="security-level">CLEARANCE: ARCHIVIST LVL 3</span>
          </div>

        </div>

      </div>
    }
  `,
  styles: [`
    .terminal-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1200;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(3, 5, 10, 0.85);
      backdrop-filter: blur(16px);
      padding: 1.5rem;
      animation: fadeIn 0.25s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .terminal-desk-console {
      position: relative;
      width: 100%;
      max-width: 950px;
      height: 85vh;
      max-height: 750px;
      display: flex;
      flex-direction: column;
      background: #090c14;
      border: 1px solid rgba(0, 240, 255, 0.4);
      border-radius: 12px;
      box-shadow: 0 0 40px rgba(0, 240, 255, 0.25), 0 25px 50px rgba(0, 0, 0, 0.9);
      overflow: hidden;
    }

    .monitor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 1.25rem;
      background: linear-gradient(90deg, #101626, #0c101c);
      border-bottom: 1px solid rgba(0, 240, 255, 0.3);
    }

    .terminal-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .crt-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 8px #00f0ff;
    }

    .crt-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #00f0ff;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .database-status {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      color: #00e5a3;
      letter-spacing: 0.08em;
    }

    .terminal-close-btn {
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .terminal-close-btn:hover {
      background: #ff0055;
      border-color: #ff0055;
    }

    .search-console-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      overflow: hidden;
    }

    .search-input-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      background: rgba(0, 240, 255, 0.03);
      border: 1px solid rgba(0, 240, 255, 0.4);
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: inset 0 0 15px rgba(0, 240, 255, 0.05);
    }

    .prompt-symbol {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.2rem;
      font-weight: 800;
      color: #00f0ff;
    }

    .terminal-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      color: #ffffff;
    }

    .terminal-input::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    .query-spinner {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      color: #ffd000;
      animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
      0% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .filter-genre-row {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      overflow-x: auto;
      padding-bottom: 0.8rem;
      margin-bottom: 1rem;
      scrollbar-width: none;
    }

    .filter-label {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 0.1em;
      white-space: nowrap;
      margin-right: 0.3rem;
    }

    .filter-pill {
      padding: 0.3rem 0.75rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.7);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.72rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .filter-pill:hover,
    .filter-pill.active {
      background: rgba(0, 240, 255, 0.15);
      border-color: #00f0ff;
      color: #ffffff;
    }

    .search-results-viewport {
      flex: 1;
      overflow-y: auto;
      padding-right: 0.5rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 240, 255, 0.3) transparent;
    }

    .terminal-default-instructions,
    .terminal-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'Space Grotesk', sans-serif;
    }

    .instruction-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      padding: 1.5rem 2rem;
      border-radius: 10px;
      text-align: left;
    }

    .instruction-box h4 {
      color: #00f0ff;
      margin: 0 0 0.8rem 0;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
    }

    .instruction-box p {
      font-size: 0.8rem;
      margin: 0.4rem 0;
      color: rgba(255, 255, 255, 0.75);
    }

    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .result-cd-card {
      display: flex;
      gap: 0.85rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .result-cd-card:hover {
      background: rgba(0, 240, 255, 0.08);
      border-color: #00f0ff;
      transform: translateY(-3px);
      box-shadow: 0 6px 18px rgba(0, 240, 255, 0.2);
    }

    .card-poster-thumb {
      position: relative;
      width: 55px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
    }

    .card-poster-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
    }

    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-sub {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .pull-cd-btn {
      padding: 0.3rem 0.6rem;
      background: rgba(0, 240, 255, 0.2);
      border: 1px solid #00f0ff;
      border-radius: 4px;
      color: #00f0ff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      align-self: flex-start;
    }

    .result-cd-card:hover .pull-cd-btn {
      background: #00f0ff;
      color: #000000;
    }

    .monitor-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1.25rem;
      background: #06080e;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .footer-msg, .security-level {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.58rem;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.4);
    }
  `]
})
export class SearchTerminalComponent {
  searchQuery: string = '';
  selectedGenreFilter: string = '';
  results = signal<MovieSearchResult[]>([]);
  isSearching = signal<boolean>(false);

  private searchSubject = new Subject<string>();

  constructor(
    public movieService: MovieService,
    public state: LibraryStateService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (query.trim().length < 2) {
          this.isSearching.set(false);
          return [];
        }
        this.isSearching.set(true);
        return this.movieService.searchMovies(query);
      })
    ).subscribe({
      next: (res) => {
        this.results.set(res);
        this.isSearching.set(false);
      },
      error: () => {
        this.isSearching.set(false);
      }
    });
  }

  onQueryChange(val: string): void {
    this.searchSubject.next(val);
  }

  setGenreFilter(genreId: string): void {
    this.selectedGenreFilter = genreId;
    if (genreId) {
      const g = this.movieService.getGenreById(genreId);
      if (g && g.seedTitles.length > 0) {
        this.searchQuery = g.seedTitles[0];
        this.searchSubject.next(this.searchQuery);
      }
    }
  }

  pullMovie(searchRes: MovieSearchResult): void {
    this.movieService.getMovieDetail(searchRes.Title, this.selectedGenreFilter || undefined).subscribe((movie) => {
      this.state.toggleTerminal(false);
      this.state.inspectMovie(movie);
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.state.toggleTerminal(false);
    }
  }
}
