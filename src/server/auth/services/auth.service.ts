import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@server/modules/user/services/user.service'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne({ username })

        if (user && user.password === password) {
            const { password, ...result } = user
            return result
        }

        return null
    }

    async getUserById(id: string, username: string): Promise<any> {
        const user = await this.userService.findOne({ id, username })

        if (user) {
            const { password, ...result } = user
            return result
        }

        return null
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
