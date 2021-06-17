import * as readYamlFile from 'read-yaml-file'
import { get } from 'lodash'
import { isNullOrUndefined } from 'util'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConfigService {
    private readonly config

    constructor(filePath: string) {
        this.config = readYamlFile.sync(filePath)
    }

    /**
     * 获取配置数据
     * @param key
     * @param defaultValue
     */
    get(key: string, defaultValue?) {
        // 获取本地配置数据
        const value = get(this.config, key, null)

        // 本地配置不存在直接返回默认值
        // 只允许环境值修改本地值
        // 不允许环境值创建新值
        if (isNullOrUndefined(value)) {
            return defaultValue
        }

        // 获取环境配置数据
        const env = process.env[key]

        // 环境值不存在直接返回本地值
        if (isNullOrUndefined(env)) {
            return value
        }

        // 环境值存在对环境值进行转换
        if (value instanceof Array) {
            return env.split(',')
        } else {
            return env
        }
    }
}
