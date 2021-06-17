import { GraphQLClient } from 'graphql-request'
import { inject } from 'vue'
import { Chain } from './zeus/index.js'

export const useGraphql = () => {
    const host = import.meta.env.SSR ? '' : globalThis.location.origin
    return Chain(`${host}/graphql`)
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
