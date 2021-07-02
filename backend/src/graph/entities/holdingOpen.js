
const Holding = require('../../models/Holding')

const entityName = "HoldingOpen"

const type = `{
    _id : ID!
    name : String
    quantity : Float
    buyUnitPrice : Float
    buyTotalPrice : Float
    buyDate : Date
    buyRate : Float
    fees : Float
}`

const mutations = {
    addHoldingOpen : {
        format : `(
            user : Int
            holding_id : ID!
            quantity : Float!
            buyUnitPrice : Float!
            buyTotalPrice : Float
            buyDate : Date!
        ) : HoldingMutationResponse!`,

        resolver : async (parentObject, {user, holding_id, quantity, buyUnitPrice, buyTotalPrice, buyDate}) => {

            let open = {
                quantity,
                buyUnitPrice,
                buyTotalPrice,
                buyDate
            }

            console.log("saving holding open graphql", holding_id, open)
        
            let p = Holding.findOneAndUpdate(
                { _id : holding_id },
                { "$push" : { opens : open } },
                { new : true }
            )
            .then( (holding) => {
                console.log("Holding updated", holding);
                return {
                    status : "OK",
                    holding : holding
                }
            })
            .catch( err => {
                console.log(err)
                return {
                    status : "ERROR",
                    reason : "Could not save open info"
                }
            })

            return p

        }
    }
}

module.exports = {
    [entityName] : {
        type,
        mutations
    }
}