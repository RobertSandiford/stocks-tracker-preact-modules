
//const addHoldingMutation = require('./mutations/addHolding.js')
const addHoldingOpenMutation = require('../mutations/addHoldingOpen.js')
const addHoldingCloseMutation = require('../mutations/addHoldingClose.js')

const Holding = require('../../models/Holding')

const entityName = "Holding"

module.exports = {
    [entityName] : {
        type : `{
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
            opens : [Open]
            closes : [Close]
        }`,
        query : {
            format : "(_id : ID!) : Holding!",
            resolver : (parentEntity, {_id}) => { 
                const filter = { _id : _id }
                return Holding.findOne(filter)
            },
        }
    }
}