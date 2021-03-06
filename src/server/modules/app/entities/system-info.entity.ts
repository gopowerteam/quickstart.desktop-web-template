import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SystemInfo {
    @Field()
    administrator: boolean

    @Field(type => [String])
    apps: string[]
}
