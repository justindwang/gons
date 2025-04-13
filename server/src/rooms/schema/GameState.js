// server/rooms/schema/GameState.js
import { Schema, MapSchema, type } from "@colyseus/schema";
import { PlayerState } from "./PlayerState.js";

export class GameState extends Schema {
  constructor() {
    super();
    
    this.players = new MapSchema();
    this.roomType = "lobby";  // "lobby" or "dungeon"
    this.zoneType = "";       // R, O, Y, G, B, P
    this.zoneLevel = 0;       // Difficulty level
    this.waveNumber = 0;      // Current wave number
    this.gameTime = 0;        // Time elapsed in seconds
  }
}

// Define schema types
type("string")(GameState.prototype, "roomType");
type("string")(GameState.prototype, "zoneType");
type("number")(GameState.prototype, "zoneLevel");
type("number")(GameState.prototype, "waveNumber");
type("number")(GameState.prototype, "gameTime");
type({ map: PlayerState })(GameState.prototype, "players");