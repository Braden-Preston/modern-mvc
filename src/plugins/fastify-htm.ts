import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import htm from 'htm'
import h from 'vhtml'

const html = htm.bind(h)

let resolve = (p: string) => new URL(p, import.meta.url).pathname

const htmViewEngine = fp(
  (fastify: FastifyInstance, options: FastifyPluginOptions, next: any) => {
    options = options || {}

    let defaultProps = {
      contentType: 'text/html',
      doctype: '<!DOCTYPE html>',
      ...options.defaultProps
    }

    if (options.views && typeof options.views !== 'string') {
      throw new TypeError('Views folder must be a string')
    }

    const viewsDir = path.resolve(options.views)

    fastify.decorate('view', async (props: Object[], options: Object[]) => {
      try {
        // Apply default props from the application and the reply
        props = { ...defaultProps, ...props }
        console.log(props)

        // Load and render the view
        // const viewPath = path.resolve(resolve(viewsDir), view)
        // const { default: render } = await import(viewPath)

        // const ctx = {}
        // const node = render(html, props, ctx)

        let node = 'sue'
        console.log(node)

        return node
        // return `${props.doctype ? `${props.doctype}\n` : ''}${output}`
      } catch (error: any) {
        if (error.code === 'MODULE_NOT_FOUND') {
          throw new Error(`View '${view}' does not exist in ${viewsDir}`)
        }

        throw error
      }
    })

    // Provide a reply.view method, which renders and sends the HTML
    fastify.decorateReply(
      'view',
      async function (props: Object[], options: Object[]) {
        // Default props here so we can incorporate `reply.props`
        // and check for a content type
        props = { ...defaultProps, ...props }

        // let { routePath, routeFile } = this.request.context.config
        // let allPages = glob.sync(`src/routes/**/*.page.{js,ts}`, { nodir: true })
        // let routeFileDir = resolve(`../../${path.dirname(routeFile)}`)
        // let routeRelDir = path.relative(resolve('src/routes'), routeFileDir)
        // // console.log(`${routePath}/*.js`)
        // console.log(allPages)
        // console.log(routePath, routeFile)

        // console.log(path.relative(resolve('.'), routeFileDir))

        // let routeName = path.basename(routeFile, '.route.ts')
        // let routeParent = path.dirname(routeFile)
        // for (const pageFile of allPages) {
        //   const pageName = path.basename(pageFile, '.page.js')
        //   const pageParent = path.dirname(pageFile)
        //   if (routeParent === pageParent) {
        //     let res =
        //     console.log(routeFile, pageFile)
        //     console.log(res)
        //   }

        // let pageName = path.basename(pageFile, '.page.js')
        // }

        // let results = glob.sync(`src/routes/**/*.page.{js,ts}`, { nodir: true })

        // console.log(allPages)

        // Set the content type
        if (props.contentType) {
          this.type(props.contentType)
        }

        // Render and send the view
        return this.send(await fastify.view(props, options))
      }
    )

    next()
  },
  {
    fastify: '>=3.0.0',
    name: 'fastify-htm'
  }
)

export default htmViewEngine
