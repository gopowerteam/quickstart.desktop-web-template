import { GraphQLClient } from 'graphql-request'
import { inject } from 'vue'
import { Chain } from './zeus/index.js'

export const useGraphql = () => {
    const host = import.meta.env.SSR ? '' : globalThis.location.origin
    return Chain(`${host}/graphql`, {
        // TODO AUTH
        headers: {
            'Content-Type': 'application/json',
            Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJpYXQiOjE2MjQ0NDAzOTUsImV4cCI6MTYyNDQ0MDQ1NX0._0JSctyoj1b9HbvRtEqbsmTYv-7xTwAWL99ZmiOEoRA'
        }
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
