// // public/js/main.js
// import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
// // Using global Colyseus object from script tag

// // Game constants
// const GAME = {
//   width: window.innerWidth,
//   height: window.innerHeight,
//   backgroundColor: 0xf0f0f0
// };

// const localPlayerState = {
//   x: 0,
//   y: 0,
//   controls: {
//     up: false,
//     down: false,
//     left: false,
//     right: false,
//     attack: false
//   }
// };

// // Initialize PixiJS
// const app = new PIXI.Application({
//   width: GAME.width,
//   height: GAME.height,
//   backgroundColor: GAME.backgroundColor,
//   resolution: window.devicePixelRatio || 1,
//   autoDensity: true,
// });
// document.body.appendChild(app.view);

// // Connect to Colyseus server
// const client = new Colyseus.Client('ws://localhost:2567');
// let room;

// // Shape rendering functions
// const ShapeRenderer = {
//   triangle: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.moveTo(0, -15);
//     graphics.lineTo(-13, 10);
//     graphics.lineTo(13, 10);
//     graphics.closePath();
//     graphics.endFill();
//     return graphics;
//   },
  
//   square: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.drawRect(-12, -12, 24, 24);
//     graphics.endFill();
//     return graphics;
//   },
  
//   circle: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.drawCircle(0, 0, 15);
//     graphics.endFill();
//     return graphics;
//   },
  
//   heart: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.moveTo(0, -10);
//     graphics.bezierCurveTo(-10, -20, -20, 0, 0, 10);
//     graphics.bezierCurveTo(20, 0, 10, -20, 0, -10);
//     graphics.endFill();
//     return graphics;
//   }
// };

// // Create a player sprite based on shape and color
// function createPlayerSprite(shape, color) {
//   const container = new PIXI.Container();
  
//   // Convert color string to number if needed
//   const colorValue = typeof color === 'string' 
//     ? parseInt(color.replace('#', '0x'))
//     : color;
  
//   // Create shape graphics
//   const shapeGraphics = ShapeRenderer[shape] 
//     ? ShapeRenderer[shape](colorValue) 
//     : ShapeRenderer.circle(colorValue);
  
//   container.addChild(shapeGraphics);
  
//   // Add a simple name tag
//   const nameText = new PIXI.Text('Player', {
//     fontFamily: 'Arial',
//     fontSize: 12,
//     fill: 0x000000,
//     align: 'center',
//   });
//   nameText.anchor.set(0.5);
//   nameText.y = -30;
//   container.addChild(nameText);
  
//   return container;
// }

// // Join the lobby
// async function joinLobby() {
//   try {
//     // Choose a random shape and color for testing
//     const shapes = ["triangle", "square", "circle", "heart"];
//     const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
//     const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    
//     console.log(`Joining lobby as ${randomShape} with color ${randomColor}`);
    
//     room = await client.joinOrCreate("lobby", {
//       shape: randomShape,
//       color: randomColor
//     });

//     console.log(room);
    
//     console.log("Joined lobby successfully!");
//     setupControls()
    
//   } catch (error) {
//     console.error("Failed to join lobby:", error);
//   }
// }

// // TODO: Render current player and the client around the current player, including positions of other players

// // Set up keyboard controls
// function setupControls() {
//   // Keyboard event handlers
//   window.addEventListener('keydown', (e) => {
//     switch(e.code) {
//       case 'ArrowUp':
//       case 'KeyW':
//         localPlayerState.controls.up = true;
//         break;
//       case 'ArrowDown':
//       case 'KeyS':
//         localPlayerState.controls.down = true; 
//         break;
//       case 'ArrowLeft':
//       case 'KeyA':
//         localPlayerState.controls.left = true; 
//         break;
//       case 'ArrowRight':
//       case 'KeyD':
//         localPlayerState.controls.right = true; 
//         break;
//       case 'Space':
//         localPlayerState.controls.attack = true; 
//         break;
//     }
//   });
  
//   window.addEventListener('keyup', (e) => {
//     switch(e.code) {
//       case 'ArrowUp':
//       case 'KeyW':
//         localPlayerState.controls.up = false;
//         break;
//       case 'ArrowDown':
//       case 'KeyS':
//         localPlayerState.controls.down = false; 
//         break;
//       case 'ArrowLeft':
//       case 'KeyA':
//         localPlayerState.controls.left = false; 
//         break;
//       case 'ArrowRight':
//       case 'KeyD':
//         localPlayerState.controls.right = false; 
//         break;
//       case 'Space':
//         localPlayerState.controls.attack = false; 
//         break;
//     }
//   });
  
