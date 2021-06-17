import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm'
import { Group } from './group.entity'
import { EntityClass, EntityWithDate, EntityWithEnable } from './index'
import { Field, ObjectType } from 'type-graphql'
import { pipe } from 'ramda'

@Entity('app')
@ObjectType()
export class App extends pipe(EntityWithDate, EntityWithEnable)(EntityClass) {
    @PrimaryColumn()
    @Field()
    name: string

    @Column()
    @Field()
    title: string

    @Column()
    @Field()
    icon: string

    @ManyToOne(() => Group, group => group.apps)
    @Field(type => Group)
    group: Group
}
