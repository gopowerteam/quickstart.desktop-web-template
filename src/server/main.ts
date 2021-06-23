import { NestFactory } from '@nestjs/core'
import { MainModule } from './main.module'
import { createServer } from './ssr'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Application } from './core/application'
import * as Express from 'express'
import { APP_CONFIG_PROVIDER } from './core/constant'
import { Logger } from './logger/services/logger.service'

/**
 * 创建服务实例
 * @returns
 */
async function createApp() {
    const express = Express()
    const { app: server, registerApp } = await createServer(express)
    const app = NestFactory.create(MainModule, new ExpressAdapter(server), {
        bodyParser: true
    }).then(Application.initialize)

    registerApp(app)
    return app
}

async function bootstrap() {
    const app = await createApp()
    // 获取配置服务
    const config = app.get(APP_CONFIG_PROVIDER)
    // 配置日志服务
    const logger = await app.resolve(Logger)
    // 获取监听端口
    const host = config.get('server.host')
    const port = config.get('server.port')
    // 安装日志服务
    app.useLogger(logger)
    // 建立服务监听
    await app.listen(port, host).then(() => {
        logger.log(`启动成功: http://${host}:${port}`)
    })
}

bootstrap()
