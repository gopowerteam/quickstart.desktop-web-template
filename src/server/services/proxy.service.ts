import * as HttpProxy from 'http-proxy'
import { Request, Response } from 'express'
import * as http from 'http'
import * as url from 'url'
import { ConfigService } from '../config/services/config.service'
import { APP_CONFIG_PROVIDER } from '../core/constant'
import { Inject } from '@nestjs/common'
import { Logger } from '../logger/services/logger.service'
import { safeEncodeURI } from '../shared/utils'

export class ProxyService {
    private readonly proxy: HttpProxy

    constructor(
        @Inject(APP_CONFIG_PROVIDER) private config: ConfigService,
        private logger: Logger
    ) {
        this.proxy = this.createProxy()
        this.logger.setCategory('proxy')
    }

    /**
     * 创建代理服务
     */
    private createProxy() {
        const proxy = HttpProxy.createProxyServer({
            secure: false,
            prependPath: true,
            ignorePath: true,
            changeOrigin: true
        })

        proxy.on('error', this.onProxyError)
        proxy.on('proxyReq', this.onProxyReq)

        return proxy
    }

    private onProxyReq(proxyReq, req, res, options) {
        if (req.body) {
            const bodyData = JSON.stringify(req.body)
            // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
            proxyReq.setHeader('Content-Type', 'application/json')
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
            // stream the content
            proxyReq.write(bodyData)
        }
    }

    /**
     * 代理异常处理
     * @param err
     * @param req
     * @param res
     * @param target
     */
    private onProxyError(
        err: Error,
        req: http.IncomingMessage,
        res: http.ServerResponse,
        target?: string | Partial<url.Url>
    ) {
        this.logger.error('Proxy Error', req, target)
        res.end(JSON.stringify(err))
        // TODO:添加服务异常处理
    }

    /**
     * 发送代理数据
     * @param req
     * @param res
     * @param service
     */
    public async forward(req: Request, res: Response) {
        const proxyTarget = this.config.get('proxy.target')
        const timeout = 1000 * 30
        const proxyTimeout = 1000 * 30

        // 生成代理路径
        const target = `${proxyTarget}/${req.url}`
        this.proxy.web(
            req,
            res,
            {
                target: safeEncodeURI(target),
                timeout: Number(timeout),
                proxyTimeout: Number(proxyTimeout)
            },
            e => console.error(e)
        )
    }
}
