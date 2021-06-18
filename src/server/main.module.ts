import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { ProxyService } from './services/proxy.service'
import { ApiController } from './controllers/api.controller'
import { LoggerModule } from './logger/logger.module'
import { DatabaseModule } from './database/database.module'
import { TypeGraphQLModule } from 'typegraphql-nestjs'
import { join } from 'path'
import { AppModule } from './modules/app/app.module'
import { UserModule } from './modules/user/user.module'

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
        ...MODULES
    ],
    controllers: [ApiController],
    providers: [ProxyService]
})
export class MainModule {}
