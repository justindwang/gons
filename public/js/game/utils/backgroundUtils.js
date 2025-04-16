// public/js/game/utils/backgroundUtils.js

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

// Creates a grid background for the game world
export function createBackgroundGrid(width, height, cellSize, color = 0xDDDDDD) {
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
    return container;
  }
  
  // Creates a parallax background with floating shapes
  export function createParallaxBackground(width, height, options = {}) {
    const container = new PIXI.Container();
    
    // Default options
    const defaultOptions = {
      layerCount: 3,
      shapeCount: 30,
      colors: [0xFF5555, 0x55FF55, 0x5555FF, 0xFFFF55, 0xFF55FF, 0x55FFFF],
      shapes: ['triangle', 'square', 'circle', 'heart', 'star', 'diamond'],
      baseAlpha: 0.2,
      baseScale: 1.0
    };
    
    // Merge options
    const config = { ...defaultOptions, ...options };
    
    // Create layers
    for (let layer = 0; layer < config.layerCount; layer++) {
      const layerContainer = new PIXI.Container();
      container.addChild(layerContainer);
      
      // Layer properties
      const layerDepth = layer / config.layerCount;
      const layerAlpha = config.baseAlpha * (1 - layerDepth * 0.5);
      const layerScale = config.baseScale * (0.5 + layerDepth * 0.5);
      
      // Create shapes for this layer
      const shapesPerLayer = Math.ceil(config.shapeCount / config.layerCount);
      
      for (let i = 0; i < shapesPerLayer; i++) {
        // Randomly select shape and color
        const shapeType = config.shapes[Math.floor(Math.random() * config.shapes.length)];
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        
        // Create shape
        let shape;
        
        // Use the ShapeRenderer to create the shape
        // This assumes ShapeRenderer is imported or available globally
        if (window.ShapeRenderer && window.ShapeRenderer[shapeType]) {
          shape = window.ShapeRenderer[shapeType](color);
        } else {
          // Fallback shape creation if ShapeRenderer isn't available
          shape = new PIXI.Graphics();
          shape.beginFill(color);
          
          switch (shapeType) {
            case 'triangle':
              shape.moveTo(0, -15);
              shape.lineTo(-13, 10);
              shape.lineTo(13, 10);
              shape.closePath();
              break;
              
            case 'square':
              shape.drawRect(-12, -12, 24, 24);
              break;
              
            case 'circle':
            default:
              shape.drawCircle(0, 0, 15);
              break;
          }
          
          shape.endFill();
        }
        
        // Random position within bounds
        shape.x = Math.random() * width;
        shape.y = Math.random() * height;
        
        // Apply layer properties
        shape.alpha = layerAlpha;
        shape.scale.set(layerScale * (0.5 + Math.random() * 0.5));
        
        // Store original position for parallax effect
        shape._originalX = shape.x;
        shape._originalY = shape.y;
        shape._parallaxFactor = 1 - layerDepth;
        
        // Add to layer
        layerContainer.addChild(shape);
      }
    }
    
    // Add parallax update method
    container.updateParallax = (cameraX, cameraY) => {
      // Update each layer based on camera position
      for (let i = 0; i < container.children.length; i++) {
        const layer = container.children[i];
        
        // Update each shape in the layer
        for (let j = 0; j < layer.children.length; j++) {
          const shape = layer.children[j];
          
          // Apply parallax movement
          shape.x = shape._originalX - (cameraX * shape._parallaxFactor);
          shape.y = shape._originalY - (cameraY * shape._parallaxFactor);
          
          // Wrap around if out of bounds
          if (shape.x < -50) shape.x = width + 50;
          if (shape.x > width + 50) shape.x = -50;
          if (shape.y < -50) shape.y = height + 50;
          if (shape.y > height + 50) shape.y = -50;
        }
      }
    };
    
    return container;
  }
  
  // Creates a simple color gradient background
  export function createGradientBackground(width, height, colors) {
    const container = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    
    // Default colors if not provided
    if (!colors || !colors.length) {
      colors = [0x000033, 0x000066];
    }
    
    // If only one color provided, add a slightly darker variant
    if (colors.length === 1) {
      const color = colors[0];
      const r = (color >> 16) & 0xFF;
      const g = (color >> 8) & 0xFF;
      const b = color & 0xFF;
      
      const darkerColor = (
        Math.max(0, r - 40) << 16 |
        Math.max(0, g - 40) << 8 |
        Math.max(0, b - 40)
      );
      
      colors.push(darkerColor);
    }
    
    // Create gradient
    if (colors.length === 2) {
      // Simple top-to-bottom gradient
      const gradient = graphics.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      
      graphics.beginTextureFill({ gradient });
      graphics.drawRect(0, 0, width, height);
      graphics.endFill();
    } else {
      // Multi-color gradient
      const segmentHeight = height / (colors.length - 1);
      
      for (let i = 0; i < colors.length - 1; i++) {
        const gradient = graphics.createLinearGradient(
          0, i * segmentHeight, 
          0, (i + 1) * segmentHeight
        );
        
        gradient.addColorStop(0, colors[i]);
        gradient.addColorStop(1, colors[i + 1]);
        
        graphics.beginTextureFill({ gradient });
        graphics.drawRect(0, i * segmentHeight, width, segmentHeight);
        graphics.endFill();
      }
    }
    
    container.addChild(graphics);
    return container;
  }