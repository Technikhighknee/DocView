# DocView

DocView is a local-first Markdown viewer built with Electron. It lets you choose a directory and browse markdown files using a GitHub-like style.

## Usage

```
npm install
npm run start
```

A window will open asking for a folder. Pick the documentation directory and the tree will appear on the left. Selecting a file renders it on the right.

## Development

- `npm run build` – compile TypeScript and bundle the renderer.
- `npm run start` – build then start the Electron app.
- `npm test` – run Vitest.
- End-to-end tests require a display. When running in headless environments,
  `xvfb-run` must be available. The test harness detects the absence of the
  `DISPLAY` variable and launches Electron using `xvfb-run` automatically.

## Architecture

- **electron-main/** – Electron entry and preload exposing IPC.
- **shared/** – Logic for walking directories, reading files, and parsing markdown.
- **src/** – Renderer code and styles.
- **tests/** – Vitest unit and integration tests.

The renderer communicates with the main process through IPC methods `chooseRoot` and `readFile`. Markdown is parsed using `marked`, highlighted via `highlight.js`, and sanitized with `sanitize-html`.

## License

Unlicense
