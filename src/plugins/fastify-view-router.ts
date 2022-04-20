import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import path from 'path'
import glob from 'glob'
import fs from 'fs'

import htm from 'htm'
import h from 'vhtml'

let resolve = (p: string) => new URL(p, import.meta.url).pathname

// interface RouteFunctions {
//   get?: func
//   post?:
// }

function matchPageInDir(dir: string, exts: string[], name: string) {
  let pageFiles = glob.sync(`/*.page.{${exts.join(',')}}`, {
    root: dir
  })
  for (let pageFile of pageFiles) {
    let ext = path.extname(pageFile)
    let pageName = path.basename(pageFile, `.page${ext}`)
    if (pageName.startsWith(name)) {
      return pageFile
    }
  }
  return null
}

function getRouteContext(routeFile: string) {
  let routeExt = path.extname(routeFile)
  let routeDir = path.dirname(path.resolve(routeFile))
  let routeName = path.basename(routeFile, `.route${routeExt}`)
  return { routeExt, routeDir, routeName }
}

function matchParentPages(
  dir: string,
  exts: string[],
  name: string,
  matches: string[] = []
): string[] {
  // Get matches the page name in directory
  let page = matchPageInDir(dir, exts, name)

  if (page) {
    // Add to stack
    matches.push(page)

    // Exit if _layout.break or _error.break
    if (page.includes('.break')) {
      return matches
    }
  }

  // Exit if the project root is reached
  if (process.cwd() === dir) {
    return matches
  }

  // Recurse upwares in the directory and search again at that level.
  return matchParentPages(path.dirname(dir), exts, name, matches)
}

let fastifyViewRouterPlugin = fp(
  async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: any
  ) => {
    options = options || {}

    let routesDir = options.routes || 'src/routes'
    let routeExts = options.routeExts || ['ts', 'js']
    let pageExts = options.pageExts || ['ts', 'js']

    let routesPath = resolve(`../../${routesDir}`)
    if (!fs.existsSync(routesPath)) {
      return next(new Error(`dir ${routesDir} does not exists`))
    }

    let routes = glob.sync(`**/*.route.{${routeExts.join(',')}}`, {
      root: routesDir
    })

    // For every **/*.route.{ts,js} match
    for (let routeFile of routes) {
      let ext = path.extname(routeFile)
      let basename = path.basename(routeFile, ext)
      let url = path.dirname(routeFile)
      let routePath = path.relative(routesDir, url)

      // Transform relative route path into fastify routing url
      url = '/' + routePath.replaceAll(/\[/g, ':').replaceAll(/\]/g, '')
      basename != 'index.route' &&
        (url += '/' + path.basename(basename, '.route'))

      // Import HTTP method handlers from the route module
      let handlers = ({ get, post, put, patch, del } = await import(
        resolve(`../../${routeFile}`)
      ))

      // Create a route for each HTTP method
      for (let key in handlers) {
        let method = key === 'del' ? 'DELETE' : key.toUpperCase()
        let handler = handlers[key]
        if (handler) {
          fastify.route({
            method,
            handler,
            url,
            config: { routeFile, routePath }
          })
        }
      }
    }

    fastify.decorate('view', async (props: any, config: any) => {
      props = props || {}
      config = config || {}

      let { routeFile, routePath } = config

      try {
        let { routeDir, routeName } = getRouteContext(routeFile)

        // Find the matching page for the route handler
        let page = matchPageInDir(routeDir, pageExts, routeName)

        // routeName = '_error'

        // If the page is _error, find the next highest error boundrary
        if (routeName.startsWith('_error')) {
          let errorPages = matchParentPages(routeDir, pageExts, '_error')
          page = String(errorPages.length > 0 && errorPages[0])
        }

        // If the page has _layouts, recurse up and collect them for later
        let layouts = matchParentPages(routeDir, pageExts, '_layout')

        // Import in the view component for the route
        let { default: Page } = await import(page)

        let pageContext = { ...config, ...getRouteContext(routeFile) }
        let renderContext = {
          html: htm.bind(h),
          props: {
            ...props,
            page: pageContext
          }
        }

        // If there are layouts, wrap up the page
        // in the layout and pass in the contexts
        if (!config.fragment) {
          try {
            for (const layout of layouts) {
              try {
                let { default: Layout } = await import(layout)
                let Child = Page
                Page = (ctx: any) =>
                  ctx.html`<${Layout} ...${ctx}><${Child} ...${ctx}/><//>`
              } catch (error) {
                console.warn(`Layout file failed to import: ${layout}`)
              }
            }
          } catch (error) {
            console.warn('Could not render Layouts correctly!', error)
          }
        }

        // Render the full page
        let renderedPage = Page(renderContext)
        return renderedPage
        //
      } catch (error: any) {
        // Catch view error
        return `Route view does not exist: ${routePath}`
      }
    })

    // Provide a reply.view method, which renders and sends the HTML
    fastify.decorateReply(
      'view',
      async function (props: Object[], config: Object[]) {
        props = props || {}
        config = config || {}


        let { request } = this

        // Get router path context from request
        config = {
          ...config,
          ...request.context.config,
          routeFormat: config.url,
          url: request.url
        }

        // console.log(config)

        // TODO: Based on hx-request, mark for rendering as partial
        // if (request.headers.accept) {
        //   config = { ...config, partial: true }
        // }

        // TODO: Set the content type
        // if (props.contentType) {
        //   this.type(props.contentType)
        // }

        this.type('text/html')

        let html = await fastify.view(props, config)

        if (!config.fragment) {
          html = '<!DOCTYPE html>' + html
        }

        console.log(html)

        // Render and send the view
        return this.send(html)
      }
    )
  },
  {
    fastify: '>=3.0.0',
    name: 'fastify-filerouter'
  }
)

export default fastifyViewRouterPlugin
