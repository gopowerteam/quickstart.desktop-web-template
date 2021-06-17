import { gql } from 'graphql-request'

// 用户数据结构
const userFragment = gql`
    fragment user on User {
        id
        username
        nickname
    }
`

// 获取用户列表
export const getUserList = gql`
    query Users {
        users {
            ...user
        }
    }
    ${userFragment}
`

// 获取超级用户信息
export const getRootUser = gql`
    query Root {
        root {
            ...user
        }
    }
    ${userFragment}
`

// 创建超级用户
export const createRootUser = gql`
    mutation creater($password: String!) {
        createRootUser(password: $password) {
            ...user
        }
    }

    ${userFragment}
`

// 创建用户
// export const createUser = gql`
//   mutation creater($: String!) {
//     createRootUser(password: $password) {
//       ...user
//     }
//   }
//
//   ${userFragment}
// `;

// 用户登录
export const userLogin = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ...user
        }
    }

    ${userFragment}
`
