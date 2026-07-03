# Twillo Callbot Tauri

Tauri desktop wrapper for the existing Next.js frontend.

## Development

```bash
npm install
npm run dev
```

`npm run dev` starts `../twillo-callbot-front` on `http://localhost:3100` through the Tauri `beforeDevCommand`.

## Build

```bash
npm run build
```

The production build runs `npm --prefix ../twillo-callbot-front run build` first and loads the exported static files from `../twillo-callbot-front/out`.
