// public/js/game/ui/components/SettingsMenu.js

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { Modal } from './Modal.js';
import { PixiTextInput } from './TextInput.js';

export class SettingsMenu extends Modal {
    constructor(app, onClose) {
        super(400, 350, {
            backgroundColor: 0x336633,
            backgroundAlpha: 0.9,
            title: "Settings",
            onClose: onClose
        });
        
        this.app = app;
        this.initSettings();
    }
    
    initSettings() {
        // Player name setting
        const nameText = new PIXI.Text("Player Name:", {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xFFFFFF
        });
        nameText.x = 20;
        nameText.y = 70;
        this.container.addChild(nameText);
        
        // Get current player name from localStorage
        const currentName = localStorage.getItem('playerName') || "You";
        
        // Create text input for player name
        this.nameInput = new PixiTextInput(200, 30, currentName);
        this.nameInput.setPosition(180, 65);
        this.container.addChild(this.nameInput.container);
        
        // Music volume setting
        const musicText = new PIXI.Text("Music Volume:", {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xFFFFFF
        });
        musicText.x = 20;
        musicText.y = 120;
        this.container.addChild(musicText);
        
        // Music volume slider
        this.musicSlider = this.createSlider(200, 20, 0.7);
        this.musicSlider.x = 180;
        this.musicSlider.y = 120;
        this.container.addChild(this.musicSlider);
        
        // Sound effects setting
        const sfxText = new PIXI.Text("SFX Volume:", {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xFFFFFF
        });
        sfxText.x = 20;
        sfxText.y = 160;
        this.container.addChild(sfxText);
        
        // SFX volume slider
        this.sfxSlider = this.createSlider(200, 20, 0.9);
        this.sfxSlider.x = 180;
        this.sfxSlider.y = 160;
        this.container.addChild(this.sfxSlider);
        
        // Full screen option
        const fullscreenText = new PIXI.Text("Fullscreen:", {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xFFFFFF
        });
        fullscreenText.x = 20;
        fullscreenText.y = 200;
        this.container.addChild(fullscreenText);
        
        // Fullscreen toggle
        this.fullscreenToggle = this.createToggle(40, 20, false);
        this.fullscreenToggle.x = 180;
        this.fullscreenToggle.y = 200;
        this.fullscreenToggle.interactive = true;
        this.fullscreenToggle.buttonMode = true;
        this.fullscreenToggle.on("pointerdown", () => {
            this.toggleFullscreen();
        });
        this.container.addChild(this.fullscreenToggle);
        
        // Save button
        const saveBtn = new PIXI.Graphics();
        saveBtn.beginFill(0x44AA44);
        saveBtn.drawRoundedRect(0, 0, 120, 40, 5);
        saveBtn.endFill();
        saveBtn.x = 140;
        saveBtn.y = 270;
        saveBtn.interactive = true;
        saveBtn.buttonMode = true;
        saveBtn.on("pointerdown", () => {
            this.saveSettings();
        });
        
        const saveText = new PIXI.Text("Save", {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xFFFFFF
        });
        saveText.x = (120 - saveText.width) / 2;
        saveText.y = (40 - saveText.height) / 2;
        saveBtn.addChild(saveText);
        
        this.container.addChild(saveBtn);
    }
    
    createSlider(width, height, value = 0.5) {
        const container = new PIXI.Container();
        
        // Track
        const track = new PIXI.Graphics();
        track.beginFill(0x666666);
        track.drawRoundedRect(0, 0, width, height, height / 2);
        track.endFill();
        container.addChild(track);
        
        // Handle
        const handle = new PIXI.Graphics();
        handle.beginFill(0xFFFFFF);
        handle.drawCircle(0, 0, height * 0.7);
        handle.endFill();
        handle.x = width * value;
        handle.y = height / 2;
        container.addChild(handle);
        
        // Make interactive
        container.interactive = true;
        container.buttonMode = true;
        
        container.on("pointerdown", (event) => {
            const bounds = track.getBounds();
            const newX = Math.max(0, Math.min(width, event.data.global.x - bounds.x));
            handle.x = newX;
            
            // Calculate new value (0-1)
            const newValue = newX / width;
            container.value = newValue;
        });
        
        // Store value
        container.value = value;
        
        return container;
    }
    
    createToggle(width, height, value = false) {
        const container = new PIXI.Container();
        
        // Track
        const track = new PIXI.Graphics();
        track.beginFill(value ? 0x44AA44 : 0x666666);
        track.drawRoundedRect(0, 0, width, height, height / 2);
        track.endFill();
        container.addChild(track);
        
        // Handle
        const handle = new PIXI.Graphics();
        handle.beginFill(0xFFFFFF);
        handle.drawCircle(0, 0, height * 0.8);
        handle.endFill();
        handle.x = value ? width - (height / 2) : height / 2;
        handle.y = height / 2;
        container.addChild(handle);
        
        // Toggle state
        container.value = value;
        
        // Make interactive
        container.interactive = true;
        container.buttonMode = true;
        
        container.on("pointerdown", () => {
            container.value = !container.value;
            
            // Update visuals
            track.clear();
            track.beginFill(container.value ? 0x44AA44 : 0x666666);
            track.drawRoundedRect(0, 0, width, height, height / 2);
            track.endFill();
            
            handle.x = container.value ? width - (height / 2) : height / 2;
        });
        
        return container;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    saveSettings() {
        // Save player name
        const newPlayerName = this.nameInput.text;
        if (newPlayerName && newPlayerName.trim() !== "") {
            localStorage.setItem('playerName', newPlayerName);
            
            // If we're connected to a room, we should update the server
            if (window.currentRoom) {
                window.currentRoom.send("updateName", { name: newPlayerName });
            }
            
            // Show notification (this will be handled by the UIManager)
            if (this.options.onSave) {
                this.options.onSave({
                    playerName: newPlayerName,
                    musicVolume: this.musicSlider.value,
                    sfxVolume: this.sfxSlider.value,
                    fullscreen: this.fullscreenToggle.value
                });
            }
        }
        
        // Close settings menu
        if (this.options.onClose) {
            this.options.onClose();
        }
    }
    
    onSave(callback) {
        this.options.onSave = callback;
        return this;
    }
    
    destroy() {
        // Clean up text input
        this.nameInput.destroy();
        super.destroy();
    }
}
