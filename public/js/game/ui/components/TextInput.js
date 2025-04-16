// public/js/game/ui/components/TextInput.js

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import TextInput from '../../../lib/pixi-text-input.js';

export class PixiTextInput {
    constructor(width, height, initialValue = "", options = {}) {
        // Default style options
        const defaultOptions = {
            input: {
                fontSize: '16px',
                padding: '5px',
                width: `${width}px`,
                color: '#000000',
                fontFamily: 'Arial'
            },
            box: {
                default: {
                    fill: 0xFFFFFF,
                    rounded: 5,
                    stroke: { color: 0xCCCCCC, width: 1 }
                },
                focused: {
                    fill: 0xFFFFFF,
                    rounded: 5,
                    stroke: { color: 0x999999, width: 1 }
                }
            }
        };

        // Merge default options with provided options
        const mergedOptions = {
            input: { ...defaultOptions.input, ...options.input },
            box: {
                default: { ...defaultOptions.box.default, ...options.box?.default },
                focused: { ...defaultOptions.box.focused, ...options.box?.focused }
            }
        };

        // Create the TextInput instance
        this.textInput = new TextInput(mergedOptions);
        this.textInput.width = width;
        this.textInput.height = height;
        this.textInput.text = initialValue;
        
        // Make sure the text input is properly positioned
        this.textInput.pivot.x = 0;
        this.textInput.pivot.y = 0;
    }

    get container() {
        return this.textInput;
    }

    get text() {
        return this.textInput.text;
    }

    set text(value) {
        this.textInput.text = value;
    }

    setPosition(x, y) {
        this.textInput.x = x;
        this.textInput.y = y;
        return this;
    }

    focus() {
        this.textInput.focus();
        return this;
    }

    blur() {
        this.textInput.blur();
        return this;
    }

    destroy() {
        this.textInput.destroy();
    }
}
