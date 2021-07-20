import { HttpException, UnauthorizedException } from '@nestjs/common'
import {
    Args,
    ArgsType,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Parent,
    Query,
    ResolveField,
    Resolver
} from '@nestjs/graphql'
import { AuthService } from '@server/auth/services/auth.service'
import { UserRole } from '@server/constants/enum.config'
import { CurrentUser } from '@server/decorators/current-user.decorator'
import { Public } from '@server/decorators/public.decorator'
import { ResultString } from '@server/graphql/result'
import { App } from '@server/modules/app/entities/app.entity'
import { User } from '@server/modules/user/entities/user.entity'
import { UserService } from '@server/modules/user/services/user.service'

@ArgsType()
class LoginByPasswordArgs {
    @Field()
    username: string

    @Field()
    password: string
}

@InputType()
class UserInput implements Partial<User> {
    @Field()
    username: string

    @Field()
    password: string

    @Field({ nullable: true })
    role: UserRole
}

@Resolver(of => User)
export class UserResolver {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    /**
     * 通过密码登录
     * @param param0
     * @returns
     */
    @Public()
    @Query(returns => ResultString)
    async loginByPassword(@Args() { username, password }: LoginByPasswordArgs) {
        const user = await this.authService.validateUser(username, password)

        if (user) {
            const { access_token } = await this.authService.login({
                username: user.username,
                id: user.id
            })

            return {
                data: access_token
            }
        } else {
            throw new UnauthorizedException()
        }
    }

    @Query(returns => User)
    public getUserByToken(@CurrentUser() user: User) {
        console.log(user)
        return user
    }

    /**
     * 设置管理员
     */
    @Public()
    @Mutation(returns => User)
    async setAdministrator(@Args('user') user: UserInput) {
        const admin = await this.userService.findOne({ role: UserRole.ADMIN })

        if (!admin) {
            return this.userService.createUser(user)
        } else {
            throw new HttpException('管理员已存在', 400)
        }
    }

    /**
     * 获取用户桌面应用
     * @param user
     * @returns
     */
    @ResolveField(returns => [App])
    async desktop(@Parent() user: User) {
        return user.desktop
    }
}
