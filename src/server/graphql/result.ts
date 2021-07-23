import { Field, ObjectType } from '@nestjs/graphql'

export function createResult<T extends { result: any }>(
    Container: new () => T,
    data
) {
    const container = new Container()
    container.result = data
    return container
}

@ObjectType()
export class ResultString {
    @Field()
    public declare result: String
}

@ObjectType()
export class ResultStringArray {
    @Field(type => [String])
    public result: string[]
}

@ObjectType()
export class ResultBoolean {
    @Field()
    public result: boolean
}

@ObjectType()
export class ResultNumber {
    @Field()
    public result: number
}

@ObjectType()
export class ResultNumberArray {
    @Field(type => [Number])
    public result: number[]
}
