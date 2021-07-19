export function safeEncodeURI(value) {
    if (typeof value !== 'string') {
        value = '' + value
    }

    let current = decodeURI(value)

    while (value !== current) {
        value = decodeURI(value)
        current = decodeURI(current)
    }

    return encodeURI(current)
}
