import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@server/modules/user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    /**
     * 密码登录
     * @param username
     * @param password
     * @returns
     */
    async loginByPassword(username: string, password: string) {
        return this.userRepository.findOne(
            { username, password },
            {
                relations: ['desktop']
            }
        )
    }

    /**
     * 注册用户
     * @param username
     * @param password
     * @returns
     */
    async registerUser(user: Partial<User>) {
        const userEntity = this.userRepository.create({
            username: user.username,
            password: user.password,
            role: user.role,
            desktop: []
        })

        return await this.userRepository.save(userEntity)
    }

    async getUserDesktop(userId: number) {
        const user = await this.userRepository.findOne(userId, {
            select: ['desktop'],
            relations: ['desktop']
        })

        return user?.desktop
    }

    async getUser(userId) {
        const user = await this.userRepository.findOne(userId, {
            select: ['desktop'],
            relations: ['desktop']
        })
        return user
    }

    async getUserList() {
        return await this.userRepository.find()
    }
}
