import { boot } from './bootstrap/boots'
import store from '@/store'
import router from '@/router'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'

const createVueApp = () => {
    return import('./main').then(({ createApp }) => createApp())
}

createVueApp()
    .then(async app => {
        moment.locale('zh-cn')
        await boot({ app, store, router })
        return app
    })
    .then(app => app.mount('#app'))
