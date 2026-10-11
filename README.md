# 🎬 CineVault — 3D Interactive Movie Library & CD Archive

An interactive cinema library archive application built with **Angular (Standalone Components, Signals, Web Audio API)** and **OMDb API**.

## ✨ Features

- 🏛️ **Walk-in Archival Library Experience**: Atmospheric library corridors with ambient spotlights, mahogany & brushed metal shelving racks, and glowing genre banners.
- 🚀 **Genre-Differentiated Shelving Racks**: Explore 9 distinct aisles:
  - 🚀 **Sci-Fi & Cyberpunk**
  - 💥 **Action & Blockbusters**
  - 😂 **Comedy & Satire**
  - 👻 **Horror & Paranormal**
  - 🎨 **Animation & Anime**
  - 🕵️ **Thriller & Mystery**
  - 🍿 **Drama & Masterpieces**
  - 🧙 **Fantasy & Mythic Lore**
  - 💖 **Romance & Heartfelt**
- 🔄 **"Refresh the Rack" Restocking System**:
  - Individual **"Refresh Rack"** button on each aisle that dynamically fetches and reshuffles fresh movie titles from the deep archive.
  - Global **"Restock Library"** button in the master header.
- 💿 **Realistic 3D CD Jewel Cases**:
  - Authentic 3D acrylic jewel case with spine title, release year, genre dot, and peaking holographic disc.
  - Interactive hover physics with specular reflection glare and slide-out movement.
  - **Inspection Deck (Click to Open)**:
    - Left Leaf: High-res Movie Poster Booklet, Year, Rated, Runtime, IMDb Rating (with gold stars & vote count), Metascore, Award trophies, Cast, Director, Box Office, and detailed Synopsis.
    - Right Leaf: **Spinning Holographic Compact Disc** with custom movie title art, diffraction sheen, center spindle, optical laser HUD, and toggleable disc spin.
- 💻 **OPAC Catalog Search Terminal**:
  - Retro-modern green phosphor library catalog computer.
  - Live debounced search across hundreds of thousands of films via OMDb API (`apikey=8c44fadb`).
  - Instant **"Pull CD"** button that creates a 3D jewel case and opens it on the inspection stage.
- 🔊 **Procedural Web Audio Engine**:
  - Authentic synthesized physical audio: CD shelf sliding, jewel-case unlatching click, optical disc laser whir, and shelf restock shuffle.
  - One-click mute/unmute control.
- 🛍️ **Archive Bag / Borrowed CDs Drawer**:
  - Save/borrow favorite movie CDs into your personal drawer.
- ⌨️ **Keyboard Navigation**:
  - `[ ❮ / ❯ ]` or `[ A / D ]` to walk down aisles.
  - `[ / ]` or `[ F ]` to open Search Terminal.
  - `[ ESC ]` to return CD to shelf or close dialogs.

## 🚀 How to Run

1. Open a terminal inside the project directory:
   ```bash
   cd cinevault-angular
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Open your browser at `http://localhost:4200` to step inside the CineVault!
