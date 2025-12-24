# Web Worker Flow Diagram

## Initialization Flow

```
User loads page with highlight-it.js
            ↓
┌───────────────────────────────────────┐
│   highlight-it.js (Main Entry)        │
│   - Parse configuration                │
│   - Get engine (Prism.js)              │
│   - Determine final config             │
└───────────┬───────────────────────────┘
            ↓
┌───────────────────────────────────────┐
│   createHighlighter()                  │
│   (from highlighter.js)                │
│                                        │
│   Check: typeof Worker !== 'undefined'?│
└───────────┬───────────────────────────┘
            ↓
     ┌──────┴──────┐
     │             │
     ↓             ↓
  YES            NO
     │             │
     ↓             ↓
┌─────────────┐ ┌──────────────────┐
│WorkerHighli│ │MainThreadHighli │
│ghter        │ │ghter             │
└──────┬──────┘ └────────┬─────────┘
       │                 │
       ↓                 ↓
  Initialize          Initialize
  Worker             Main Thread
```

## Worker Highlighter Flow (When Workers Available)

```
┌────────────────────────────────────────┐
│  WorkerHighlighter.initialize()        │
│  Step 1: Load DOM Resources            │
│  - Load CSS themes                     │
│  - Load plugin CSS                     │
│  - Add line-numbers class if needed    │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Step 2: Create Worker                 │
│  - Find worker script URL              │
│  - new Worker(highlight-worker.js)     │
│  - Set up message handlers             │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Step 3: Initialize Worker             │
│  - Send { type: 'init', config }       │
│  - Worker loads Prism.js core          │
│  - Worker loads plugins                │
│  - Wait for success response           │
└────────────┬───────────────────────────┘
             ↓
        ┌────────┐
        │Success?│
        └───┬────┘
            │
     ┌──────┴──────┐
     ↓             ↓
   YES            NO
     │             │
     ↓             ↓
  Ready      Fallback to
              Main Thread
```

## Highlighting Flow (Worker Mode)

```
User's page has <code class="language-js">...</code>
            ↓
┌────────────────────────────────────────┐
│  highlighter.highlightAll()            │
│  - Find all code blocks                │
│  - Call Prism.highlightAll()           │
│  (Still uses main thread for DOM)      │
└────────────────────────────────────────┘

Alternative: Individual Element
            ↓
┌────────────────────────────────────────┐
│  highlighter.highlightElement(element) │
│  Step 1: Extract code & language       │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Step 2: Send to Worker                │
│  Message: {                            │
│    type: 'highlight',                  │
│    code: '...',                        │
│    language: 'javascript',             │
│    id: 'req_123'                       │
│  }                                     │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Web Worker (highlight-worker.js)      │
│  - Parse code with Prism               │
│  - Generate highlighted HTML           │
│  - Return results                      │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Step 3: Update DOM                    │
│  - Receive highlighted HTML            │
│  - element.innerHTML = result          │
│  - Add language class                  │
└────────────────────────────────────────┘
```

## Main Thread Fallback Flow

```
┌────────────────────────────────────────┐
│  MainThreadHighlighter.initialize()    │
│  - Load all resources (CSS + JS)       │
│  - Load Prism.js core                  │
│  - Load plugins                        │
│  - Everything on main thread           │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  highlightAll() / highlightElement()   │
│  - Call Prism.highlightAll() directly  │
│  - Or Prism.highlightElement()         │
│  - Blocks main thread during highlight │
└────────────────────────────────────────┘
```

## Error Handling & Fallback

```
┌────────────────────────────────────────┐
│  Worker Creation Failed                │
│  - Worker not supported                │
│  - Worker script 404                   │
│  - Security error (file://)            │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Set useMainThread = true              │
│  console.warn() with error             │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  Initialize engine on main thread      │
│  - engine.initialize()                 │
│  - Continue with main thread mode      │
└────────────────────────────────────────┘
```

## Message Protocol

### Main Thread → Worker

```javascript
// Initialize
{
  type: 'init',
  config: {
    engine: 'prism',
    theme: { light: 'prism', dark: 'prism-dark' },
    plugins: ['autoloader', 'line-numbers']
  },
  id: 'req_0'
}

// Highlight code
{
  type: 'highlight',
  code: 'const x = 42;',
  language: 'javascript',
  id: 'req_1'
}
```

### Worker → Main Thread

```javascript
// Success response
{
  type: 'init',
  success: true,
  id: 'req_0'
}

{
  type: 'highlight',
  success: true,
  code: '<span class="token">...</span>',
  id: 'req_1'
}

// Error response
{
  type: 'highlight',
  success: false,
  error: 'Language not found',
  id: 'req_1'
}
```

## File Dependencies

```
highlight-it.js (Entry point)
    ↓ imports
highlighter.js (Manager)
    ↓ uses
engines/index.js
    ↓ exports
engines/prism.js
    ↓ configures
[Prism.js from CDN]

Parallel:
highlight-worker.js (Separate file)
    ↓ importScripts()
[Prism.js from CDN]
```

## Build Output

```
Source Files:
- highlight-it.js
- highlighter.js
- highlight-worker.js
- engines/index.js
- engines/prism.js

Build Process:
npm run build
    ↓
esbuild (2 separate bundles)
    ↓
dist/
├── highlight-it.js        (Main bundle with highlighter)
├── highlight-it.js.map
├── highlight-worker.js    (Worker bundle)
└── highlight-worker.js.map
```
