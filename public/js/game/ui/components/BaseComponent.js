// public/js/game/ui/components/BaseComponent.js

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

export class BaseComponent {
    constructor() {
        this.container = new PIXI.Container();
    }

    setPosition(x, y) {
        this.container.x = x;
        this.container.y = y;
        return this;
    }

    setVisible(visible) {
        this.container.visible = visible;
        return this;
    }

    addTo(parent) {
        parent.addChild(this.container);
        return this;
    }

    remove() {
        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
        return this;
    }

    destroy() {
        this.container.destroy({ children: true });
    }
}
