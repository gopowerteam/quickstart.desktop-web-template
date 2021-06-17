import { All, Controller, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { ProxyService } from '../services/proxy.service'

@Controller('/api')
export class ApiController {
    constructor(private readonly proxyService: ProxyService) {}

    /**
     * 代理服務
     * @param req
     * @param res
     */
    @All()
    doProxy(@Req() req: Request, @Res() res: Response) {
        this.proxyService.forward(req, res)
    }
}
