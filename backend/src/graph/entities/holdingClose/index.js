
const addMutation = require('./mutations/add')
const updateMutation = require('./mutations/update')
const deleteMutation = require('./mutations/delete')

const entityName = "HoldingClose"

const typeCore =
`name : String
quantity : Float
sellUnitPrice : Float
sellTotalPrice : Float
sellDate : Date
sellRate : Float
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
            ...addMutation,
            ...updateMutation,
            ...deleteMutation
        }
    }
}