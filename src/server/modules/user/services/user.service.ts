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
     * 查询用户
     * @param username
     * @returns
     */
    async findOne(conditions: { [key: string]: any }) {
        return this.userRepository.findOne(conditions, {
            relations: ['desktop']
        })
    }

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
     * 创建用户
     * @param username
     * @param password
     * @returns
     */
    async createUser(user: Partial<User>) {
        const userEntity = this.userRepository.create({
            username: user.username,
            password: user.password,
            role: user.role,
            desktop: []
        })

        return await this.userRepository.save(userEntity)
    }

    /**
     * 获取用户桌面应用
     */
    async getUserDesktop(userId: number) {
        const user = await this.userRepository.findOne(userId, {
            select: ['desktop'],
            relations: ['desktop']
        })

        return user?.desktop
    }

    /**
     * 获取所有用户
     */
    async getUserList() {
        return await this.userRepository.find()
    }
}