//   // Game update loop
//   app.ticker.add(gameLoop);
// }

// // Main game loop
// function gameLoop(delta) {
//   if (!room) return;
//   // const player = room.state.players[room.sessionId];
//   const speed = 5;
  
//   let moved = false;
//   let x = localPlayerState.x;
//   let y = localPlayerState.y;
  
//   // Handle movement (TODO: This needs to be changed to just send messages of up-pressed/released, to prevent client side hacking)
//   if (localPlayerState.controls.up) {
//     y -= speed;
//     moved = true;
//   }
//   if (localPlayerState.controls.down) {
//     y += speed;
//     moved = true;
//   }
//   if (localPlayerState.controls.left) {
//     x -= speed;
//     moved = true;
//   }
//   if (localPlayerState.controls.right) {
//     x += speed;
//     moved = true;
//   }
  
//   // Send movement to server
//   if (moved) {
//     room.send("move", { x, y });
//   }
  
//   // Handle attack
//   if (localPlayerState.controls.attack) {
//     room.send("attack", { x, y });
//     localPlayerState.controls.attack = false; // Reset to prevent continuous attacks
//   }
// }

// // Handle window resize
// window.addEventListener('resize', () => {
//   app.renderer.resize(window.innerWidth, window.innerHeight);
// });

// // Start the game
// document.addEventListener('DOMContentLoaded', () => {
//   console.log("Game initializing...");
//   joinLobby();
// });

// v2--------------------------------

// // public/js/main.js
// import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
// import { DebugUI } from './debug-ui.js';
// // Using global Colyseus object from script tag

// // Game constants
// const GAME = {
//   width: window.innerWidth,
//   height: window.innerHeight,
//   backgroundColor: 0xf0f0f0,
//   playerSpeed: 5
// };

// // Game state
// let room; // Colyseus room
// const players = new Map(); // Map of player sprites by sessionId
// let localPlayer = null; // Reference to the local player's game object

// // Initialize PixiJS
// const app = new PIXI.Application({
//   width: GAME.width,
//   height: GAME.height,
//   backgroundColor: GAME.backgroundColor,
//   resolution: window.devicePixelRatio || 1,
//   autoDensity: true,
// });
// document.body.appendChild(app.view);

// // Create a container for all game objects
// const gameWorld = new PIXI.Container();
// app.stage.addChild(gameWorld);

// // Create background grid
// function createBackgroundGrid(width, height, cellSize, color = 0xDDDDDD) {
//   const container = new PIXI.Container();
//   const graphics = new PIXI.Graphics();
  
//   graphics.lineStyle(1, color, 0.5);
  
//   // Draw vertical lines
//   for (let x = 0; x <= width; x += cellSize) {
//     graphics.moveTo(x, 0);
//     graphics.lineTo(x, height);
//   }
  
//   // Draw horizontal lines
//   for (let y = 0; y <= height; y += cellSize) {
//     graphics.moveTo(0, y);
//     graphics.lineTo(width, y);
//   }
  
//   container.addChild(graphics);
//   return container;
// }

// // Add a grid background to the game world
// const grid = createBackgroundGrid(2000, 2000, 50);
// gameWorld.addChild(grid);

// // Camera system
// const camera = {
//   target: null,
//   update: () => {
//     if (!camera.target) return;
    
//     // Center the game world on the target
//     gameWorld.x = GAME.width / 2 - camera.target.sprite.x;
//     gameWorld.y = GAME.height / 2 - camera.target.sprite.y;
//   }
// };

// // Connect to Colyseus server
// const client = new Colyseus.Client('ws://localhost:2567');

// // Shape rendering functions
// const ShapeRenderer = {
//   triangle: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.moveTo(0, -15);
//     graphics.lineTo(-13, 10);
//     graphics.lineTo(13, 10);
//     graphics.closePath();
//     graphics.endFill();
//     return graphics;
//   },
  
//   square: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.drawRect(-12, -12, 24, 24);
//     graphics.endFill();
//     return graphics;
//   },
  
//   circle: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.drawCircle(0, 0, 15);
//     graphics.endFill();
//     return graphics;
//   },
  
