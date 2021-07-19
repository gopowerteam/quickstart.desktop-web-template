import { Scope } from '@nestjs/common'
import { Injectable, LoggerService } from '@nestjs/common'
import * as log4js from 'log4js'

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
    private _logger: log4js.Logger
    private _category: string

    constructor() {
        log4js.configure({
            appenders: { app: { type: 'console' } },
            categories: {
                default: { appenders: ['app'], level: 'all' },
                proxy: { appenders: ['app'], level: 'all' }
            }
        })
    }

    public setCategory(category) {
        this._category = category
    }

    private get logger() {
        if (!this._logger) this._logger = log4js.getLogger(this._category)

        return this._logger
    }

    log(message: string, ...args) {
        this.logger.info(message, ...args)
    }

    error(message: string, ...args) {
        this.logger.error(message, ...args)
    }

    warn(message: string, ...args) {
        this.logger.warn(message, ...args)
    }

    debug(message: string, ...args) {
        this.logger.debug(message, ...args)
    }

    verbose(message: string, ...args) {
        this.logger.info(message, ...args)
    }
}
