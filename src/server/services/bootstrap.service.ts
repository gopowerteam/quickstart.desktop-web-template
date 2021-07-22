import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { AppService } from '@server/modules/app/services/app.service'
import { lstatSync, readdirSync } from 'fs'
import { join } from 'path'

const appsPath = join(__dirname, '..', '..', '..', 'src', 'client', 'apps')

@Injectable()
export class BootStrapService implements OnApplicationBootstrap {
    constructor(private readonly appService: AppService) {}

    /**
     * 应用初始化
     */
    async onApplicationBootstrap() {
        await this.syncApplicationList()
    }

    /**
     * 同步App列表
     * @returns
     */
    private async syncApplicationList() {
        // 获取应用目录
        const apps = await Promise.all(
            readdirSync(appsPath)
                .filter(path => lstatSync(`${appsPath}/${path}`).isDirectory())
                .map(async path => import(`${appsPath}/${path}/config.json`))
        )

        return this.appService.syncAppList(apps)
    }
}
