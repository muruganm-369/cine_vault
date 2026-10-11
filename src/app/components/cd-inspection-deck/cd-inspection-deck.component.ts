import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStateService } from '../../services/library-state.service';
import { AudioEngineService } from '../../services/audio-engine.service';
import { MovieDetail } from '../../models/movie.model';

@Component({
  selector: 'app-cd-inspection-deck',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (movie()) {
      <div 
        class="inspection-overlay" 
        [class.active]="state.inspectionState() === 'opened'"
        [style.--accent]="movie()?.accentColor || '#00f0ff'"
        (click)="onBackdropClick($event)">
        
        <!-- Inspection Stage Container -->
        <div class="inspection-stage" (click)="$event.stopPropagation()">
          
          <!-- Close / Return CD Button -->
          <button 
            class="close-deck-btn" 
            (click)="state.closeInspection()" 
            title="Return CD to Rack (Esc)">
            ✕
          </button>

          <!-- 3D Opened Jewel Case Structure -->
          <div class="opened-jewel-case-3d">
            
            <!-- ================= LEFT TRAY: BOOKLET & POSTER DETAILS ================= -->
            <div class="case-leaf left-leaf">
              <div class="acrylic-frame">
                
                <!-- Poster Header & Metadata -->
                <div class="poster-booklet-header">
                  <div class="poster-box">
                    <img 
                      [src]="movie()!.Poster && movie()!.Poster !== 'N/A' ? movie()!.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80'" 
                      [alt]="movie()!.Title"
                      class="booklet-cover-img">
                    <div class="poster-badge-ribbon">AUTHENTIC ARCHIVE DISC</div>
                  </div>

                  <div class="meta-primary">
                    <div class="genre-pill-list">
                      @for (g of splitGenres(movie()!.Genre); track g) {
                        <span class="genre-tag">{{ g }}</span>
                      }
                    </div>

                    <h2 class="movie-main-title">{{ movie()!.Title }}</h2>

                    <div class="quick-stats-row">
                      <span class="stat-pill year">{{ movie()!.Year }}</span>
                      <span class="stat-pill rated">{{ movie()!.Rated || 'PG-13' }}</span>
                      <span class="stat-pill runtime">⏱ {{ movie()!.Runtime || '120 min' }}</span>
                    </div>

                    <!-- IMDb & Metascore Badges -->
                    <div class="rating-scores-box">
                      <div class="score-card imdb">
                        <span class="score-label">IMDb RATING</span>
                        <span class="score-val">★ {{ movie()!.imdbRating || 'N/A' }}<span class="out-of">/10</span></span>
                        <span class="votes-sub">{{ movie()!.imdbVotes || '500k+' }} votes</span>
                      </div>

                      @if (movie()!.Metascore && movie()!.Metascore !== 'N/A') {
                        <div class="score-card meta">
                          <span class="score-label">METASCORE</span>
                          <span class="score-val">{{ movie()!.Metascore }}</span>
                          <span class="votes-sub">Critic Consensus</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <!-- Cast, Director, Awards & Plot Overview -->
                <div class="movie-deep-details">
                  @if (movie()!.Awards && movie()!.Awards !== 'N/A') {
                    <div class="awards-strip">
                      <span class="trophy-icon">🏆</span>
                      <span class="awards-text">{{ movie()!.Awards }}</span>
                    </div>
                  }

                  <div class="plot-box">
                    <h4 class="section-heading">SYNOPSIS</h4>
                    <p class="plot-paragraph">{{ movie()!.Plot }}</p>
                  </div>

                  <div class="credits-grid">
                    @if (movie()!.Director && movie()!.Director !== 'N/A') {
                      <div class="credit-item">
                        <span class="credit-role">DIRECTOR</span>
                        <span class="credit-name">{{ movie()!.Director }}</span>
                      </div>
                    }
                    @if (movie()!.Actors && movie()!.Actors !== 'N/A') {
                      <div class="credit-item">
                        <span class="credit-role">STARRING</span>
                        <span class="credit-name">{{ movie()!.Actors }}</span>
                      </div>
                    }
                    @if (movie()!.BoxOffice && movie()!.BoxOffice !== 'N/A') {
                      <div class="credit-item">
                        <span class="credit-role">BOX OFFICE</span>
                        <span class="credit-name">{{ movie()!.BoxOffice }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Action Button Toolbar -->
                <div class="inspection-actions">
                  <button 
                    class="action-btn borrow-btn" 
                    [class.borrowed]="isBorrowed()"
                    (click)="state.toggleBorrowMovie(movie()!)">
                    <span class="btn-glyph">{{ isBorrowed() ? '✓' : '💿' }}</span>
                    <span>{{ isBorrowed() ? 'In Archive Bag' : 'Borrow / Save CD' }}</span>
                  </button>

                  <button 
                    class="action-btn trailer-btn" 
                    (click)="state.openTrailer(movie()!)">
                    <span class="btn-glyph">▶</span>
                    <span>Watch Trailer</span>
                  </button>
                </div>

              </div>
            </div>

            <!-- ================= CENTER HINGE ================= -->
            <div class="case-center-hinge">
              <div class="hinge-pin top-pin"></div>
              <div class="hinge-cylinder"></div>
              <div class="hinge-pin bottom-pin"></div>
            </div>

            <!-- ================= RIGHT TRAY: OPTICAL DISC & SPINDLE ================= -->
            <div class="case-leaf right-leaf">
              <div class="acrylic-frame disc-tray-bed">
                
                <div class="tray-recess">
                  <!-- Spindle Center Clamp -->
                  <div class="disc-spindle-hub">
                    <div class="hub-center-ring"></div>
                  </div>

                  <!-- 3D Spinning Compact Disc Object -->
                  <div 
                    class="compact-disc-3d" 
                    [class.spinning]="isDiscSpinning"
                    (click)="toggleDiscSpin()">
                    
                    <!-- Rainbow Holographic Diffraction Sheen -->
                    <div class="disc-laser-diffraction"></div>

                    <!-- Inner Clear Plastic Hub Ring -->
                    <div class="disc-clear-hub">
                      <div class="hub-spindle-hole"></div>
                      <div class="hub-serial-code">{{ movie()!.imdbID }}</div>
                    </div>

                    <!-- Printed Movie Disc Art -->
                    <div class="disc-art-print">
                      <div class="disc-text-wrap">
                        <span class="disc-brand-logo">CINEVAULT DIGITAL MASTER</span>
                        <h4 class="disc-movie-title">{{ movie()!.Title }}</h4>
                        <span class="disc-format-badge">COMPACT DISC • 4K ULTRA STREAM</span>
                      </div>
                    </div>

                    <!-- Optical Laser Grooves Ring -->
                    <div class="disc-grooves"></div>
                  </div>
                </div>

                <!-- Laser Drive Playback Indicator -->
                <div class="optical-drive-hud">
                  <div class="laser-status">
                    <span class="status-dot" [class.active]="isDiscSpinning"></span>
                    <span class="status-text">{{ isDiscSpinning ? 'DISC SPINNING @ 48X OPTICAL SPEED' : 'CLICK DISC TO SPIN / LASER READ' }}</span>
                  </div>
                  <div class="track-info">TRACK 01 // STEREO DIGITAL AUDIO</div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .inspection-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(5, 7, 12, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 1.5rem;
      opacity: 0;
      visibility: hidden;
      transition: all 0.35s ease;
      perspective: 1600px;
    }

    .inspection-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .inspection-stage {
      position: relative;
      width: 100%;
      max-width: 1100px;
      max-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-deck-btn {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      color: #ffffff;
      font-size: 1.2rem;
      cursor: pointer;
      z-index: 20;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
    }

    .close-deck-btn:hover {
      background: #ff0055;
      border-color: #ff0055;
      transform: scale(1.1) rotate(90deg);
    }

    /* 3D Opened Jewel Case Container */
    .opened-jewel-case-3d {
      position: relative;
      width: 100%;
      display: flex;
      align-items: stretch;
      justify-content: center;
      transform-style: preserve-3d;
      transform: rotateX(2deg);
      box-shadow: 0 35px 80px rgba(0, 0, 0, 0.95);
      border-radius: 16px;
      overflow: hidden;
      background: #0d101a;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .case-leaf {
      flex: 1;
      min-width: 0;
      background: linear-gradient(135deg, #131724, #0a0c13);
      padding: 1.8rem;
      overflow-y: auto;
      max-height: 82vh;
    }

    .left-leaf {
      border-top-left-radius: 14px;
      border-bottom-left-radius: 14px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    .right-leaf {
      border-top-right-radius: 14px;
      border-bottom-right-radius: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, #181d2e 0%, #0c0e17 100%);
    }

    /* Acrylic Hinge Divider */
    .case-center-hinge {
      position: relative;
      width: 14px;
      background: linear-gradient(90deg, #07080d, #252b3d, #07080d);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      z-index: 10;
    }

    .hinge-pin {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4b5563;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .hinge-cylinder {
      width: 4px;
      height: 70%;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
    }

    /* Left Leaf Contents */
    .poster-booklet-header {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .poster-box {
      position: relative;
      width: 150px;
      height: 220px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .booklet-cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .poster-badge-ribbon {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.85);
      border-top: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.52rem;
      font-weight: 800;
      text-align: center;
      padding: 0.2rem 0;
      letter-spacing: 0.1em;
    }

    .meta-primary {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .genre-pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.5rem;
    }

    .genre-tag {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      color: #ffffff;
    }

    .movie-main-title {
      font-family: 'Cinzel', serif;
      font-size: 1.65rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
      line-height: 1.15;
    }

    .quick-stats-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.9rem;
    }

    .stat-pill {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.75);
    }

    .rating-scores-box {
      display: flex;
      gap: 0.85rem;
    }

    .score-card {
      display: flex;
      flex-direction: column;
      padding: 0.5rem 0.85rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .score-card.imdb {
      border-color: rgba(255, 208, 0, 0.4);
      background: rgba(255, 208, 0, 0.08);
    }

    .score-card.meta {
      border-color: rgba(0, 240, 255, 0.4);
      background: rgba(0, 240, 255, 0.08);
    }

    .score-label {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.58rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.5);
    }

    .score-val {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
    }

    .score-card.imdb .score-val {
      color: #ffd000;
    }

    .out-of {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .votes-sub {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.58rem;
      color: rgba(255, 255, 255, 0.4);
    }

    .awards-strip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.85rem;
      background: rgba(255, 208, 0, 0.08);
      border: 1px dashed rgba(255, 208, 0, 0.4);
      border-radius: 6px;
      margin-bottom: 1rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      color: #ffd000;
    }

    .plot-box {
      margin-bottom: 1.2rem;
    }

    .section-heading {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      color: var(--accent, #00f0ff);
      margin: 0 0 0.4rem 0;
      font-weight: 800;
    }

    .plot-paragraph {
      font-family: 'Outfit', sans-serif;
      font-size: 0.85rem;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    .credits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.85rem;
      margin-bottom: 1.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.07);
    }

    .credit-item {
      display: flex;
      flex-direction: column;
    }

    .credit-role {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.58rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.08em;
    }

    .credit-name {
      font-family: 'Outfit', sans-serif;
      font-size: 0.8rem;
      color: #ffffff;
    }

    .inspection-actions {
      display: flex;
      gap: 0.85rem;
      padding-top: 0.75rem;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 1.25rem;
      border-radius: 10px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .borrow-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .borrow-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #ffffff;
      transform: translateY(-2px);
    }

    .borrow-btn.borrowed {
      background: rgba(0, 229, 163, 0.2);
      border-color: #00e5a3;
      color: #00e5a3;
    }

    .trailer-btn {
      background: var(--accent, #00f0ff);
      border: 1px solid var(--accent, #00f0ff);
      color: #000000;
      box-shadow: 0 4px 15px var(--glow, rgba(0, 240, 255, 0.3));
    }

    .trailer-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px var(--glow, rgba(0, 240, 255, 0.6));
    }

    /* Right Leaf Disc Tray Bed */
    .disc-tray-bed {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .tray-recess {
      position: relative;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, #080a10 0%, #151a29 70%, #06070a 100%);
      box-shadow: 
        inset 0 0 25px rgba(0, 0, 0, 0.95),
        0 4px 15px rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .disc-spindle-hub {
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #11141f;
      border: 2px solid rgba(255, 255, 255, 0.3);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
      pointer-events: none;
    }

    .hub-center-ring {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #555;
      background: #000;
    }

    /* 3D Compact Disc */
    .compact-disc-3d {
      position: relative;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, #1a1e2d 15%, #0f121d 60%, #090a10 100%);
      cursor: pointer;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.25);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .compact-disc-3d:hover {
      transform: scale(1.02);
    }

    .compact-disc-3d.spinning {
      animation: spinDisc 3s linear infinite;
    }

    @keyframes spinDisc {
      100% { transform: rotate(360deg); }
    }

    .disc-laser-diffraction {
      position: absolute;
      inset: 0;
      background: conic-gradient(
        from 0deg,
        rgba(255, 0, 0, 0.35) 0deg,
        rgba(255, 128, 0, 0.35) 45deg,
        rgba(255, 255, 0, 0.35) 90deg,
        rgba(0, 255, 128, 0.35) 135deg,
        rgba(0, 240, 255, 0.35) 180deg,
        rgba(0, 128, 255, 0.35) 225deg,
        rgba(255, 0, 255, 0.35) 270deg,
        rgba(255, 0, 128, 0.35) 315deg,
        rgba(255, 0, 0, 0.35) 360deg
      );
      mix-blend-mode: screen;
      opacity: 0.6;
      pointer-events: none;
    }

    .disc-clear-hub {
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(2px);
    }

    .hub-spindle-hole {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #000000;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .hub-serial-code {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.45rem;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 0.2rem;
      letter-spacing: 0.05em;
    }

    .disc-art-print {
      position: absolute;
      top: 25px;
      left: 25px;
      right: 25px;
      bottom: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      pointer-events: none;
      z-index: 4;
    }

    .disc-text-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0.5rem 0;
    }

    .disc-brand-logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.5rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: var(--accent, #00f0ff);
      text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
    }

    .disc-movie-title {
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      font-weight: 900;
      color: #ffffff;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
      max-width: 200px;
    }

    .disc-format-badge {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.48rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 0.1em;
    }

    .disc-grooves {
      position: absolute;
      inset: 15px;
      border-radius: 50%;
      background: repeating-radial-gradient(
        circle,
        transparent 0px,
        transparent 3px,
        rgba(255, 255, 255, 0.03) 4px,
        transparent 5px
      );
      pointer-events: none;
    }

    .optical-drive-hud {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
    }

    .laser-status {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #555;
    }

    .status-dot.active {
      background: #00e5a3;
      box-shadow: 0 0 10px #00e5a3;
      animation: blink 1s infinite alternate;
    }

    @keyframes blink {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .status-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.75);
      letter-spacing: 0.06em;
    }

    .track-info {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.55rem;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.1em;
    }

    @media (max-width: 900px) {
      .opened-jewel-case-3d {
        flex-direction: column;
        max-height: 85vh;
      }
      .case-leaf {
        padding: 1rem;
        max-height: none;
      }
      .case-center-hinge {
        width: 100%;
        height: 10px;
        flex-direction: row;
        padding: 0 1rem;
      }
      .tray-recess {
        width: 220px;
        height: 220px;
      }
      .compact-disc-3d {
        width: 200px;
        height: 200px;
      }
      .movie-main-title {
        font-size: 1.3rem;
      }
      .poster-box {
        width: 110px;
        height: 160px;
      }
    }
  `]
})
export class CdInspectionDeckComponent {
  isDiscSpinning = true;

  constructor(
    public state: LibraryStateService,
    private audio: AudioEngineService
  ) {}

  movie(): MovieDetail | null {
    return this.state.selectedMovie();
  }

  isBorrowed(): boolean {
    const m = this.movie();
    return m ? this.state.isMovieBorrowed(m) : false;
  }

  splitGenres(genreStr: string = ''): string[] {
    return genreStr.split(',').map(s => s.trim()).filter(Boolean);
  }

  toggleDiscSpin(): void {
    this.isDiscSpinning = !this.isDiscSpinning;
    if (this.isDiscSpinning) {
      this.audio.playDiscSpin();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.state.closeInspection();
    }
  }

  @HostListener('window:keydown.escape')
  onEscKey(): void {
    this.state.closeInspection();
  }
}
