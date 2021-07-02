const mongoose = require('mongoose')

let name = "asset"
let collection = "assets"

const schema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    ticker : {
        type: String,
        required: true
    },
    exchangeName : {
        type: String,
    },
    exchangeTicker : {
        type: String,
    },
    fees : {
        type : Number,
    },
    dataLoaded : {
        type : Boolean,
        default: false
    }
})

const model = mongoose.model(name, schema, collection)

module.exports = model