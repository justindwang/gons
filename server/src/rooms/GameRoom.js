// server/rooms/GameRoom.js
import { Room } from "@colyseus/core";
import { GameState } from "./schema/GameState.js";
import { PlayerState } from "./schema/PlayerState.js";

export class GameRoom extends Room {
  onCreate(options) {
    console.log("Creating room with options:", options);
    
    // Initialize room settings from options
    this.roomType = options.roomType || "lobby";
    this.maxClients = options.maxClients || 4;
    
    // Create the room state
    this.setState(new GameState());
    this.state.roomType = this.roomType;
    
    // Set up movement directions for each player
    this.playerMovements = new Map();
    
    // Set up game mechanics
    this.setupGameMechanics();
    
    // Set up game loop
    this.setSimulationInterval(() => this.update(), 1000 / 60); // 60 FPS
    
    console.log(`Created ${this.roomType} room`);
  }

  setupGameMechanics() {
    console.log("Setting up game mechanics");
    
    // Handle player movement start
    this.onMessage("moveStart", (client, data) => {
      // console.log(`Player ${client.sessionId} started moving ${data.direction}`);
      
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      
      // Get or initialize player movement state
      if (!this.playerMovements.has(client.sessionId)) {
        this.playerMovements.set(client.sessionId, {
          up: false,
          down: false,
          left: false,
          right: false
        });
      }
      
      // Update movement state
      const movement = this.playerMovements.get(client.sessionId);
      movement[data.direction] = true;
    });
    
    // Handle player movement stop
    this.onMessage("moveStop", (client, data) => {
      // console.log(`Player ${client.sessionId} stopped moving ${data.direction}`);
      
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      
      // Get player movement state
      const movement = this.playerMovements.get(client.sessionId);
      if (movement) {
        movement[data.direction] = false;
      }
    });

    // For backward compatibility, still handle the old move message
    this.onMessage("move", (client, data) => {
      console.log(`Player ${client.sessionId} moved to ${data.x}, ${data.y}`);
      
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
      }
    });

    // Handle player attacks
    this.onMessage("attack", (client, data) => {
      console.log(`Player ${client.sessionId} attacked`);
      
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      
      console.log(`Player ${client.sessionId} attacked with shape ${player.shape}`);
      
      // Broadcast the attack to all clients
      this.broadcast("playerAttack", {
        playerId: client.sessionId,
        x: player.x,
        y: player.y,
        shape: player.shape
      });
    });
    
    // Handle player name updates
    this.onMessage("updateName", (client, data) => {
      console.log(`Player ${client.sessionId} updating name to: ${data.name}`);
      
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      
      // Update player name
      player.name = data.name || "Player";
      
      // Notify the player that their name was updated
      client.send("nameUpdated", { name: player.name });
    });
  }

  // Game update loop
  update() {
    // Process player movements
    for (const [sessionId, movement] of this.playerMovements.entries()) {
      const player = this.state.players.get(sessionId);
      if (!player) continue;
      
      // Calculate player speed (can be adjusted based on player stats)
      const speed = player.speed || 5;
      let moved = false;
      
      // Apply movement
      if (movement.up) {
        player.y -= speed;
        moved = true;
      }
      if (movement.down) {
        player.y += speed;
        moved = true;
      }
      if (movement.left) {
        player.x -= speed;
        moved = true;
      }
      if (movement.right) {
        player.x += speed;
        moved = true;
      }
      
      // Add boundary checks
      if (player.x < 0) player.x = 0;
      if (player.y < 0) player.y = 0;
      if (player.x > 2000) player.x = 2000;
      if (player.y > 2000) player.y = 2000;
    }
  }

  onJoin(client, options) {
    console.log(`${client.sessionId} joined ${this.roomType} with options:`, options);
    
    // Create player state
    const player = new PlayerState();
    player.id = client.sessionId;
    player.name = options.name || "Player";
    player.shape = options.shape || "triangle";
    player.x = Math.random() * 400;
    player.y = Math.random() * 400;
    
    // Handle equipped colors if provided
    if (options.equippedColors && Array.isArray(options.equippedColors)) {
      player.equippedColors.clear();
      options.equippedColors.forEach((color, index) => {
        if (index < 4) {
          player.equippedColors.push(color);
        }
      });
    }
    
    // Update average color based on equipped colors
    player.updateAverageColor();
    
    // Add some default values
    player.hp = 100;
    player.maxHp = 100;
    player.attack = 10;
    player.speed = 5;
    player.luck = 1;
    player.level = 1;
    player.gold = 0;
    
    // Add to room state
    this.state.players.set(client.sessionId, player);
    
    // Initialize player movement state
    this.playerMovements.set(client.sessionId, {
      up: false,
      down: false,
      left: false,
      right: false
    });
    
    client.send("welcome", {
      message: `Welcome to the ${this.roomType}!`,
      playerId: client.sessionId
    });
    
    console.log(`Player ${client.sessionId} initialized at position (${player.x}, ${player.y})`);
  }

  onLeave(client, consented) {
    console.log(`${client.sessionId} left ${this.roomType}`);
    
    // Clean up player movement state
    this.playerMovements.delete(client.sessionId);
    
    // Remove from room state
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log(`Room ${this.roomId} (${this.roomType}) disposing...`);
    // Clean up any resources
    this.playerMovements.clear();
  }
}
