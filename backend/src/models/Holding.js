const mongoose = require('mongoose')

let name = "holding"
let collection = "holdings"

const openSchema = mongoose.Schema({ 
    name : {
        type : 'string',
    },
    quantity : {
        type : Number,
    },
    buyUnitPrice : {
        type : Number,
    },
    buyTotalPrice : {
        type : Number,
    },
    buyDate : {
        type : Date,
    },
    fees : {
        type : Number
    }
});

const closeSchema = mongoose.Schema({ 
    name : {
        type : 'string',
    },
    quantity : {
        type : Number,
    },
    sellUnitPrice : {
        type : Number,
    },
    sellTotalPrice : {
        type : Number,
    },
    sellDate : {
        type : Date,
    },
    fees : {
        type : Number
    }
});

const schema = mongoose.Schema({
    user : {
        type : Number
    },
    name : {
        type : String,
    },
    type : {
        type : String,
    },
    ticker : {
        type : String,
    },
    /*custom : {
        type : Boolean,
        default : false,
    },*/
    exchangeName : {
        type : String,
    },
    exchangeTicker : {
        type : String,
    },
    priceCurrency : {
        type : String,
    },
    group : {
        type : String
    },
    region : {
        type : String
    },
    quantity: {
        type : Number
    },
    buyUnitPrice : {
        type : Number,
    },
    buyTotalPrice : {
        type : Number,
    },
    buyCurrency : {
        type : String,
    },
    buyDate : {
        type : Date,
    },
    fees : {
        type : Number,
    },
    currentUnitPrice : {
        type : Number
    },
    currentPriceDate : {
        type : Date,
    },
    opens : [openSchema],
    closes : [closeSchema]
})

const model = mongoose.model(name, schema, collection)

module.exports = model