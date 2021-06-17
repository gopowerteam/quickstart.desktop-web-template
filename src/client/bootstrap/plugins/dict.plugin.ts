import dictUtil from '@/shared/utils/dict.util'

export default {
    install: (app, options) => {
        app.config.globalProperties.$dict = dictUtil
    }
}
