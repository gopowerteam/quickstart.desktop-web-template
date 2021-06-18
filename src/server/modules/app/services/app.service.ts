import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { App } from '@server/modules/app/entities/app.entity'
import { Repository } from 'typeorm'
@Injectable()
export class AppService {
    constructor(
        @InjectRepository(App) private appRepository: Repository<App>
    ) {}

    /**
     * 获取应用列表
     * @returns
     */
    async getAppList() {
        return this.appRepository.find()
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
            .values(apps)
            .onConflict(`("name") DO NOTHING`)
            .execute()

        return await this.getAppList()
    }

    async addUserDesktopApp(app: Partial<App>) {
        // TODO
        return app
    }

    async removeUserDesktopApp(appName: string) {
        // TODO
        return {}
    }
}
