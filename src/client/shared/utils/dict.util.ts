import * as dictData from '@/config/dict.config'
import store from '@/store'

function dictLocalFilter(value, code) {
    const target = typeof code === 'string' ? (dictData[code] as any[]) : code
    const { label } = target.find(x => x.value === value)
    return label
}

function dictStoreFilter(value) {
    const target = store.state.dict.data.find(x => x.id === value) as any
    return target?.name
}

/**
 * 字典转换
 * @param value
 * @param code 字典名称
 */
export default {
    filter(value, code?, defaultValue?): string {
        const result = code
            ? dictLocalFilter(value, code)
            : dictStoreFilter(value)
        return result || defaultValue
    },
    get(code) {
        return store.state.dict.data.filter(x => x.dict_code === code)
    },
    ...dictData
}
