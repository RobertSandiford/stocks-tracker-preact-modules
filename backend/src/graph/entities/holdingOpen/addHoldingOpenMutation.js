
const Holding = require('../../../models/Holding')

module.exports = {
    addHoldingOpen : {
        format : `(
            user : Int
            holdingId : ID!
            quantity : Float!
            buyUnitPrice : Float!
            buyTotalPrice : Float
            buyDate : Date!
        ) : UpdateHoldingResponse!`,

        mutator : async (parentObject, {user, holdingId, quantity, buyUnitPrice, buyTotalPrice, buyDate}) => {

            const open = {
                quantity,
                buyUnitPrice,
                buyTotalPrice,
                buyDate
            }

            console.log("saving holding open graphql", holdingId, open)
        
            const p = Holding.findOneAndUpdate(
                { _id : holdingId },
                { "$push" : { opens : open } },
                { new : true }
            )
            .then( holding => {
                console.log("Holding updated", holding)
                return {
                    status : "OK",
                    holding
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