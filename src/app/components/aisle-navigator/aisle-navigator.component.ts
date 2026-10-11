import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { LibraryStateService } from '../../services/library-state.service';
import { GenreInfo } from '../../models/movie.model';

@Component({
  selector: 'app-aisle-navigator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="aisle-corridor-nav">
      <!-- Left Step Corridor Arrow -->
      <button 
        class="nav-arrow left" 
        (click)="state.stepAisle(-1)"
        title="Walk to Previous Aisle (Left Arrow / A)">
        <span class="arrow-glyph">❮</span>
      </button>

      <!-- Horizontal Corridor Rack Signs -->
      <div class="aisle-track">
        @for (genre of genres; track genre.id) {
          <button 
            class="aisle-tab"
            [class.active]="genre.id === state.activeAisleId()"
            [style.--accent]="genre.accentColor"
            [style.--glow]="genre.glowColor"
            (click)="state.setAisle(genre.id)">
            
            <span class="tab-halo"></span>
            
            <div class="tab-content">
              <span class="genre-icon">{{ genre.icon }}</span>
              <span class="genre-name">{{ genre.name }}</span>
            </div>

            <!-- Floor Sign Lighting Plaque -->
            <div class="floor-plaque"></div>
          </button>
        }
      </div>

      <!-- Right Step Corridor Arrow -->
      <button 
        class="nav-arrow right" 
        (click)="state.stepAisle(1)"
        title="Walk to Next Aisle (Right Arrow / D)">
        <span class="arrow-glyph">❯</span>
      </button>
    </nav>
  `,
  styles: [`
    .aisle-corridor-nav {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 1.5rem;
      background: radial-gradient(circle at center, rgba(26, 32, 53, 0.6) 0%, rgba(10, 12, 19, 0.95) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: inset 0 -10px 20px rgba(0, 0, 0, 0.5);
    }

    .nav-arrow {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #ffffff;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .nav-arrow:hover {
      background: rgba(0, 240, 255, 0.15);
      border-color: #00f0ff;
      transform: scale(1.1);
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
    }

    .aisle-track {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 0.5rem 0.25rem;
      scrollbar-width: none;
    }

    .aisle-track::-webkit-scrollbar {
      display: none;
    }

    .aisle-tab {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.6rem 1.25rem;
      background: rgba(18, 22, 36, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.65);
      cursor: pointer;
      font-family: 'Space Grotesk', sans-serif;
      transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
      white-space: nowrap;
      user-select: none;
      flex-shrink: 0;
    }

    .tab-content {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      z-index: 2;
    }

    .genre-icon {
      font-size: 1.15rem;
      transition: transform 0.25s ease;
    }

    .genre-name {
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .floor-plaque {
      position: absolute;
      bottom: -1px;
      left: 15%;
      right: 15%;
      height: 2px;
      background: transparent;
      transition: all 0.3s ease;
      border-radius: 2px;
    }

    .aisle-tab:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.25);
      color: #ffffff;
      transform: translateY(-2px);
    }

    .aisle-tab:hover .genre-icon {
      transform: scale(1.2) rotate(-5deg);
    }

    .aisle-tab.active {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(15, 18, 28, 0.9));
      border-color: var(--accent);
      color: #ffffff;
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 8px 20px var(--glow), 0 0 10px var(--glow);
    }

    .aisle-tab.active .genre-icon {
      transform: scale(1.25);
      filter: drop-shadow(0 0 6px var(--accent));
    }

    .aisle-tab.active .floor-plaque {
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent);
    }

    @media (max-width: 768px) {
      .aisle-corridor-nav {
        padding: 0.5rem;
      }
      .genre-name {
        font-size: 0.75rem;
      }
    }
  `]
})
export class AisleNavigatorComponent {
  genres: GenreInfo[];

  constructor(
    private movieService: MovieService,
    public state: LibraryStateService
  ) {
    this.genres = this.movieService.GENRES;
  }
}
