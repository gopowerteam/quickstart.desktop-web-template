import { gql } from 'graphql-request'

// 用户数据结构
const userFragment = gql`
    fragment user on User {
        active
        admin
        avatar
        boss
        dept_id_list
        dept_order_list {
            dept_id
            order
        }
        exclusive_account
        hide_mobile
        job_number
        leader_in_dept {
            dept_id
            leader
        }
        name
        real_authed
        role_list {
            id
            name
            group_name
        }
        senior
        title
        unionid
        userid
    }
`

// type Department {
//   dept_id: Int
//   order: Float
// }
//
// type DepartmentLeader {
//   dept_id: Int
//   leader: Boolean
// }
//
// type Role {
//   group_name: String
//   id: Int
//   name: String
// }

// 获取用户列表
export const UserAuthByQrCode = gql`
    query($code: String!) {
        UserAuthByQrCode(code: $code) {
            ...user
        }
    }

    ${userFragment}
`

export const GetUserInfoByCode = gql`
    query($code: String!) {
        GetUserInfoByCode(code: $code) {
            ...user
        }
    }

    ${userFragment}
`
