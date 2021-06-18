import { get } from 'lodash'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { join } from 'path'
import { readdirSync } from 'fs'
import { ConfigService } from '@server/config/services/config.service'
import { User } from '@server/modules/user/entities/user.entity'
import { App } from '@server/modules/app/entities/app.entity'
import { Group } from '@server/modules/app/entities/group.entity'

const ENTITY_PATH = join(__dirname, '..', '..', '..', 'entities')

export class DatabaseService {
    private entities: any[] = []

    constructor(private config: ConfigService) {
        // DatabaseService.getEntities().then(
        //     entities => (this.entities = entities)
        // )
    }

    /**
     * 获取实体列表
     * @returns
     */
    public static async getEntities(): Promise<any[]> {
        const entities = await Promise.all(
            readdirSync(ENTITY_PATH)
                .filter(path => /^.*?\.entity\.(ts|js)$/.test(path))
                .map(async path => import(join(ENTITY_PATH, path)))
        )
            .then(entities => entities.map(entity => Object.values(entity)))
            .then(entities => entities.flat())

        return entities
    }

    /**
     * 获取数据库配置
     */
    async getConfig(): Promise<TypeOrmModuleOptions> {
        const config = this.config.get('database')

        return {
            ...config,
            synchronize: true,
            // TODO 修改为动态加载
            entities: [User, App, Group]
        }
    }
}
