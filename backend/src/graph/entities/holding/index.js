
const getHoldingsQuery = require('./getHoldingsQuery')

const addHoldingMutation = require('./addHoldingMutation')
const updateHoldingMutation = require('./updateHoldingMutation')
const removeHoldingMutation = require('./removeHoldingMutation')

const Holding = require('../../../models/Holding')

const entityName = "Holding"

const holdingInput = `{
    name : String
    ticker : String
    exchangeName : String
    exchangeTicker : String
    type : String
    group : String
    region : String
    quantity : Float
    buyUnitPrice : Float
    buyTotalPrice : Float
    buyCurrency : String
    buyDate : Date
    buyRate : Float
    fees : Float
    currentUnitPrice : Float
    currentTotalPrice : Float
    priceCurrency : String
    currentPriceDate : Date
    currentRate : Float
}`

const holdingType = `{
    _id : ID!
    name : String
    ticker : String
    exchangeName : String
    exchangeTicker : String
    type : String
    group : String
    region : String
    quantity : Float
    buyUnitPrice : Float
    buyTotalPrice : Float
    buyCurrency : String
    buyDate : Date
    buyRate : Float
    fees : Float
    currentUnitPrice : Float
    currentTotalPrice : Float
    priceCurrency : String
    currentPriceDate : Date
    currentRate : Float
    opens : [HoldingOpen]
    closes : [HoldingClose]
}`

module.exports = {
    [entityName] : {
        type : holdingType,
        input : holdingInput,
        queries : {
            holding : {
                format : "(_id : ID!) : Holding!",
                resolver : (parentEntity, {_id}) => { 
                    const filter = { _id : _id }
                    return Holding.findOne(filter)
                },
            },
            holdings : {
                format : "(userId : ID!) : Holding!",
                resolver : (parentEntity, {userId}) => { 
                    const filter = { userId : userId }
                    return Holding.findMany(filter)
                },
            },
            ...getHoldingsQuery
        },
        mutations : {
            ...addHoldingMutation,
            ...updateHoldingMutation,
            ...removeHoldingMutation
        }
        
    }
}