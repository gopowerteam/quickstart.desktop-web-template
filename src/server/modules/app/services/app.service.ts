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
     * 查询分组
     * @param id
     * @returns
     */
    async findGroup(id) {
        return this.groupRepository.findOne(id)
    }

    /**
     * 获取应用列表
     * @returns
     */
    async getAppList() {
        return this.appRepository.find({ relations: ['group'] })
    }

    /**
     * 更新应用信息
     * @returns
     */
    async updateApp(app: Partial<App>) {
        return this.appRepository.update(
            {
                name: app.name
            },
            {
                title: app.title,
                icon: app.icon,
                group: app.group
            }
        )
    }

    /**
     * 更新分组信息
     * @returns
     */
    async updateGroup(group: Partial<Group>) {
        const { id, ...data } = group
        return this.groupRepository.update(
            {
                id
            },
            data
        )
    }

    /**
     * 更新分组信息
     * @returns
     */
    async deleteGroup(id: number) {
        const group = await this.findGroup(id)

        // 解散分组应用
        await this.appRepository.update(
            {
                group: group
            },
            {
                group: undefined
            }
        )

        // 移除分组
        return this.groupRepository.delete(id)
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
    async createGroup(title: string) {
        return this.groupRepository.save({
            title
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
