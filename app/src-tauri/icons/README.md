# App icons

Tauri needs platform icon files here before the first native build. They're
generated from a single source image, so they aren't committed.

From `app/`, with a square source PNG (1024×1024 recommended):

```bash
npm run tauri icon path/to/hermite-source.png
```

That writes `32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.icns` (macOS),
and `icon.ico` (Windows) into this folder — matching the `bundle.icon` list in
`tauri.conf.json`. Until then `npm run tauri build` will fail on the missing
icons (the web frontend still builds fine with `npm run build`).
