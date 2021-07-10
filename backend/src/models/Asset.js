import mongoose from 'mongoose'

const name = "asset"
const collection = "assets"

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


const model = mongoose.connection.model(name, schema, collection)

export default model