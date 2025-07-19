# Web-based Minesweeper Game

A classic Minesweeper game implemented with pure front-end technologies (HTML, CSS, JavaScript).

## Features

### 🎮 Core Game Features
- **Classic Minesweeper Gameplay**: Left-click to reveal cells, right-click to flag mines
- **Smart Mine Placement**: First click is always safe, ensuring solvable games
- **Auto Area Expansion**: Clicking empty areas automatically reveals adjacent safe cells
- **Number Hints**: Shows mine count in surrounding areas with color-coded numbers

### 🏆 Difficulty Levels
- **Beginner**: 9×9 grid, 10 mines - Perfect for newcomers
- **Intermediate**: 16×16 grid, 40 mines - Moderate challenge
- **Expert**: 16×30 grid, 99 mines - Expert-level challenge

### 📊 Game Information
- **Mine Counter**: Real-time display of remaining unflagged mines
- **Game Timer**: Records game duration
- **Win/Loss Detection**: Automatic game state detection
- **Reset Function**: One-click game restart

### 📱 User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Visual Feedback**: Clear icons and color indicators
- **Smooth Interactions**: Optimized clicking and flagging operations

## Game Rules

### Basic Controls
1. **Left Click**: Reveal cell contents
2. **Right Click**: Flag/unflag suspected mine locations
3. **Numbers**: Display total mines in the 8 surrounding directions

### Win Condition
Reveal all non-mine cells to win the game

### Lose Condition
Clicking on a mine ends the game

## Technical Implementation

### Project Structure
```
minesweeper/
├── index.html      # Main page structure
├── styles.css      # Stylesheet
├── script.js       # Game logic
├── README.md       # Chinese documentation
└── README_EN.md    # English documentation
```

### Technology Stack
- **HTML5**: Page structure
- **CSS3**: Styling and layout (using CSS Grid)
- **JavaScript (ES6+)**: Game logic and interactions

### Core Algorithms
- **Random Mine Distribution**: Ensures first click safety
- **Recursive Area Expansion**: Auto-expands contiguous safe areas
- **Adjacent Mine Calculation**: Efficiently calculates surrounding mine counts

## How to Run

### Method 1: Direct Opening
1. Download project files
2. Double-click `index.html`
3. Start playing in your browser

### Method 2: Local Server
```bash
# Using Python local server
python -m http.server 8000

# Or using Node.js
npx http-server

# Then visit http://localhost:8000 in your browser
```

## Game Screenshots

The game interface includes:
- Top info bar: Mine counter, reset button, timer
- Difficulty selection buttons: Beginner, Intermediate, Expert
- Game grid: Clickable cells forming the play area

## Special Features

### Smart Mine Placement
- First click never hits a mine
- First click's 8 surrounding cells are also mine-free
- Guarantees every game is solvable

### Responsive Design
- Adapts to different screen sizes
- Mobile-friendly touch controls
- Optimized cell dimensions

### Visual Effects
- 🚩 Red flag for marked mines
- 💣 Mine explosion effects
- Color-coded numbers (1-blue, 2-green, 3-red, etc.)

## Browser Compatibility

Supports all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development Notes

### Code Structure
- `GAME_LEVELS`: Defines three difficulty configurations
- `gameState`: Manages game state
- `initGame()`: Game initialization
- `placeMines()`: Smart mine placement
- `revealCell()`: Cell revelation logic
- `checkWin()`: Victory condition check

### Custom Difficulty
Add new difficulty levels in the `GAME_LEVELS` object:
```javascript
const GAME_LEVELS = {
    custom: { rows: 20, cols: 20, mines: 50 }
};
```

## License

MIT License - Free to use, modify, and distribute

## Contributing

Issues and Pull Requests are welcome to improve the game!

---

*Enjoy the classic Minesweeper experience!* 🎯
