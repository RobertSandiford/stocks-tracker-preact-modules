
const addHoldingOpenMutation = require('./addHoldingOpenMutation')
const removeHoldingOpenMutation = require('./removeHoldingOpenMutation')


const entityName = "HoldingOpen"

module.exports = {
    [entityName] : {
        type : `{
            _id : ID!
            name : String
            quantity : Float
            buyUnitPrice : Float
            buyTotalPrice : Float
            buyDate : Date
            buyRate : Float
            fees : Float
        }`,
        mutations : {
            ...addHoldingOpenMutation,
            ...removeHoldingOpenMutation
        }
    }
}