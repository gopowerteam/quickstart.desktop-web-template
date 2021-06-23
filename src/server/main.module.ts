import { CacheModule, ContextType, Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { ProxyService } from './services/proxy.service'
import { ApiController } from './controllers/api.controller'
import { LoggerModule } from './logger/logger.module'
import { DatabaseModule } from './database/database.module'
import { TypeGraphQLModule } from 'typegraphql-nestjs'
import { join } from 'path'
import { AppModule } from './modules/app/app.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt.guard'

// 配置文件路径
const configFilePath = join(__dirname, '..', '..', 'config.yml')

// 业务模块
const MODULES = [AppModule, UserModule]

@Module({
    imports: [
        CacheModule.register(),
        LoggerModule,
        ConfigModule.forRoot(configFilePath),
        TypeGraphQLModule.forRoot({
            emitSchemaFile: true,
            dateScalarMode: 'timestamp',
            debug: true,
            playground: true
        }),
        DatabaseModule.forRoot(),
        AuthModule,
        ...MODULES
    ],
    controllers: [ApiController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        },
        ProxyService
    ]
})
export class MainModule {}
