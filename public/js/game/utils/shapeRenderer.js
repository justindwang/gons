// public/js/game/utils/shapeRenderer.js

// This utility provides functions to render the various shapes in the game

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

export const ShapeRenderer = {
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
      
      // Heart shape using bezier curves
      graphics.moveTo(0, -10);
      graphics.bezierCurveTo(-10, -20, -20, 0, 0, 10);
      graphics.bezierCurveTo(20, 0, 10, -20, 0, -10);
      
      graphics.endFill();
      return graphics;
    },
    
    star: (color) => {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(color);
      
      // Draw a five-pointed star
      const outerRadius = 15;
      const innerRadius = 7;
      const points = 5;
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * 2 * i) / (points * 2) - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          graphics.moveTo(x, y);
        } else {
          graphics.lineTo(x, y);
        }
      }
      
      graphics.closePath();
      graphics.endFill();
      return graphics;
    },
    
    diamond: (color) => {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(color);
      
      // Draw a diamond shape
      graphics.moveTo(0, -15);
      graphics.lineTo(15, 0);
      graphics.lineTo(0, 15);
      graphics.lineTo(-15, 0);
      
      graphics.closePath();
      graphics.endFill();
      return graphics;
    },
    
    createAttackAnimation: (shape, color, scale = 1) => {
      // Create appropriate attack animation based on shape
      let container = new PIXI.Container();
      let graphic;
      
      switch (shape) {
        case "triangle":
          // Create slash effect
          graphic = new PIXI.Graphics();
          graphic.beginFill(color, 0.7);
          graphic.moveTo(-30, -5);
          graphic.lineTo(30, -15);
          graphic.lineTo(35, 0);
          graphic.lineTo(30, 15);
          graphic.lineTo(-30, 5);
          graphic.closePath();
          graphic.endFill();
          
          // Rotate for slash effect
          graphic.rotation = Math.PI / 4;
          break;
          
        case "square":
          // Create barrier effect
          graphic = new PIXI.Graphics();
          graphic.lineStyle(3, color, 0.8);
          graphic.beginFill(color, 0.3);
          graphic.drawRect(-30, -30, 60, 60);
          graphic.endFill();
          break;
          
        case "heart":
          // Create healing effect
          graphic = ShapeRenderer.heart(color);
          graphic.scale.set(2);
          graphic.alpha = 0.8;
          
          // Add particles
          for (let i = 0; i < 5; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(color, 0.6);
            particle.drawCircle(0, 0, 3);
            particle.endFill();
            
            // Random position around heart
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 15;
            particle.x = Math.cos(angle) * distance;
            particle.y = Math.sin(angle) * distance;
            
            container.addChild(particle);
          }
          break;
          
        case "circle":
        default:
          // Create blast effect
          graphic = new PIXI.Graphics();
          graphic.beginFill(color, 0.5);
          graphic.drawCircle(0, 0, 30);
          graphic.endFill();
          
          // Add inner circle
          const innerCircle = new PIXI.Graphics();
          innerCircle.beginFill(color, 0.8);
          innerCircle.drawCircle(0, 0, 15);
          innerCircle.endFill();
          container.addChild(innerCircle);
          break;
      }
      
      if (graphic) {
        container.addChild(graphic);
      }
      
      container.scale.set(scale);
      return container;
    },
    
    // Factory method to create any shape
    createShape: (shapeName, color, scale = 1) => {
      if (ShapeRenderer[shapeName]) {
        const shape = ShapeRenderer[shapeName](color);
        if (scale !== 1) {
          shape.scale.set(scale);
        }
        return shape;
      }
      
      // Fallback to circle if shape not found
      console.warn(`Shape "${shapeName}" not found, using circle as fallback`);
      return ShapeRenderer.circle(color);
    }
  }