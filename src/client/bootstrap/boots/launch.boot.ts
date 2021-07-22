import { useGraphql } from '@/graphql'
import store from '@/store'
import { ConsoleLogger } from '@nestjs/common'

/**
 * 获取系统状态
 * @returns
 */
function getSystemInfo() {
    return useGraphql()
        .query({
            getSystemInfo: {
                administrator: true
            }
        })
        .then(({ getSystemInfo: data }) => {
            store.commit('app/initialize', data.administrator)
        })
}

/**
 * 更新用户信息
 **/
function getUserInfo() {
    return useGraphql()
        .query({
            getUserByToken: {
                id: true,
                username: true,
                nickname: true,
                role: true,
                desktop: {
                    name: true
                }
            }
        })
        .then(({ getUserByToken: data }) => {
            const { desktop, ...user } = data
            // 更新用户信息
            store.commit('user/updateUser', user)
            // 更新桌面应用
            store.commit('app/updateDesktopApps', desktop)
        })
}

/**
 * 业务启动逻辑
 */
export async function globalLaunch() {
    // 同步并获取应用
    await Promise.all([getSystemInfo()])
    // 更新系统状态
    store.commit('app/ready')
}

/**
 * 业务启动逻辑
 */
export function userLaunch() {
    // 同步并获取应用
    return Promise.all([getUserInfo()])
        .then(() => true)
        .catch(() => {
            // 用户信息更新失败
            store.commit('user/clearUser')
            return '/login'
        })
}
