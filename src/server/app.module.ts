import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { ConfigModule } from './modules/config/config.module'
import { join } from 'path'
import { ProxyService } from './services/proxy.service'
import { ApiController } from './controllers/api.controller'
import { LoggerModule } from './modules/logger/logger.module'
import { AppService } from './services/app.service'
import { AppResolver } from './graphql/resolvers/app.resolver'
import { DatabaseModule } from './modules/database/database.module'
import { TypeGraphQLModule } from 'typegraphql-nestjs'
import { UserService } from './services/user.service'
import { UserResolver } from './graphql/resolvers/user.resolver'

// 配置文件路径
const configFilePath = join(__dirname, '..', '..', 'config.yml')

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
        DatabaseModule.forRoot()
    ],
    controllers: [ApiController],
    providers: [
        // SERVICES
        ProxyService,
        AppService,
        UserService,
        // RESOLVERS
        AppResolver,
        UserResolver
    ]
})
export class AppModule {}
