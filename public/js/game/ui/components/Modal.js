// public/js/game/ui/components/Modal.js

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { BaseComponent } from './BaseComponent.js';

export class Modal extends BaseComponent {
    constructor(width, height, options = {}) {
        super();
        
        // Default options
        const defaultOptions = {
            backgroundColor: 0x333333,
            backgroundAlpha: 0.9,
            borderRadius: 10,
            title: null,
            titleStyle: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xFFFFFF
            },
            closeButton: true,
            closeButtonColor: 0xFF5555,
            onClose: null
        };
        
        // Merge options
        this.options = { ...defaultOptions, ...options };
        
        // Create background
        this.background = new PIXI.Graphics();
        this.background.beginFill(this.options.backgroundColor, this.options.backgroundAlpha);
        this.background.drawRoundedRect(0, 0, width, height, this.options.borderRadius);
        this.background.endFill();
        this.container.addChild(this.background);
        
        // Add title if provided
        if (this.options.title) {
            this.titleText = new PIXI.Text(this.options.title, this.options.titleStyle);
            this.titleText.x = 20;
            this.titleText.y = 20;
            this.container.addChild(this.titleText);
        }
        
        // Add close button if enabled
        if (this.options.closeButton) {
            this.closeBtn = new PIXI.Graphics();
            this.closeBtn.beginFill(this.options.closeButtonColor);
            this.closeBtn.drawRoundedRect(0, 0, 30, 30, 5);
            this.closeBtn.endFill();
            this.closeBtn.x = width - 40;
            this.closeBtn.y = 10;
            this.closeBtn.interactive = true;
            this.closeBtn.buttonMode = true;
            
            const closeX = new PIXI.Text("X", {
                fontFamily: "Arial",
                fontSize: 16,
                fill: 0xFFFFFF
            });
            closeX.x = 10;
            closeX.y = 5;
            this.closeBtn.addChild(closeX);
            
            this.closeBtn.on("pointerdown", () => {
                if (this.options.onClose) {
                    this.options.onClose();
                }
            });
            
            this.container.addChild(this.closeBtn);
        }
        
        // Store dimensions
        this.width = width;
        this.height = height;
    }
    
    setTitle(title) {
        if (this.titleText) {
            this.titleText.text = title;
        } else if (title) {
            this.titleText = new PIXI.Text(title, this.options.titleStyle);
            this.titleText.x = 20;
            this.titleText.y = 20;
            this.container.addChild(this.titleText);
        }
        return this;
    }
    
    centerOnScreen(app) {
        this.container.x = (app.screen.width - this.width) / 2;
        this.container.y = (app.screen.height - this.height) / 2;
        return this;
    }
    
    onClose(callback) {
        this.options.onClose = callback;
        return this;
    }
}
