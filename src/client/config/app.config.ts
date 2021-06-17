const config = globalThis['$config'] || {}

export const appConfig = {
    cos: config.cos,
    corpid: config.corpid,
    admin: config.admin
}
