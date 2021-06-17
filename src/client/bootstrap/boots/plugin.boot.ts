import { App } from 'vue'
import plugins from '@/bootstrap/plugins'

/**
 * 安装插件
 */
export const pluginBoot = async (app: App<Element>) => {
    Object.entries(plugins).forEach(([key, plugin]: [string, any]) => {
        app.use(plugin)
    })
}
