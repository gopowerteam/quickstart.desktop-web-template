import { Module, DynamicModule, Global } from '@nestjs/common'
import { ConfigService } from '../config/services/config.service'
import { DatabaseService } from './services/database.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
    APP_CONFIG_PROVIDER,
    APP_DATABASE_PROVIDER
} from '@server/core/constant'

@Global()
@Module({})
export class DatabaseModule {
    public static async forRoot(): Promise<DynamicModule> {
        // const entities = await DatabaseService.getEntities()

        const providers = [
            {
                provide: APP_DATABASE_PROVIDER,
                useFactory: async (
                    config: ConfigService
                ): Promise<DatabaseService> => {
                    return new DatabaseService(config)
                },
                inject: [APP_CONFIG_PROVIDER]
            }
        ]

        return {
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: (database: DatabaseService) => {
                        return database.getConfig()
                    },
                    inject: [APP_DATABASE_PROVIDER]
                })
            ],
            module: DatabaseModule,
            providers: [...providers],
            exports: [...providers, TypeOrmModule]
        }
    }
}
