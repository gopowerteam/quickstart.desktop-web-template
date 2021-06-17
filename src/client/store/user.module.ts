import { appConfig } from '@/config/app.config'
import store from '.'

export interface IState {
    current?: IUser
    code?: string
}

export interface IUser {
    username: string
    nickname: string
    token: string
    id: string
    role: string
    desktop: any[]
}

export default {
    namespaced: true,
    state: (): IState => ({
        current: undefined,
        code: undefined
    }),
    getters: {
        isAdmin(state) {
            return state.current.role === 'admin'
        }
    },
    mutations: {
        updateUser(state, user) {
            state.current = user
            store.commit('app/updateDesktopApps', user.desktop)
        },
        updateCode(state, code) {
            state.code = code
        },
        logout(state) {
            state.current = {}
        }
    }
}
