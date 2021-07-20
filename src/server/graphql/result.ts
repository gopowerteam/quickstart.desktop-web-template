import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ResultString {
    @Field()
    public data: String
}

@ObjectType()
export class ResultBoolean {
    @Field()
    public data: boolean
}

@ObjectType()
export class ResultNumber {
    @Field()
    public data: number
}
