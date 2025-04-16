// public/js/main.js
import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.1/+esm';
import { LobbyScene } from './game/scenes/LobbyScene.js';
import { ShapeRenderer } from './game/utils/shapeRenderer.js';

// Make ShapeRenderer available globally for background utils
window.ShapeRenderer = ShapeRenderer;

console.log("Main.js loaded");

// Check if PIXI loaded correctly
console.log("PIXI loaded:", !!PIXI);
console.log("PIXI version:", PIXI.VERSION);

// Check if Colyseus is available
console.log("Colyseus loaded:", typeof Colyseus !== 'undefined');
console.log("GSAP loaded:", typeof gsap !== 'undefined');

// Game constants
const GAME = {
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xf0f0f0
};

console.log("Game settings:", GAME);

// Initialize PixiJS
console.log("Initializing PIXI Application");
const app = new PIXI.Application({
  width: GAME.width,
  height: GAME.height,
  backgroundColor: GAME.backgroundColor,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});
console.log("PIXI Application created");

// Append the canvas to the body
console.log("Appending canvas to body");
document.body.appendChild(app.view);
console.log("Canvas appended");

// Create a container for all game objects
const gameWorld = new PIXI.Container();
app.stage.addChild(gameWorld);

// Connect to Colyseus server
console.log("Setting up Colyseus client");
const client = new Colyseus.Client('ws://localhost:2567');
console.log("Colyseus client created");

// Current scene
let currentScene = null;

// Create loading screen
function showLoadingScreen() {
  const loadingContainer = new PIXI.Container();
  app.stage.addChild(loadingContainer);
  
  // Background
  const bg = new PIXI.Graphics();
  bg.beginFill(GAME.backgroundColor);
  bg.drawRect(0, 0, GAME.width, GAME.height);
  bg.endFill();
  loadingContainer.addChild(bg);
  
  // Title
  const titleText = new PIXI.Text("GONS", {
    fontFamily: "Arial",
    fontSize: 72,
    fontWeight: "bold",
    fill: 0x000000
  });
  titleText.anchor.set(0.5);
  titleText.x = GAME.width / 2;
  titleText.y = GAME.height / 2 - 100;
  loadingContainer.addChild(titleText);
  
  // Subtitle
  const subtitleText = new PIXI.Text("A Shapes & Colors Adventure", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0x555555
  });
  subtitleText.anchor.set(0.5);
  subtitleText.x = GAME.width / 2;
  subtitleText.y = GAME.height / 2 - 40;
  loadingContainer.addChild(subtitleText);
  
  // Loading indicator
  const loadingText = new PIXI.Text("Loading...", {
    fontFamily: "Arial",
    fontSize: 18,
    fill: 0x000000
  });
  loadingText.anchor.set(0.5);
  loadingText.x = GAME.width / 2;
  loadingText.y = GAME.height / 2 + 50;
  loadingContainer.addChild(loadingText);
  
  // // Loading bar
  // const barWidth = 300;
  // const barHeight = 20;
  
  // const barBg = new PIXI.Graphics();
  // barBg.beginFill(0xFFFFFF);
  // barBg.drawRoundedRect(0, 0, barWidth, barHeight, 8);
  // barBg.endFill();
  // barBg.x = GAME.width / 2 - barWidth / 2;
  // barBg.y = GAME.height / 2 + 80;
  // loadingContainer.addChild(barBg);
  
  // const bar = new PIXI.Graphics();
  // bar.beginFill(0xF0F0F0);
  // bar.drawRoundedRect(0, 0, 10, barHeight, 8);
  // bar.endFill();
  // bar.x = GAME.width / 2 - barWidth / 2;
  // bar.y = GAME.height / 2 + 80;
  // loadingContainer.addChild(bar);
  
  // // Animate loading bar
  // let progress = 0;
  // const updateBar = () => {
  //   progress += 0.01;
  //   if (progress > 1) {
  //     progress = 0;
  //   }
    
  //   bar.width = barWidth * progress;
    
  //   if (loadingContainer.parent) {
  //     requestAnimationFrame(updateBar);
  //   }
  // };
  // updateBar();
  
  // Add some decorative shapes
  const shapes = ['triangle', 'square', 'circle', 'heart'];
  const colors = [0xFF5555, 0x55FF55, 0x5555FF, 0xFFFF55, 0xFF55FF, 0x55FFFF];
  
  for (let i = 0; i < 20; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const shapeGraphic = ShapeRenderer[shape](color);
    shapeGraphic.x = Math.random() * GAME.width;
    shapeGraphic.y = Math.random() * GAME.height;
    shapeGraphic.scale.set(Math.random() + 0.5);
    shapeGraphic.alpha = 0.2 + Math.random() * 0.3;
    
    // Add animation
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 2;
    
    gsap.to(shapeGraphic, {
      x: Math.random() * GAME.width,
      y: Math.random() * GAME.height,
      rotation: Math.random() * Math.PI * 2,
      duration: duration,
      delay: delay,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    loadingContainer.addChild(shapeGraphic);
  }
  
  return loadingContainer;
}

// Initialize the game
async function initGame() {
  try {
    // Show loading screen
    const loadingScreen = showLoadingScreen();
    
    // Preload assets
    await loadAssets();
    
    // Initialize scenes
    initScenes();
    
    // Remove loading screen
    gsap.to(loadingScreen, {
      alpha: 0,
      duration: 0.5,
      onComplete: () => {
        app.stage.removeChild(loadingScreen);
      }
    });
    
    // Start game loop
    app.ticker.add(gameLoop);
    
    console.log("Game initialized!");
  } catch (error) {
    console.error("Failed to initialize game:", error);
    
    // Show error screen
    const errorText = new PIXI.Text(`Error loading game: ${error.message}\nTry refreshing the page.`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xFF0000,
      align: "center"
    });
    errorText.anchor.set(0.5);
    errorText.x = GAME.width / 2;
    errorText.y = GAME.height / 2;
    app.stage.addChild(errorText);
  }
}

// Load assets
async function loadAssets() {
  return new Promise((resolve, reject) => {
    try {
      // Create a loader - using newer PIXI.Assets API
      console.log("Setting up asset loader...");
      
      // Define assets to load
      const assetMap = {
        'door': 'assets/door.png',
        // Add more assets here as needed
      };
      
      console.log("Assets to load:", assetMap);
      
      // Start loading
      console.log("Loading assets...");
      
      // Use the newer Assets.load API
      PIXI.Assets.load(Object.values(assetMap))
        .then((resources) => {
          console.log("Assets loaded successfully:", resources);
          resolve();
        })
        .catch(error => {
          console.error("Error in Assets.load:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Exception in loadAssets:", error);
      reject(error);
    }
  });
}

// Initialize scenes
function initScenes() {
  // Create lobby scene
  currentScene = new LobbyScene(app, client, gameWorld);
  
  // Join lobby
  currentScene.joinLobby();
}

// Game loop
function gameLoop(delta) {
  if (currentScene) {
    currentScene.update(delta);
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  console.log("Window resized");
  GAME.width = window.innerWidth;
  GAME.height = window.innerHeight;
  app.renderer.resize(GAME.width, GAME.height);
});

// Add additional error handling
window.addEventListener('error', (event) => {
  console.error("Global error:", event.error);
});

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing game...");
  initGame();
});