// public/js/game/scenes/LobbyScene.js
import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.1/+esm';
import { createBackgroundGrid } from '../utils/backgroundUtils.js';
import { ShapeRenderer } from '../utils/shapeRenderer.js';
import { InteractionZone } from '../ui/InteractionZone.js';
import { UiManager } from '../ui/UIManager.js';

export class LobbyScene {
  constructor(app, client, gameWorld) {
    this.app = app;
    this.client = client;
    this.gameWorld = gameWorld;
    this.players = new Map();
    this.localPlayer = null;
    this.room = null;
    this.uiManager = new UiManager(app);
    
    // Camera system
    this.camera = {
      target: null,
      update: () => {
        if (!this.camera.target) return;
        
        // Center the game world on the target
        this.gameWorld.x = this.app.screen.width / 2 - this.camera.target.sprite.x;
        this.gameWorld.y = this.app.screen.height / 2 - this.camera.target.sprite.y;
      }
    };
    
    // Set up background
    this.setupBackground();
    
    // Set up door to dungeons
    this.setupDungeonDoor();
  }
  
  setupBackground() {
    // Create a nice background for the lobby
    // You can replace this with a more aesthetic background like mentioned in the design doc
    const grid = createBackgroundGrid(2000, 2000, 50);
    this.gameWorld.addChild(grid);
    
    // Add some decorative elements to make the lobby more interesting
    this.addDecorativeElements();
  }
  
  addDecorativeElements() {
    // Add some floating shapes in the background
    const shapes = ['triangle', 'square', 'circle', 'heart'];
    const colors = [0xFF5555, 0x55FF55, 0x5555FF, 0xFFFF55, 0xFF55FF, 0x55FFFF];
    
    for (let i = 0; i < 20; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const scale = 0.5 + Math.random() * 1.5;
      const alpha = 0.1 + Math.random() * 0.3;
      
      const graphic = ShapeRenderer[shape](color);
      graphic.scale.set(scale);
      graphic.alpha = alpha;
      
      // Position randomly in the background
      graphic.x = Math.random() * 2000;
      graphic.y = Math.random() * 2000;
      
      this.gameWorld.addChild(graphic);
    }
  }
  
  setupDungeonDoor() {
    // Load door texture
    const doorTexture = PIXI.Texture.from('assets/door.png');
    const door = new PIXI.Sprite(doorTexture);
    
    // Position the door in the center of the map
    door.x = 1000;
    door.y = 1000;
    door.anchor.set(0.5);
    door.scale.set(2);
    
    this.gameWorld.addChild(door);
    
    // Create interaction zone around the door
    const interactionZone = new InteractionZone(
      door.x, 
      door.y + 80, 
      250, // Radius for interaction
      "Press E to enter dungeon",
      () => this.openZoneSelectionModal()
    );
    
    this.gameWorld.addChild(interactionZone);
  }
  
  async joinLobby() {
    try {
      // Choose a random shape for testing
      const shapes = ["triangle", "square", "circle", "heart"];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Get player name from localStorage or use default
      const playerName = localStorage.getItem('playerName') || "You";
      
      console.log(`Joining lobby as ${playerName} with shape ${randomShape}`);
      
      this.room = await this.client.joinOrCreate("lobby", {
        name: playerName,
        shape: randomShape
      });

      console.log("Joined lobby successfully!");
      
      // Store room reference globally for other components to access
      window.currentRoom = this.room;
      
      this.setupRoomListeners();
      this.setupControls();
      
      // Initialize debug UI if available
      try {
        const { DebugUI } = await import('../../debug-ui.js');
        console.log("DebugUI module loaded");
        const debugUI = new DebugUI(this.room);
        console.log("DebugUI initialized");
      } catch (e) {
        console.error("Failed to load or initialize DebugUI:", e);
      }
      
    } catch (error) {
      console.error("Failed to join lobby:", error);
      // Display error on screen
      this.uiManager.showError(`Failed to connect: ${error.message}`);
    }
  }
  
  setupRoomListeners() {
    // When the room state is first available
    this.room.onStateChange((state) => {
      console.log("Room state changed:", state);
    });
    
    // Handle welcome message
    this.room.onMessage("welcome", (message) => {
      console.log("Welcome message:", message);
      this.uiManager.showNotification(message.message);
    });
    
    // Handle player attack messages
    this.room.onMessage("playerAttack", (message) => {
      console.log("Player attack:", message);
      // Implement visual feedback for attacks
      this.showAttackEffect(message);
    });
    
    // Handle name update confirmation
    this.room.onMessage("nameUpdated", (message) => {
      console.log("Name updated:", message);
      this.uiManager.showNotification(`Name updated to: ${message.name}`);
    });
  }
  
