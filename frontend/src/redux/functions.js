
export { default as dispatchFunction } from './dispatcher'

export function getStoreItems(items) {
    return state => {
        const values = {}
        for (const key of items) {
            values[key] = state[key]
        }
        return values
    }
}
