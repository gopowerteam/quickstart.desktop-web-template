import { gql } from 'graphql-request'

const fragments = {
    admin: gql`
        fragment admin on Admin {
            userid
            name
            title
        }
    `,
    app: gql`
        fragment app on App {
            name
            title
            icon
            group {
                _id
                order
                name
            }
        }
    `,
    group: gql`
        fragment group on Group {
            _id
            name
            order
        }
    `
}

export const applicationRequest = {
    getAdminList: gql`
        query {
            GetAdminList {
                ...admin
            }
        }

        ${fragments.admin}
    `,
    addAdminList: gql`
        mutation($users: [AdminInput]!) {
            AddAdminList(users: $users) {
                ...admin
            }
        }

        ${fragments.admin}
    `,
    getAppList: gql`
        query {
            GetAppList {
                ...app
            }
        }

        ${fragments.app}
    `,
    syncAppList: gql`
        mutation($apps: [AppInput]!) {
            SyncAppList(apps: $apps) {
                ...app
            }
        }

        ${fragments.app}
    `,
    getGroupList: gql`
        query {
            GetGroupList {
                ...group
            }
        }

        ${fragments.group}
    `,
    addGroup: gql`
        mutation($group: GroupInput) {
            AddGroup(group: $group) {
                ...group
            }
        }

        ${fragments.group}
    `,
    updateApp: gql`
        mutation($app: AppInput) {
            UpdateApp(app: $app) {
                ...app
            }
        }

        ${fragments.app}
    `,
    updateGroup: gql`
        mutation($group: GroupInput) {
            UpdateGroup(group: $group) {
                ...group
            }
        }

        ${fragments.group}
    `,
    deleteGroup: gql`
        mutation($id: String) {
            DeleteGroup(id: $id) {
                _id
            }
        }
    `,
    getUserDesktopApps: gql`
        query($userid: String) {
            GetUserDesktopApps(userid: $userid) {
                userid
                apps
            }
        }
    `,
    addUserDesktopApp: gql`
        mutation($userid: String, $app: String) {
            AddUserDesktopApp(userid: $userid, app: $app) {
                userid
                apps
            }
        }
    `,
    deleteUserDesktopApp: gql`
        mutation ($userid:String,$app:String){{
            DeleteUserDesktopApp(userid:$userid,app:$app){
                userid
                apps
            }
        }
    `,
    getRoleById: gql`
        query($roleid: Int) {
            GetRoleById(roleid: $roleid) {
                roleid 
                apps
            }
        }
    `,
    updateRole: gql`
        mutation ($roleid:Int,$apps:[String]){
            UpdateRole(roleid:$roleid,apps:$apps){
                roleid
                apps
            }
        }
    `,
}
