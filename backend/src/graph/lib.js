const fs = require("fs")
require("colors")

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

module.exports.load = (folder, includeIndex = false) => {
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