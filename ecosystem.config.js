module.exports = {
    apps: [
        {
            name: 'app',
            script: './dist/server/main.js',
            env: {
                NODE_ENV: 'production'
            },
            log: './output.log'
        }
    ]
}
