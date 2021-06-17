import * as fs from 'fs'
import * as path from 'path'
import { APP_CONFIG_PROVIDER } from './core/constant'

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
const prodPath = '../../dist/client'

export async function createServer(
    app: any,
    root = process.cwd(),
    isProd = process.env.NODE_ENV === 'production'
) {
    let application
    const toAbsolute = (...p) => path.resolve(__dirname, ...p)

    const indexProd = isProd
        ? fs.readFileSync(toAbsolute(prodPath, 'index.html'), 'utf-8')
        : ''

    const manifest = isProd
        ? // @ts-ignore
          require('../../dist/client/ssr-manifest.json')
        : {}

    function getIndexTemplate(/*url*/) {
        if (isProd) {
            return indexProd
        }

        // during dev, inject vite client + always read fresh index.html
        return (
            '<script type="module" src="/@vite/client"></script>' +
            fs.readFileSync(toAbsolute('../../index.html'), 'utf-8')
        )
    }

    function getIndexConfig() {
        if (application) {
            const config = application.get(APP_CONFIG_PROVIDER)
            const injectConfig = config.get('client')
            return `
                window.$config = ${JSON.stringify(injectConfig)}
            `
        } else {
            return ''
        }
    }

    async function registerApp(appContext) {
        application = await appContext
    }

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite
    if (!isProd) {
        vite = await require('vite').createServer({
            root,
            logLevel: isTest ? 'error' : 'info',
            server: {
                middlewareMode: true
            }
        })
        // use vite's connect instance as middleware
        app.use(vite.middlewares)
    } else {
        app.use(require('compression')())
        app.use(
            require('serve-static')(toAbsolute(prodPath), {
                index: false
            })
        )
    }
    app.get(/^(?!\/?(api|doc|graphql)).+$/, async (req, res, next) => {
        try {
            const { render } = isProd
                ? // @ts-ignore
                  require('../../dist/client/render/entry-server.js')
                : await vite.ssrLoadModule('/src/client/entry-server.ts')

            const [appHtml, preloadLinks] = await render(
                req.originalUrl,
                manifest
            )

            const appConfig = getIndexConfig()

            const html = `
                ${preloadLinks}
                ${getIndexTemplate(/*req.originalUrl*/)
                    .replace('<!--ssr-outlet-->', appHtml)
                    .replace('/**config-outlet**/', appConfig)}
                `
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            !isProd && vite.ssrFixStacktrace(e)
            console.error(e.stack)
            next(e)
        }
    })

    return { app, vite, registerApp }
}
