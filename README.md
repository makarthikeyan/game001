# Endless Runner 🏃‍♂️

A fun, fast-paced endless runner game built with vanilla HTML, CSS, and JavaScript. Play in your browser on desktop, tablet, or mobile!

## Features

✨ **Mobile-Friendly**
- Fully responsive design optimized for all screen sizes
- Touch controls (tap to jump, double-tap for double jump)
- Works on iPhone, Android, and desktop browsers
- Prevents unwanted scrolling during gameplay

🎮 **Gameplay**
- Simple one-tap controls
- Double-tap for a second jump
- Score increases over time
- Progressive difficulty: obstacles spawn faster and move quicker
- Best score saved locally using localStorage

🎨 **Visual Polish**
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Colorful player and obstacle designs
- Responsive HUD with score tracking

📱 **Social Sharing**
- Native share button (on supported devices)
- Fallback copy-to-clipboard for desktop
- Share your scores with friends

## How to Play

1. **Start**: Open the game and tap anywhere to begin
2. **Jump**: Tap the screen to make your player jump
3. **Double Jump**: Tap twice quickly to perform a double jump
4. **Avoid**: Don't hit the red obstacles!
5. **Score**: Survive as long as possible to increase your score
6. **Difficulty**: The longer you survive, the faster obstacles come!

## Running Locally

### Option 1: Simple HTTP Server (Recommended)

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (with http-server package)
npx http-server

# Using Ruby
ruby -run -ehttpd . -p8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: Direct File Access

Simply open `index.html` in your browser (some features like localStorage may not work due to browser security).

## Deploying to GitHub Pages

1. **Create a repository** on GitHub named `game001` (or your preferred name)

2. **Initialize git** in your local directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Endless Runner game"
   ```

3. **Add remote and push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/game001.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/root` folder
   - Click Save

5. **Access your game**:
   - Your game will be live at `https://YOUR_USERNAME.github.io/game001/`
   - Or visit the URL shown in the Pages settings

## Files

- **index.html** - Main HTML structure with Canvas element
- **style.css** - Responsive styling for mobile and desktop
- **game.js** - Complete game logic (no external dependencies)
- **README.md** - This file

## Game Architecture

### Game States
- **START**: Title screen with best score
- **PLAYING**: Active gameplay
- **GAME_OVER**: Game over screen with restart option

### Difficulty Progression
- Base obstacle spawn rate: 0.015 (increases over time)
- Base game speed: 5 (increases gradually)
- Speed increases every 1/0.0002 points (~5000 points)
- Spawn rate increases every 1/0.00005 points (~20000 points)

### Controls
| Input | Action |
|-------|--------|
| Single Tap | Jump |
| Double Tap | Second Jump (if available) |
| Click/Space | Jump (desktop) |

## Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari
- ✅ Samsung Internet

## Performance

- Runs at 60 FPS on most devices
- Optimized for mobile with low memory footprint
- No external dependencies = minimal load time
- Responsive canvas with proper DPR scaling

## Customization

### Difficulty Settings
Edit these values in `game.js` under "Game Settings":
```javascript
gravity: 0.5,              // Player falling speed
baseGameSpeed: 5,          // Initial obstacle speed
maxGameSpeed: 12,          // Maximum speed
speedIncrement: 0.0002,    // Speed increase rate
baseObstacleSpawnRate: 0.015,  // Initial spawn rate
maxObstacleSpawnRate: 0.04     // Maximum spawn rate
```

### Player Settings
```javascript
player: {
    width: 30,             // Player size
    height: 30,
    jumpPower: -12,        // Jump strength (negative = up)
    maxJumps: 2            // Number of jumps available
}
```

### Obstacles
```javascript
obstacleWidth: 30,
obstacleHeight: 40,
```

## Tips for Players

🎯 **Strategy**
- Time your jumps carefully to avoid obstacles
- Use double-jump to escape tight situations
- Watch the pattern of incoming obstacles

📊 **Score Tracking**
- Your best score is automatically saved
- Try to beat your previous high score
- Share scores to challenge friends

## Keyboard Shortcuts (Desktop)

| Key | Action |
|-----|--------|
| Space | Jump |
| Click | Jump or interact with buttons |

## License

This game is free to use and modify for personal or educational purposes.

## Credits

Built as a fun, educational project demonstrating:
- HTML5 Canvas rendering
- Touch and mouse event handling
- Game loop implementation
- Responsive web design
- Local storage usage
- Progressive difficulty systems

---

**Have fun and happy gaming!** 🎮

For updates or to share your score, open an issue or discussion in the repository.