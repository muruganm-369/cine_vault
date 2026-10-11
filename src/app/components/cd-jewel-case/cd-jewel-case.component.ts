import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetail } from '../../models/movie.model';
import { LibraryStateService } from '../../services/library-state.service';
import { AudioEngineService } from '../../services/audio-engine.service';

@Component({
  selector: 'app-cd-jewel-case',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="cd-case-wrapper"
      [style.--accent]="movie.accentColor || '#00f0ff'"
      (mouseenter)="onHover()"
      (click)="onSelect()"
      tabindex="0"
      (keydown.enter)="onSelect()"
      (keydown.space)="onSelect()"
      [attr.aria-label]="'Inspect CD: ' + movie.Title">
      
      <!-- 3D Jewel Case Object -->
      <div class="jewel-case-3d">
        <!-- Spine (Left Edge) -->
        <div class="case-spine">
          <span class="spine-genre-dot"></span>
          <span class="spine-title">{{ movie.Title }}</span>
          <span class="spine-year">{{ movie.Year }}</span>
        </div>

        <!-- Front Glass Cover -->
        <div class="case-front">
          <!-- Glass Crystal Reflection Sheen -->
          <div class="acrylic-glare"></div>
          
          <!-- Hinge Line on the Left -->
          <div class="acrylic-hinge"></div>

          <!-- Inside Cover Booklet / Poster -->
          <div class="booklet-art">
            <img 
              [src]="movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80'" 
              [alt]="movie.Title"
              class="poster-img"
              loading="lazy">
            
            <!-- Compact CD Overlay Info -->
            <div class="cover-overlay">
              <div class="top-row">
                <span class="badge-cd">DIGITAL CD</span>
                <span class="badge-rating" *ngIf="movie.imdbRating && movie.imdbRating !== 'N/A'">
                  ★ {{ movie.imdbRating }}
                </span>
              </div>
              <div class="bottom-row">
                <h3 class="cover-title">{{ movie.Title }}</h3>
                <p class="cover-meta">{{ movie.Year }} • {{ movie.Runtime || '120m' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Disc Peeking Out from the Right -->
        <div class="disc-peeking">
          <div class="peeking-disc-rim"></div>
          <div class="peeking-rainbow-sheen"></div>
        </div>

        <!-- Plastic Tray Rim Back -->
        <div class="case-tray-rim"></div>
      </div>

      <!-- Realistic Shelf Cast Shadow -->
      <div class="shelf-shadow"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      perspective: 1000px;
    }

    .cd-case-wrapper {
      position: relative;
      width: 175px;
      height: 235px;
      cursor: pointer;
      outline: none;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
    }

    .jewel-case-3d {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transform: rotateY(-12deg) rotateX(4deg);
      transition: all 0.38s cubic-bezier(0.2, 0.8, 0.2, 1);
      border-radius: 6px;
      box-shadow: 
        -8px 12px 24px rgba(0, 0, 0, 0.7),
        0 2px 4px rgba(255, 255, 255, 0.1) inset;
    }

    /* Left Spine Edge */
    .case-spine {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 18px;
      background: linear-gradient(90deg, #11141e, #1e2436, #0e1018);
      border-right: 1px solid rgba(255, 255, 255, 0.15);
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0;
      overflow: hidden;
    }

    .spine-genre-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent, #00f0ff);
      box-shadow: 0 0 6px var(--accent, #00f0ff);
    }

    .spine-title {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.8);
      white-space: nowrap;
      max-height: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .spine-year {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.5rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.4);
    }

    /* Front Case Acrylic Cover */
    .case-front {
      position: absolute;
      inset: 0;
      left: 14px;
      background: rgba(20, 24, 38, 0.6);
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-left: none;
      box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
      z-index: 3;
    }

    .acrylic-hinge {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 6px;
      background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(0,0,0,0.3));
      z-index: 4;
    }

    .acrylic-glare {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.35) 0%,
        rgba(255, 255, 255, 0.05) 30%,
        transparent 50%,
        rgba(255, 255, 255, 0.12) 100%
      );
      z-index: 5;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    /* Booklet Artwork Inside */
    .booklet-art {
      position: absolute;
      inset: 3px;
      border-radius: 4px;
      overflow: hidden;
      background: #090b10;
    }

    .poster-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
      filter: saturate(1.05) contrast(1.05);
    }

    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.7) 0%,
        transparent 40%,
        rgba(0, 0, 0, 0.85) 80%,
        rgba(0, 0, 0, 0.98) 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.5rem;
      z-index: 2;
    }

    .top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.3rem;
    }

    .badge-cd {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.52rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 0.15rem 0.35rem;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 3px;
      color: #00f0ff;
    }

    .badge-rating {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.6rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      background: rgba(255, 208, 0, 0.2);
      border: 1px solid rgba(255, 208, 0, 0.6);
      border-radius: 3px;
      color: #ffd000;
    }

    .cover-title {
      font-family: 'Outfit', sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      line-height: 1.15;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .cover-meta {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.62rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0.2rem 0 0 0;
    }

    /* Peeking Holographic Disc Rim */
    .disc-peeking {
      position: absolute;
      top: 10px;
      bottom: 10px;
      right: -10px;
      width: 35px;
      border-radius: 50%;
      background: radial-gradient(circle, #333 20%, #777 40%, #222 80%);
      z-index: 1;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.25);
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
    }

    .peeking-rainbow-sheen {
      position: absolute;
      inset: 0;
      background: conic-gradient(
        from 45deg,
        rgba(255, 0, 0, 0.4),
        rgba(255, 255, 0, 0.4),
        rgba(0, 255, 128, 0.4),
        rgba(0, 255, 255, 0.4),
        rgba(0, 128, 255, 0.4),
        rgba(255, 0, 255, 0.4),
        rgba(255, 0, 0, 0.4)
      );
      mix-blend-mode: color-dodge;
      opacity: 0.7;
    }

    /* Shelf Shadow */
    .shelf-shadow {
      position: absolute;
      bottom: -14px;
      left: 10px;
      right: 5px;
      height: 12px;
      background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, transparent 75%);
      transform-origin: center;
      transition: all 0.35s ease;
      pointer-events: none;
    }

    /* Hover & Focus Interactions */
    .cd-case-wrapper:hover .jewel-case-3d,
    .cd-case-wrapper:focus .jewel-case-3d {
      transform: translateY(-16px) translateZ(35px) rotateY(-4deg) rotateX(2deg);
      box-shadow: 
        -12px 24px 35px rgba(0, 0, 0, 0.85),
        0 0 20px var(--accent, #00f0ff)55;
    }

    .cd-case-wrapper:hover .disc-peeking,
    .cd-case-wrapper:focus .disc-peeking {
      right: -22px;
      transform: rotate(45deg);
    }

    .cd-case-wrapper:hover .poster-img {
      transform: scale(1.05);
    }

    .cd-case-wrapper:hover .acrylic-glare {
      opacity: 0.9;
    }

    .cd-case-wrapper:hover .shelf-shadow {
      transform: scale(1.15) translateY(8px);
      opacity: 0.5;
    }
  `]
})
export class CdJewelCaseComponent {
  @Input({ required: true }) movie!: MovieDetail;

  constructor(
    private state: LibraryStateService,
    private audio: AudioEngineService
  ) {}

  onHover(): void {
    this.audio.playSlide();
  }

  onSelect(): void {
    this.state.inspectMovie(this.movie);
  }
}
