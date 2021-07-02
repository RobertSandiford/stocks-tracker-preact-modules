
export { default as dispatchFunction } from './dispatcher'

export function getStoreItems(items) {
    return state => {
        let values = {}
        for (const key of items) {
            values[key] = state[key]
        }
        return values
    }
}
