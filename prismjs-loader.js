;(async function () {
  if (typeof document === 'undefined') {
    return
  }

  const BASE_URL = 'https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0'
  const ALL_THEMES = ['prism', 'prism-coy', 'prism-dark', 'prism-funky', 'prism-okaidia', 'prism-solarizedlight', 'prism-tomorrow', 'prism-twilight']
  const DEFAULT_THEME = ALL_THEMES[0]

  /**
   * Extracts the theme name and mode (dark or light) from a given class name.
   *
   * @param {string} className - The class name string to parse.
   * @returns {{ name: string, forDarkMode: boolean } | null} Parsed theme object or `null` if invalid.
   */
  function getThemeNameAndMode(className) {
    const raw = (className ?? '').toLowerCase()
    const name = raw.replace(/^(dark:|light:)/i, '')
    return ALL_THEMES.includes(name) ? { name, forDarkMode: raw.startsWith('dark:') } : null
  }

  /**
   * Retrieves theme options for light and dark modes based on the current script's class list.
   *
   * @returns {Object} Theme options for light and dark modes.
   */
  function getThemeOptions() {
    const parseTheme = (theme) => {
      const themeObject = getThemeNameAndMode(theme)
      return themeObject
        ? { dark: themeObject.forDarkMode ? themeObject.name : undefined, light: themeObject.forDarkMode ? undefined : themeObject.name }
        : { light: DEFAULT_THEME }
    }

    const scriptElement = document.currentScript
    if (scriptElement?.tagName === 'SCRIPT') {
      if (scriptElement.classList.length === 0) {
        return { light: DEFAULT_THEME }
      }
      const option1 = parseTheme(scriptElement.classList[0])
      const option2 = parseTheme(scriptElement.classList[1])
      return { dark: option1.dark ?? option2.dark, light: option1.light ?? option2.light }
    }

    return { light: DEFAULT_THEME }
  }

  /**
   * Dynamically adds a script or stylesheet element to the document.
   *
   * @param {string} tagName - The type of element to create ('script' or 'link').
   * @param {string} src - The source URL for the script or stylesheet.
   * @param {Function} [success] - Optional callback function to execute when the element is successfully loaded.
   */
  function addElement({ tagName, src }) {
    const element = document.createElement(tagName)
    if (tagName === 'link') {
      element.rel = 'stylesheet'
      element.href = `${BASE_URL}${src}`
    } else if (tagName === 'script') {
      element.defer = true
      element.src = `${BASE_URL}${src}`
    }
    document.body.appendChild(element)
  }

  // Stop Prism from auto-highlighting
  window.Prism = window.Prism || {}
  window.Prism.manual = true

  const themes = getThemeOptions()
  const isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const coreScriptsToLoad = [
    { tagName: 'link', src: `/themes/${isDarkMode ? themes.dark ?? themes.light : themes.light}.min.css` },
    { tagName: 'link', src: '/plugins/line-numbers/prism-line-numbers.min.css' },
    { tagName: 'script', src: '/components/prism-core.min.js' }
  ]
  const pluginsToLoad = [
    { tagName: 'script', src: '/plugins/autoloader/prism-autoloader.min.js' },
    { tagName: 'script', src: '/plugins/line-numbers/prism-line-numbers.min.js' }
  ]

  function checkLoadingStatus(isLoaded) {
    return new Promise((res, rej) => {
      let cycle = 0
      const loop = () => {
        if (isLoaded()) {
          res()
        } else {
          cycle++
          if (cycle > 200) {
            rej(new Error('Prism failed to load within the expected time.'))
          } else {
            requestAnimationFrame(loop)
          }
        }
      }
      loop()
    })
  }

  try {
    document.body.classList.add('line-numbers')

    coreScriptsToLoad.forEach(addElement)
    await checkLoadingStatus(() => !!window.Prism?.filename)

    pluginsToLoad.forEach(addElement)
    await checkLoadingStatus(() => !!window.Prism?.plugins?.autoloader)

    Prism.highlightAll()
  } catch (error) {
    console.error('Error loading PrismJS:', error)
  }
})()
