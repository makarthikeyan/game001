// Game Constants
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver'
};

// Game Object
const game = {
    canvas: null,
    ctx: null,
    gameState: GAME_STATES.START,
    score: 0,
    bestScore: localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0,
    
    // Game settings
    gravity: 0.5,
    baseGameSpeed: 5,
    gameSpeed: 5,
    maxGameSpeed: 12,
    speedIncrement: 0.0002,
    
    // Player
    player: {
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        velocityY: 0,
        isJumping: false,
        jumpsAvailable: 1,
        maxJumps: 2,
        jumpPower: -12
    },
    
    // Ground
    groundY: 0,
    
    // Obstacles
    obstacles: [],
    obstacleWidth: 30,
    obstacleHeight: 40,
    baseObstacleSpawnRate: 0.015,
    obstacleSpawnRate: 0.015,
    maxObstacleSpawnRate: 0.04,
    spawnRateIncrement: 0.00005,
    
    // Input
    touchStartY: null,
    lastTapTime: 0,
    doubleTapDelay: 300,
    
    init: function() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Touch/Mouse controls
        this.setupControls();
        
        // Update best score display
        this.updateBestScoreDisplay();
        
        // Start game loop
        this.gameLoop();
    },
    
    resizeCanvas: function() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Update ground position
        this.groundY = window.innerHeight - 50;
        
        // Center player on first load
        if (this.gameState === GAME_STATES.START) {
            this.player.x = window.innerWidth / 2 - this.player.width / 2;
            this.player.y = this.groundY - this.player.height;
        }
    },
    
    setupControls: function() {
        // Touch controls
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        }, { passive: false });
        
        // Mouse controls
        document.addEventListener('click', () => {
            this.handleInput();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleInput();
            }
        });
        
        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.share();
        });
    },
    
    handleInput: function() {
        const now = Date.now();
        const isDoubleTap = now - this.lastTapTime < this.doubleTapDelay;
        this.lastTapTime = now;
        
        if (this.gameState === GAME_STATES.START) {
            this.startGame();
        } else if (this.gameState === GAME_STATES.PLAYING) {
            if (isDoubleTap && this.player.jumpsAvailable < this.player.maxJumps) {
                // Double tap for second jump
                this.jump();
            } else if (!isDoubleTap) {
                // Single tap for first jump
                this.jump();
            }
        } else if (this.gameState === GAME_STATES.GAME_OVER) {
            this.startGame();
        }
    },
    
    startGame: function() {
        this.gameState = GAME_STATES.PLAYING;
        this.score = 0;
        this.gameSpeed = this.baseGameSpeed;
        this.obstacleSpawnRate = this.baseObstacleSpawnRate;
        this.obstacles = [];
        
        // Reset player
        this.player.x = window.innerWidth / 2 - this.player.width / 2;
        this.player.y = this.groundY - this.player.height;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        this.player.jumpsAvailable = 1;
        
        // Hide/show screens
        document.getElementById('startScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        document.getElementById('hud').classList.add('active');
        
        // Prevent scrolling
        document.body.classList.add('no-scroll');
    },
    
    jump: function() {
        if (this.player.jumpsAvailable > 0) {
            this.player.velocityY = this.player.jumpPower;
            this.player.jumpsAvailable--;
            this.player.isJumping = true;
        }
    },
    
    update: function() {
        if (this.gameState !== GAME_STATES.PLAYING) return;
        
        // Increase difficulty over time
        this.gameSpeed = Math.min(
            this.baseGameSpeed + (this.score * this.speedIncrement),
            this.maxGameSpeed
        );
        
        this.obstacleSpawnRate = Math.min(
            this.baseObstacleSpawnRate + (this.score * this.spawnRateIncrement),
            this.maxObstacleSpawnRate
        );
        
        // Update score
        this.score++;
        document.getElementById('currentScore').textContent = this.score;
        
        // Update player
        this.updatePlayer();
        
        // Spawn obstacles
        this.spawnObstacle();
        
        // Update obstacles
        this.updateObstacles();
        
        // Check collisions
        this.checkCollisions();
    },
    
    updatePlayer: function() {
        // Apply gravity
        this.player.velocityY += this.gravity;
        this.player.y += this.player.velocityY;
        
        // Ground collision
        if (this.player.y + this.player.height >= this.groundY) {
            this.player.y = this.groundY - this.player.height;
            this.player.velocityY = 0;
            this.player.isJumping = false;
            this.player.jumpsAvailable = 1;
        }
        
        // Boundaries (left/right)
        if (this.player.x < 0) {
            this.player.x = 0;
        }
        if (this.player.x + this.player.width > window.innerWidth) {
            this.player.x = window.innerWidth - this.player.width;
        }
    },
    
    spawnObstacle: function() {
        if (Math.random() < this.obstacleSpawnRate) {
            const obstacle = {
                x: window.innerWidth,
                y: this.groundY - this.obstacleHeight,
                width: this.obstacleWidth,
                height: this.obstacleHeight
            };
            this.obstacles.push(obstacle);
        }
    },
    
    updateObstacles: function() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            
            // Remove off-screen obstacles
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    },
    
    checkCollisions: function() {
        for (let obstacle of this.obstacles) {
            if (this.isColliding(this.player, obstacle)) {
                this.gameOver();
                break;
            }
        }
    },
    
    isColliding: function(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    gameOver: function() {
        this.gameState = GAME_STATES.GAME_OVER;
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        
        // Show game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalBest').textContent = this.bestScore;
        document.getElementById('gameOverScreen').classList.add('active');
        document.getElementById('hud').classList.remove('active');
        
        // Allow scrolling
        document.body.classList.remove('no-scroll');
    },
    
    draw: function() {
        // Clear canvas
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#e0f6ff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw ground
        this.drawGround();
        
        // Draw obstacles
        this.drawObstacles();
        
        // Draw player
        this.drawPlayer();
    },
    
    drawGround: function() {
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(0, this.groundY, window.innerWidth, window.innerHeight - this.groundY);
        
        // Draw ground pattern
        this.ctx.strokeStyle = '#27ae60';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < window.innerWidth; i += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, this.groundY);
            this.ctx.lineTo(i + 20, this.groundY + 10);
            this.ctx.stroke();
        }
    },
    
    drawPlayer: function() {
        // Draw player as a circle with gradient
        const gradient = this.ctx.createRadialGradient(
            this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 0,
            this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.player.width
        );
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(1, '#0099cc');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            this.player.width / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw player outline
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw eyes
        this.ctx.fillStyle = '#000';
        const eyeRadius = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + this.player.width / 2 - 5, this.player.y + this.player.height / 2 - 3, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + this.player.width / 2 + 5, this.player.y + this.player.height / 2 - 3, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    drawObstacles: function() {
        for (let obstacle of this.obstacles) {
            // Draw obstacle with gradient
            const gradient = this.ctx.createLinearGradient(
                obstacle.x, obstacle.y,
                obstacle.x, obstacle.y + obstacle.height
            );
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, '#ee5a6f');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Draw obstacle outline
            this.ctx.strokeStyle = '#cc0000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    },
    
    updateBestScoreDisplay: function() {
        document.getElementById('bestScoreStart').textContent = this.bestScore;
        document.getElementById('bestScore').textContent = this.bestScore;
    },
    
    share: function() {
        const url = window.location.href;
        const text = `I scored ${this.score} in Endless Runner! 🏃‍♂️ Can you beat my score?\n\n${url}`;
        
        if (navigator.share) {
            // Use native share if available
            navigator.share({
                title: 'Endless Runner',
                text: 'Check out this awesome tap-to-jump game!',
                url: url
            }).catch(err => console.log('Share cancelled'));
        } else {
            // Fallback: copy to clipboard
            const shareText = `My score: ${this.score}\nEndless Runner - ${url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Score copied to clipboard! Share it with friends.');
            }).catch(() => {
                alert(`Share this: ${url}`);
            });
        }
    },
    
    gameLoop: function() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
};

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
