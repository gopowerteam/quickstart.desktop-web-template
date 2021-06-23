import {
    All,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Param
} from '@nestjs/common'
import { JwtAuthGuard } from '@server/auth/guards/jwt.guard'
import { LocalAuthGuard } from '@server/auth/guards/local.guard'
import { AuthService } from '@server/auth/services/auth.service'
import { Public } from '@server/constants/decorator.config'
import { ProxyService } from '../services/proxy.service'

@Controller()
export class ApiController {
    constructor(
        private readonly proxyService: ProxyService,
        private readonly authService: AuthService
    ) {}

    /**
     * 代理服務
     * @param req
     * @param res
    //  */
    // @All()
    // @UseGuards(AuthGuard('local'))
    // doProxy(@Req() req: Request, @Res() res: Response) {
    //     this.proxyService.forward(req, res)
    // }

    @UseGuards(LocalAuthGuard)
    @Post('api/login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/user')
    getProfile(@Request() req) {
        return req.user
    }

    @Public()
    @Get('api/test')
    getTest() {
        return {
            right: true
        }
    }
}
