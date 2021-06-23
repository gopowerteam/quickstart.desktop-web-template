import { pipe } from 'ramda'
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { App } from './app.entity'
import { EntityClass, EntityWithID } from '@server/entities/index'
import { Field, ObjectType } from '@nestjs/graphql'

@Entity('group')
@ObjectType()
export class Group extends pipe(EntityWithID)(EntityClass) {
    @Column()
    @Field()
    name: string

    @OneToMany(() => App, app => app.group)
    apps: App[]
}
