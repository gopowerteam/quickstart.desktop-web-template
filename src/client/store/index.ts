import { createStore, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import appModule, { IState as IAppState } from './app.module'
import userModule, { IState as IUserState } from './user.module'
import dictModule, { IState as IDictState } from './dict.module'
import { InjectionKey } from 'vue'

const plugins: any[] = []

const modules = {
    app: appModule,
    user: userModule,
    dict: dictModule
}

interface IModules {
    app: IAppState
    user: IUserState
    dict: IDictState
}

if (!import.meta.env.SSR) {
    plugins.push(
        createPersistedState({
            paths: ['user']
        })
    )
}

export const IStore: InjectionKey<Store<IModules>> = Symbol()

const store = createStore<IModules>({
    modules,
    plugins
})

export default store
