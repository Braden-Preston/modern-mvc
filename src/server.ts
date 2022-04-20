import fastify from 'fastify'
import staticfiles from 'fastify-static'
import viewrouter from './plugins/fastify-view-router'
// import viewengine from './plugins/fastify-htm'

let resolve = (p: string) => new URL(p, import.meta.url).pathname

const app = fastify()

app.register(viewrouter)

// app.register(viewengine, {
//   views: './src/views',
//   layouts: './src/views/layouts',
//   templates: './src/components'
// })

app.register(staticfiles, {
  root: resolve('../public')
})

// Declare a route
app.get('/', (req, res) => {
  let props = { thing: 'kittens' }

  res.view(props)
})

if (import.meta.env.PROD) {
  app.listen(3000)
}

export const viteNodeApp = app
