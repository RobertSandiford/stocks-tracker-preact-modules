import fs from 'fs'
import 'colors'

/*
module.exports.loadEntities = (folder, includeIndex = false) => {
    let entities = {}
    const files = fs.readdirSync(folder)
    for ( const file of files ) {
        if ( ! includeIndex && file !== "index.js" ) {
            entities = { ...entities, ...require(folder + "/" + file) }
        }
    }
    return entities
}
*/

/*
export const loadCjs = (folder, includeIndex = false) => {
    let items = {}
    //console.log("load dirname", __dirname)
    const files = fs.readdirSync(folder, { withFileTypes: true })
    for ( const file of files ) {
        if ( file.isDirectory() ) {
            items = { ...items, ...require(`${folder}/${file.name}/${file.name}`) }
        } else {
            // if includeIndex == false, skip index.js
            if ( ! includeIndex && file.name === "index.js" ) continue
            items = { ...items, ...require(`${folder}/${file.name}`) }
        }
    }
    return items
}
*/

export const load = async (folder, includeIndex = false) => {
    const promises = new Map()
    //console.log("load dirname", __dirname)
    const files = fs.readdirSync(folder, { withFileTypes: true })
    for ( const file of files ) {
        if ( file.isDirectory() ) {
            promises.set(file.name, import(`${folder}/${file.name}/${file.name}`))
        } else {
            // if includeIndex == false, skip index.js
            if ( ! includeIndex && file.name === "index.js" ) continue
            promises.set(file.name, import(`${folder}/${file.name}`))
        }
    }
    const items = await Promise.all(promises)
    return items
}