# highlight-it

A simple, engine-agnostic syntax highlighting loader for web pages. Just include one script and you're done - no need to know what highlighting engine is being used under the hood.

## Quick Start

Add this single line to your HTML (at the end of your `body` tag):

```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@v2.0.0/dist/highlight-it.js" defer></script>
```

That's it! Your code blocks will be automatically highlighted.

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 🎨 **Multiple Themes** - Built-in light and dark mode support
- 🔌 **Engine Agnostic** - Currently uses Prism.js, but designed to support multiple engines
- 📦 **Configuration Packs** - Pre-configured setups for different use cases
- 🎯 **Simple API** - Configure everything via query parameters

## Configuration Packs

Each highlighting engine defines its own pre-configured packs. Use them to quickly set up highlighting:

### Minimal
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@v2.0.0/dist/highlight-it.js?config=minimal" defer></script>
```
- Lightweight setup with no plugins
- Basic theme

### Complete
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@v2.0.0/dist/highlight-it.js?config=complete" defer></script>
```
- Full-featured setup with all plugins
- Enhanced theme
- Line numbers, line highlighting, and toolbar

**Note:** Each engine (Prism.js, highlight.js, etc.) defines its own minimal and complete configurations optimized for that engine's capabilities.

## Custom Configuration

### Theme Configuration

**Via Query String:**
```html
<!-- Single theme for both modes -->
<script src=".../highlight-it.js?theme=prism-okaidia" defer></script>

<!-- Different themes for light and dark modes -->
<script src=".../highlight-it.js?theme=light:prism-tomorrow,dark:prism-okaidia" defer></script>
```

**Via Class Attribute (legacy support):**
```html
<!-- Load prism-coy in dark mode, prism-funky in light mode -->
<script src=".../highlight-it.js" class="dark:prism-coy prism-funky" defer></script>
```

### Available Themes
- `prism` (default)
- `prism-coy`
- `prism-dark`
- `prism-funky`
- `prism-okaidia`
- `prism-solarizedlight`
- `prism-tomorrow`
- `prism-twilight`

### Plugin Configuration

Specify plugins via query string:
```html
<script src=".../highlight-it.js?plugins=autoloader,line-numbers" defer></script>
```

Available plugins include:
- `autoloader` - Automatically loads language grammars as needed
- `line-numbers` - Adds line numbers to code blocks
- `line-highlight` - Highlights specific lines
- `toolbar` - Adds a toolbar with copy button
- `command-line` - Adds command line styling

### Advanced Examples

**Complete custom configuration:**
```html
<script src=".../highlight-it.js?theme=light:prism-tomorrow,dark:prism-okaidia&plugins=autoloader,line-numbers,toolbar" defer></script>
```

**Mix pack with overrides:**
Start with a pack and customize specific options by using query parameters together.

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
<script src=".../highlight-it.js?engine=prism&config=modern" defer></script>
```

## Migration from prismjs-loader

If you're upgrading from `prismjs-loader`:

1. **Update the script URL:**
   - Old: `prismjs-loader@v1.0.1/dist/prismjs-loader.js`
   - New: `highlight-it@v2.0.0/dist/highlight-it.js`

2. **Configuration is now hidden:** You no longer need to know about Prism.js specifics

3. **Use configuration packs:** Instead of manually configuring, use `?config=modern` or similar

4. **Class-based themes still work:** Legacy syntax is supported for backward compatibility

## Browser Support

- Chrome 58+
- Edge 58+
- Firefox 58+
- Safari 13+

## License

MIT - see [LICENSE](LICENSE) file

## References

- [PrismJS](https://github.com/PrismJS/prism) - Current highlighting engine
