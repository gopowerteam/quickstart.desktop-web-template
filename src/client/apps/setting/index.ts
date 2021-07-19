import config from './config.json'
import { appOption } from '@/apps'

export default appOption(() => import('./pages/setting.vue'), config)