//   heart: (color) => {
//     const graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.moveTo(0, -10);
//     graphics.bezierCurveTo(-10, -20, -20, 0, 0, 10);
//     graphics.bezierCurveTo(20, 0, 10, -20, 0, -10);
//     graphics.endFill();
//     return graphics;
//   }
// };

// // Create a player sprite based on shape and color
// function createPlayerSprite(shape, color, name = "Player") {
//   const container = new PIXI.Container();
  
//   // Convert color string to number if needed
//   const colorValue = typeof color === 'string' 
//     ? parseInt(color.replace('#', '0x'))
//     : color;
  
//   // Create shape graphics
//   const shapeGraphics = ShapeRenderer[shape] 
//     ? ShapeRenderer[shape](colorValue) 
//     : ShapeRenderer.circle(colorValue);
  
//   container.addChild(shapeGraphics);
  
//   // Add a simple name tag
//   const nameText = new PIXI.Text(name, {
//     fontFamily: 'Arial',
//     fontSize: 12,
//     fill: 0x000000,
//     align: 'center',
//   });
//   nameText.anchor.set(0.5);
//   nameText.y = -30;
//   container.addChild(nameText);
  
//   return container;
// }

// // Join the lobby
// async function joinLobby() {
//   try {
//     // Choose a random shape and color for testing
//     const shapes = ["triangle", "square", "circle", "heart"];
//     const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
//     const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    
//     console.log(`Joining lobby as ${randomShape} with color ${randomColor}`);
    
//     room = await client.joinOrCreate("lobby", {
//       shape: randomShape,
//       color: randomColor
//     });

//     console.log("Joined lobby successfully!");
//     setupRoomListeners();
//     setupControls();
    
//     // Initialize debug UI
//     const debugUI = new DebugUI(room);
    
//   } catch (error) {
//     console.error("Failed to join lobby:", error);
//   }
// }

// // Set up room state change listeners
// function setupRoomListeners() {
//   // When the room state is first available
//   room.onStateChange((state) => {
//     console.log("Room state changed:", state);
//   });
  
//   // When a player is added to the room
//   room.state.players.onAdd((player, sessionId) => {
//     console.log("Player added:", sessionId, player);
    
//     // Create player sprite
//     const sprite = createPlayerSprite(player.shape, player.color, sessionId === room.sessionId ? "You" : sessionId.substring(0, 4));
//     sprite.x = player.x;
//     sprite.y = player.y;
    
//     // Add to game world
//     gameWorld.addChild(sprite);
    
//     // Store in our players map
//     players.set(sessionId, {
//       sprite: sprite,
//       state: player
//     });
    
//     // If this is the local player
//     if (sessionId === room.sessionId) {
//       localPlayer = players.get(sessionId);
//       // Set this player as the camera target
//       camera.target = localPlayer;
//       console.log("Local player initialized:", localPlayer);
//     }
    
//     // Listen for player property changes
//     player.onChange(() => {
//       // Update sprite position based on server state
//       sprite.x = player.x;
//       sprite.y = player.y;
//     });
//   });
  
//   // When a player is removed from the room
//   room.state.players.onRemove((player, sessionId) => {
//     console.log("Player removed:", sessionId);
    
//     // Get the player game object
//     const playerObject = players.get(sessionId);
    
//     if (playerObject) {
//       // Remove sprite from game world
//       gameWorld.removeChild(playerObject.sprite);
      
//       // Remove from our map
//       players.delete(sessionId);
      
//       // Reset local player if it was us
//       if (sessionId === room.sessionId) {
//         localPlayer = null;
//       }
//     }
//   });
  
//   // Handle welcome message
//   room.onMessage("welcome", (message) => {
//     console.log("Welcome message:", message);
//   });
  
//   // Handle player attack messages
//   room.onMessage("playerAttack", (message) => {
//     console.log("Player attack:", message);
//     // TODO: Implement visual feedback for attacks
//   });
// }

// // Set up keyboard controls
// function setupControls() {
//   // Keyboard event handlers
//   window.addEventListener('keydown', (e) => {
//     if (!room) return;
    
//     let direction = null;
    
//     switch(e.code) {
//       case 'ArrowUp':
//       case 'KeyW':
//         direction = "up";
//         break;
//       case 'ArrowDown':
//       case 'KeyS':
//         direction = "down";
//         break;
//       case 'ArrowLeft':
//       case 'KeyA':
//         direction = "left";
//         break;
//       case 'ArrowRight':
//       case 'KeyD':
//         direction = "right";
//         break;
//       case 'Space':
//         // Send attack message
//         if (localPlayer) {
//           room.send("attack", { 
//             x: localPlayer.sprite.x, 
//             y: localPlayer.sprite.y 
//           });
//         }
//         return;
//     }
    
