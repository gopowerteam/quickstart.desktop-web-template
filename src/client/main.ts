import App from './App.vue'
import { createSSRApp } from 'vue'
import { createGraphQL } from './graphql'
import store, { IStore } from '@/store'
import router from '@/router'
// import { boot } from './bootstrap/bootgccs'

export async function createApp() {
    const app = createSSRApp(App)
    const graphQL = createGraphQL()

    app.use(router)
    app.use(store, IStore)
    app.use(graphQL)

    return app
}
