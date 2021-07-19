export interface IAppConfig {
    name: string
    icon: string
    title: string
    maximize: boolean
    admin: boolean
}

export const appOption = (root, config: IAppConfig) => ({
    root,
    ...config
})
