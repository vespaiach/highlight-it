import Link from "next/link";
import AngleLeft from "@/components/icons/AngleLeft";
import Github from "@/components/icons/Github";

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content antialiased">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="mb-12 -ml-4">
          <Link href="/" className="btn btn-sm btn-link gap-1">
            <AngleLeft size={18} />
            Back to Home
          </Link>
        </nav>

        <header className="mb-16">
          <h1 className="text-4xl font-bold mb-2 text-primary text-center">About Shiki Loader</h1>
          <p className="text-xl opacity-80 text-center">
            The effortless way to bring high-quality syntax highlighting to any website.
          </p>
        </header>

        <section className="prose prose-lg max-w-none">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">What is Shiki Loader?</h2>
            <p className="mb-4">
              <a href="https://github.com/vespaiach/shiki-loader">
                <strong>shiki-loader</strong>
              </a>{" "}
              is a tiny, copy-and-paste script that helps you to quickly add with a syntax-highlighting engine
              to your web pages without any setup headaches.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Key Features</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Client-Side Only:</strong> Works perfectly on static sites, CMS platforms (like
                WordPress or Ghost), or any HTML page.
              </li>
              <li>
                <strong>Automatic Detection:</strong> Automatically finds and highlights all{" "}
                <code>&lt;pre&gt;&lt;code&gt;</code> blocks on your page.
              </li>
              <li>
                <strong>Dark Mode Support:</strong> Seamlessly switch between light and dark themes based on
                system preferences.
              </li>
              <li>
                <strong>Built-in Utilities:</strong> Includes a language badge and a "Copy to Clipboard"
                button for every code block.
              </li>
              <li>
                <strong>CDN Ready:</strong> No installation required. Just add a single{" "}
                <code>&lt;script&gt;</code> tag and you're good to go.
              </li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">How it works?</h2>
            <p className="mb-4">
              Behind the scenes,{" "}
              <a href="https://github.com/vespaiach/shiki-loader" className="link">
                shiki-loader
              </a>{" "}
              pulls{" "}
              <a href="https://shiki.style/" target="_blank" className="link" rel="noopener">
                Shiki engine
              </a>{" "}
              - a powerful syntax highlighter - from{" "}
              <a href="https://esm.sh/shiki@3.0.0" target="_blank" className="link" rel="noopener">
                esm.sh CDN link
              </a>
              , automatically finds all <code>&lt;pre&gt;&lt;code&gt;</code> blocks with classes like
              <code>language-*</code>, and asks Shiki to highlight them.
            </p>
          </div>

          <div className="mb-10 p-6 bg-base-200 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Open Source</h2>
            <p className="mb-6">
              Shiki Loader is open source and available on GitHub. Contributions, bug reports, and feature
              requests are always welcome!
            </p>
            <a
              href="https://github.com/vespaiach/shiki-loader"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline gap-2">
              <Github size={20} />
              View on GitHub
            </a>
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t text-center opacity-60">
          <p>Built with Next.js, Shiki, and DaisyUI.</p>
        </footer>
      </div>
    </div>
  );
}
