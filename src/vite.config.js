import { defineConfig } from "vite";

let resolve = (p) => new URL(p, import.meta.url).pathname;

/* ----------- Client Bundle Config ----------- */

export default defineConfig({
  server: {
    port: 3002,
  },
  build: {
    minify: 'terser',
    outDir: resolve("../public"),
    lib: {
      entry: resolve("./client.js"),
      name: "client",
      fileName: "client",
      formats: ["umd"],
    },
  }
});
