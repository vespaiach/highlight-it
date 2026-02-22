"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Github from "@/components/icons/Github";
import Refresh from "@/components/icons/Refresh";
import Select from "@/components/Select";
import { SHIKI_THEMES } from "@/shiki-loader/themes";

export default function Home() {
  const ranRef = useRef(false);
  const [highlightHtmlCode, setHighlightHtmlCode] = useState(false);
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
        </div>

        <h1 className="text-center text-3xl mt-8 text-primary font-semibold leading-none">Shiki Loader</h1>
        <p className="text-center text-sm mb-12 font-normal">
          The effortless way to highlight your code snippets.
        </p>

        <div className="mb-7">
          <h2 className="font-semibold mb-2">Integration</h2>
          <p className="mb-2">
            Simply copy {/** biome-ignore lint/a11y/useValidAnchor: I want to link to the script section */}
            <a
              href="#the-script"
              className="link link-accent"
              onClick={(e) => {
                e.preventDefault();
                setHighlightHtmlCode((v) => !v);
                setTimeout(() => {
                  setHighlightHtmlCode(false);
                }, 2000);
              }}>
              this snippet the HTML snippet on the right
            </a>{" "}
            and paste it into the <code>&lt;body&gt;</code> tag of your web pages. Use the Customization panel below to perfectly match your brand's theme.
          </p>
        </div>

        <fieldset className="fieldset border-base-content rounded-lg w-full border p-4">
          <legend className="fieldset-legend">Customization</legend>

          <Select label="Primary Theme" value={theme} onChange={(e) => setTheme(e.target.value)} />

          <Select
            label="Dark Mode Override"
            value={darkTheme}
            allowEmpty
            onChange={(e) => setDarkTheme(e.target.value)}
          />
          <p className="text-base-content">
            <strong>Note:</strong> Dark mode override will only take effect if your system is set to dark
            mode.
          </p>

          <button type="button" onClick={handleClick} className="btn btn-primary mt-4 w-full">
            Refresh
            <Refresh size={18} className="ml-2" />
          </button>
        </fieldset>
      </div>

      <div className="flex-6 py-8 px-12 flex flex-col gap-6">
        <h2 className="font-semibold">Live Preview</h2>
        <div id="the-script" className={highlightHtmlCode ? "bounce-in-top" : ""}>
          <pre>
            <code className="language-html">{`<script src="https://cdn.jsdelivr.net/npm/shiki-loader@latest/dist/shiki-loader.js?theme=${theme}${darkTheme ? `&dark-theme=${darkTheme}` : ""}" defer></script>`}</code>
          </pre>
        </div>
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
}`}</code>
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
`}</code>
          </pre>
        </div>
      </div>
    </main>
  );
}
