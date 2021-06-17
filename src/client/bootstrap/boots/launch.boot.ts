import store from '@/store'

import { GetUserInfoByCode, UserAuthByQrCode } from '@/graphql/ding-talk.graph'
import qs from 'qs'
import { UsingJoinColumnIsNotAllowedError } from 'typeorm'
import { applicationRequest } from '@/graphql/application.graph'
import { appConfig } from '@/config/app.config'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { application } from 'express'
import { useGraphql } from '@/graphql'
import { ApplicationList } from '@/config/application.config'

const gql = useGraphql()

/**
 * 获取应用列表
 * @returns
 */
function getApplicationList() {
    return gql
        .query({
            getAppList: {
                name: true,
                title: true,
                icon: true
            }
        })
        .then(({ getAppList: data }) => {
            store.commit('app/updateAppList', data)
        })
}

function getSystemInitialize() {
    return gql
        .query({
            getUserList: {
                username: true,
                role: true
            }
        })
        .then(({ getUserList: data }) => {
            if (!data.length) {
                store.commit('app/initialize', false)
            }
        })
}

function syncAppList() {
    const apps = ApplicationList.map(x => ({
        name: x.name,
        title: x.title,
        icon: x.icon
    }))

    return gql
        .mutation({
            syncAppList: [
                { apps },
                {
                    name: true,
                    title: true,
                    icon: true
                }
            ]
        })
        .then(({ syncAppList: data }) => {
            store.commit('app/updateAppList', data)
            store.commit(
                'app/updateUserApplications',
                data.map(x => x.name)
            )
        })
}

// function getUserRoleApplications() {
//     const user = store.state.user.current as any
//     return Promise.all(
//         user.role_list.map(role =>
//             request(applicationRequest.getRoleById, { roleid: role.id })
//         )
//     ).then((data: any[]) => {
//         const isAdmin = store.getters['user/isAdmin']
//         let apps = data
//             .map(x => x.GetRoleById)
//             .filter(x => x && x.apps && x.apps.length)
//             .reduce((result, { apps }) => {
//                 return [...result, ...apps]
//             }, [])

//         if (isAdmin) {
//             apps = store.state.app.applications.map(x => x.name)
//         }

//         store.commit('app/updateUserApplications', apps)
//     })
// }

/**
 * 业务启动逻辑
 */
export default async function launch() {
    // 同步并获取应用
    await Promise.all([syncAppList(), getSystemInitialize()])

    if (store.state.user.current?.id) {
        // await Promise.all([getApplicationList()])
    }

    store.commit('app/ready')
}
