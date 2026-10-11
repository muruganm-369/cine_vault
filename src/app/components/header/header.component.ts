import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStateService } from '../../services/library-state.service';
import { AudioEngineService } from '../../services/audio-engine.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="vault-header">
      <!-- CD Shop Brand Emblem -->
      <div class="brand-zone" (click)="state.exitToStorefront()" title="Click to view CD Storefront">
        <div class="reel-badge">
          <span class="reel-icon">💿</span>
          <span class="disc-glow"></span>
        </div>
        <div class="title-group">
          <div class="kicker">RETRO CD & MOVIE RENTAL SHOP</div>
          <h1 class="vault-title">CINE<span>VAULT</span></h1>
        </div>
      </div>

      <!-- Current Location in Store -->
      <div class="aisle-badge-status" [style.--accent]="state.activeGenre().accentColor">
        @if (!state.isInsideStore()) {
          <span class="aisle-num">STOREFRONT</span>
          <span class="aisle-name">MAIN ENTRANCE</span>
        } @else {
          <span class="aisle-num">AISLE</span>
          <span class="aisle-icon">{{ state.activeGenre().icon }}</span>
          <span class="aisle-name">{{ state.activeGenre().name }}</span>
        }
      </div>

      <!-- Header Controls -->
      <div class="actions-zone">
        <!-- Storefront / Inside Toggle Button -->
        <button 
          class="header-btn store-btn" 
          (click)="state.isInsideStore() ? state.exitToStorefront() : state.enterShop()"
          [title]="state.isInsideStore() ? 'Step outside to storefront' : 'Step inside the CD shop'">
          <span class="btn-icon">{{ state.isInsideStore() ? '🏪' : '🚪' }}</span>
          <span class="btn-label">{{ state.isInsideStore() ? 'Storefront' : 'Walk Inside' }}</span>
        </button>

        <!-- Restock All Aisles Button -->
        <button 
          class="header-btn restock-btn" 
          (click)="state.restockAll()" 
          [class.spinning]="state.isRestockingAll()"
          title="Clerk restock: Refresh all CD racks with new movie titles">
          <span class="btn-icon">🔄</span>
          <span class="btn-label">Restock Racks</span>
        </button>

        <!-- Search Terminal Computer -->
        <button 
          class="header-btn terminal-btn" 
          (click)="state.toggleTerminal(true)"
          title="Search worldwide movie archive">
          <span class="btn-icon">💻</span>
          <span class="btn-label">Shop Computer</span>
        </button>

        <!-- Borrowed / CD Rental Bag Tray -->
        <button 
          class="header-btn cart-btn" 
          (click)="state.toggleCart()"
          title="View Borrowed Movie CDs in your rental bag">
          <span class="btn-icon">🛍️</span>
          <span class="btn-label">Rental Bag</span>
          @if (state.borrowedCds().length > 0) {
            <span class="cart-pill">{{ state.borrowedCds().length }}</span>
          }
        </button>

        <!-- Audio Mute / Unmute Toggle -->
        <button 
          class="header-btn sound-btn" 
          (click)="audio.toggleMute()"
          [title]="audio.isMuted() ? 'Unmute Sound Effects' : 'Mute Sound Effects'">
          <span class="btn-icon">{{ audio.isMuted() ? '🔇' : '🔊' }}</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .vault-header {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 0.75rem 2rem;
      background: rgba(13, 15, 23, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }

    .brand-zone {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      cursor: pointer;
    }

    .reel-badge {
      position: relative;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e2235, #0f121e);
      border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 10px;
      font-size: 1.35rem;
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
    }

    .disc-glow {
      position: absolute;
      inset: -2px;
      border-radius: 12px;
      border: 1px solid rgba(0, 240, 255, 0.4);
      animation: pulseGlow 3s ease-in-out infinite alternate;
      pointer-events: none;
    }

    @keyframes pulseGlow {
      0% { opacity: 0.3; }
      100% { opacity: 0.9; }
    }

    .kicker {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.62rem;
      letter-spacing: 0.18em;
      color: #00f0ff;
      text-transform: uppercase;
      font-weight: 600;
    }

    .vault-title {
      font-family: 'Cinzel', serif;
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      margin: 0;
      color: #ffffff;
      line-height: 1;
    }

    .vault-title span {
      background: linear-gradient(90deg, #00f0ff, #ff0077);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .aisle-badge-status {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.4rem 1.1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--accent, #00f0ff);
      border-radius: 999px;
      box-shadow: 0 0 16px var(--accent, #00f0ff)22;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .aisle-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.5);
    }

    .aisle-icon {
      font-size: 1.1rem;
    }

    .aisle-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.88rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.04em;
    }

    .actions-zone {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .header-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.95rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      color: #e6e8ee;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .header-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(0, 240, 255, 0.5);
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 240, 255, 0.15);
    }

    .store-btn:hover {
      border-color: #00e5a3;
      box-shadow: 0 4px 12px rgba(0, 229, 163, 0.25);
    }

    .restock-btn:hover {
      border-color: #ffd000;
      box-shadow: 0 4px 12px rgba(255, 208, 0, 0.25);
    }

    .terminal-btn:hover {
      border-color: #00f0ff;
    }

    .cart-btn:hover {
      border-color: #ff0077;
    }

    .cart-pill {
      background: #ff0077;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 999px;
      padding: 0.1rem 0.45rem;
      min-width: 18px;
      text-align: center;
      line-height: 1.2;
    }

    .spinning .btn-icon {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
      .vault-header {
        padding: 0.6rem 1rem;
      }
      .btn-label, .kicker {
        display: none;
      }
      .aisle-badge-status {
        padding: 0.3rem 0.75rem;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(
    public state: LibraryStateService,
    public audio: AudioEngineService
  ) {}
}
