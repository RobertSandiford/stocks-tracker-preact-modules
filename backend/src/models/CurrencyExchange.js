const mongoose = require('mongoose')

let name = "currency_exchange"
let collection = "currency_exchanges"

const schema = mongoose.Schema({
    toCurr : {
        type : String,
        required: true
    },
    fromCurr : {
        type : String,
        required: true
    },
    date : {
        type : Date,
        required: true
    },
    rate : {
        type : Number,
        required: true
    }
})

const model = mongoose.model(name, schema, collection)

module.exports = model