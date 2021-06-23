import { CacheModule, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
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
    providers: [ProxyService]
})
export class MainModule {}
