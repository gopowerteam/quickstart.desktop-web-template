import { Module, DynamicModule, Global } from '@nestjs/common'
import { ConfigService } from './services/config.service'
import { APP_CONFIG_PROVIDER } from '../../core/constant'

@Global()
@Module({})
export class ConfigModule {
    static forRoot(configFilePath): DynamicModule {
        const providers = [
            {
                provide: APP_CONFIG_PROVIDER,
                useFactory: () => new ConfigService(configFilePath)
            }
        ]

        return {
            module: ConfigModule,
            providers,
            exports: providers
        }
    }
}
