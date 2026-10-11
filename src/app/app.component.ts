import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ShopStorefrontComponent } from './components/shop-storefront/shop-storefront.component';
import { AisleNavigatorComponent } from './components/aisle-navigator/aisle-navigator.component';
import { ShopFloorAisleComponent } from './components/shop-floor-aisle/shop-floor-aisle.component';
import { CdInspectionDeckComponent } from './components/cd-inspection-deck/cd-inspection-deck.component';
import { SearchTerminalComponent } from './components/search-terminal/search-terminal.component';
import { BorrowedDrawerComponent } from './components/borrowed-drawer/borrowed-drawer.component';
import { TrailerModalComponent } from './components/trailer-modal/trailer-modal.component';
import { LibraryStateService } from './services/library-state.service';
import { MovieService } from './services/movie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ShopStorefrontComponent,
    AisleNavigatorComponent,
    ShopFloorAisleComponent,
    CdInspectionDeckComponent,
    SearchTerminalComponent,
    BorrowedDrawerComponent,
    TrailerModalComponent
  ],
  template: `
    <div class="cinevault-app-container">
      
      <!-- Top Store Banner & Navigation Header -->
      <app-header></app-header>

      <!-- Store Floor or Storefront View -->
      <main class="vault-main-hall">
        
        <!-- View 1: Exterior 3D Storefront & Glass Doors Entrance -->
        @if (!state.isInsideStore()) {
          <app-shop-storefront></app-shop-storefront>
        }

        <!-- View 2: Inside the CD Shop Floor & Aisles -->
        @if (state.isInsideStore()) {
          <!-- Inside Shop Welcoming Header -->
          <div class="inside-shop-top-banner">
            <button class="exit-to-street-btn" (click)="state.exitToStorefront()" title="Walk back outside to the storefront">
              <span>🚪 Exit to Storefront</span>
            </button>
            <div class="shop-status-text">
              <span>📍 BROWSING CD STORE AISLE: <b>{{ state.activeGenre().name.toUpperCase() }}</b></span>
            </div>
            <div class="clerk-tip">
              <span>💡 TIP: Flip through CD crates or click any jewel case to inspect!</span>
            </div>
          </div>

          <!-- Aisle Corridor Navigator -->
          <app-aisle-navigator></app-aisle-navigator>

          <!-- Active Aisle Shelves & Flip-Bin Crates -->
          <div class="active-aisle-viewport">
            <app-shop-floor-aisle [genre]="state.activeGenre()"></app-shop-floor-aisle>
          </div>

          <!-- Complete CD Store Directory / Floor Plan -->
          <section class="all-aisles-directory">
            <div class="directory-header">
              <span class="dir-kicker">CD STORE FLOOR MAP & AISLE DIRECTORY</span>
              <h3 class="dir-title">EXPLORE ALL GENRE RACKS</h3>
              <p class="dir-subtitle">Jump directly to any CD section across the store.</p>
            </div>

            <div class="aisles-grid-cards">
              @for (g of movieService.GENRES; track g.id) {
                <div 
                  class="aisle-card" 
                  [class.current]="g.id === state.activeAisleId()"
                  [style.--card-accent]="g.accentColor"
                  (click)="state.setAisle(g.id)">
                  
                  <div class="card-icon">{{ g.icon }}</div>
                  <div class="card-text-group">
                    <span class="card-section">AISLE {{ g.id.toUpperCase() }}</span>
                    <h4 class="card-genre-name">{{ g.name }}</h4>
                    <p class="card-seed-count">{{ g.seedTitles.length }}+ CD Titles In Stock</p>
                  </div>
                  <span class="card-arrow">➔</span>
                </div>
              }
            </div>
          </section>
        }

      </main>

      <!-- Footer Archive Stamp -->
      <footer class="vault-footer">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="footer-logo">📀 CINEVAULT CD MEGAMARKET</span>
            <p class="footer-tag">Authentic 3D CD Jewel Case & Cinema Rental Store Simulation</p>
          </div>
          <div class="footer-meta">
            <span class="meta-item">OMDb API • ANGULAR STANDALONE • WEB AUDIO ENGINE</span>
            <span class="meta-item">3D PERSPECTIVE JEWEL CASES & OPTICAL LASER DRIVE</span>
          </div>
        </div>
      </footer>

      <!-- Modals & Overlays -->
      <app-cd-inspection-deck></app-cd-inspection-deck>
      <app-search-terminal></app-search-terminal>
      <app-borrowed-drawer></app-borrowed-drawer>
      <app-trailer-modal></app-trailer-modal>

    </div>
  `,
  styles: [`
    .cinevault-app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #080a10;
      color: #ffffff;
      overflow-x: hidden;
    }

    .vault-main-hall {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .inside-shop-top-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 2rem;
      background: rgba(0, 0, 0, 0.6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.78rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .exit-to-street-btn {
      padding: 0.4rem 0.9rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .exit-to-street-btn:hover {
      background: #ff0055;
      border-color: #ff0055;
    }

    .shop-status-text b {
      color: #00f0ff;
    }

    .clerk-tip {
      color: rgba(255, 255, 255, 0.5);
    }

    .active-aisle-viewport {
      min-height: 600px;
      padding: 1rem 0;
    }

    .all-aisles-directory {
      max-width: 1300px;
      margin: 3rem auto 4rem;
      padding: 0 2rem;
      width: 100%;
    }

    .directory-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .dir-kicker {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: #00f0ff;
    }

    .dir-title {
      font-family: 'Cinzel', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0.3rem 0;
    }

    .dir-subtitle {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.88rem;
      color: rgba(255, 255, 255, 0.55);
      margin: 0;
    }

    .aisles-grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .aisle-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.2rem 1.4rem;
      background: rgba(18, 22, 36, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .aisle-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--card-accent, #00f0ff);
      opacity: 0.4;
      transition: opacity 0.2s ease, width 0.2s ease;
    }

    .aisle-card:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: var(--card-accent, #00f0ff);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    .aisle-card:hover::before {
      opacity: 1;
      width: 6px;
    }

    .aisle-card.current {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(15, 18, 28, 0.9));
      border-color: var(--card-accent, #00f0ff);
      box-shadow: 0 0 20px var(--card-accent)33;
    }

    .aisle-card.current::before {
      opacity: 1;
      width: 6px;
    }

    .card-icon {
      font-size: 1.8rem;
    }

    .card-text-group {
      flex: 1;
      min-width: 0;
    }

    .card-section {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.4);
    }

    .card-genre-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0.1rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-seed-count {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    .card-arrow {
      color: rgba(255, 255, 255, 0.3);
      font-size: 1.1rem;
      transition: transform 0.2s ease, color 0.2s ease;
    }

    .aisle-card:hover .card-arrow {
      color: var(--card-accent, #00f0ff);
      transform: translateX(4px);
    }

    .vault-footer {
      background: #05060b;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 2.5rem 2rem;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .footer-logo {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      color: #ffffff;
    }

    .footer-tag {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.45);
      margin: 0.3rem 0 0 0;
    }

    .footer-meta {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      text-align: right;
    }

    .meta-item {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.62rem;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.4);
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        align-items: flex-start;
      }
      .footer-meta {
        text-align: left;
      }
    }
  `]
})
export class AppComponent {
  constructor(
    public state: LibraryStateService,
    public movieService: MovieService
  ) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      this.state.stepAisle(-1);
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      this.state.stepAisle(1);
    } else if (event.key === '/' || event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      this.state.toggleTerminal(true);
    }
  }
}
