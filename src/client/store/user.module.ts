export interface IState {
    current?: IUser
    token?: string
}

export interface IUser {
    username: string
    nickname: string
    id: string
    role: string
    desktop: any[]
}

export default {
    namespaced: true,
    state: (): IState => ({
        current: undefined,
        token: undefined
    }),
    getters: {
        isAdmin(state) {
            return state.current.role === 'admin'
        }
    },
    mutations: {
        updateUser(state, user) {
            state.current = user
        },
        updateToken(state, token) {
            state.token = token
        },
        clearUser(state) {
            state.current = {}
            state.token = ''
        }
    }
}
