import { UnauthorizedException } from '@nestjs/common'
import {
    Args,
    ArgsType,
    Field,
    InputType,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver
} from '@nestjs/graphql'
import { AuthService } from '@server/auth/services/auth.service'
import { UserRole } from '@server/constants/enum.config'
import { Public } from '@server/decorators/public.decorator'
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
class RegisterUserInput implements Partial<User> {
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
    @Query(returns => User)
    async loginByPassword(@Args() { username, password }: LoginByPasswordArgs) {
        const user = await this.authService.validateUser(username, password)

        if (user) {
            return user
        } else {
            throw new UnauthorizedException()
        }
    }

    @Public()
    @Query(returns => [User])
    async getUserList() {
        return this.userService.getUserList()
    }
    /**
     * 注册创建用户
     * @param param0
     * @returns
     */
    @Mutation(returns => User)
    async registerUser(@Args('user') user: RegisterUserInput) {
        return this.userService.registerUser(user)
    }

    @ResolveField(returns => [App])
    async desktop(@Parent() user: User) {
        return user.desktop
    }
}
