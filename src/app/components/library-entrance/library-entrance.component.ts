import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStateService } from '../../services/library-state.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-library-entrance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="library-walk-in-arch">
      
      <!-- Ambient Library Lighting & Dust Particles -->
      <div class="ambient-spotlight left-spot"></div>
      <div class="ambient-spotlight right-spot"></div>
      <div class="dust-particles"></div>

      <div class="entrance-portal-content">
        <!-- Archway Signboard -->
        <div class="archway-crest">
          <span class="crest-roman">MMXXVI</span>
          <span class="crest-icon">🏛️</span>
          <span class="crest-tag">GRAND FILM VAULT</span>
        </div>

        <h1 class="portal-main-heading">
          STEP INSIDE THE <span class="highlight-text">CINEVAULT</span>
        </h1>

        <p class="portal-description">
          A physical 3D archival library of legendary cinema. Walk through genre aisles, pull out CD jewel cases from handcrafted racks, inspect high-fidelity optical discs, and restock the shelves with fresh classics.
        </p>

        <!-- Quick Explore Genre Portals -->
        <div class="genre-gateway-chips">
          @for (genre of movieService.GENRES.slice(0, 6); track genre.id) {
            <button 
              class="gateway-chip"
              [style.--accent]="genre.accentColor"
              (click)="state.setAisle(genre.id)">
              <span class="chip-icon">{{ genre.icon }}</span>
              <span class="chip-name">{{ genre.name }}</span>
            </button>
          }
        </div>

        <!-- Walk-in Key Navigation Guide -->
        <div class="keyboard-controls-hint">
          <span class="hint-pill">Use <b>[ ❮ / ❯ ]</b> or <b>[ A / D ]</b> to walk down aisles</span>
          <span class="hint-pill">Click any <b>CD Case</b> to open & spin disc</span>
          <span class="hint-pill">Press <b>[ ESC ]</b> to return CD to shelf</span>
        </div>

      </div>

      <!-- Wood & Brass Arch Ledge Floor -->
      <div class="archway-threshold"></div>
    </section>
  `,
  styles: [`
    .library-walk-in-arch {
      position: relative;
      width: 100%;
      padding: 3rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 30%, #161b2b 0%, #090b12 85%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }

    .ambient-spotlight {
      position: absolute;
      width: 450px;
      height: 450px;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      opacity: 0.18;
    }

    .left-spot {
      top: -100px;
      left: 10%;
      background: #00f0ff;
    }

    .right-spot {
      top: -100px;
      right: 10%;
      background: #ff0077;
    }

    .dust-particles {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.3;
      pointer-events: none;
    }

    .entrance-portal-content {
      position: relative;
      z-index: 5;
      max-width: 850px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .archway-crest {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.35rem 1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 999px;
      margin-bottom: 1.25rem;
    }

    .crest-roman {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.4);
    }

    .crest-icon {
      font-size: 1rem;
    }

    .crest-tag {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      color: #00f0ff;
    }

    .portal-main-heading {
      font-family: 'Cinzel', serif;
      font-size: 2.8rem;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 1rem 0;
      letter-spacing: 0.04em;
      line-height: 1.1;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
    }

    .highlight-text {
      background: linear-gradient(135deg, #00f0ff 0%, #ff0077 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .portal-description {
      font-family: 'Outfit', sans-serif;
      font-size: 1.05rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.75);
      max-width: 720px;
      margin: 0 0 1.8rem 0;
    }

    .genre-gateway-chips {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      margin-bottom: 2rem;
    }

    .gateway-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .gateway-chip:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--accent, #00f0ff);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    .keyboard-controls-hint {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }

    .hint-pill {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.72rem;
      padding: 0.35rem 0.85rem;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.6);
    }

    .hint-pill b {
      color: #00f0ff;
    }

    .archway-threshold {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent 0%, #00f0ff 50%, transparent 100%);
      opacity: 0.6;
    }

    @media (max-width: 768px) {
      .portal-main-heading {
        font-size: 1.9rem;
      }
      .portal-description {
        font-size: 0.9rem;
      }
      .library-walk-in-arch {
        padding: 2rem 1rem 1.5rem;
      }
    }
  `]
})
export class LibraryEntranceComponent {
  constructor(
    public movieService: MovieService,
    public state: LibraryStateService
  ) {}
}
