function iterableCopyProps(to, from) {
    for (const key in from) {
        if (typeof from[key] === "object") {
            to[key] = new Iterable({})
            iterableCopyProps(to[key], from[key])
        } else {
            to[key] = from[key]
        }
    }
}

class Iterable extends Object {
    constructor(obj) {
        super()
        iterableCopyProps(this, obj)
    }
    foreach(f) {
        for (const key in this) {
            f(key, this[key])
        }
    }
}
