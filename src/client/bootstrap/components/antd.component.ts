import { App } from 'vue'
import Antd from 'ant-design-vue'
export const registerAntdComponents = (app: App) => {
    app.use(Antd)
}
