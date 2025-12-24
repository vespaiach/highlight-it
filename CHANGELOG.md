# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-12-24

### 🚀 Major Refactoring

This is a complete rewrite of the library with breaking changes. The library has been renamed from `prismjs-loader` to `highlight-it`.

### ✨ New Features

#### 1. Engine Abstraction Layer
- Introduced a generic engine architecture that allows switching between different syntax highlighting engines
- Currently powered by Prism.js, but designed to support highlight.js, Shiki, and other engines in the future
- Users no longer need to know about the underlying highlighting engine

#### 2. Configuration Packs
Pre-defined configuration packs for quick setup:
- **default**: Basic setup with Prism theme and autoloader
- **minimal**: Lightest configuration with no plugins
- **modern**: Modern themes with line numbers
- **complete**: Full-featured setup with multiple plugins

Usage: `?config=modern`

#### 3. Query String Configuration
Configure everything via URL parameters:
- `?config=modern` - Use a configuration pack
- `?theme=prism-okaidia` - Set theme for both modes
- `?theme=light:prism-tomorrow,dark:prism-okaidia` - Different themes for light/dark mode
- `?plugins=autoloader,line-numbers` - Specify plugins

#### 4. Improved API
- Simpler, more intuitive configuration
- Better defaults that work out of the box
- Backward compatible with class-based theme configuration

### 🔄 Changed

- **Package name**: `prismjs-loader` → `highlight-it`
- **Main file**: `prismjs-loader.js` → `highlight-it.js`
- **Version**: 1.0.1 → 2.0.0
- **Configuration method**: Query string parameters are now the preferred method (class attributes still supported for backward compatibility)

### 📝 Migration Guide

#### Updating from v1.x

**Before (v1.0.1):**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/prismjs-loader@v1.0.1/dist/prismjs-loader.js"
    class="dark:prism-coy prism-funky" defer></script>
```

**After (v2.0.0):**
```html
<!-- Option 1: Use a configuration pack -->
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@v2.0.0/dist/highlight-it.js?config=modern" defer></script>

<!-- Option 2: Custom configuration via query string -->
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@v2.0.0/dist/highlight-it.js?theme=light:prism-funky,dark:prism-coy" defer></script>

<!-- Option 3: Legacy class-based (still works) -->
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@v2.0.0/dist/highlight-it.js" 
    class="dark:prism-coy prism-funky" defer></script>
```

### 🏗️ Architecture Improvements

- **Separation of Concerns**: Engine-specific code is now isolated in the ENGINES object
- **Extensibility**: Easy to add new highlighting engines without modifying core code
- **Better Error Handling**: More descriptive error messages
- **Code Organization**: Clearer structure with distinct sections for configuration, utilities, and execution

### 📚 Documentation

- Complete rewrite of README.md
- Added comprehensive examples
- Documented all configuration options
- Included migration guide from v1.x

### 🧪 Testing

- Updated all existing test files
- Added new test files for configuration packs
- Added test for query string configuration

---

## [1.0.1] - Previous Version

### Features
- Basic Prism.js integration
- Class-based theme configuration
- Dark mode support via `dark:` prefix
- Automatic plugin loading

