
// creates some globals

global.log = (...items) => {
    console.log(...items)
}

global.error = (...items) => {
    console.error(...items)
    //console.trace(...items)
}