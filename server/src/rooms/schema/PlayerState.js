// server/rooms/schema/PlayerState.js
import { Schema, ArraySchema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
  constructor() {
    super();
    
    // Basic properties
    this.id = "";
    this.shape = "triangle";  // Default shape
    this.color = "#FFFFFF";   // Default color
    this.x = 0;
    this.y = 0;
    
    // Stats
    this.hp = 100;
    this.maxHp = 100;
    this.attack = 10;
    this.speed = 5;
    this.luck = 1;
    this.recovery = 0;
    this.level = 1;
    this.gold = 0;
    
    // Equipment
    this.equippedColors = new ArraySchema();
  }
}

// Define schema types
type("string")(PlayerState.prototype, "id");
type("string")(PlayerState.prototype, "shape");
type("string")(PlayerState.prototype, "color");
type("number")(PlayerState.prototype, "x");
type("number")(PlayerState.prototype, "y");
type("number")(PlayerState.prototype, "hp");
type("number")(PlayerState.prototype, "maxHp");
type("number")(PlayerState.prototype, "attack");
type("number")(PlayerState.prototype, "speed");
type("number")(PlayerState.prototype, "luck");
type("number")(PlayerState.prototype, "recovery");
type("number")(PlayerState.prototype, "level");
type("number")(PlayerState.prototype, "gold");
type(["string"])(PlayerState.prototype, "equippedColors");