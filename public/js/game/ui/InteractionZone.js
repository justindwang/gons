// public/js/game/ui/InteractionZone.js
import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.1/+esm';

export class InteractionZone extends PIXI.Container {
    constructor(x, y, radius, promptText, onInteract) {
      super();
      
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.promptText = promptText;
      this.onInteract = onInteract;
      this.isPlayerInside = false;
      
      // Create visual indicator (hidden by default)
      this.indicator = new PIXI.Container();
      this.indicator.visible = false;
      this.addChild(this.indicator);
      
      // Circle indicator
      const circle = new PIXI.Graphics();
      circle.beginFill(0xFFFFFF, 0.1);
      circle.drawCircle(0, 0, radius);
      circle.endFill();
      this.indicator.addChild(circle);
      
      // Prompt text
      this.prompt = new PIXI.Text(promptText, {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF,
        stroke: 0x000000,
        strokeThickness: 4,
        align: "center"
      });
      this.prompt.anchor.set(0.5);
      this.prompt.y = -radius - 20;
      this.indicator.addChild(this.prompt);
      
      // Key indicator
      const keyBackground = new PIXI.Graphics();
      keyBackground.beginFill(0xFFFFFF);
      keyBackground.drawRoundedRect(-15, -15, 30, 30, 5);
      keyBackground.endFill();
      
      const keyText = new PIXI.Text("E", {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0x000000,
        fontWeight: "bold"
      });
      keyText.anchor.set(0.5);
      
      const keyIndicator = new PIXI.Container();
      keyIndicator.addChild(keyBackground);
      keyIndicator.addChild(keyText);
      keyIndicator.y = -radius - 60;
      
      this.indicator.addChild(keyIndicator);
      
      // Listen for keyboard events
      window.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    
    handleKeyDown(event) {
      if (event.code === "KeyE" && this.isPlayerInside) {
        if (this.onInteract) {
          this.onInteract();
        }
      }
    }
    
    isPlayerInRange(playerX, playerY) {
      const dx = this.x - playerX;
      const dy = this.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance <= this.radius;
    }
    
    checkPlayerProximity(playerX, playerY) {
      const wasInside = this.isPlayerInside;
      this.isPlayerInside = this.isPlayerInRange(playerX, playerY);
      
      // Show/hide indicator based on proximity
      if (this.isPlayerInside !== wasInside) {
        // Set visibility immediately to ensure it shows up
        this.indicator.visible = this.isPlayerInside;
        
        if (this.isPlayerInside) {
          // Reset alpha and animate in
          this.indicator.alpha = 0;
          gsap.to(this.indicator, {
            alpha: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          
          // Start key bounce animation
          this.startKeyAnimation();
        } else {
          // Animate out
          gsap.to(this.indicator, {
            alpha: 0,
            duration: 0.2,
            onComplete: () => {
              this.indicator.visible = false;
            }
          });
          
          // Stop key animation
          gsap.killTweensOf(this.indicator.children[2]);
        }
      } else if (this.isPlayerInside) {
        // Ensure indicator is visible when player is inside
        this.indicator.visible = true;
        this.indicator.alpha = 1;
      }
    }
    
    startKeyAnimation() {
      // Kill any existing animations to prevent stacking
      gsap.killTweensOf(this.indicator.children[2]);
      
      // Reset position before starting animation
      this.indicator.children[2].y = -this.radius - 60;
      
      // Start bounce animation
      gsap.to(this.indicator.children[2], {
        y: -this.radius - 50,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
        repeat: -1,
        yoyo: true
      });
    }
    
    triggerInteraction() {
        if (this.onInteract) {
            this.onInteract();
        }
    }
  }
