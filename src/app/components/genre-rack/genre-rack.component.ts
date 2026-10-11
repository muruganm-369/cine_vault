import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenreInfo, MovieDetail } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { LibraryStateService } from '../../services/library-state.service';
import { CdJewelCaseComponent } from '../cd-jewel-case/cd-jewel-case.component';

@Component({
  selector: 'app-genre-rack',
  standalone: true,
  imports: [CommonModule, CdJewelCaseComponent],
  template: `
    <section 
      class="genre-rack-section" 
      [style.--accent]="genre.accentColor"
      [style.--glow]="genre.glowColor">
      
      <!-- Rack Header Plaque -->
      <div class="rack-header-banner">
        <div class="rack-title-box">
          <div class="rack-sign-glow"></div>
          <div class="rack-badge">SECTION {{ genre.id.toUpperCase() }}</div>
          <h2 class="genre-rack-title">
            <span class="genre-icon">{{ genre.icon }}</span>
            {{ genre.name }}
          </h2>
          <p class="genre-tagline">{{ genre.tagline }}</p>
        </div>

        <!-- Refresh / Restock This Rack Button -->
        <div class="rack-controls">
          <button 
            class="restock-rack-btn" 
            (click)="onRestock()"
            [class.loading]="isLoading()"
            title="Restock this genre shelf with fresh movie titles">
            <span class="refresh-icon" [class.spinning]="isLoading()">🔄</span>
            <span class="btn-text">Refresh Rack</span>
          </button>
        </div>
      </div>

      <!-- 3D Library Shelving Unit -->
      <div class="shelving-unit" [class.restocking]="isFlipping()">
        
        <!-- Loading State Skeleton -->
        @if (isLoading() && movies().length === 0) {
          <div class="shelf-loading-grid">
            @for (item of [1,2,3,4,5,6,7,8]; track item) {
              <div class="cd-case-skeleton">
                <div class="skeleton-shimmer"></div>
              </div>
            }
          </div>
        }

        <!-- 3D CD Grid Display -->
        @if (movies().length > 0) {
          <div class="cd-grid-tiers">
            <!-- Shelf Tier 1 (Upper Row) -->
            <div class="shelf-tier">
              <div class="tier-cds">
                @for (movie of topRowMovies(); track movie.imdbID || movie.Title) {
                  <app-cd-jewel-case [movie]="movie"></app-cd-jewel-case>
                }
              </div>
              <div class="wooden-shelf-ledge">
                <div class="shelf-wood-grain"></div>
                <div class="shelf-neon-strip"></div>
              </div>
            </div>

            <!-- Shelf Tier 2 (Lower Row) -->
            <div class="shelf-tier">
              <div class="tier-cds">
                @for (movie of bottomRowMovies(); track movie.imdbID || movie.Title) {
                  <app-cd-jewel-case [movie]="movie"></app-cd-jewel-case>
                }
              </div>
              <div class="wooden-shelf-ledge">
                <div class="shelf-wood-grain"></div>
                <div class="shelf-neon-strip"></div>
              </div>
            </div>
          </div>
        }

        <!-- Side Shelf Pillars -->
        <div class="rack-pillar left-pillar"></div>
        <div class="rack-pillar right-pillar"></div>
      </div>

      <!-- Floor Perspective Projection -->
      <div class="aisle-floor-perspective">
        <div class="floor-grid-lines"></div>
      </div>
    </section>
  `,
  styles: [`
    .genre-rack-section {
      position: relative;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem 2rem 3rem;
      perspective: 1200px;
    }

    .rack-header-banner {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1.25rem 2rem;
      background: linear-gradient(135deg, rgba(20, 24, 38, 0.85), rgba(12, 14, 22, 0.95));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 4px solid var(--accent, #00f0ff);
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--glow, rgba(0, 240, 255, 0.1));
    }

    .rack-badge {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: var(--accent, #00f0ff);
      margin-bottom: 0.3rem;
    }

    .genre-rack-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.4rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      line-height: 1.1;
    }

    .genre-icon {
      font-size: 1.8rem;
      filter: drop-shadow(0 0 8px var(--accent));
    }

    .genre-tagline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.88rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      max-width: 600px;
    }

    .restock-rack-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1.4rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--accent, #00f0ff);
      border-radius: 10px;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 15px var(--glow, rgba(0, 240, 255, 0.2));
      transition: all 0.25s ease;
      white-space: nowrap;
    }

    .restock-rack-btn:hover {
      background: var(--accent, #00f0ff);
      color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px var(--glow, rgba(0, 240, 255, 0.5));
    }

    .restock-rack-btn.loading {
      pointer-events: none;
      opacity: 0.75;
    }

    .spinning {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    /* 3D Shelving Unit Frame */
    .shelving-unit {
      position: relative;
      padding: 1.5rem 2rem 2.5rem;
      background: linear-gradient(180deg, #10131d 0%, #090a10 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.8),
        inset 0 0 40px rgba(0, 0, 0, 0.9);
      transition: transform 0.4s ease, opacity 0.4s ease;
    }

    .shelving-unit.restocking {
      animation: rackShuffle 0.55s ease-in-out;
    }

    @keyframes rackShuffle {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.97) translateY(8px); opacity: 0.4; }
      100% { transform: scale(1); opacity: 1; }
    }

    .cd-grid-tiers {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      z-index: 2;
      position: relative;
    }

    .shelf-tier {
      position: relative;
    }

    .tier-cds {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      padding-bottom: 0.75rem;
      min-height: 250px;
    }

    /* Wooden Shelf Ledge */
    .wooden-shelf-ledge {
      position: relative;
      width: 100%;
      height: 18px;
      background: linear-gradient(90deg, #2b1f18 0%, #463428 50%, #2b1f18 100%);
      border-top: 2px solid #5d4637;
      border-bottom: 3px solid #140d0a;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.8);
      border-radius: 3px;
    }

    .shelf-wood-grain {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.1) 0px,
        rgba(0, 0, 0, 0.1) 40px,
        rgba(255, 255, 255, 0.05) 41px,
        rgba(255, 255, 255, 0.05) 80px
      );
      pointer-events: none;
    }

    .shelf-neon-strip {
      position: absolute;
      top: -2px;
      left: 2%;
      right: 2%;
      height: 2px;
      background: var(--accent, #00f0ff);
      box-shadow: 0 0 10px var(--accent, #00f0ff);
      opacity: 0.85;
    }

    /* Pillars */
    .rack-pillar {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 14px;
      background: linear-gradient(90deg, #181d2c, #0d101a);
      border: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 3;
      border-radius: 4px;
    }

    .left-pillar { left: 0; }
    .right-pillar { right: 0; }

    /* Skeleton Loading */
    .shelf-loading-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      padding: 2rem 0;
    }

    .cd-case-skeleton {
      width: 175px;
      height: 235px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      position: relative;
      overflow: hidden;
    }

    .skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* Floor Perspective */
    .aisle-floor-perspective {
      position: relative;
      height: 80px;
      margin-top: 1rem;
      transform: perspective(600px) rotateX(65deg);
      transform-origin: top center;
      overflow: hidden;
      opacity: 0.35;
    }

    .floor-grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    @media (max-width: 768px) {
      .genre-rack-section {
        padding: 1rem;
      }
      .rack-header-banner {
        flex-direction: column;
        align-items: flex-start;
      }
      .genre-rack-title {
        font-size: 1.5rem;
      }
      .shelving-unit {
        padding: 1rem 0.5rem 1.5rem;
      }
    }
  `]
})
export class GenreRackComponent implements OnInit, OnChanges {
  @Input({ required: true }) genre!: GenreInfo;

  movies = signal<MovieDetail[]>([]);
  isLoading = signal<boolean>(false);
  isFlipping = signal<boolean>(false);

  constructor(
    private movieService: MovieService,
    public state: LibraryStateService
  ) {
    // React to restock counter changes
    effect(() => {
      const counters = this.state.restockCounters();
      if (this.genre && counters[this.genre.id]) {
        this.loadRackMovies(true);
      }
    });
  }

  ngOnInit(): void {
    this.loadRackMovies(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['genre'] && !changes['genre'].firstChange) {
      this.loadRackMovies(false);
    }
  }

  loadRackMovies(shuffle: boolean): void {
    if (!this.genre) return;
    this.isLoading.set(true);
    if (shuffle) {
      this.isFlipping.set(true);
      setTimeout(() => this.isFlipping.set(false), 550);
    }

    this.movieService.getRackMovies(this.genre.id, 8, shuffle).subscribe({
      next: (list) => {
        this.movies.set(list);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onRestock(): void {
    this.state.restockRack(this.genre.id);
  }

  topRowMovies(): MovieDetail[] {
    return this.movies().slice(0, 4);
  }

  bottomRowMovies(): MovieDetail[] {
    return this.movies().slice(4, 8);
  }
}
