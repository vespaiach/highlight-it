"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Github from "@/components/icons/Github";
import Moon from "@/components/icons/Moon";
import Refresh from "@/components/icons/Refresh";
import Sun from "@/components/icons/Sun";
import Select from "@/components/Select";
import { SHIKI_THEMES } from "@/shiki-loader/themes";

export default function Home() {
  const ranRef = useRef(false);
  const params = useSearchParams();
  const [theme, setTheme] = useState(() => {
    const themeParam = params.get("theme") ?? "";
    if (SHIKI_THEMES.includes(themeParam)) {
      return themeParam;
    }
    return "material-theme";
  });

  const [darkTheme, setDarkTheme] = useState(() => {
    const darkThemeParam = params.get("dark-theme") ?? "";
    if (SHIKI_THEMES.includes(darkThemeParam)) {
      return darkThemeParam;
    }
    return "";
  });

  const handleClick = () => {
    const newParams = new URLSearchParams();
    if (theme) {
      newParams.set("theme", theme);
    }
    if (darkTheme) {
      newParams.set("dark-theme", darkTheme);
    }

    window.location.search = newParams.toString();
  };

  useEffect(() => {
    if (theme && !ranRef.current) {
      ranRef.current = true;
      document.querySelectorAll('script[src*="shiki-loader.js"]').forEach((s) => {
        s.remove();
      });

      const script = document.createElement("script");
      let src = `/shiki-loader.js?theme=${theme}`;
      if (darkTheme) {
        src += `&dark-theme=${darkTheme}`;
      }
      script.src = src;
      script.type = "module";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [theme, darkTheme]);

  return (
    <main className="flex flex-row justify-stretch min-h-screen">
      <div className="flex-2 bg-base-200 text-base-content px-8 pt-3 pb-4 min-w-80">
        <div className="flex items-center justify-end gap-2">
          <a
            href="https://github.com/vespaiach/highlight-it"
            title="Highlight-it Github Repository"
            target="_blank"
            className="btn btn-circle btn-sm btn-ghost text-base-content"
            rel="noopener noreferrer">
            <Github size={20} />
          </a>
          <label className="toggle text-base-content">
            <input type="checkbox" value="dark" className="theme-controller" />
            <Sun size={18} aria-label="sun" />
            <Moon size={18} aria-label="moon" />
          </label>
        </div>

        <h1 className="text-center text-3xl mt-8 mb-2 text-primary font-semibold leading-none">
          Shiki Loader
        </h1>
        <p className="text-center text-sm mb-12 font-normal">
          A simple way to highlight code snippets.
        </p>

        <fieldset className="fieldset border-base-300 rounded-lg w-full border p-4">
          <legend className="fieldset-legend">Customization</legend>

          <Select label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} />

          <Select
            label="Dark Theme"
            value={darkTheme}
            allowEmpty
            onChange={(e) => setDarkTheme(e.target.value)}
          />

          <button type="button" onClick={handleClick} className="btn btn-primary mt-4 w-full">
            Refresh
            <Refresh size={18} className="ml-2" />
          </button>
        </fieldset>

        
      </div>

      <div className="flex-6 py-8 px-12 flex flex-col gap-6">
        <div>
          <pre>
            <code className="language-javascript">{`async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        return { success: true, user: data };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
}

const userProfile = {
    id: 42,
    username: 'dev_hero',
    roles: ['admin', 'moderator']
};`}</code>
          </pre>
        </div>
        <div>
          <pre>
            <code className="language-python">{`@dataclass
class HighlightingEngine:
    name: str
    is_active: bool = True

    def toggle(self):
        self.is_active = not self.is_active

# Modern Python dictionary merging
config = {"engine": "prism", "theme": "okaidia"}
defaults = {"darkMode": True}
merged = {**defaults, **config}

print(f"Loading {merged['engine']} engine...")`}</code>
          </pre>
        </div>
      </div>
    </main>
  );
}
