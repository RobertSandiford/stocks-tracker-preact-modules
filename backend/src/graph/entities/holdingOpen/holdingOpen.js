
const addHoldingOpenMutation = require('./addHoldingOpenMutation')
const removeHoldingOpenMutation = require('./removeHoldingOpenMutation')


const entityName = "HoldingOpen"

const typeCore =
`quantity : Float!
buyUnitPrice : Float!
buyTotalPrice : Float!
buyDate : Date!
buyRate : Float
fees : Float`

module.exports = {
    [entityName] : {
        type : `{
            _id : ID!
            ${typeCore}
        }`,
        input : `{
            ${typeCore}
        }`,
        mutations : {
            ...addHoldingOpenMutation,
            ...removeHoldingOpenMutation
        }
    }
}