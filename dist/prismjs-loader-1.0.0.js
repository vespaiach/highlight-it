(() => {
  var b = (o, s) => () => (s || o((s = { exports: {} }).exports, s), s.exports);
  var y = b(() => {
    (async function () {
      var g;
      if (typeof document > "u" || window.__prismjsLoaderInitialized) return;
      window.__prismjsLoaderInitialized = !0;
      let o = "https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0",
        s = [
          "prism",
          "prism-coy",
          "prism-dark",
          "prism-funky",
          "prism-okaidia",
          "prism-solarizedlight",
          "prism-tomorrow",
          "prism-twilight",
        ],
        a = s[0];
      function m(i, e = 15e3) {
        return new Promise((r, t) => {
          if (i()) {
            r();
            return;
          }
          let n = Date.now(),
            w = setInterval(() => {
              i()
                ? (clearInterval(w), r())
                : Date.now() - n > e &&
                  (clearInterval(w),
                  t(
                    new Error("Prism failed to load within the expected time.")
                  ));
            }, 50);
        });
      }
      function f(i) {
        let e = (i != null ? i : "").toLowerCase(),
          r = e.replace(/^(dark:|light:)/i, "");
        return s.includes(r)
          ? { name: r, forDarkMode: e.startsWith("dark:") }
          : null;
      }
      function d(i) {
        let e = f(i);
        return e
          ? {
              dark: e.forDarkMode ? e.name : void 0,
              light: e.forDarkMode ? void 0 : e.name,
            }
          : { light: a };
      }
      function k() {
        var e, r;
        let i = document.currentScript;
        if ((i == null ? void 0 : i.tagName) === "SCRIPT") {
          if (i.classList.length === 0) return { light: a };
          let t = d(i.classList[0]),
            n = d(i.classList[1]);
          return {
            dark: (e = t.dark) != null ? e : n.dark,
            light: (r = t.light) != null ? r : n.light,
          };
        }
        return { light: a };
      }
      function T() {
        let i = document.currentScript;
        if ((i == null ? void 0 : i.tagName) === "SCRIPT" && i.src)
          try {
            let r = new URL(i.src).searchParams.get("plugins");
            if (r)
              return r
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
          } catch (e) {
            console.warn("Failed to parse query string:", e);
          }
        return ["autoloader"];
      }
      function u({ tagName: i, src: e }) {
        return new Promise((r, t) => {
          let n = document.createElement(i);
          (n.onload = () => r()),
            (n.onerror = () => t(new Error(`Failed to load ${i}: ${e}`))),
            i === "link"
              ? ((n.rel = "stylesheet"), (n.href = `${o}${e}`))
              : i === "script" && ((n.defer = !0), (n.src = `${o}${e}`)),
            document.body.appendChild(n);
        });
      }
      (window.Prism = window.Prism || {}), (window.Prism.manual = !0);
      let l = k(),
        P =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches,
        c = [],
        p = {
          "line-numbers": "/plugins/line-numbers/prism-line-numbers.min.css",
          "line-highlight":
            "/plugins/line-highlight/prism-line-highlight.min.css",
          toolbar: "/plugins/toolbar/prism-toolbar.min.css",
          "command-line": "/plugins/command-line/prism-command-line.min.css",
        },
        h = [
          {
            tagName: "link",
            src: `/themes/${P && (g = l.dark) != null ? g : l.light}.min.css`,
          },
          { tagName: "script", src: "/components/prism-core.js" },
        ];
      c.forEach((i) => {
        p[i] && h.splice(1, 0, { tagName: "link", src: p[i] });
      });
      let L = c.map((i) => ({
        tagName: "script",
        src: `/plugins/${i}/prism-${i}.min.js`,
      }));
      try {
        c.includes("line-numbers") &&
          document.body.classList.add("line-numbers");
        for (let i of h) await u(i);
        await m(() => {
          var i;
          return !!((i = window.Prism) != null && i.filename);
        }),
          await Promise.all(L.map((i) => u(i))),
          await m(() => {
            var i, e;
            return !!(
              (e = (i = window.Prism) == null ? void 0 : i.plugins) != null &&
              e.autoloader
            );
          }),
          window.Prism.highlightAll();
      } catch (i) {
        console.error("Error loading PrismJS:", i);
      }
    })();
  });
  y();
})();
//# sourceMappingURL=prismjs-loader.js.map
