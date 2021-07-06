const { load } = require('../lib')
module.exports = load(__dirname)

/*
const fs = require("fs")

let entities = {}

const files = fs.readdirSync(__dirname)
for ( const file of files ) {
    if (file !== "index.js") {
        entities = { ...entities, ...require("./" + file) }
    }
}

module.exports = entities
*/