//     // Send movement start message if we have a valid direction
//     if (direction) {
//       room.send("moveStart", { direction });
//     }
//   });
  
//   window.addEventListener('keyup', (e) => {
//     if (!room) return;
    
//     let direction = null;
    
//     switch(e.code) {
//       case 'ArrowUp':
//       case 'KeyW':
//         direction = "up";
//         break;
//       case 'ArrowDown':
//       case 'KeyS':
//         direction = "down";
//         break;
//       case 'ArrowLeft':
//       case 'KeyA':
//         direction = "left";
//         break;
//       case 'ArrowRight':
//       case 'KeyD':
//         direction = "right";
//         break;
//     }
    
//     // Send movement stop message if we have a valid direction
//     if (direction) {
//       room.send("moveStop", { direction });
//     }
//   });
// }

// // Handle window resize
// window.addEventListener('resize', () => {
//   GAME.width = window.innerWidth;
//   GAME.height = window.innerHeight;
//   app.renderer.resize(GAME.width, GAME.height);
// });

// // Game loop 
// function gameLoop(delta) {
//   // Update camera
//   camera.update();
// }

// // Start the game
// document.addEventListener('DOMContentLoaded', () => {
//   console.log("Game initializing...");
//   joinLobby();
  
//   // Set up game loop
//   app.ticker.add(gameLoop);
// });

// public/js/main.js
import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
// Using global Colyseus object from script tag

console.log("Main.js loaded");

// First, let's check if PIXI loaded correctly
console.log("PIXI loaded:", !!PIXI);
console.log("PIXI version:", PIXI.VERSION);

// Check if Colyseus is available
console.log("Colyseus loaded:", typeof Colyseus !== 'undefined');

// Game constants
const GAME = {
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xf0f0f0,
  playerSpeed: 5
};

console.log("Game settings:", GAME);

// Game state
let room; // Colyseus room
const players = new Map(); // Map of player sprites by sessionId
let localPlayer = null; // Reference to the local player's game object

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

// Create background grid
function createBackgroundGrid(width, height, cellSize, color = 0xDDDDDD) {
  console.log("Creating grid:", width, height, cellSize);
  const container = new PIXI.Container();
  const graphics = new PIXI.Graphics();
  
  graphics.lineStyle(1, color, 0.5);
  
  // Draw vertical lines
  for (let x = 0; x <= width; x += cellSize) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, height);
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    graphics.moveTo(0, y);
    graphics.lineTo(width, y);
  }
  
  container.addChild(graphics);
  console.log("Grid created");
  return container;
}

// Add a grid background to the game world
console.log("Adding grid to game world");
const grid = createBackgroundGrid(2000, 2000, 50);
gameWorld.addChild(grid);
console.log("Grid added");

// Camera system
console.log("Setting up camera system");
const camera = {
  target: null,
  update: () => {
    if (!camera.target) {
      console.log("No camera target");
      return;
    }
    
    // Center the game world on the target
    gameWorld.x = GAME.width / 2 - camera.target.sprite.x;
    gameWorld.y = GAME.height / 2 - camera.target.sprite.y;
  }
};

// Connect to Colyseus server
console.log("Setting up Colyseus client");
const client = new Colyseus.Client('ws://localhost:2567');
console.log("Colyseus client created");

// Shape rendering functions
const ShapeRenderer = {
  triangle: (color) => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.moveTo(0, -15);
    graphics.lineTo(-13, 10);
    graphics.lineTo(13, 10);
    graphics.closePath();
    graphics.endFill();
    return graphics;
  },
  
  square: (color) => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawRect(-12, -12, 24, 24);
    graphics.endFill();
    return graphics;
  },
  
  circle: (color) => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawCircle(0, 0, 15);
    graphics.endFill();
    return graphics;
  },
  
  heart: (color) => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.moveTo(0, -10);
    graphics.bezierCurveTo(-10, -20, -20, 0, 0, 10);
    graphics.bezierCurveTo(20, 0, 10, -20, 0, -10);
    graphics.endFill();
    return graphics;
  }
};

