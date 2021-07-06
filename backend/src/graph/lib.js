const fs = require("fs")

module.exports.loadEntities = (folder) => {
    let entities = {}
    const files = fs.readdirSync(folder)
    for ( const file of files ) {
        if (file !== "index.js") {
            entities = { ...entities, ...require(folder + "/" + file) }
        }
    }
}