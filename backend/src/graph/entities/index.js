const fs = require("fs")

let entities = {}

let files = fs.readdirSync(__dirname)
for ( const file of files ) {
    if (file !== "index.js")
        entities = { ... entities, ... require("./" + file) }
}

module.exports = entities