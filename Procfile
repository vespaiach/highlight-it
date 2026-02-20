
build: bun build highlight-it.ts --outfile ./dist/highlight-it.js --target browser --bundle --minify --watch
web: npx http-server ./dist -c-1 -p 5555
tailwindcss: cd docs && npx tailwindcss -i ./main.css -o ../dist/main.css --watch
html: bun run scripts/watch-html.ts