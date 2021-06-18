import { UserRole } from 'src/server/config/enum.config'
import { Entity, Column, ManyToMany, JoinTable, Unique } from 'typeorm'
import {
    EntityClass,
    EntityWithDate,
    EntityWithEnable,
    EntityWithID
} from './index'
import { App } from './app.entity'
import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { pipe } from 'ramda'
registerEnumType(UserRole, {
    name: 'UserRole'
})

@Entity('user')
@ObjectType()
export class User extends pipe(
    EntityWithID,
    EntityWithEnable,
    EntityWithDate
)(EntityClass) {
    @Column({ unique: true })
    @Field()
    username: string

    @Column()
    @Field()
    password: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    nickname: string

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.MEMBER
    })
    @Field(type => UserRole)
    role: string

    @ManyToMany(() => App)
    @JoinTable()
    @Field(type => [App])
    desktop: App[]
}