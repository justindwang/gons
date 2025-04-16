// public/js/game/ui/UiManager.js

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

export class UiManager {
    constructor(app) {
      this.app = app;
      
      // Create UI container (fixed position, not affected by camera)
      this.container = new PIXI.Container();
      this.app.stage.addChild(this.container);
      
      // Track active modals
      this.activeModals = new Set();
      
      // Create overlay for modal backgrounds
      this.overlay = new PIXI.Graphics();
      this.overlay.beginFill(0x000000, 0.5);
      this.overlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
      this.overlay.endFill();
      this.overlay.visible = false;
      this.container.addChild(this.overlay);
      
      // Create notification area
      this.notificationContainer = new PIXI.Container();
      this.notificationContainer.x = 10;
      this.notificationContainer.y = 10;
      this.container.addChild(this.notificationContainer);
      
      // Initialize menus
      this.initInventoryMenu();
      this.initStoreMenu();
      this.initSettingsMenu();
    }
    
    initInventoryMenu() {
      // Create inventory menu (hidden by default)
      this.inventoryMenu = new PIXI.Container();
      this.inventoryMenu.visible = false;
      this.container.addChild(this.inventoryMenu);
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(0x333333, 0.9);
      bg.drawRoundedRect(0, 0, 600, 400, 10);
      bg.endFill();
      this.inventoryMenu.addChild(bg);
      
      // Title
      const title = new PIXI.Text("Inventory", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xFFFFFF
      });
      title.x = 20;
      title.y = 20;
      this.inventoryMenu.addChild(title);
      
      // Close button
      const closeBtn = new PIXI.Graphics();
      closeBtn.beginFill(0xFF5555);
      closeBtn.drawRoundedRect(0, 0, 30, 30, 5);
      closeBtn.endFill();
      closeBtn.x = 560;
      closeBtn.y = 10;
      closeBtn.interactive = true;
      closeBtn.buttonMode = true;
      closeBtn.on("pointerdown", () => this.toggleInventoryMenu());
      
      const closeX = new PIXI.Text("X", {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF
      });
      closeX.x = 10;
      closeX.y = 5;
      closeBtn.addChild(closeX);
      
      this.inventoryMenu.addChild(closeBtn);
      
      // Add shapes section
      const shapesTitle = new PIXI.Text("Shapes:", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      shapesTitle.x = 20;
      shapesTitle.y = 70;
      this.inventoryMenu.addChild(shapesTitle);
      
      // Add colors section
      const colorsTitle = new PIXI.Text("Colors:", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      colorsTitle.x = 20;
      colorsTitle.y = 200;
      this.inventoryMenu.addChild(colorsTitle);
      
      // Add placeholder for shapes and colors (will be populated dynamically)
      const shapesContainer = new PIXI.Container();
      shapesContainer.x = 20;
      shapesContainer.y = 100;
      this.inventoryMenu.addChild(shapesContainer);
      
      const colorsContainer = new PIXI.Container();
      colorsContainer.x = 20;
      colorsContainer.y = 230;
      this.inventoryMenu.addChild(colorsContainer);
      
      // Center the menu
      this.inventoryMenu.x = (this.app.screen.width - this.inventoryMenu.width) / 2;
      this.inventoryMenu.y = (this.app.screen.height - this.inventoryMenu.height) / 2;
    }
    
    initStoreMenu() {
      // Create store menu (hidden by default)
      this.storeMenu = new PIXI.Container();
      this.storeMenu.visible = false;
      this.container.addChild(this.storeMenu);
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(0x333366, 0.9);
      bg.drawRoundedRect(0, 0, 600, 400, 10);
      bg.endFill();
      this.storeMenu.addChild(bg);
      
      // Title
      const title = new PIXI.Text("Store", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xFFFFFF
      });
      title.x = 20;
      title.y = 20;
      this.storeMenu.addChild(title);
      
      // Close button
      const closeBtn = new PIXI.Graphics();
      closeBtn.beginFill(0xFF5555);
      closeBtn.drawRoundedRect(0, 0, 30, 30, 5);
      closeBtn.endFill();
      closeBtn.x = 560;
      closeBtn.y = 10;
      closeBtn.interactive = true;
      closeBtn.buttonMode = true;
      closeBtn.on("pointerdown", () => this.toggleStoreMenu());
      
      const closeX = new PIXI.Text("X", {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF
      });
      closeX.x = 10;
      closeX.y = 5;
      closeBtn.addChild(closeX);
      
      this.storeMenu.addChild(closeBtn);
      
      // Add tabs for Store
      const storeTab = this.createTab("Store", 150, 60);
      storeTab.x = 20;
      storeTab.y = 60;
      storeTab.interactive = true;
      storeTab.buttonMode = true;
      storeTab.on("pointerdown", () => {
        console.log("Store tab clicked");
        // Handle tab switch
      });
      this.storeMenu.addChild(storeTab);
      
      const gachaTab = this.createTab("Gacha", 150, 60, false);
      gachaTab.x = 180;
      gachaTab.y = 60;
      gachaTab.interactive = true;
      gachaTab.buttonMode = true;
      gachaTab.on("pointerdown", () => {
        console.log("Gacha tab clicked");
        // Handle tab switch
      });
      this.storeMenu.addChild(gachaTab);
      
      // Placeholder for store content
      const storeContent = new PIXI.Container();
      storeContent.x = 20;
      storeContent.y = 130;
      
      // Add some sample items
      const item1 = this.createStoreItem("Beginner Pack", "100 gold", 0x22CC22);
      storeContent.addChild(item1);
      
      const item2 = this.createStoreItem("Color Pack", "250 gold", 0xCC22CC);
      item2.y = 80;
      storeContent.addChild(item2);
      
      const item3 = this.createStoreItem("Shape Pack", "300 gold", 0x2222CC);
      item3.y = 160;
      storeContent.addChild(item3);
      
      this.storeMenu.addChild(storeContent);
      
      // Center the menu
      this.storeMenu.x = (this.app.screen.width - this.storeMenu.width) / 2;
      this.storeMenu.y = (this.app.screen.height - this.storeMenu.height) / 2;
    }
    
