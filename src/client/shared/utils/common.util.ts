import { get } from 'lodash'

/**
 * 列表数据转换为树形数据
 * @param param
 */
export function convertToTree(
    data,
    {
        key,
        parentKey,
        defaultParent
    }: { key: string; parentKey: string; defaultParent?: any }
) {
    // 获取根节点
    const roots = data.filter(
        x => x[key] === defaultParent
    )
    const action = item => {
        // 获取子节点
        const children = data.filter(x => {
            return x[parentKey] === item[key]
        })

        if (children && children.length > 0) {
            return {
                ...item,
                children: children.map(action)
            }
        } else {
            return {
                ...item
            }
        }
    }
    return roots.map(action)
}

export function filterTree(tree, arr: any[] = []) {
    if (!tree.length) return []

    const checkChild = item => {
        if (item.children && item.children.length > 0) {
            return item.children.every(checkChild)
        }
        return item.disabled
    }

    for (const item of tree) {
        if (item.disabled) {
            if (item.children && item.children.length === 0) {
                continue
            }
            if (!item.children) {
                continue
            }
            if (
                item.children &&
                item.children.length > 0 &&
                item.children.every(checkChild)
            ) {
                continue
            }
        }
        const node = { ...item, children: [] }
        arr.push(node)
        if (item.children && item.children.length) {
            filterTree(item.children, node.children)
        }
    }
    return arr
}

export function formatCustomDate(date: any) {
    if (date) {
        const tempStr = date.toString()
        return (
            tempStr.substring(0, 4) + '-' + tempStr.substring(4, tempStr.length)
        )
    }
    return ''
}
/**
 * 数据分组
 * @param data
 * @param key
 * @returns
 */
export function groupBy(data: any[], key: string) {
    return data.reduce((result, item) => {
        result[get(item, key, '')] = [
            ...(result[get(item, key, '')] || []),
            item
        ]
        return result
    }, {})
}