// Create a player sprite based on shape and color
function createPlayerSprite(shape, color, name = "Player") {
  console.log("Creating player sprite:", shape, color, name);
  const container = new PIXI.Container();
  
  // Convert color string to number if needed
  let colorValue;
  try {
    colorValue = typeof color === 'string' 
      ? parseInt(color.replace('#', '0x'))
      : color;
    console.log("Color value:", colorValue);
  } catch (e) {
    console.error("Error parsing color:", e);
    colorValue = 0xFF0000; // Fallback to red
  }
  
  // Create shape graphics
  let shapeGraphics;
  try {
    shapeGraphics = ShapeRenderer[shape] 
      ? ShapeRenderer[shape](colorValue) 
      : ShapeRenderer.circle(colorValue);
    console.log("Shape graphics created");
  } catch (e) {
    console.error("Error creating shape:", e);
    // Fallback to a simple circle
    shapeGraphics = new PIXI.Graphics()
      .beginFill(0xFF0000)
      .drawCircle(0, 0, 15)
      .endFill();
  }
  
  container.addChild(shapeGraphics);
  
  // Add a simple name tag
  const nameText = new PIXI.Text(name, {
    fontFamily: 'Arial',
    fontSize: 12,
    fill: 0x000000,
    align: 'center',
  });
  nameText.anchor.set(0.5);
  nameText.y = -30;
  container.addChild(nameText);
  
  console.log("Player sprite created");
  return container;
}

// Join the lobby
async function joinLobby() {
  console.log("Attempting to join lobby");
  try {
    // Choose a random shape and color for testing
    const shapes = ["triangle", "square", "circle", "heart"];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    
    console.log(`Joining lobby as ${randomShape} with color ${randomColor}`);
    
    room = await client.joinOrCreate("lobby", {
      shape: randomShape,
      color: randomColor
    });

    console.log("Joined lobby successfully!", room);
    
    // Initialize debug UI - make this conditional on the presence of the module
    try {
      const { DebugUI } = await import('./debug-ui.js');
      console.log("DebugUI module loaded");
      const debugUI = new DebugUI(room);
      console.log("DebugUI initialized");
    } catch (e) {
      console.error("Failed to load or initialize DebugUI:", e);
    }
    
    setupRoomListeners();
    setupControls();
    
  } catch (error) {
    console.error("Failed to join lobby:", error);
    // Display error on screen
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.backgroundColor = 'rgba(255,0,0,0.7)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '20px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.textContent = `Failed to connect: ${error.message}`;
    document.body.appendChild(errorDiv);
  }
}

// Set up room state change listeners
function setupRoomListeners() {
  console.log("Setting up room listeners");
  
  // When the room state is first available
  room.onStateChange((state) => {
    console.log("Room state changed:", state);
  });
  
  // When a player is added to the room
  // room.state.players.onAdd = (player, sessionId) => {
  //   console.log('ever work?');
  //   console.log("Player added:", sessionId, player);
    
  //   // Create player sprite
  //   const sprite = createPlayerSprite(player.shape, player.color, sessionId === room.sessionId ? "You" : sessionId.substring(0, 4));
  //   sprite.x = player.x;
  //   sprite.y = player.y;
    
  //   // Add to game world
  //   gameWorld.addChild(sprite);
  //   console.log("Player sprite added to game world");
    
  //   // Store in our players map
  //   players.set(sessionId, {
  //     sprite: sprite,
  //     state: player
  //   });
  //   console.log("Player added to players map");
    
  //   // If this is the local player
  //   if (sessionId === room.sessionId) {
  //     localPlayer = players.get(sessionId);
  //     // Set this player as the camera target
  //     camera.target = localPlayer;
  //     console.log("Local player initialized:", localPlayer);
  //   }
    
  //   // Listen for player property changes
  //   player.onChange = () => {
  //     // Update sprite position based on server state
  //     sprite.x = player.x;
  //     sprite.y = player.y;
  //   };
  // };
  
  // // When a player is removed from the room
  // room.state.players.onRemove = (player, sessionId) => {
  //   console.log("Player removed:", sessionId);
    
  //   // Get the player game object
  //   const playerObject = players.get(sessionId);
    
  //   if (playerObject) {
  //     // Remove sprite from game world
  //     gameWorld.removeChild(playerObject.sprite);
      
  //     // Remove from our map
  //     players.delete(sessionId);
      
  //     // Reset local player if it was us
  //     if (sessionId === room.sessionId) {
  //       localPlayer = null;
  //       camera.target = null;
  //     }
  //   }
  // };
  
  // Handle welcome message
  room.onMessage("welcome", (message) => {
    console.log("Welcome message:", message);
  });
  
  // Handle player attack messages
  room.onMessage("playerAttack", (message) => {
    console.log("Player attack:", message);
    // TODO: Implement visual feedback for attacks
  });
  
  console.log("Room listeners setup complete");
}