  showAttackEffect(attackData) {
    // Get player who attacked
    const player = this.players.get(attackData.playerId);
    if (!player) return;
    
    // Create attack animation based on shape
    let attackGraphic;
    
    switch (attackData.shape) {
      case 'triangle':
        // Create triangle slash effect
        attackGraphic = ShapeRenderer.triangle(0xFFFFFF);
        attackGraphic.alpha = 0.7;
        attackGraphic.scale.set(2);
        break;
        
      case 'square':
        // Create square barrier effect
        attackGraphic = ShapeRenderer.square(0xFFFFFF);
        attackGraphic.alpha = 0.5;
        attackGraphic.scale.set(3);
        break;
        
      case 'heart':
        // Create healing heart effect
        attackGraphic = ShapeRenderer.heart(0xFF9999);
        attackGraphic.alpha = 0.8;
        attackGraphic.scale.set(2);
        break;
        
      case 'circle':
      default:
        // Create circle blast effect
        attackGraphic = ShapeRenderer.circle(0xFFFFFF);
        attackGraphic.alpha = 0.6;
        attackGraphic.scale.set(2);
        break;
    }
    
    // Position at player
    attackGraphic.x = attackData.x;
    attackGraphic.y = attackData.y;
    
    // Add to game world
    this.gameWorld.addChild(attackGraphic);
    
    // Animate and remove
    gsap.to(attackGraphic, {
      alpha: 0,
      duration: 0.5,
      onComplete: () => {
        this.gameWorld.removeChild(attackGraphic);
      }
    });
  }
  
  setupControls() {
    // Keyboard event handlers
    window.addEventListener('keydown', (e) => {
      if (!this.room) return;
      
      // Skip input handling if a text input is focused
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
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
          if (this.localPlayer) {
            console.log("Attack key pressed");
            this.room.send("attack", { 
              x: this.localPlayer.sprite.x, 
              y: this.localPlayer.sprite.y 
            });
          }
          return;
        case 'KeyE':
          // We don't need to handle E key here since InteractionZone already handles it
          // This prevents duplicate triggers
          return;
        case 'KeyI':
          // Inventory key
          this.uiManager.toggleInventoryMenu();
          return;
        case 'KeyG':
          // Gacha/Store key
          this.uiManager.toggleStoreMenu();
          return;
        case 'KeyM':
          // Settings/Menu key
          this.uiManager.toggleSettingsMenu();
          return;
      }
      
      // Send movement start message if we have a valid direction
      if (direction) {
        console.log(`Movement key pressed: ${direction}`);
        this.room.send("moveStart", { direction });
      }
    });
    
