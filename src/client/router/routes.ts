import { RouteRecordRaw } from 'vue-router'
import store from '@/store'

const canUserAccess = () => {
    const result = !!store.state.user.current?.id
    return result
}

const canSystemAccess = () => {
    return store.state.app.initialize
}

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/workspace'
    },
    {
        name: 'welcome',
        path: '/welcome',
        component: () => import('@/pages/welcome/welcome.vue')
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/pages/login/login.vue'),
        beforeEnter: async () => {
            const canAccess = await canUserAccess()
            if (canAccess) return '/workspace'
        }
    },
    {
        name: 'worksapce',
        path: '/workspace',
        component: () => import('@/pages/workspace/workspace.vue'),
        beforeEnter: async () => {
            const userAccess = await canUserAccess()
            const systemAccess = await canSystemAccess()

            if (!systemAccess) return '/welcome'
            if (!userAccess) return '/login'
        }
    }
]
