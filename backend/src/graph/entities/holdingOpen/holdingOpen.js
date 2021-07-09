
import addHoldingOpenMutation from './addHoldingOpenMutation'
import removeHoldingOpenMutation from './removeHoldingOpenMutation'


const entityName = "HoldingOpen"

const typeCore =
`quantity : Float!
buyUnitPrice : Float!
buyTotalPrice : Float!
buyDate : Date!
buyRate : Float
fees : Float`

export default {
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