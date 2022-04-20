import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import watchAndRun from '@kitql/vite-plugin-watch-and-run'

/* ------------- API Server Config ------------ */

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'fastify',
      appPath: './src/server.ts',
      exportName: 'viteNodeApp',
      tsCompiler: 'esbuild'
    }),
    watchAndRun([{ 
      watch: '**/routes/**/**.ts',
      run: 'touch -m src/server.ts'
    }]),
  ]
})
