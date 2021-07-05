
module.exports.callFuncIfExists = (f, p) => {
    if (typeof f == "function") {
        if (typeof p != "array" && typeof p != "object") p = [p]
        f(...p)
    }
}
