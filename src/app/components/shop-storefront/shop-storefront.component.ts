import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStateService } from '../../services/library-state.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-shop-storefront',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="storefront-stage">
      
      <!-- Ambient Night City Glow -->
      <div class="street-neon-glow"></div>
      <div class="rain-steam"></div>

      <!-- Retro Neon Storefront Signage -->
      <div class="storefront-facade">
        <div class="neon-sign-box">
          <div class="neon-badge-row">
            <span class="neon-tag red">EST. 1998</span>
            <span class="neon-tag green">● NOW OPEN</span>
            <span class="neon-tag yellow">4K & ORIGINAL DISCS</span>
          </div>

          <h1 class="store-neon-title">
            <span class="glow-word">RETRO</span>
            <span class="disc-spin-logo">💿</span>
            <span class="glow-word pink">CINEVAULT</span>
          </h1>
          <p class="store-subtitle">THE WORLD'S GREATEST MOVIE CD & LASERDISC RENTAL SHOP</p>
        </div>

        <!-- Store Windows with Featured Movie Posters -->
        <div class="shop-windows-row">
          <!-- Left Window Display -->
          <div class="shop-window left-window">
            <div class="window-neon-sign">NEW RELEASES</div>
            <div class="window-poster-grid">
              <div class="mini-window-poster p1">
                <span class="staff-pick-sticker">STAFF PICK</span>
              </div>
              <div class="mini-window-poster p2">
                <span class="sale-sticker">TOP RENT</span>
              </div>
            </div>
          </div>

          <!-- Center 3D Interactive Double Glass Entrance Doors -->
          <div class="store-entrance-portal" (click)="state.enterShop()">
            
            <div class="door-frame-arch">
              <div class="overhead-chime-bell">🔔</div>
              <span class="welcome-sign">PUSH TO ENTER SHOP</span>
            </div>

            <div class="double-glass-doors">
              <!-- Left Glass Door -->
              <div class="glass-door door-left">
                <div class="door-handle left-handle">PUSH</div>
                <div class="door-decal">
                  <span class="decal-logo">📀 CINEVAULT</span>
                  <span class="decal-hours">HOURS: 24/7</span>
                </div>
                <div class="glass-reflection"></div>
              </div>

              <!-- Right Glass Door -->
              <div class="glass-door door-right">
                <div class="door-handle right-handle">PULL</div>
                <div class="door-decal">
                  <span class="decal-logo">ALL GENRES</span>
                  <span class="decal-hours">SCI-FI • ACTION • COMEDY</span>
                </div>
                <div class="glass-reflection"></div>
              </div>
            </div>

            <!-- Welcome Floor Mat -->
            <div class="entrance-floor-mat">
              <span>WELCOME ARCHIVIST • STEP INSIDE</span>
            </div>

            <!-- Action Button Prompt -->
            <button class="enter-shop-action-btn">
              <span class="door-icon">🚪</span>
              <span class="action-text">WALK INSIDE THE CD SHOP</span>
              <span class="door-arrow">➔</span>
            </button>
          </div>

          <!-- Right Window Display -->
          <div class="shop-window right-window">
            <div class="window-neon-sign gold">CULT CLASSICS</div>
            <div class="window-poster-grid">
              <div class="mini-window-poster p3">
                <span class="staff-pick-sticker gold">LEGEND</span>
              </div>
              <div class="mini-window-poster p4">
                <span class="sale-sticker">RESTOCKED</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Quick Genre Aisles Sneak Peek -->
        <div class="storefront-genre-pills">
          <span class="aisle-guide-tag">SHOP AISLES INSIDE:</span>
          @for (g of movieService.GENRES.slice(0, 7); track g.id) {
            <span class="store-genre-badge" (click)="openDirectAisle($event, g.id)">
              {{ g.icon }} {{ g.name }}
            </span>
          }
        </div>

      </div>

      <!-- Sidewalk Pavement -->
      <div class="sidewalk-curb"></div>
    </div>
  `,
  styles: [`
    .storefront-stage {
      position: relative;
      width: 100%;
      min-height: 85vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem 4rem;
      background: radial-gradient(circle at 50% 20%, #171c2c 0%, #080a12 85%);
      overflow: hidden;
      perspective: 1400px;
    }

    .street-neon-glow {
      position: absolute;
      width: 800px;
      height: 500px;
      top: -100px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(255, 0, 119, 0.12) 50%, transparent 70%);
      filter: blur(60px);
      pointer-events: none;
    }

    .storefront-facade {
      position: relative;
      z-index: 5;
      max-width: 1200px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .neon-sign-box {
      background: rgba(10, 12, 20, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 1.5rem 2.5rem;
      box-shadow: 
        0 0 35px rgba(0, 240, 255, 0.2),
        inset 0 0 25px rgba(0, 0, 0, 0.8);
      margin-bottom: 2.5rem;
    }

    .neon-badge-row {
      display: flex;
      justify-content: center;
      gap: 0.85rem;
      margin-bottom: 0.85rem;
      flex-wrap: wrap;
    }

    .neon-tag {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      padding: 0.2rem 0.65rem;
      border-radius: 4px;
      border: 1px solid currentColor;
    }

    .neon-tag.red { color: #ff0055; text-shadow: 0 0 8px #ff0055; }
    .neon-tag.green { color: #00e5a3; text-shadow: 0 0 8px #00e5a3; }
    .neon-tag.yellow { color: #ffd000; text-shadow: 0 0 8px #ffd000; }

    .store-neon-title {
      font-family: 'Cinzel', serif;
      font-size: 3.2rem;
      font-weight: 900;
      color: #ffffff;
      margin: 0;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.85rem;
      line-height: 1.1;
      text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
    }

    .glow-word {
      color: #00f0ff;
    }

    .glow-word.pink {
      color: #ff0077;
      text-shadow: 0 0 20px rgba(255, 0, 119, 0.8);
    }

    .disc-spin-logo {
      font-size: 2.8rem;
      display: inline-block;
      animation: logoSpin 6s linear infinite;
    }

    @keyframes logoSpin {
      100% { transform: rotate(360deg); }
    }

    .store-subtitle {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.7);
      margin: 0.6rem 0 0 0;
    }

    /* Windows & Center Door Row */
    .shop-windows-row {
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 2rem;
      width: 100%;
      margin-bottom: 2rem;
    }

    .shop-window {
      flex: 1;
      max-width: 280px;
      background: rgba(14, 18, 30, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.7);
    }

    .window-neon-sign {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #00f0ff;
      text-shadow: 0 0 8px #00f0ff;
      margin-bottom: 0.85rem;
      padding: 0.3rem;
      border-bottom: 1px dashed rgba(0, 240, 255, 0.3);
    }

    .window-neon-sign.gold {
      color: #ffd000;
      text-shadow: 0 0 8px #ffd000;
      border-color: rgba(255, 208, 0, 0.3);
    }

    .window-poster-grid {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      flex: 1;
    }

    .mini-window-poster {
      flex: 1;
      min-height: 110px;
      border-radius: 6px;
      position: relative;
      background-size: cover;
      background-position: center;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    }

    .mini-window-poster.p1 { background-image: url('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80'); }
    .mini-window-poster.p2 { background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80'); }
    .mini-window-poster.p3 { background-image: url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80'); }
    .mini-window-poster.p4 { background-image: url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80'); }

    .staff-pick-sticker, .sale-sticker {
      position: absolute;
      top: 6px;
      left: 6px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.55rem;
      font-weight: 800;
      padding: 0.15rem 0.45rem;
      border-radius: 3px;
      background: #ff0055;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
    }

    .staff-pick-sticker.gold { background: #ffd000; color: #000; }
    .sale-sticker { background: #00e5a3; color: #000; }

    /* Center Double Glass Entrance Doors */
    .store-entrance-portal {
      width: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      perspective: 1000px;
      transition: transform 0.3s ease;
    }

    .store-entrance-portal:hover {
      transform: scale(1.02);
    }

    .door-frame-arch {
      width: 100%;
      background: linear-gradient(180deg, #2b334d, #141824);
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-bottom: none;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      padding: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }

    .overhead-chime-bell {
      font-size: 1.2rem;
      animation: ringBell 2s ease-in-out infinite;
    }

    @keyframes ringBell {
      0%, 100% { transform: rotate(0); }
      10%, 30% { transform: rotate(15deg); }
      20%, 40% { transform: rotate(-15deg); }
      50% { transform: rotate(0); }
    }

    .welcome-sign {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #00f0ff;
    }

    .double-glass-doors {
      width: 100%;
      height: 290px;
      display: flex;
      border: 3px solid #36415d;
      border-top: none;
      background: rgba(10, 15, 28, 0.75);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
      position: relative;
    }

    .glass-door {
      flex: 1;
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(20, 28, 48, 0.6) 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: left center;
    }

    .door-right {
      transform-origin: right center;
    }

    .store-entrance-portal:hover .door-left {
      transform: rotateY(-22deg);
    }

    .store-entrance-portal:hover .door-right {
      transform: rotateY(22deg);
    }

    .door-handle {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 70px;
      background: linear-gradient(90deg, #c5cad6, #7a8499);
      border: 1px solid #ffffff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.55rem;
      font-weight: 800;
      color: #11141e;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }

    .left-handle { right: 10px; }
    .right-handle { left: 10px; }

    .door-decal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      backdrop-filter: blur(4px);
    }

    .decal-logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 800;
      color: #00f0ff;
    }

    .decal-hours {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.52rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .glass-reflection {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
      pointer-events: none;
    }

    .entrance-floor-mat {
      width: 100%;
      background: #111420;
      border: 2px solid #282f42;
      border-top: none;
      padding: 0.5rem;
      text-align: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.62rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 0.12em;
    }

    .enter-shop-action-btn {
      margin-top: 1.25rem;
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.85rem 1.8rem;
      background: linear-gradient(90deg, #00f0ff, #00a2ff);
      border: none;
      border-radius: 999px;
      color: #000000;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 240, 255, 0.4);
      transition: all 0.25s ease;
    }

    .enter-shop-action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 240, 255, 0.7);
    }

    .storefront-genre-pills {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .aisle-guide-tag {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.4);
    }

    .store-genre-badge {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.35rem 0.85rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .store-genre-badge:hover {
      background: rgba(0, 240, 255, 0.15);
      border-color: #00f0ff;
      transform: translateY(-2px);
    }

    .sidewalk-curb {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 10px;
      background: linear-gradient(180deg, #1c2130, #0a0d14);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 900px) {
      .shop-window {
        display: none;
      }
      .store-neon-title {
        font-size: 2.2rem;
      }
    }
  `]
})
export class ShopStorefrontComponent {
  constructor(
    public state: LibraryStateService,
    public movieService: MovieService
  ) {}

  openDirectAisle(event: MouseEvent, genreId: string): void {
    event.stopPropagation();
    this.state.setAisle(genreId);
    this.state.enterShop();
  }
}
