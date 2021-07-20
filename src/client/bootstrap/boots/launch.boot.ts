import store from '@/store'

// import { useGraphql } from '@/graphql'

/**
 * 获取系统状态
 * @returns
 */
function getSystemState() {
    // return useGraphql()
    //     .query({
    //         getSystemState: {
    //             init: true
    //         }
    //     })
    //     .then(({ getSystemState: data }) => {
    //         store.commit('app/initialize', data.init)
    //     })
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
// }a

function updateUserData() {
    // return useGraphql()
    //     .query({
    //         getUserByToken: {
    //             username: true,
    //             nickname: true,
    //             desktop: {
    //                 name: true
    //             },
    //             role: true
    //         }
    //     })
    //     .then(({ getUserByToken: user }) => {
    //         console.log(user)
    //         // store.commit('app/initialize', data.init)
    //     })
}

/**
 * 业务启动逻辑
 */
export async function globalLaunch() {
    // 同步并获取应用
    await Promise.all([])
    // 更新系统状态
    store.commit('app/ready')
}

/**
 * 业务启动逻辑
 */
export async function userLaunch() {
    // 同步并获取应用
    await Promise.all([])
}
