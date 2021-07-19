import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { App } from './entities/app.entity'
import { Group } from './entities/group.entity'
import { AppResolver } from './resolvers/app.resolver'
import { AppService } from './services/app.service'

@Module({
    imports: [TypeOrmModule.forFeature([App, Group])],
    providers: [AppService, AppResolver],
    exports: [AppService, AppResolver, TypeOrmModule]
})
export class AppModule {}
