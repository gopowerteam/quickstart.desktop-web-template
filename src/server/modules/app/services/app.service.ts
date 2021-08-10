import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityClass } from '@server/entities'
import { App } from '@server/modules/app/entities/app.entity'
import { Repository, UsingJoinColumnIsNotAllowedError } from 'typeorm'
import { Group } from '../entities/group.entity'
@Injectable()
export class AppService {
    constructor(
        @InjectRepository(App) private appRepository: Repository<App>,
        @InjectRepository(Group) private groupRepository: Repository<Group>
    ) {}

    /**
     * 查询用户
     * @param username
     * @returns
     */
    async findOne(conditions: { [key: string]: any }) {
        return this.appRepository.findOne(conditions, {
            relations: ['group']
        })
    }

    /**
     * 获取应用列表
     * @returns
     */
    async getAppList() {
        return this.appRepository.find({ relations: ['group'] })
    }

    /**
     * 获取应用列表
     * @returns
     */
    async getGroupList() {
        return this.groupRepository.find()
    }

    /**
     * 创建应用分组
     * @returns
     */
    async createGroup(name: string) {
        return this.groupRepository.save({
            name
        })
    }

    /**
     * 同步应用
     * @param apps
     * @returns
     */
    async syncAppList(apps: Partial<App>[]) {
        await this.appRepository
            .createQueryBuilder()
            .insert()
            .into(App)
            .values(EntityClass.toPlain(apps))
            .onConflict('("name") DO NOTHING')
            .execute()

        return await this.getAppList()
    }
}
