const fs = require("fs")

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

module.exports.load = (folder, includeIndex = false) => {
    let items = {}
    //console.log("load dirname", __dirname)
    const files = fs.readdirSync(folder)
    for ( const file of files ) {
        if ( ! includeIndex && file !== "index.js" ) {
            items = { ...items, ...require(folder + "/" + file) }
        }
    }
    return items
}