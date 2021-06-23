import { Module } from '@nestjs/common'
import { UserModule } from '../modules/user/user.module'
import { AuthService } from './services/auth.service'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtStrategy } from './strategy/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '@server/constants/auth.config'

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}
