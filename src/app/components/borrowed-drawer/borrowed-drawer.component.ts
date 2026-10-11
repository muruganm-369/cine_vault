import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStateService } from '../../services/library-state.service';
import { MovieDetail } from '../../models/movie.model';

@Component({
  selector: 'app-borrowed-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state.isCartOpen()) {
      <div class="drawer-overlay" (click)="state.toggleCart()">
        <div class="cart-drawer-panel" (click)="$event.stopPropagation()">
          
          <!-- Drawer Header -->
          <div class="drawer-header">
            <div class="header-title-box">
              <span class="disc-icon">💿</span>
              <div>
                <h3 class="drawer-title">MY ARCHIVE BAG</h3>
                <span class="drawer-subtitle">{{ state.borrowedCds().length }} DISCS CHECKED OUT</span>
              </div>
            </div>
            <button class="drawer-close-btn" (click)="state.toggleCart()">✕</button>
          </div>

          <!-- Drawer Body -->
          <div class="drawer-body">
            @if (state.borrowedCds().length === 0) {
              <div class="empty-cart-state">
                <span class="empty-cart-icon">📼</span>
                <h4>YOUR BAG IS EMPTY</h4>
                <p>Browse through the library aisles or search the terminal and click "Borrow / Save CD" to build your movie collection.</p>
              </div>
            }

            @if (state.borrowedCds().length > 0) {
              <div class="borrowed-list">
                @for (movie of state.borrowedCds(); track movie.imdbID || movie.Title) {
                  <div class="borrowed-card" (click)="inspectFromCart(movie)">
                    <div class="mini-cd-poster">
                      <img 
                        [src]="movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80'" 
                        [alt]="movie.Title">
                      <div class="mini-disc-rim"></div>
                    </div>

                    <div class="borrowed-meta">
                      <h4 class="b-title">{{ movie.Title }}</h4>
                      <p class="b-sub">{{ movie.Year }} • ★ {{ movie.imdbRating || 'N/A' }}</p>
                      <div class="b-genre-pill">{{ movie.Genre }}</div>
                    </div>

                    <button 
                      class="remove-borrow-btn" 
                      (click)="removeMovie($event, movie)"
                      title="Return this CD to shelf">
                      🗑
                    </button>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Drawer Footer -->
          @if (state.borrowedCds().length > 0) {
            <div class="drawer-footer">
              <button class="clear-all-btn" (click)="clearAll()">
                <span>Return All CDs to Shelves</span>
              </button>
            </div>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    .drawer-overlay {
      position: fixed;
      inset: 0;
      z-index: 1100;
      background: rgba(4, 6, 12, 0.7);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: flex-end;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .cart-drawer-panel {
      width: 100%;
      max-width: 420px;
      height: 100%;
      background: #0d101a;
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      flex-direction: column;
      box-shadow: -15px 0 40px rgba(0, 0, 0, 0.85);
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      background: #121624;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .header-title-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .disc-icon {
      font-size: 1.6rem;
    }

    .drawer-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #ffffff;
      margin: 0;
    }

    .drawer-subtitle {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      color: #00f0ff;
      letter-spacing: 0.1em;
    }

    .drawer-close-btn {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .drawer-close-btn:hover {
      background: #ff0055;
      border-color: #ff0055;
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem;
    }

    .empty-cart-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70%;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'Space Grotesk', sans-serif;
      padding: 2rem;
    }

    .empty-cart-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-cart-state h4 {
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }

    .empty-cart-state p {
      font-size: 0.8rem;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.5);
    }

    .borrowed-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .borrowed-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .borrowed-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 240, 255, 0.4);
      transform: translateX(-3px);
    }

    .mini-cd-poster {
      position: relative;
      width: 48px;
      height: 68px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .mini-cd-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .borrowed-meta {
      flex: 1;
      min-width: 0;
    }

    .b-title {
      font-family: 'Outfit', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .b-sub {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0.2rem 0;
    }

    .b-genre-pill {
      display: inline-block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.58rem;
      padding: 0.1rem 0.4rem;
      background: rgba(0, 240, 255, 0.1);
      border-radius: 3px;
      color: #00f0ff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }

    .remove-borrow-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0.4rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .remove-borrow-btn:hover {
      color: #ff0055;
      background: rgba(255, 0, 85, 0.15);
    }

    .drawer-footer {
      padding: 1.25rem 1.5rem;
      background: #121624;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .clear-all-btn {
      width: 100%;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-all-btn:hover {
      background: rgba(255, 0, 85, 0.2);
      border-color: #ff0055;
      color: #ff0055;
    }
  `]
})
export class BorrowedDrawerComponent {
  constructor(public state: LibraryStateService) {}

  inspectFromCart(movie: MovieDetail): void {
    this.state.toggleCart();
    this.state.inspectMovie(movie);
  }

  removeMovie(event: MouseEvent, movie: MovieDetail): void {
    event.stopPropagation();
    this.state.toggleBorrowMovie(movie);
  }

  clearAll(): void {
    this.state.borrowedCds.set([]);
    localStorage.removeItem('cinevault_cart');
  }
}
