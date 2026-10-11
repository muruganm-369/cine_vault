import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenreInfo, MovieDetail } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { LibraryStateService } from '../../services/library-state.service';
import { AudioEngineService } from '../../services/audio-engine.service';
import { CdJewelCaseComponent } from '../cd-jewel-case/cd-jewel-case.component';

@Component({
  selector: 'app-shop-floor-aisle',
  standalone: true,
  imports: [CommonModule, CdJewelCaseComponent],
  template: `
    <div class="shop-floor-container" [style.--accent]="genre.accentColor" [style.--glow]="genre.glowColor">
      
      <!-- Store Floor Header & Aisle Sign -->
      <div class="shop-aisle-overhead-sign">
        <div class="sign-chain left-chain"></div>
        <div class="sign-chain right-chain"></div>
        
        <div class="hanging-neon-board">
          <div class="sign-top-row">
            <span class="shop-section-label">CD SHOP AISLE {{ genre.id.toUpperCase() }}</span>
            <span class="blinking-indicator">● LIVE STOCK</span>
          </div>

          <div class="sign-main-title">
            <span class="sign-icon">{{ genre.icon }}</span>
            <h2 class="sign-text">{{ genre.name }}</h2>
          </div>

          <p class="sign-desc">{{ genre.tagline }}</p>
        </div>

        <!-- Shop View Mode Switcher: Rack View vs. Flip-Bin Crate View -->
        <div class="shop-toolbar-row">
          <div class="view-mode-toggles">
            <button 
              class="mode-toggle-btn" 
              [class.active]="state.shopViewMode() === 'wall-rack'"
              (click)="state.setViewMode('wall-rack')"
              title="Display CD jewel cases on wall shelving racks">
              <span class="toggle-icon">🗄️</span>
              <span>Wall Rack View</span>
            </button>

            <button 
              class="mode-toggle-btn" 
              [class.active]="state.shopViewMode() === 'crate-flip'"
              (click)="state.setViewMode('crate-flip')"
              title="Dig and flip through CD jewel cases in a shop crate bin">
              <span class="toggle-icon">📦</span>
              <span>Crate Flip-Bin Mode</span>
            </button>
          </div>

          <!-- Clerk Restock Button -->
          <button 
            class="clerk-restock-btn" 
            (click)="onRestock()"
            [class.loading]="isLoading()"
            title="Ask store clerk to restock this aisle with fresh movie CDs">
            <span class="restock-icon" [class.spinning]="isLoading()">🔄</span>
            <span>Clerk Restock Rack</span>
          </button>
        </div>
      </div>

      <!-- ================= MODE 1: WALL RACK VIEW ================= -->
      @if (state.shopViewMode() === 'wall-rack') {
        <div class="shop-wall-rack" [class.restocking]="isFlipping()">
          
          @if (isLoading() && movies().length === 0) {
            <div class="rack-skeleton-grid">
              @for (item of [1,2,3,4,5,6,7,8]; track item) {
                <div class="skeleton-cd-box"></div>
              }
            </div>
          }

          @if (movies().length > 0) {
            <div class="shelving-rack-structure">
              <!-- Upper Tier -->
              <div class="rack-row">
                <div class="row-cds">
                  @for (movie of topRowMovies(); track movie.imdbID || movie.Title) {
                    <app-cd-jewel-case [movie]="movie"></app-cd-jewel-case>
                  }
                </div>
                <div class="rack-shelf-wood">
                  <div class="shelf-led-line"></div>
                </div>
              </div>

              <!-- Lower Tier -->
              <div class="rack-row">
                <div class="row-cds">
                  @for (movie of bottomRowMovies(); track movie.imdbID || movie.Title) {
                    <app-cd-jewel-case [movie]="movie"></app-cd-jewel-case>
                  }
                </div>
                <div class="rack-shelf-wood">
                  <div class="shelf-led-line"></div>
                </div>
              </div>
            </div>
          }

        </div>
      }

      <!-- ================= MODE 2: CRATE FLIP-BIN DIGGING MODE ================= -->
      @if (state.shopViewMode() === 'crate-flip') {
        <div class="shop-crate-bin-stage">
          <div class="crate-instruction-bar">
            <span>📦 DIGGING THROUGH THE {{ genre.name.toUpperCase() }} CRATE • CLICK / FLIP THROUGH DISCS</span>
          </div>

          <div class="crate-box-3d">
            <!-- Left & Right Flip Buttons -->
            <button class="crate-flip-arrow prev-arrow" (click)="stepCrate(-1)" title="Flip to Previous CD">
              ❮ FLIP PREV
            </button>

            <!-- 3D Stack of CDs in Crate -->
            <div class="crate-inner-slot">
              @if (currentCrateMovie()) {
                <div class="active-crate-cd-showcase" (click)="inspectCurrentCrateMovie()">
                  <app-cd-jewel-case [movie]="currentCrateMovie()!"></app-cd-jewel-case>
                  
                  <div class="crate-cd-metadata-card">
                    <div class="crate-disc-number">DISC {{ crateIndex() + 1 }} OF {{ movies().length }}</div>
                    <h3 class="crate-movie-name">{{ currentCrateMovie()!.Title }}</h3>
                    <p class="crate-movie-sub">{{ currentCrateMovie()!.Year }} • ★ {{ currentCrateMovie()!.imdbRating || 'N/A' }} • {{ currentCrateMovie()!.Genre }}</p>
                    <button class="pull-from-crate-btn">
                      <span>💿 Inspect & Open Jewel Case</span>
                    </button>
                  </div>
                </div>
              }
            </div>

            <button class="crate-flip-arrow next-arrow" (click)="stepCrate(1)" title="Flip to Next CD">
              FLIP NEXT ❯
            </button>
          </div>

          <!-- Crate Navigation Dots -->
          <div class="crate-dots-row">
            @for (m of movies(); track $index) {
              <button 
                class="crate-dot" 
                [class.active]="$index === crateIndex()"
                (click)="setCrateIndex($index)"
                [title]="m.Title">
              </button>
            }
          </div>
        </div>
      }

      <!-- Shop Floor Tiling Perspective -->
      <div class="shop-tile-floor">
        <div class="tile-grid"></div>
      </div>

    </div>
  `,
  styles: [`
    .shop-floor-container {
      position: relative;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem 3rem;
      perspective: 1200px;
    }

    /* Hanging Neon Overhead Aisle Board */
    .shop-aisle-overhead-sign {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2.5rem;
    }

    .sign-chain {
      position: absolute;
      top: -30px;
      width: 2px;
      height: 30px;
      background: repeating-linear-gradient(
        180deg,
        #555 0px,
        #555 4px,
        #222 4px,
        #222 8px
      );
    }

    .left-chain { left: 20%; }
    .right-chain { right: 20%; }

    .hanging-neon-board {
      width: 100%;
      max-width: 900px;
      background: linear-gradient(180deg, #181d2e, #0c0f18);
      border: 2px solid var(--accent, #00f0ff);
      border-radius: 12px;
      padding: 1.25rem 2rem;
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.7),
        0 0 25px var(--glow, rgba(0, 240, 255, 0.25));
      text-align: center;
      margin-bottom: 1.25rem;
    }

    .sign-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.4rem;
    }

    .shop-section-label {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: var(--accent, #00f0ff);
    }

    .blinking-indicator {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      color: #00e5a3;
      animation: blink 1.2s infinite alternate;
    }

    @keyframes blink {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .sign-main-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .sign-icon {
      font-size: 2rem;
      filter: drop-shadow(0 0 10px var(--accent));
    }

    .sign-text {
      font-family: 'Cinzel', serif;
      font-size: 2.2rem;
      font-weight: 900;
      color: #ffffff;
      margin: 0;
      letter-spacing: 0.05em;
    }

    .sign-desc {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0.4rem 0 0 0;
    }

    /* Toolbar Row */
    .shop-toolbar-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 900px;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .view-mode-toggles {
      display: flex;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.04);
      padding: 0.3rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mode-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.7);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mode-toggle-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }

    .mode-toggle-btn.active {
      background: var(--accent, #00f0ff);
      color: #000000;
      font-weight: 800;
    }

    .clerk-restock-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.55rem 1.25rem;
      background: rgba(255, 208, 0, 0.1);
      border: 1px solid #ffd000;
      border-radius: 8px;
      color: #ffd000;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(255, 208, 0, 0.15);
      transition: all 0.2s ease;
    }

    .clerk-restock-btn:hover {
      background: #ffd000;
      color: #000000;
      transform: translateY(-2px);
    }

    .spinning {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    /* Wall Rack Display */
    .shop-wall-rack {
      position: relative;
      padding: 2rem;
      background: linear-gradient(180deg, #111420 0%, #080a11 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
      transition: transform 0.4s ease, opacity 0.4s ease;
    }

    .shop-wall-rack.restocking {
      animation: rackShuffle 0.55s ease-in-out;
    }

    @keyframes rackShuffle {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.97) translateY(8px); opacity: 0.4; }
      100% { transform: scale(1); opacity: 1; }
    }

    .shelving-rack-structure {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    .rack-row {
      position: relative;
    }

    .row-cds {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      padding-bottom: 0.85rem;
      min-height: 250px;
    }

    .rack-shelf-wood {
      position: relative;
      width: 100%;
      height: 18px;
      background: linear-gradient(90deg, #2b1f18 0%, #463428 50%, #2b1f18 100%);
      border-top: 2px solid #5d4637;
      border-bottom: 3px solid #140d0a;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.8);
      border-radius: 3px;
    }

    .shelf-led-line {
      position: absolute;
      top: -2px;
      left: 2%;
      right: 2%;
      height: 2px;
      background: var(--accent, #00f0ff);
      box-shadow: 0 0 10px var(--accent, #00f0ff);
    }

    /* Skeleton Loading */
    .rack-skeleton-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      padding: 2rem 0;
    }

    .skeleton-cd-box {
      width: 175px;
      height: 235px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
    }

    /* Crate Flip-Bin Mode Styles */
    .shop-crate-bin-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #0f1320;
      border: 2px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
    }

    .crate-instruction-bar {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: var(--accent, #00f0ff);
      margin-bottom: 1.5rem;
    }

    .crate-box-3d {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      width: 100%;
      max-width: 850px;
      padding: 2rem;
      background: radial-gradient(circle, #1a2034 0%, #0c0e18 100%);
      border: 2px solid #2e3752;
      border-radius: 14px;
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.9);
    }

    .crate-flip-arrow {
      padding: 0.85rem 1.4rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .crate-flip-arrow:hover {
      background: var(--accent, #00f0ff);
      color: #000000;
      transform: scale(1.05);
      box-shadow: 0 0 15px var(--glow);
    }

    .crate-inner-slot {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .active-crate-cd-showcase {
      display: flex;
      align-items: center;
      gap: 2rem;
      cursor: pointer;
      animation: flipIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes flipIn {
      0% { transform: scale(0.92) rotateY(15deg); opacity: 0.6; }
      100% { transform: scale(1) rotateY(0deg); opacity: 1; }
    }

    .crate-cd-metadata-card {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      max-width: 320px;
    }

    .crate-disc-number {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--accent, #00f0ff);
      letter-spacing: 0.15em;
    }

    .crate-movie-name {
      font-family: 'Cinzel', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      line-height: 1.2;
    }

    .crate-movie-sub {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .pull-from-crate-btn {
      margin-top: 0.6rem;
      padding: 0.65rem 1.2rem;
      background: var(--accent, #00f0ff);
      border: none;
      border-radius: 8px;
      color: #000000;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.82rem;
      font-weight: 800;
      cursor: pointer;
      align-self: flex-start;
      transition: all 0.2s ease;
    }

    .pull-from-crate-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px var(--glow);
    }

    .crate-dots-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .crate-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .crate-dot.active {
      background: var(--accent, #00f0ff);
      box-shadow: 0 0 8px var(--accent, #00f0ff);
      transform: scale(1.3);
    }

    /* Shop Tile Floor */
    .shop-tile-floor {
      position: relative;
      height: 70px;
      margin-top: 1.5rem;
      transform: perspective(500px) rotateX(65deg);
      transform-origin: top center;
      overflow: hidden;
      opacity: 0.3;
    }

    .tile-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(0, 240, 255, 0.25) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.25) 1px, transparent 1px);
      background-size: 35px 35px;
    }

    @media (max-width: 800px) {
      .active-crate-cd-showcase {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      .crate-box-3d {
        flex-direction: column;
        gap: 1rem;
      }
      .sign-text {
        font-size: 1.6rem;
      }
    }
  `]
})
export class ShopFloorAisleComponent implements OnInit, OnChanges {
  @Input({ required: true }) genre!: GenreInfo;

  movies = signal<MovieDetail[]>([]);
  isLoading = signal<boolean>(false);
  isFlipping = signal<boolean>(false);
  crateIndex = signal<number>(0);

  constructor(
    private movieService: MovieService,
    public state: LibraryStateService,
    private audio: AudioEngineService
  ) {
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
      this.crateIndex.set(0);
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

  currentCrateMovie(): MovieDetail | null {
    const list = this.movies();
    return list.length > 0 ? list[this.crateIndex() % list.length] : null;
  }

  stepCrate(delta: number): void {
    this.audio.playCrateFlip();
    const list = this.movies();
    if (list.length === 0) return;
    let next = (this.crateIndex() + delta) % list.length;
    if (next < 0) next = list.length - 1;
    this.crateIndex.set(next);
  }

  setCrateIndex(idx: number): void {
    this.audio.playCrateFlip();
    this.crateIndex.set(idx);
  }

  inspectCurrentCrateMovie(): void {
    const m = this.currentCrateMovie();
    if (m) {
      this.state.inspectMovie(m);
    }
  }
}
