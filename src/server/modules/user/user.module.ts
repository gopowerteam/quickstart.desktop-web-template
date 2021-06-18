import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserResolver } from './resolvers/user.resolver'
import { UserService } from './services/user.service'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserResolver],
    exports: [UserService, UserResolver, TypeOrmModule]
})
export class UserModule {}
