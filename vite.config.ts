import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

/* ------------- API Server Config ------------ */

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "fastify",
      appPath: "./src/server.ts",
      exportName: "viteNodeApp",
      tsCompiler: "esbuild",
    }),
  ],
});
