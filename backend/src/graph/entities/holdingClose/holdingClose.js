
import addMutation from './mutations/add'
import updateMutation from './mutations/update'
import deleteMutation from './mutations/delete'

const entityName = "HoldingClose"

const typeCore =
`name : String
quantity : Float
sellUnitPrice : Float
sellTotalPrice : Float
sellDate : Date
sellRate : Float
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
            ...addMutation,
            ...updateMutation,
            ...deleteMutation
        }
    }
}