# Web Worker Implementation

## Overview

The highlight-it library now supports running syntax highlighting in a Web Worker, moving the computationally intensive highlighting operations off the main thread. This results in better performance and prevents UI blocking, especially when highlighting large code blocks.

## How It Works

### Architecture

1. **Main Thread (highlight-it.js)**
   - Loads CSS resources (themes, plugin styles)
   - Manages DOM manipulation
   - Creates and manages the highlighter instance

2. **Web Worker (highlight-worker.js)**
   - Loads Prism.js core and plugins
   - Performs actual syntax highlighting
   - Runs independently without blocking the main thread

3. **Highlighter Manager (highlighter.js)**
   - Detects Web Worker support
   - Creates appropriate highlighter (worker or main thread)
   - Manages communication between main thread and worker
   - Automatically falls back to main thread if workers are unavailable

### Fallback Mechanism

The library automatically detects if Web Workers are available in the browser:

- ✅ **Web Worker Available**: Uses worker-based highlighting for better performance
- ⚠️ **Web Worker Not Available**: Falls back to main thread highlighting (original behavior)

The fallback ensures compatibility with:
- Older browsers without Worker support
- Environments where workers are disabled (some corporate proxies)
- Local file:// protocol (workers may be blocked)

## Benefits

### Performance Improvements

1. **Non-blocking UI**: Highlighting runs in parallel with UI rendering
2. **Better Responsiveness**: Main thread remains free for user interactions
3. **Smoother Experience**: No janky scrolling or delayed interactions during highlighting

### Backwards Compatible

- No breaking changes to the API
- Existing configurations work without modification
- Automatic fallback ensures all users can use the library

## Usage

No changes required! The library automatically uses Web Workers when available:

```html
<!-- Works exactly the same as before -->
<script type="module" src="https://cdn.jsdelivr.net/.../highlight-it.js?pack=complete"></script>
```

## Checking Worker Status

You can check if the library is using Web Workers:

```javascript
setTimeout(() => {
  const highlighter = window.__highlightItInstance;
  
  if (highlighter.worker && !highlighter.useMainThread) {
    console.log('Using Web Worker mode ✅');
  } else {
    console.log('Using main thread mode ⚠️');
  }
}, 1000);
```

## Limitations

### Current Limitations

1. **DOM Plugins**: Some Prism plugins that require DOM access (like `line-numbers`, `line-highlight`) are still loaded in the main thread
2. **Initial Load**: CSS and theme resources are still loaded in the main thread
3. **Language Loading**: Dynamic language loading via autoloader happens in main thread

### Future Improvements

- Optimize worker initialization for faster startup
- Cache highlighted results in worker
- Support for incremental highlighting
- Better error handling and recovery

## Browser Support

Web Worker support is available in:
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge (all versions)
- Opera 10.6+

For unsupported browsers, the library automatically falls back to main thread mode.

## Testing

Test the worker implementation:

```bash
# Start development server
npm test

# Open test page
# http://localhost:8080/test/worker-test.html
```

The test page shows:
- Current mode (Worker or Main Thread)
- Multiple code examples with different languages
- Performance comparison

## Technical Details

### Message Protocol

The worker uses a simple request/response protocol:

```javascript
// Initialize worker
{ type: 'init', config: {...}, id: 'req_0' }
// Response
{ type: 'init', success: true, id: 'req_0' }

// Highlight code
{ type: 'highlight', code: '...', language: 'javascript', id: 'req_1' }
// Response
{ type: 'highlight', success: true, code: '<span>...</span>', id: 'req_1' }
```

### Error Handling

- Worker initialization failures trigger automatic fallback
- Individual highlight failures log errors and return original code
- Timeout protection (30s) for worker requests
- Graceful degradation on all errors

## Files

- `highlight-it.js` - Main entry point
- `highlighter.js` - Highlighter manager with worker/main thread logic
- `highlight-worker.js` - Web Worker implementation
- `test/worker-test.html` - Test page demonstrating worker functionality