    window.addEventListener('keyup', (e) => {
      if (!this.room) return;
      
      // Skip input handling if a text input is focused
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
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
        this.room.send("moveStop", { direction });
      }
    });
  }
  
  handleInteractionKey() {
    // Check if player is near any interaction zones
    if (!this.localPlayer) return;
    
    const playerX = this.localPlayer.sprite.x;
    const playerY = this.localPlayer.sprite.y;
    
    // Check all interaction zones
    for (let child of this.gameWorld.children) {
      if (child instanceof InteractionZone) {
        if (child.isPlayerInRange(playerX, playerY)) {
          child.triggerInteraction();
          return;
        }
      }
    }
  }
  
  openZoneSelectionModal() {
    console.log(`Selected zone!!`);
    this.uiManager.showZoneSelectionModal((zoneType, zoneLevel) => {
      // This callback will be called when a zone is selected
      
      // Send joinDungeon message to server
      this.room.send("joinDungeon", {
        zoneType: zoneType,
        zoneLevel: zoneLevel
      });
    });
  }
  
  update(delta) {
    if (!this.room || !this.room.state) return;
    
    // Process players
    if (this.room.state.players) {
      // Track which players we've processed this frame
      const processedPlayerIds = new Set();
      
      // Update existing players and add new ones
      this.room.state.players.forEach((player, sessionId) => {
        processedPlayerIds.add(sessionId);
        
        if (this.players.has(sessionId)) {
          // Player exists - update sprite position and other properties
          const playerObj = this.players.get(sessionId);
          playerObj.sprite.x = player.x;
          playerObj.sprite.y = player.y;
          
          // Update player state reference
          playerObj.state = player;
          
          // Check if name has changed
          const nameText = playerObj.sprite.getChildAt(1); // The name text is the second child
          if (nameText && nameText.text !== player.name) {
            nameText.text = player.name;
          }
          
          // Check if color has changed
          const shapeGraphic = playerObj.sprite.getChildAt(0); // The shape graphic is the first child
          if (shapeGraphic) {
            const colorValue = typeof player.color === 'string' 
              ? parseInt(player.color.replace('#', '0x'))
              : player.color;
            
            // Update the shape's color
            shapeGraphic.clear();
            if (ShapeRenderer[player.shape]) {
              const newShape = ShapeRenderer[player.shape](colorValue);
              shapeGraphic.beginFill(colorValue);
              // Copy the shape's path
              for (const path of newShape.geometry.graphicsData) {
                shapeGraphic.drawShape(path.shape);
              }
              shapeGraphic.endFill();
            }
          }
          
          // Update character UI if this is the local player
          if (sessionId === this.room.sessionId && playerObj.sprite.uiContainer) {
            const uiContainer = playerObj.sprite.uiContainer;
            
            // Update name
            const uiNameText = uiContainer.getChildAt(1); // The name text in UI
            if (uiNameText && uiNameText.text !== player.name) {
              uiNameText.text = player.name;
            }
            
            // Update shape color
            const uiShapeGraphic = uiContainer.getChildAt(2); // The shape in UI
            if (uiShapeGraphic) {
              const colorValue = typeof player.color === 'string' 
                ? parseInt(player.color.replace('#', '0x'))
                : player.color;
              
              // Update the shape's color
              uiShapeGraphic.clear();
              if (ShapeRenderer[player.shape]) {
                const newShape = ShapeRenderer[player.shape](colorValue);
                uiShapeGraphic.beginFill(colorValue);
                // Copy the shape's path
                for (const path of newShape.geometry.graphicsData) {
                  uiShapeGraphic.drawShape(path.shape);
                }
                uiShapeGraphic.endFill();
              }
            }
            
            // Update color squares
            for (let i = 0; i < 4; i++) {
              if (i + 3 < uiContainer.children.length) { // +3 because first 3 children are background, name, and shape
                const colorBox = uiContainer.getChildAt(i + 3);
                const colorHex = player.equippedColors[i] || "#FFFFFF";
                const colorInt = typeof colorHex === 'string' 
                  ? parseInt(colorHex.replace('#', '0x'))
                  : colorHex;
                
                colorBox.clear();
                colorBox.beginFill(colorInt);
                colorBox.lineStyle(1, 0xFFFFFF, 0.8);
                colorBox.drawRect(0, 0, 20, 20); // Use the same size as in createCharacterUI
                colorBox.endFill();
              }
            }
          }
        } else {
          // New player - create sprite
          console.log(`Creating sprite for player ${sessionId}`);
          const sprite = this.createPlayerSprite(
            player.shape, 
            player.color, 
            player.name || (sessionId === this.room.sessionId ? "You" : sessionId.substring(0, 4)),
            player.equippedColors,
            sessionId === this.room.sessionId
          );
          sprite.x = player.x;
          sprite.y = player.y;
          
          // Add to game world
          this.gameWorld.addChild(sprite);
          
          // Store in our players map
          this.players.set(sessionId, {
            sprite: sprite,
            state: player
          });
          
          // If this is the local player, set as camera target
          if (sessionId === this.room.sessionId) {
            console.log(`Found local player (${sessionId}) - setting camera target`);
            this.localPlayer = this.players.get(sessionId);
            this.camera.target = this.localPlayer;
          }
        }
      });
      
      // Remove players that aren't in the room anymore
      for (const existingId of this.players.keys()) {
        if (!processedPlayerIds.has(existingId)) {
          console.log(`Removing player ${existingId}`);
          const playerObj = this.players.get(existingId);
          this.gameWorld.removeChild(playerObj.sprite);
          this.players.delete(existingId);
          
          if (existingId === this.room.sessionId) {
            this.localPlayer = null;
            this.camera.target = null;
          }
        }
      }
    }
    
    // Update interaction zones
    for (let child of this.gameWorld.children) {
      if (child instanceof InteractionZone && this.localPlayer) {
        child.checkPlayerProximity(
          this.localPlayer.sprite.x, 
          this.localPlayer.sprite.y
        );
      }
    }
    
    // Update camera
    if (this.camera.target) {
      this.camera.update();
    }
    
    // Update UI
    this.uiManager.update(delta);
  }
  
  createPlayerSprite(shape, color, name = "Player", equippedColors = [], isLocalPlayer = false) {
    const container = new PIXI.Container();
    
    // Convert color string to number if needed
    let colorValue;
    try {
      colorValue = typeof color === 'string' 
        ? parseInt(color.replace('#', '0x'))
        : color;
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
    
    // Add character UI for local player
    if (isLocalPlayer) {
      this.createCharacterUI(container, shape, name, equippedColors, colorValue);
    }
    
    return container;
  }
  
  createCharacterUI(playerContainer, shape, name, equippedColors, averageColor) {
    // Create a fixed position UI container (not affected by camera)
    const uiContainer = new PIXI.Container();
    this.uiManager.container.addChild(uiContainer);
    
    // Position in bottom left, raised a bit to avoid being cut off
    uiContainer.x = 20;
    uiContainer.y = this.app.screen.height - 160;
    
    // Add controls UI to the right of the character UI
    this.createControlsUI(uiContainer.x + 120, uiContainer.y);
    
    // Character box background
    const charBox = new PIXI.Graphics();
    charBox.beginFill(0x333333, 0.7);
    charBox.lineStyle(2, 0xFFFFFF, 0.8);
    charBox.drawRoundedRect(0, 0, 100, 100, 5);
    charBox.endFill();
    uiContainer.addChild(charBox);
    
    // Character name above the box
    const nameText = new PIXI.Text(name, {
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0x000000,
      align: 'center',
    });
    nameText.anchor.set(0.5, 1);
    nameText.x = 50;
    nameText.y = -5;
    uiContainer.addChild(nameText);
    
    // Character shape in the box
    let shapeGraphics;
    try {
      shapeGraphics = ShapeRenderer[shape] 
        ? ShapeRenderer[shape](averageColor) 
        : ShapeRenderer.circle(averageColor);
    } catch (e) {
      console.error("Error creating shape for UI:", e);
      shapeGraphics = new PIXI.Graphics()
        .beginFill(0xFF0000)
        .drawCircle(0, 0, 15)
        .endFill();
    }
    
    shapeGraphics.x = 50;
    shapeGraphics.y = 50;
    shapeGraphics.scale.set(2);
    uiContainer.addChild(shapeGraphics);
    
    // Add the four equipped colors
    const colorSize = 20;
    const colorSpacing = 5;
    const startX = 10;
    const startY = 110;
    
    // Create color squares
    for (let i = 0; i < 4; i++) {
      const colorBox = new PIXI.Graphics();
      
      // Get color or use default
      let colorHex = equippedColors && equippedColors[i] ? equippedColors[i] : "#FFFFFF";
      let colorInt;
      
      try {
        colorInt = typeof colorHex === 'string' 
          ? parseInt(colorHex.replace('#', '0x'))
          : colorHex;
      } catch (e) {
        console.error("Error parsing equipped color:", e);
        colorInt = 0xFFFFFF; // Fallback to white
      }
      
      colorBox.beginFill(colorInt);
      colorBox.lineStyle(1, 0xFFFFFF, 0.8);
      colorBox.drawRect(0, 0, colorSize, colorSize);
      colorBox.endFill();
      
      colorBox.x = startX + i * (colorSize + colorSpacing);
      colorBox.y = startY;
      
      uiContainer.addChild(colorBox);
    }
    
    // Store reference to UI container in player container for cleanup
    playerContainer.uiContainer = uiContainer;
    
    // Update UI container when player container is removed
    const originalDestroy = playerContainer.destroy;
    playerContainer.destroy = function(...args) {
      if (uiContainer && uiContainer.parent) {
        uiContainer.parent.removeChild(uiContainer);
      }
      originalDestroy.apply(this, args);
    };
  }
  
  createControlsUI(x, y) {
    // Create a fixed position UI container for controls
    const controlsContainer = new PIXI.Container();
    this.uiManager.container.addChild(controlsContainer);
    
    // Position to the right of character UI
    controlsContainer.x = x;
    controlsContainer.y = y;
    
    // Controls box background
    const controlsBox = new PIXI.Graphics();
    controlsBox.beginFill(0x333333, 0.7);
    controlsBox.lineStyle(2, 0xFFFFFF, 0.8);
    controlsBox.drawRoundedRect(0, 0, 180, 100, 5);
    controlsBox.endFill();
    controlsContainer.addChild(controlsBox);
    
    // Title
    const title = new PIXI.Text("Controls", {
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0xFFFFFF,
      align: 'center',
    });
    title.x = 10;
    title.y = 10;
    controlsContainer.addChild(title);
    
    // Controls text
    const controlsText = new PIXI.Text(
      "WASD/←↑→↓ - Move\nSpace - Attack\nE - Interact  //  I - Inventory\nG - Store  //  M - Settings", 
      {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 0xFFFFFF,
        lineHeight: 16
      }
    );
    controlsText.x = 10;
    controlsText.y = 30;
    controlsContainer.addChild(controlsText);
    
    return controlsContainer;
  }
}
