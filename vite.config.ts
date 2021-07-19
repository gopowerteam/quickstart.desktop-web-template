import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx'
import { resolve, join } from 'path'
import svgLoader from 'vite-svg-loader'
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        hmr: {
            host: 'localhost'
        }
    },
    resolve: {
        alias: [
            {
                find: '@apps',
                replacement: resolve(__dirname, './src/client/apps/')
            },
            {
                find: '@',
                replacement: resolve(__dirname, './src/client/')
            }
        ]
    },
    css: {
        preprocessorOptions: {
            // stylus: {
            //     additionalData: `$injectedColor: orange;`
            // }
        }
    },
    plugins: [
        vue({
            script: {
                refSugar: true
            }
        }),
        vueJSX(),
        svgLoader()
    ]
})
