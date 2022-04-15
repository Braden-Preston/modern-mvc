import { defineConfig } from "vite";
import FullReload from 'vite-plugin-full-reload'

let resolve = (p) => new URL(p, import.meta.url).pathname;

/* ----------- Client Bundle Config ----------- */

export default defineConfig({
  server: {
    port: 3001,
  },
  build: {
    outDir: resolve("../public"),
    lib: {
      entry: resolve("./client.js"),
      name: "app",
      fileName: "client",
      formats: ["es"],
    },
  },
  plugins: [
    FullReload(['./**/*'])
  ]
});