    createTab(label, width, height, active = true) {
      const tab = new PIXI.Container();
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(active ? 0x5555AA : 0x444488);
      bg.drawRoundedRect(0, 0, width, height, {tl: 5, tr: 5, bl: 0, br: 0});
      bg.endFill();
      tab.addChild(bg);
      
      // Label
      const text = new PIXI.Text(label, {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      text.x = (width - text.width) / 2;
      text.y = (height - text.height) / 2;
      tab.addChild(text);
      
      return tab;
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
        console.log(`Slider value: ${newValue}`);
      });
      
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
        
        console.log(`Toggle value: ${container.value}`);
      });
      
      return container;
    }
    
    createStoreItem(name, price, color) {
      const item = new PIXI.Container();
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(0x444444);
      bg.drawRoundedRect(0, 0, 560, 70, 5);
      bg.endFill();
      item.addChild(bg);
      
      // Color indicator
      const colorCircle = new PIXI.Graphics();
      colorCircle.beginFill(color);
      colorCircle.drawCircle(0, 0, 20);
      colorCircle.endFill();
      colorCircle.x = 35;
      colorCircle.y = 35;
      item.addChild(colorCircle);
      
      // Name
      const nameText = new PIXI.Text(name, {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      nameText.x = 70;
      nameText.y = 15;
      item.addChild(nameText);
      
      // Price
      const priceText = new PIXI.Text(price, {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFDD44
      });
      priceText.x = 70;
      priceText.y = 40;
      item.addChild(priceText);
      
      // Buy button
      const buyBtn = new PIXI.Graphics();
      buyBtn.beginFill(0x44AA44);
      buyBtn.drawRoundedRect(0, 0, 80, 40, 5);
      buyBtn.endFill();
      buyBtn.x = 470;
      buyBtn.y = 15;
      buyBtn.interactive = true;
      buyBtn.buttonMode = true;
      buyBtn.on("pointerdown", () => {
        console.log(`Buying ${name}`);
        // Handle purchase
      });
      
      const buyText = new PIXI.Text("Buy", {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF
      });
      buyText.x = (80 - buyText.width) / 2;
      buyText.y = (40 - buyText.height) / 2;
      buyBtn.addChild(buyText);
      
      item.addChild(buyBtn);
      
      return item;
    }
    
    initSettingsMenu() {
      // Create settings menu (hidden by default)
      this.settingsMenu = new PIXI.Container();
      this.settingsMenu.visible = false;
      this.container.addChild(this.settingsMenu);
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(0x336633, 0.9);
      bg.drawRoundedRect(0, 0, 400, 300, 10);
      bg.endFill();
      this.settingsMenu.addChild(bg);
      
      // Title
      const title = new PIXI.Text("Settings", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xFFFFFF
      });
      title.x = 20;
      title.y = 20;
      this.settingsMenu.addChild(title);
      
      // Close button
      const closeBtn = new PIXI.Graphics();
      closeBtn.beginFill(0xFF5555);
      closeBtn.drawRoundedRect(0, 0, 30, 30, 5);
      closeBtn.endFill();
      closeBtn.x = 360;
      closeBtn.y = 10;
      closeBtn.interactive = true;
      closeBtn.buttonMode = true;
      closeBtn.on("pointerdown", () => this.toggleSettingsMenu());
      
      const closeX = new PIXI.Text("X", {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF
      });
      closeX.x = 10;
      closeX.y = 5;
      closeBtn.addChild(closeX);
      
      this.settingsMenu.addChild(closeBtn);
      
      // Add some settings
      const musicText = new PIXI.Text("Music Volume:", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      musicText.x = 20;
      musicText.y = 70;
      this.settingsMenu.addChild(musicText);
      
      // Music volume slider
      const musicSlider = this.createSlider(200, 20, 0.7);
      musicSlider.x = 180;
      musicSlider.y = 70;
      this.settingsMenu.addChild(musicSlider);
      
      // Sound effects
      const sfxText = new PIXI.Text("SFX Volume:", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      sfxText.x = 20;
      sfxText.y = 110;
      this.settingsMenu.addChild(sfxText);
      
      // SFX volume slider
      const sfxSlider = this.createSlider(200, 20, 0.9);
      sfxSlider.x = 180;
      sfxSlider.y = 110;
      this.settingsMenu.addChild(sfxSlider);
      
      // Full screen option
      const fullscreenText = new PIXI.Text("Fullscreen:", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      fullscreenText.x = 20;
      fullscreenText.y = 150;
      this.settingsMenu.addChild(fullscreenText);
      
      // Fullscreen toggle
      const fullscreenToggle = this.createToggle(40, 20, false);
      fullscreenToggle.x = 180;
      fullscreenToggle.y = 150;
      fullscreenToggle.interactive = true;
      fullscreenToggle.buttonMode = true;
      fullscreenToggle.on("pointerdown", () => {
        console.log("Fullscreen toggle clicked");
        // Handle fullscreen toggle
        this.toggleFullscreen();
      });
      this.settingsMenu.addChild(fullscreenToggle);
      
      // Save button
      const saveBtn = new PIXI.Graphics();
      saveBtn.beginFill(0x44AA44);
      saveBtn.drawRoundedRect(0, 0, 120, 40, 5);
      saveBtn.endFill();
      saveBtn.x = 140;
      saveBtn.y = 220;
      saveBtn.interactive = true;
      saveBtn.buttonMode = true;
      saveBtn.on("pointerdown", () => {
        console.log("Save settings");
        // Save settings
        this.toggleSettingsMenu();
      });
      
      const saveText = new PIXI.Text("Save", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xFFFFFF
      });
      saveText.x = (120 - saveText.width) / 2;
      saveText.y = (40 - saveText.height) / 2;
      saveBtn.addChild(saveText);
      
      this.settingsMenu.addChild(saveBtn);
      
      // Center the menu
      this.settingsMenu.x = (this.app.screen.width - this.settingsMenu.width) / 2;
      this.settingsMenu.y = (this.app.screen.height - this.settingsMenu.height) / 2;
    }
    
    showZoneSelectionModal(onZoneSelected) {
      console.log("Opening zone selection modal");
      
      // Check if a zone selection modal is already open
      for (const modal of this.activeModals) {
        if (modal._isZoneSelectionModal) {
          console.log("Zone selection modal already open, not creating another one");
          return;
        }
      }
      
      // Create zone selection modal
      const modal = new PIXI.Container();
      modal._isZoneSelectionModal = true;
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(0x333333, 0.9);
      bg.drawRoundedRect(0, 0, 500, 400, 10);
      bg.endFill();
      modal.addChild(bg);
      
      // Title
      const title = new PIXI.Text("Select Zone", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xFFFFFF
      });
      title.x = 20;
      title.y = 20;
      modal.addChild(title);
      
      // Close button
      const closeBtn = new PIXI.Graphics();
      closeBtn.beginFill(0xFF5555);
      closeBtn.drawRoundedRect(0, 0, 30, 30, 5);
      closeBtn.endFill();
      closeBtn.x = 460;
      closeBtn.y = 10;
      closeBtn.interactive = true;
      closeBtn.buttonMode = true;
      closeBtn.on("pointerdown", () => {
        this.closeModal(modal);
      });
      
      const closeX = new PIXI.Text("X", {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF
      });
      closeX.x = 10;
      closeX.y = 5;
      closeBtn.addChild(closeX);
      
      modal.addChild(closeBtn);
      
      // Zone types (R, O, Y, G, B, P)
      const zoneTypes = [
        { name: "R", color: 0xFF0000, description: "Red Zone" },
        { name: "O", color: 0xFF8800, description: "Orange Zone" },
        { name: "Y", color: 0xFFFF00, description: "Yellow Zone" },
        { name: "G", color: 0x00FF00, description: "Green Zone" },
        { name: "B", color: 0x0000FF, description: "Blue Zone" },
        { name: "P", color: 0xFF00FF, description: "Purple Zone" },
      ];
      
      // Create zone selection grid
      const zoneGrid = new PIXI.Container();
      zoneGrid.x = 20;
      zoneGrid.y = 70;
      
      // Create buttons for each zone
      zoneTypes.forEach((zone, index) => {
        const zoneBtn = new PIXI.Container();
        
        // Position in grid (3x2)
        const col = index % 3;
        const row = Math.floor(index / 3);
        zoneBtn.x = col * 150;
        zoneBtn.y = row * 150;
        
        // Background
        const zoneBg = new PIXI.Graphics();
        zoneBg.beginFill(zone.color, 0.7);
        zoneBg.drawRoundedRect(0, 0, 130, 130, 10);
        zoneBg.endFill();
        zoneBtn.addChild(zoneBg);
        
        // Zone name
        const zoneName = new PIXI.Text(zone.name, {
          fontFamily: "Arial",
          fontSize: 48,
          fill: 0xFFFFFF,
          fontWeight: "bold"
        });
        zoneName.x = (130 - zoneName.width) / 2;
        zoneName.y = 20;
        zoneBtn.addChild(zoneName);
        
        // Zone description
        const zoneDesc = new PIXI.Text(zone.description, {
          fontFamily: "Arial",
          fontSize: 14,
          fill: 0xFFFFFF
        });
        zoneDesc.x = (130 - zoneDesc.width) / 2;
        zoneDesc.y = 80;
        zoneBtn.addChild(zoneDesc);
        
        // Make interactive
        zoneBtn.interactive = true;
        zoneBtn.buttonMode = true;
        zoneBtn.on("pointerdown", () => {
          console.log(`Selected zone: ${zone.name}`);
          
          // Show difficulty selection
          this.showDifficultySelection(modal, zone, onZoneSelected);
        });
        
        zoneGrid.addChild(zoneBtn);
      });
      
      modal.addChild(zoneGrid);
      
      // Show modal
      this.showModal(modal);
    }
    
    toggleInventoryMenu() {
      if (this.inventoryMenu.visible) {
        this.closeModal(this.inventoryMenu);
      } else {
        this.showModal(this.inventoryMenu);
      }
    }
    
    toggleStoreMenu() {
      if (this.storeMenu.visible) {
        this.closeModal(this.storeMenu);
      } else {
        this.showModal(this.storeMenu);
      }
    }
    
    toggleSettingsMenu() {
      if (this.settingsMenu.visible) {
        this.closeModal(this.settingsMenu);
      } else {
        this.showModal(this.settingsMenu);
      }
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
    
    showModal(modal) {
      // Show overlay
      this.overlay.visible = true;
      this.overlay.width = this.app.screen.width;
      this.overlay.height = this.app.screen.height;
      
      // Make sure modal is added to the container if it's not already
      if (!this.container.children.includes(modal)) {
        this.container.addChild(modal);
      }
      
      // Center and show modal
      modal.visible = true;
      
      // Keep track of active modal
      this.activeModals.add(modal);
      
      // Center on screen (if not already positioned)
      if (!modal._positionSet) {
        modal.x = (this.app.screen.width - modal.width) / 2;
        modal.y = (this.app.screen.height - modal.height) / 2;
        modal._positionSet = true;
      }
      
      // Ensure modal is on top
      this.container.setChildIndex(modal, this.container.children.length - 1);
      
      // Log for debugging
      console.log(`Modal shown: ${modal._isZoneSelectionModal ? 'Zone Selection' : 'Other'} at position ${modal.x},${modal.y}`);
    }
    
    closeModal(modal) {
      // Hide modal
      modal.visible = false;
      
      // Remove from active modals
      this.activeModals.delete(modal);
      
      // Hide overlay if no active modals
      if (this.activeModals.size === 0) {
        this.overlay.visible = false;
      }
    }
    
    showNotification(message, duration = 3000) {
      // Clear existing notifications
      while (this.notificationContainer.children.length > 0) {
        this.notificationContainer.removeChildAt(0);
      }
      
      // Create notification
      const notification = new PIXI.Container();
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(0x333333, 0.8);
      bg.drawRoundedRect(0, 0, 300, 50, 5);
      bg.endFill();
      notification.addChild(bg);
      
      // Message
      const text = new PIXI.Text(message, {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF,
        wordWrap: true,
        wordWrapWidth: 280
      });
      text.x = 10;
      text.y = (50 - text.height) / 2;
      notification.addChild(text);
      
      // Add to container
      this.notificationContainer.addChild(notification);
      
      // Auto-remove after duration
      setTimeout(() => {
        if (this.notificationContainer.children.includes(notification)) {
          this.notificationContainer.removeChild(notification);
        }
      }, duration);
    }
    
    showError(message) {
      // Similar to notification but with different styling
      // Clear existing notifications
      while (this.notificationContainer.children.length > 0) {
        this.notificationContainer.removeChildAt(0);
      }
      
      // Create error message
      const errorContainer = new PIXI.Container();
      
      // Background
      const bg = new PIXI.Graphics();
      bg.beginFill(0xAA0000, 0.8);
      bg.drawRoundedRect(0, 0, 300, 70, 5);
      bg.endFill();
      errorContainer.addChild(bg);
      
      // Message
      const text = new PIXI.Text(message, {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF,
        wordWrap: true,
        wordWrapWidth: 280
      });
      text.x = 10;
      text.y = 10;
      errorContainer.addChild(text);
      
      // Add to container
      this.notificationContainer.addChild(errorContainer);
      
      // Add close button
      const closeBtn = new PIXI.Graphics();
      closeBtn.beginFill(0xFFFFFF);
      closeBtn.drawRoundedRect(0, 0, 20, 20, 3);
      closeBtn.endFill();
      closeBtn.x = 270;
      closeBtn.y = 10;
      closeBtn.interactive = true;
      closeBtn.buttonMode = true;
      closeBtn.on("pointerdown", () => {
        this.notificationContainer.removeChild(errorContainer);
      });
      
      const closeX = new PIXI.Text("×", {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xFF0000
      });
      closeX.x = 6;
      closeX.y = 1;
      closeBtn.addChild(closeX);
      
      errorContainer.addChild(closeBtn);
    }
    
    update(delta) {
      // Handle window resize
      if (this.app.screen.width !== this._lastWidth || this.app.screen.height !== this._lastHeight) {
        this._lastWidth = this.app.screen.width;
        this._lastHeight = this.app.screen.height;
        
        // Resize overlay
        this.overlay.width = this.app.screen.width;
        this.overlay.height = this.app.screen.height;
        
        // Recenter active modals
        this.activeModals.forEach(modal => {
          modal.x = (this.app.screen.width - modal.width) / 2;
          modal.y = (this.app.screen.height - modal.height) / 2;
        });
      }
    }
    
    showDifficultySelection(parentModal, zone, onZoneSelected) {
      // Hide parent modal content
      for (let i = 0; i < parentModal.children.length; i++) {
        if (i > 0) { // Keep background
          parentModal.children[i].visible = false;
        }
      }
      
      // Create difficulty selection content
      const difficultyContainer = new PIXI.Container();
      parentModal.addChild(difficultyContainer);
      
      // Title
      const title = new PIXI.Text(`${zone.description} - Select Difficulty`, {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xFFFFFF
      });
      title.x = 20;
      title.y = 20;
      difficultyContainer.addChild(title);
      
      // Back button
      const backBtn = new PIXI.Graphics();
      backBtn.beginFill(0x555555);
      backBtn.drawRoundedRect(0, 0, 80, 30, 5);
      backBtn.endFill();
      backBtn.x = 20;
      backBtn.y = 60;
      backBtn.interactive = true;
      backBtn.buttonMode = true;
      backBtn.on("pointerdown", () => {
        // Remove difficulty content
        parentModal.removeChild(difficultyContainer);
        
        // Show original content
        for (let i = 0; i < parentModal.children.length; i++) {
          parentModal.children[i].visible = true;
        }
      });
      
      const backText = new PIXI.Text("Back", {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF
      });
      backText.x = (80 - backText.width) / 2;
      backText.y = (30 - backText.height) / 2;
      backBtn.addChild(backText);
      
      difficultyContainer.addChild(backBtn);
      
      // Close button
      const closeBtn = new PIXI.Graphics();
      closeBtn.beginFill(0xFF5555);
      closeBtn.drawRoundedRect(0, 0, 30, 30, 5);
      closeBtn.endFill();
      closeBtn.x = 460;
      closeBtn.y = 10;
      closeBtn.interactive = true;
      closeBtn.buttonMode = true;
      closeBtn.on("pointerdown", () => {
        this.closeModal(parentModal);
      });
      
      const closeX = new PIXI.Text("X", {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xFFFFFF
      });
      closeX.x = 10;
      closeX.y = 5;
      closeBtn.addChild(closeX);
      
      difficultyContainer.addChild(closeBtn);
      
      // Difficulty levels
      const difficulties = [
        { level: 1, name: "Novice", recommended: "Level 1-5" },
        { level: 2, name: "Apprentice", recommended: "Level 5-10" },
        { level: 3, name: "Adept", recommended: "Level 10-15" },
        { level: 4, name: "Expert", recommended: "Level 15-20" },
        { level: 5, name: "Master", recommended: "Level 20+" }
      ];
      
      // Create difficulty buttons
      difficulties.forEach((diff, index) => {
        const diffBtn = new PIXI.Container();
        diffBtn.y = 110 + (index * 50);
        diffBtn.x = 50;
        
        // Background
        const diffBg = new PIXI.Graphics();
        diffBg.beginFill(zone.color, 0.3 + (index * 0.1));
        diffBg.drawRoundedRect(0, 0, 400, 40, 5);
        diffBg.endFill();
        diffBtn.addChild(diffBg);
        
        // Difficulty name
        const diffName = new PIXI.Text(`${zone.name}-${diff.level}: ${diff.name}`, {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0xFFFFFF,
          fontWeight: "bold"
        });
        diffName.x = 20;
        diffName.y = (40 - diffName.height) / 2;
        diffBtn.addChild(diffName);
        
        // Recommended level
        const recLevel = new PIXI.Text(diff.recommended, {
          fontFamily: "Arial",
          fontSize: 14,
          fill: 0xCCCCCC
        });
        recLevel.x = 300;
        recLevel.y = (40 - recLevel.height) / 2;
        diffBtn.addChild(recLevel);
        
        // Make interactive
        diffBtn.interactive = true;
        diffBtn.buttonMode = true;
        diffBtn.on("pointerdown", () => {
          console.log(`Selected difficulty: ${diff.level}`);
          
          // Close modal
          this.closeModal(parentModal);
          
          // Call callback
          if (onZoneSelected) {
            onZoneSelected(zone.name, diff.level);
          }
        });
        
        difficultyContainer.addChild(diffBtn);
      });
    }
}
