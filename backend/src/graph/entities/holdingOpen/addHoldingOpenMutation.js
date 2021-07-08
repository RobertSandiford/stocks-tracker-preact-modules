
const Holding = require('../../../models/Holding')

module.exports = {
    addHoldingOpen : {
        types : {
            AddHoldingOpenResponse : `{
                status : String!
                reason : String
                holdingId : ID!
                holdingOpen : HoldingOpen
            }`
        },
        format : `(
            user : ID
            holdingId : ID!
            holdingOpenInput : HoldingOpenInput
        ) : AddHoldingOpenResponse!`,

        mutator : async (parentObject, { user, holdingId, holdingOpenInput }) => {

            const { quantity, buyUnitPrice, buyTotalPrice, buyDate, buyRate, fees }
                = holdingOpenInput

            const open = {
                quantity,
                buyUnitPrice,
                buyTotalPrice,
                buyDate
            }

            //console.log("saving holding open graphql", holdingId, open)
        
            try {
                const updatedHolding = await Holding.findOneAndUpdate(
                    { _id : holdingId },
                    { "$push" : { opens : open } },
                    { new : true }
                )
                //console.log("Holding updated", holding)
                return {
                    status : "OK",
                    holdingId,
                    holdingOpen : updatedHolding.opens.pop()
                }
            } catch(err) {
                console.log(err)
                return {
                    status : "ERROR",
                    reason : "Could not save open info"
                }
            }

        }
    }
}