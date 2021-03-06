
import fs from 'fs'

const __dirname = dirname(import.meta.url)



/*
const files = require("fs").readdirSync(__dirname)
for ( const file of files ) {
    if (file == "index.js") continue // ignore this file
    const model = file.substring(0, file.lastIndexOf("."))
    export const model = require("./" + model);
}
*/

/*
export { default as Asset } from './Asset'
export { default as AssetData } from './AssetData'
export { default as CurrencyExchange } from './CurrencyExchange'
export { default as Holding } from './Holding'
*/



const models = {}

const files = fs.readdirSync(__dirname)
for ( const file of files ) {
    if (file == "index.js") continue // ignore this file
    const model = file.substring(0, file.lastIndexOf("."))
    models[model] = await import("./" + model);
}

export default models