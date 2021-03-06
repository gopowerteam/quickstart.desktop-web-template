import { ConsoleLogger } from '@nestjs/common'
import {
    Args,
    Field,
    InputType,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver
} from '@nestjs/graphql'
import { UserRole } from '@server/constants/enum.config'
import { CurrentUser } from '@server/decorators/current-user.decorator'
import { Public } from '@server/decorators/public.decorator'
import {
    createResult,
    ResultBoolean,
    ResultStringArray
} from '@server/graphql/result'
import { App } from '@server/modules/app/entities/app.entity'
import { Group } from '@server/modules/app/entities/group.entity'
import { AppService } from '@server/modules/app/services/app.service'
import { User } from '@server/modules/user/entities/user.entity'
import { UserService } from '@server/modules/user/services/user.service'
import * as R from 'ramda'
import { SystemInfo } from '../entities/system-info.entity'

@InputType()
class AppInput {
    @Field()
    name: string

    @Field()
    title: string

    @Field()
    icon: string

    @Field({ nullable: true })
    group?: number
}

@InputType()
class GroupInput implements Partial<Group> {
    @Field()
    id: number

    @Field()
    title: string
}

@Resolver(of => App)
export class AppResolver {
    constructor(
        private readonly appService: AppService,
        private readonly userService: UserService
    ) {}

    /**
     * 获取系统状态
     * @returns
     */
    @Public()
    @Query(returns => SystemInfo)
    async getSystemInfo() {
        // 是否设置管理员
        const admin = await this.userService.findOne({ role: UserRole.ADMIN })
        // 系统应用
        const apps = await this.appService.getAppList()
        return {
            administrator: !!admin,
            apps: apps.map(x => x.name)
        }
    }
    /**
     * 获取应用列表
     * @param param0
     * @returns
     */
    @Query(returns => [App])
    async getAppList(@CurrentUser() user) {
        // TODO: 通过用户权限过滤为当前用户应用
        return await this.appService.getAppList()
    }

    /**
     * 添加用户桌面应用
     * @param user
     * @param app
     * @returns
     */
    @Mutation(returns => ResultStringArray)
    async addUserDesktopApp(
        @CurrentUser() user: User,
        @Args('app') app: string
    ) {
        const target = await this.appService.findOne({ name: app })

        if (target) {
            user = await this.userService.addUserDesktopApp(user, target)
        }

        return createResult(
            ResultStringArray,
            user.desktop.map(x => x.name)
        )
    }

    /**
     * 获取分组列表
     * @returns
     */
    @Query(returns => [Group])
    async getGroupList() {
        return await this.appService.getGroupList()
    }

    /**
     * 获取分组列表
     * @returns
     */
    @Mutation(returns => Group)
    async createGroup(@Args('title') title: string) {
        return await this.appService.createGroup(title)
    }

    /**
     * 删除用户桌面应用
     */
    @Mutation(returns => ResultStringArray)
    async removeUserDesktopApp(
        @CurrentUser() user: User,
        @Args('app') app: string
    ) {
        user = await this.userService.removeUserDesktopApp(user, app)

        return createResult(
            ResultStringArray,
            user.desktop.map(x => x.name)
        )
    }

    @Mutation(returns => ResultBoolean)
    async updateApp(@Args('app') app: AppInput) {
        // 获取Group
        const group = R.isNil(app.group)
            ? app.group
            : await this.appService.findGroup(app.group)

        const { affected } = await this.appService.updateApp({
            name: app.name,
            title: app.title,
            icon: app.icon,
            group
        })

        return createResult(ResultBoolean, affected && affected > 0)
    }

    @Mutation(returns => ResultBoolean)
    async updateGroup(@Args('group') group: GroupInput) {
        const { affected } = await this.appService.updateGroup(group)

        return createResult(ResultBoolean, affected && affected > 0)
    }

    /**
     * 删除分组
     * @returns
     */
    @Mutation(returns => ResultBoolean)
    async deleteGroup(@Args('id') id: number) {
        const { affected } = await this.appService.deleteGroup(id)

        return createResult(ResultBoolean, affected && affected > 0)
    }

    @ResolveField(returns => Group)
    async group(@Parent() app: App) {
        return app.group
    }

    // @Query('GetUserDesktopApps')
    // async getUserApps(@Args('userid') userid: string) {
    //     return await this.applicationService.getUserDesktopApps(userid)
    // }

    // @Query('GetRoleById')
    // async getRoleById(@Args('roleid') roleid: number) {
    //     return await this.applicationService.getRoleById(roleid)

    // }

    // @Mutation('AddGroup')
    // async addGroup(@Args('group') group: any) {
    //     return await this.applicationService.addGroup(group)
    // }

    // @Mutation('AddAdminList')
    // async addAdminList(@Args('users') users: any[]) {
    //     return await this.applicationService.addAdminList(users)
    // }

    // @Mutation('UpdateApp')
    // async updateApp(@Args('app') app: any) {
    //     return await this.applicationService.updateApp(app)
    // }

    // @Mutation('UpdateGroup')
    // async updateGroup(@Args('group') group: any) {
    //     return await this.applicationService.updateGroup(group)
    // }

    // @Mutation('DeleteGroup')
    // async deleteGroup(@Args('id') id: any) {
    //     return await this.applicationService.deleteGroup(id)
    // }

    // @Mutation('AddUserDesktopApp')
    // async addUserDesktopApp(
    //     @Args('userid') userid: string,
    //     @Args('app') app: string
    // ) {
    //     return await this.applicationService.addUserDesktopApp(userid, app)
    // }

    // @Mutation('DeleteUserDesktopApp')
    // async deleteUserDesktopApp(
    //     @Args('userid') userid: string,
    //     @Args('app') app: string
    // ) {
    //     return await this.applicationService.deleteUserDesktopApp(userid, app)
    // }

    // @Mutation('UpdateRole')
    // async updateRole(
    //     @Args('roleid') roleid: number,
    //     @Args('apps') apps: string[]
    // ) {
    //     return await this.applicationService.updateRole(roleid, apps)
    // }
}
