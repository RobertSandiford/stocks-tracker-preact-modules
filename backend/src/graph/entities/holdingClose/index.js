
const addMutation = require('./addMutation')
const updateMutation = require('./updateMutation')
const deleteMutation = require('./deleteMutation')

const entityName = "HoldingClose"

module.exports = {
    [entityName] : {
        type : `{
            _id : ID!
            name : String
            quantity : Float
            sellUnitPrice : Float
            sellTotalPrice : Float
            sellDate : Date
            sellRate : Float
            fees : Float
        }`,
        mutations : {
            ...addMutation,
            ...updateMutation,
            ...deleteMutation
        }
    }
}