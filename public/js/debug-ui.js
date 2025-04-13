// public/js/debug-ui.js

export class DebugUI {
    constructor(room) {
      this.room = room;
      this.container = document.createElement('div');
      this.container.id = 'debug-panel';
      this.container.style.position = 'absolute';
      this.container.style.right = '10px';
      this.container.style.top = '10px';
      this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this.container.style.color = 'white';
      this.container.style.padding = '10px';
      this.container.style.borderRadius = '5px';
      this.container.style.fontFamily = 'monospace';
      this.container.style.fontSize = '12px';
      this.container.style.maxWidth = '300px';
      this.container.style.maxHeight = '400px';
      this.container.style.overflow = 'auto';
      document.body.appendChild(this.container);
      
      this.setupToggle();
      this.setupContent();
      this.startUpdateLoop();
    }
    
    setupToggle() {
      // Create a toggle button
      this.toggleButton = document.createElement('button');
      this.toggleButton.textContent = 'Toggle Debug';
      this.toggleButton.style.position = 'absolute';
      this.toggleButton.style.right = '10px';
      this.toggleButton.style.top = '10px';
      this.toggleButton.style.zIndex = '1000';
      document.body.appendChild(this.toggleButton);
      
      // Set up toggle functionality
      this.isVisible = true;
      this.toggleButton.addEventListener('click', () => {
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'block' : 'none';
      });
    }
    
    setupContent() {
      // Create sections
      this.roomSection = document.createElement('div');
      this.roomSection.innerHTML = '<h4>Room Info</h4>';
      
      this.playerSection = document.createElement('div');
      this.playerSection.innerHTML = '<h4>Local Player</h4>';
      
      this.playersSection = document.createElement('div');
      this.playersSection.innerHTML = '<h4>All Players</h4>';
      
      // Add sections to container
      this.container.appendChild(this.roomSection);
      this.container.appendChild(this.playerSection);
      this.container.appendChild(this.playersSection);
    }
    
    startUpdateLoop() {
      // Update debug info every 500ms
      setInterval(() => this.updateDebugInfo(), 500);
    }
    
    updateDebugInfo() {
      if (!this.isVisible || !this.room) return;
      
      // Update room info
      this.roomSection.innerHTML = `
        <h4>Room Info</h4>
        <p>Room ID: ${this.room.id}</p>
        <p>Room Type: ${this.room.state.roomType}</p>
        <p>Session ID: ${this.room.sessionId}</p>
      `;
      
      // Update local player info
      const localPlayer = this.room.state.players.get(this.room.sessionId);
      if (localPlayer) {
        this.playerSection.innerHTML = `
          <h4>Local Player</h4>
          <p>Shape: ${localPlayer.shape}</p>
          <p>Color: ${localPlayer.color}</p>
          <p>Position: (${Math.round(localPlayer.x)}, ${Math.round(localPlayer.y)})</p>
          <p>HP: ${localPlayer.hp}/${localPlayer.maxHp}</p>
          <p>Stats: ATK=${localPlayer.attack}, SPD=${localPlayer.speed}, LCK=${localPlayer.luck}</p>
        `;
      }
      
      // Update all players info
      let playersHtml = '<h4>All Players</h4>';
      let count = 0;
      
      this.room.state.players.forEach((player, id) => {
        count++;
        playersHtml += `
          <p>${id.substring(0, 6)}: ${player.shape} @ (${Math.round(player.x)}, ${Math.round(player.y)})</p>
        `;
      });
      
      playersHtml += `<p>Total Players: ${count}</p>`;
      this.playersSection.innerHTML = playersHtml;
    }
  }