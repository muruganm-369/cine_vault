import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LibraryStateService } from '../../services/library-state.service';
import { MovieDetail } from '../../models/movie.model';

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (movie()) {
      <div class="trailer-backdrop" (click)="state.closeTrailer()">
        <div class="trailer-dialog" (click)="$event.stopPropagation()">
          
          <!-- Screen Hood & Header -->
          <div class="screen-header">
            <div class="header-left">
              <span class="rec-dot"></span>
              <span class="theater-label">VAULT ARCHIVE SCREENING ROOM // {{ movie()!.Title }}</span>
            </div>
            <button class="close-screen-btn" (click)="state.closeTrailer()">✕</button>
          </div>

          <!-- Screening Player Container -->
          <div class="screen-monitor">
            <div class="scanlines"></div>
            
            <div class="player-simulation">
              <img 
                [src]="movie()!.Poster && movie()!.Poster !== 'N/A' ? movie()!.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'" 
                [alt]="movie()!.Title"
                class="sim-backdrop-img">
              
              <div class="sim-play-overlay">
                <div class="film-reel-icon">🎬</div>
                <h3>{{ movie()!.Title }} ({{ movie()!.Year }})</h3>
                <p class="sim-tag">DIRECTED BY {{ movie()!.Director || 'HOLLYWOOD LEGENDS' }}</p>
                <p class="sim-plot">{{ movie()!.Plot }}</p>

                <div class="external-trailer-links">
                  <a 
                    [href]="'https://www.youtube.com/results?search_query=' + encodeQuery(movie()!.Title + ' trailer')" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="yt-direct-btn">
                    <span>▶ Launch Official 4K Trailer on YouTube</span>
                  </a>
                  <a 
                    [href]="'https://www.imdb.com/title/' + movie()!.imdbID" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="imdb-direct-btn">
                    <span>★ Open IMDb Page</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- CRT Bezel Details -->
            <div class="bezel-footer">
              <span class="bezel-text">AUDIO FORMAT: DOLBY DIGITAL 5.1 // COLOR PROCESSED BY TECHNICOLOR</span>
              <span class="bezel-text">OMDb ID: {{ movie()!.imdbID }}</span>
            </div>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .trailer-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1300;
      background: rgba(3, 5, 10, 0.9);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.25s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .trailer-dialog {
      width: 100%;
      max-width: 850px;
      background: #090c14;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 14px;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.95);
      overflow: hidden;
    }

    .screen-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.25rem;
      background: #111524;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .rec-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff0055;
      box-shadow: 0 0 8px #ff0055;
      animation: blink 1s infinite alternate;
    }

    @keyframes blink {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .theater-label {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.06em;
    }

    .close-screen-btn {
      width: 30px;
      height: 30px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .close-screen-btn:hover {
      background: #ff0055;
      border-color: #ff0055;
    }

    .screen-monitor {
      position: relative;
      height: 480px;
      background: #000000;
      overflow: hidden;
    }

    .scanlines {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        rgba(18, 16, 16, 0) 50%, 
        rgba(0, 0, 0, 0.25) 50%
      );
      background-size: 100% 4px;
      z-index: 10;
      pointer-events: none;
      opacity: 0.6;
    }

    .player-simulation {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sim-backdrop-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(12px) brightness(0.25);
    }

    .sim-play-overlay {
      position: relative;
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem;
      max-width: 650px;
    }

    .film-reel-icon {
      font-size: 3.5rem;
      margin-bottom: 0.8rem;
      animation: floatReel 3s ease-in-out infinite;
    }

    @keyframes floatReel {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .sim-play-overlay h3 {
      font-family: 'Cinzel', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.4rem 0;
    }

    .sim-tag {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      color: #00f0ff;
      letter-spacing: 0.12em;
      margin-bottom: 1rem;
    }

    .sim-plot {
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1.5rem;
    }

    .external-trailer-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .yt-direct-btn, .imdb-direct-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.4rem;
      border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .yt-direct-btn {
      background: #ff0000;
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.35);
    }

    .yt-direct-btn:hover {
      background: #cc0000;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 0, 0, 0.55);
    }

    .imdb-direct-btn {
      background: #f5c518;
      color: #000000;
      box-shadow: 0 4px 15px rgba(245, 197, 24, 0.35);
    }

    .imdb-direct-btn:hover {
      background: #dfb214;
      transform: translateY(-2px);
    }

    .bezel-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #070910;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.5rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 15;
    }

    .bezel-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.55rem;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.08em;
    }
  `]
})
export class TrailerModalComponent {
  constructor(public state: LibraryStateService) {}

  movie(): MovieDetail | null {
    return this.state.trailerMovie();
  }

  encodeQuery(query: string): string {
    return encodeURIComponent(query);
  }
}
