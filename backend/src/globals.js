import { dirname } from 'path'
import { fileURLToPath } from 'url'


// creates some globals

global.log = (...items) => {
    console.log(...items)
}

global.error = (...items) => {
    console.error(...items)
    //console.trace(...items)
}

global.dirname = (arg) => {
    if (typeof arg === 'string') return dirname(fileURLToPath(arg))
    if (typeof arg === 'object') return dirname(fileURLToPath(arg.url))
}

