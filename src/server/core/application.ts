import { INestApplicationContext } from '@nestjs/common'
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants'
import { APP_CONFIG_PROVIDER } from './constant'

// 依赖加载顺序
export class Application {
    private static readonly providerKeys = {
        [APP_CONFIG_PROVIDER]: 'config'
    }

    static initialize<
        T extends INestApplicationContext = INestApplicationContext
    >(application: T): T {
        Application.bootstrap(application)
        return application
    }

    private static bootstrap(app: any) {
        const modules = app.container.getModules()
        for (const module of modules.values()) {
            for (const providerKey in this.providerKeys) {
                if (module.providers.has(providerKey)) {
                    const instanceWrapper = module.providers.get(providerKey)
                    if (!instanceWrapper) {
                        continue
                    }
                    //const instanceHost =
                    instanceWrapper.getInstanceByContextId(STATIC_CONTEXT)
                }
            }
        }
    }
}
