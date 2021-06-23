import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm'
import { Group } from './group.entity'
import {
    EntityClass,
    EntityWithDate,
    EntityWithEnable
} from '@server/entities/index'
import { pipe } from 'ramda'
import { Field, ObjectType } from '@nestjs/graphql'

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
