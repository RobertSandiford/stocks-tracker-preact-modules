const mongoose = require('mongoose')

const name = "asset_data"
const collection = "asset_data"

const schema = mongoose.Schema({
    ticker : {
        type : String,
        required : true
    },
    type : {
        type : String
    },
    exchangeTicker : {
        type : String,
    },
    date : {
        type : Date,
        required: true
    },
    price : {
        type : Number,
        required : true
    },
    baseCurrency : {
        type : String,
        require : true
    }
})

const model = mongoose.model(name, schema, collection)

module.exports = model