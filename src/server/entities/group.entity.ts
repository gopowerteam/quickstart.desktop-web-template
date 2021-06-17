import { pipe } from 'ramda'
import { Field, ObjectType } from 'type-graphql'
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { App } from './app.entity'
import { EntityClass, EntityWithID } from './index'

@Entity('group')
@ObjectType()
export class Group extends pipe(EntityWithID)(EntityClass) {
    @Column()
    @Field()
    name: string

    @OneToMany(() => App, app => app.group)
    apps: App[]
}
