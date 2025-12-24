# Engines

This folder contains the highlighting engine implementations for highlight-it.

## Structure

Each engine is implemented as a separate module with a standard interface:

```javascript
export default {
  baseUrl: "string",           // CDN base URL for the engine
  availableThemes: [],         // Array of available theme names
  
  // Configuration packs (required: minimal and complete)
  packs: {
    minimal: {
      theme: { light: "...", dark: "..." },
      plugins: []
    },
    complete: {
      theme: { light: "...", dark: "..." },
      plugins: ["plugin1", "plugin2"]
    }
  },
  
  async initialize(config, addElement, waitForCondition) {
    // Initialize the engine
    // Load required resources (CSS, JS)
    // Configure the engine
  },Packs**:
  - **minimal**: Basic Prism theme, no plugins
  - **complete**: Solarized/Twilight themes, autoloader, line-numbers, line-highlight, toolbar
- **
  
  async highlight() {
    // Execute the highlighting
  }
};
```

## Available Engines

### Prism.js (`prism.js`)
- **Base URL**: `https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0`
- **Features**: 
  - Auto-loading of language grammars
  - Line numbers
  - Line highlighting
  - Toolbar with copy button
  - Command line styling
- **Themes**: 8 built-in themes with dark mode support

## Adding New Engines

To add a new highlighting engine:with **required** `packs` property containing at least `minimal` and `complete` configurations

1. Create a new file in this folder (e.g., `highlightjs.js`, `shiki.js`)
2. Implement the standard interface shown above
3. Add the engine to `index.js`:

```javascript
import prism from './prism.js';
import highlightjs from './highlightjs.js';

export default {
  prism,
  highlightjs,
};
```

4. (Optional) Add configuration packs in the main file

### Example: Adding highlight.js

```javascript
// engines/highlightjs.js
export default {
  baseUrl: "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0",
  
  availableThemes: [
    "default",
    "github",
    "monokai",
  // Required: Define minimal and complete packs
  packs: {
    minimal: {
      theme: { light: "default", dark: "default" },
      plugins: []
    },
    complete: {
      theme: { light: "github", dark: "monokai" },
      plugins: ["line-numbers", "copy-button"]
    }
  },
  
    // ... more themes
  ],
  
  async initialize(config, addElement, waitForCondition) {
    const { theme, plugins } = config;
    
    // Load theme CSS
    await addElement(this.baseUrl, {
      tagName: "link",
      src: `/styles/${theme.light}.min.css`,
    });
    
    // Load core library
    await addElement(this.baseUrl, {
      tagName: "script",
      src: "/highlight.min.js",
    });
    
    // Wait for library to load
    await waitForCondition(() => !!window.hljs);
  },
  
  async highlight() {
    if (window.hljs) {
      window.hljs.highlightAll();
    }
  }
};
```

## Interface Details

### `initialize(config, addElement, waitForCondition)`
Called once to set up the engine.

**Parameters:**
- `config` - Configuration object with `theme`, `plugins`, etc.
- `addElement(baseUrl, {tagName, src})` - Helper to load CSS/JS resources
- `waitForCondition(fn, timeout)` - Helper to wait for async conditions

### `highlight()`
Called to perform the actual syntax highlighting on the page.

## Benefits of This Architecture

1. **Separation of Concerns**: Engine-specific code is isolated
2. **Easy to Test**: Each engine can be tested independently
3. **Pluggable**: Swap engines without changing the main library
4. **Maintainable**: Updates to one engine don't affect others
5. **Extensible**: Adding new engines is straightforward
