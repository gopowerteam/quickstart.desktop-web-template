import { Field, ObjectType } from '@nestjs/graphql'
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm'

export class EntityClass {
    toPlain() {
        return Object.assign({}, this)
    }

    static toPlain(data) {
        if (data instanceof Array) {
            return data.map(x => Object.assign({}, x))
        } else {
            return Object.assign({}, data)
        }
    }
}

export type Constructor<T = EntityClass> = new (...args: any[]) => T

/**
 * 基础实体类型
 * 默认添加id字段
 * @param Base
 * @returns
 */
export function EntityWithID<TBase extends Constructor>(Base: TBase) {
    @ObjectType()
    abstract class AbstractBase extends Base {
        @PrimaryGeneratedColumn()
        @Field()
        id: number
    }
    return AbstractBase
}

/**
 * 基础实体类型
 * 默认添加enable字段
 * @param Base
 * @returns
 */
export function EntityWithEnable<TBase extends Constructor>(Base: TBase) {
    @ObjectType()
    abstract class AbstractBase extends Base {
        @Column({ type: 'boolean', default: true })
        @Field()
        enable: boolean
    }
    return AbstractBase
}

/**
 * 基础实体类型
 * 默认添加createAt字段 *
 * 默认添加updateAt字段 *
 * @param Base
 * @returns
 */
export function EntityWithDate<TBase extends Constructor>(Base: TBase) {
    @ObjectType()
    abstract class AbstractBase extends Base {
        @Column({
            type: 'datetime',
            nullable: true
        })
        @Field()
        public updatedAt: number

        @Column({
            type: 'datetime',
            nullable: true
        })
        @Field()
        public createdAt: number

        @BeforeUpdate()
        public setUpdatedAt() {
            this.updatedAt = Math.floor(Date.now() / 1000)
        }

        @BeforeInsert()
        public updateDates() {
            const time = Math.floor(Date.now() / 1000)
            this.createdAt = time
            this.updatedAt = time
        }
    }
    return AbstractBase
}
