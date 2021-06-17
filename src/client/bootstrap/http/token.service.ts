import { ExtendService } from '@gopowerteam/http-request'
import store from '@/store'

export class TokenService extends ExtendService {
    public before = (params: any) => {
        const userid = store.state.user.current?.id

        if (userid) {
            params.options.header = params.options.header || {}
            params.options.header['X-UserID'] = userid
        }
    }
}
