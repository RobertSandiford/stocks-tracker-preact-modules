
const getHoldingQuery = require('./queries/getHoldingQuery')
const getHoldingAdvancedQuery = require('./queries/getHoldingAdvancedQuery')
const getHoldingsQuery = require('./queries/getHoldingsQuery')

const addHoldingMutation = require('./mutations/addHoldingMutation')
const updateHoldingMutation = require('./mutations/updateHoldingMutation')
const removeHoldingMutation = require('./mutations/removeHoldingMutation')

const Holding = require('../../../models/Holding')

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
    opens : [HoldingOpen],
    closes : [HoldingClose]
}`

const holdingInput = `{
    ${typeCore}
}`
const holdingWithIdInput = `{
    _id : ID
    ${typeCore}
}`


module.exports = {
    [entityName] : {
        type : holdingType,
        types : {
            GetHoldingReponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
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