import { GraphQLClient } from 'graphql-request'
import { inject } from 'vue'
import { Chain } from './zeus/index.js'
import store from '@/store'

export const useGraphql = () => {
    const host = import.meta.env.SSR ? '' : globalThis.location.origin
    const token = store.state.user.token

    const getHeader = () => {
        const header: { [key: string]: string } = {
            'Content-Type': 'application/json'
        }

        if (token) header.Authorization = `Bearer ${token}`
        return header
    }

    return Chain(`${host}/graphql`, {
        headers: getHeader()
    })
}

const endpoint = '/graphql'
const DefaultGraphQLClient = 'DefaultGraphQLClient '
const GraphQLClientInstance = new GraphQLClient(endpoint, {})

export const createGraphQL = () => {
    return {
        install: (app, options) => {
            app.provide(DefaultGraphQLClient, GraphQLClientInstance)
        }
    }
}

export const useRequest = () => {
    const graphQLClient = inject(DefaultGraphQLClient) as GraphQLClient
    return graphQLClient.request.bind(graphQLClient)
}

export const createRequest = () => {
    return GraphQLClientInstance.request.bind(GraphQLClientInstance)
}
