# highlight-it

A simple, engine-agnostic syntax highlighting loader for web pages. Just include one script and you're done - no need to know what highlighting engine is being used under the hood.

## Quick Start

Add this single line to your HTML (at the end of your `body` tag):

```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js" integrity="sha384-zh0jk0z2/k745j30lRgmEzY6xGUxkwsJ4l37MZe1nmQR7yLDhM8n4m+G8ct7ZAyu" crossorigin="anonymous"></script>
```

That's it! Your code blocks will be automatically highlighted.

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 🎨 **Multiple Themes** - Built-in light and dark mode support
- 🔌 **Engine Agnostic** - Currently uses Prism.js, but designed to support multiple engines
- 📦 **Configuration Packs** - Pre-configured setups for different use cases
- 🎯 **Simple API** - Configure everything via query parameters

## Configuration

You can configure `highlight-it` by adding query parameters to the script URL.

### Query Parameters

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `theme` or `config` | See [Available Themes](#available-themes) | `prism` | Theme for light mode or single theme |
| `darkmode` or `darkMode` | See [Available Themes](#available-themes) | _(auto-detect)_ | Theme for dark mode (requires system dark mode) |
| `verbose` | `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off` | `false` | Enable console logging for debugging |

### Default Features

Every installation includes these plugins automatically:
- **Autoloader** - Automatic language detection and loading
- **Line Numbers** - Displays line numbers with CSS styling
- **Line Highlight** - Highlights specific lines
- **Copy to Clipboard** - Copy button with toolbar

### Available Themes

#### Built-in Themes (Prism CDN)
`prism` (default), `coy`, `dark`, `funky`, `okaidia`, `solarizedlight`, `tomorrow`, `twilight`

#### External Themes (Prism Themes CDN)
`a11y-dark`, `atom-dark`, `base16-ateliersulphurpool.light`, `cb`, `coldark-cold`, `coldark-dark`, `coy-without-shadows`, `darcula`, `dracula`, `duotone-dark`, `duotone-earth`, `duotone-forest`, `duotone-light`, `duotone-sea`, `duotone-space`, `ghcolors`, `gruvbox-dark`, `gruvbox-light`, `holi-theme`, `hopscotch`, `laserwave`, `lucario`, `material-dark`, `material-light`, `material-oceanic`, `night-owl`, `nord`, `one-dark`, `one-light`, `pojoaque`, `shades-of-purple`, `solarized-dark-atom`, `synthwave84`, `vs`, `vsc-dark-plus`, `xonokai`, `z-touch`

### Examples

**Default setup (prism theme with all plugins):**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js" defer></script>
```

**Custom theme:**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?theme=dracula" defer></script>
```

**Auto dark mode with different themes:**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?theme=one-light&darkMode=one-dark" defer></script>
```

When `darkMode` parameter is provided, the script automatically switches themes based on your system's `prefers-color-scheme` setting.

**Enable verbose logging:**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?theme=vsc-dark-plus&verbose=true" defer></script>
```

## How It Works

1. The script loads after your page renders (via `defer` attribute)
2. Configuration is parsed from query parameters or class attributes
3. The appropriate highlighting engine resources are loaded (themes, plugins, etc.)
4. Code blocks in your page are automatically highlighted
5. All requests happen after page load, so SEO is not affected

## Engine Architecture

While currently powered by Prism.js, `highlight-it` is designed with an engine abstraction layer that makes it possible to:
- Switch between different highlighting engines (Prism.js, highlight.js, Shiki, etc.)
- Add new engines without breaking existing code
- Configure engine-specific options

Future versions may support additional engines via the `engine` parameter:
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?engine=prism&config=modern" defer></script>
```

## Browser Support

- Chrome 58+
- Edge 58+
- Firefox 58+
- Safari 13+

## License

MIT - see [LICENSE](LICENSE) file

## References

- [PrismJS](https://github.com/PrismJS/prism) - Current highlighting engine
