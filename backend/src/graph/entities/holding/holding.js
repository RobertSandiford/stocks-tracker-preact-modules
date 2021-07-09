
import getHoldingQuery from './queries/getHoldingQuery'
import getHoldingAdvancedQuery from './queries/getHoldingAdvancedQuery'
import getHoldingsQuery from './queries/getHoldingsQuery'
import addHoldingMutation from './mutations/addHoldingMutation'
import updateHoldingMutation from './mutations/updateHoldingMutation'
import removeHoldingMutation from './mutations/removeHoldingMutation'
import Holding from '../../../models/Holding'

const entityName = "Holding"

const typeCore = `name : String
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
currentRate : Float`

const holdingType = `{
    _id : ID!
    ${typeCore}
    opens : [HoldingOpen]
    closes : [HoldingClose]
}`

const holdingInput = `{
    ${typeCore}
}`
const holdingWithIdInput = `{
    _id : ID
    ${typeCore}
}`

export default {
    [entityName] : {
        type : holdingType,
        inputs : {
            HoldingInput : holdingInput,
            HoldingWithIdInput : holdingWithIdInput,
        },
        queries : {
            holding : {
                format : "(holdingId : ID!) : Holding",
                resolver : (parentEntity, {holdingId}) => {
                    const filter = { _id : holdingId }
                    return Holding.findOne(filter)
                },
            },
            holdings : {
                format : "(userId : ID!) : [Holding]",
                resolver : (parentEntity, {userId}) => {
                    const filter = { userId }
                    return Holding.findMany(filter)
                },
            },
            ...getHoldingQuery,
            ...getHoldingAdvancedQuery,
            ...getHoldingsQuery
        },
        mutations : {
            ...addHoldingMutation,
            ...updateHoldingMutation,
            ...removeHoldingMutation
        }
        
    }
}