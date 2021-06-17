import Vue, { App } from 'vue'
import components from '@/bootstrap/components'

/**
 * 安装插件
 */
export const componentsBoot = async (app: App<Element>) => {
    Object.entries(components).forEach(([name, registerComponent]) => {
        registerComponent(app)
    })
}
