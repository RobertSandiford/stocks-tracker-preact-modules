const mongoose = require('mongoose')

const name = "currency_exchange"
const collection = "currency_exchanges"

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

const model = mongoose.connection.model(name, schema, collection)

module.exports = model