// server/rooms/schema/PlayerState.js
import { Schema, ArraySchema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
  constructor() {
    super();
    
    // Basic properties
    this.id = "";
    this.name = "Player";     // Player name
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
    
    // Initialize with some default colors
    this.equippedColors.push("#FF5555"); // Red
    this.equippedColors.push("#55FF55"); // Green
    this.equippedColors.push("#5555FF"); // Blue
    this.equippedColors.push("#FFFF55"); // Yellow
    
    // Update color based on equipped colors
    this.updateAverageColor();
  }
  
  // Calculate the average color from equipped colors
  updateAverageColor() {
    if (this.equippedColors.length === 0) {
      this.color = "#FFFFFF"; // Default white if no colors equipped
      return;
    }
    
    let r = 0, g = 0, b = 0;
    let count = 0;
    
    // Sum up RGB components
    for (const colorHex of this.equippedColors) {
      if (!colorHex || typeof colorHex !== 'string') continue;
      
      // Parse hex color to RGB
      const hex = colorHex.replace('#', '');
      if (hex.length !== 6) continue;
      
      try {
        const bigint = parseInt(hex, 16);
        r += (bigint >> 16) & 255;
        g += (bigint >> 8) & 255;
        b += bigint & 255;
        count++;
      } catch (e) {
        console.error("Error parsing color:", e);
      }
    }
    
    // Calculate average
    if (count > 0) {
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      
      // Convert back to hex
      this.color = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    } else {
      this.color = "#FFFFFF"; // Default white if no valid colors
    }
  }
  
  // Set a specific equipped color slot
  setEquippedColor(index, color) {
    if (index >= 0 && index < 4) {
      // Ensure we have enough slots
      while (this.equippedColors.length <= index) {
        this.equippedColors.push("#FFFFFF");
      }
      
      this.equippedColors[index] = color;
      this.updateAverageColor();
    }
  }
}

// Define schema types
type("string")(PlayerState.prototype, "id");
type("string")(PlayerState.prototype, "name");
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