// Set up keyboard controls
function setupControls() {
  console.log("Setting up controls");
  
  // Keyboard event handlers
  window.addEventListener('keydown', (e) => {
    if (!room) return;
    
    let direction = null;
    
    switch(e.code) {
      case 'ArrowUp':
      case 'KeyW':
        direction = "up";
        break;
      case 'ArrowDown':
      case 'KeyS':
        direction = "down";
        break;
      case 'ArrowLeft':
      case 'KeyA':
        direction = "left";
        break;
      case 'ArrowRight':
      case 'KeyD':
        direction = "right";
        break;
      case 'Space':
        // Send attack message
        if (localPlayer) {
          console.log("Attack key pressed");
          room.send("attack", { 
            x: localPlayer.sprite.x, 
            y: localPlayer.sprite.y 
          });
        }
        return;
    }
    
    // Send movement start message if we have a valid direction
    if (direction) {
      console.log(`Movement key pressed: ${direction}`);
      room.send("moveStart", { direction });
    }
  });
  
  window.addEventListener('keyup', (e) => {
    if (!room) return;
    
    let direction = null;
    
    switch(e.code) {
      case 'ArrowUp':
      case 'KeyW':
        direction = "up";
        break;
      case 'ArrowDown':
      case 'KeyS':
        direction = "down";
        break;
      case 'ArrowLeft':
      case 'KeyA':
        direction = "left";
        break;
      case 'ArrowRight':
      case 'KeyD':
        direction = "right";
        break;
    }
    
    // Send movement stop message if we have a valid direction
    if (direction) {
      console.log(`Movement key released: ${direction}`);
      room.send("moveStop", { direction });
    }
  });
  
  console.log("Controls setup complete");
}

// Game loop 
// function gameLoop(delta) {
//   // Update camera
//   camera.update();
// }

function gameLoop(delta) {
  if (!room || !room.state) return;
  
  // Process players
  if (room.state.players) {
    // Track which players we've processed this frame
    const processedPlayerIds = new Set();
    
    // Update existing players and add new ones
    room.state.players.forEach((player, sessionId) => {
      processedPlayerIds.add(sessionId);
      
      if (players.has(sessionId)) {
        // Player exists - update sprite position
        const playerObj = players.get(sessionId);
        playerObj.sprite.x = player.x;
        playerObj.sprite.y = player.y;
      } else {
        // New player - create sprite
        console.log(`Creating sprite for player ${sessionId}`);
        const sprite = createPlayerSprite(
          player.shape, 
          player.color, 
          sessionId === room.sessionId ? "You" : sessionId.substring(0, 4)
        );
        sprite.x = player.x;
        sprite.y = player.y;
        
        // Add to game world
        gameWorld.addChild(sprite);
        
        // Store in our players map
        players.set(sessionId, {
          sprite: sprite,
          state: player
        });
        
        // If this is the local player, set as camera target
        if (sessionId === room.sessionId) {
          console.log(`Found local player (${sessionId}) - setting camera target`);
          localPlayer = players.get(sessionId);
          camera.target = localPlayer;
        }
      }
    });
    
    // Remove players that aren't in the room anymore
    for (const existingId of players.keys()) {
      if (!processedPlayerIds.has(existingId)) {
        console.log(`Removing player ${existingId}`);
        const playerObj = players.get(existingId);
        gameWorld.removeChild(playerObj.sprite);
        players.delete(existingId);
        
        if (existingId === room.sessionId) {
          localPlayer = null;
          camera.target = null;
        }
      }
    }
  }
  
  // Update camera
  if (camera.target) {
    camera.update();
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  console.log("Window resized");
  GAME.width = window.innerWidth;
  GAME.height = window.innerHeight;
  app.renderer.resize(GAME.width, GAME.height);
});

// Start the game
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, game initializing...");
  joinLobby();
  
  // Set up game loop
  app.ticker.add(gameLoop);
});

// Add additional error handling
window.addEventListener('error', (event) => {
  console.error("Global error:", event.error);
});