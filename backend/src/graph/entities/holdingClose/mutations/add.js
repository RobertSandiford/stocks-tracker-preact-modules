
import Holding from '../../../../models/Holding'

export default {
    addHoldingClose : {
        types : {
            AddHoldingCloseResponse : `{
                status : String!
                reason : String
                holdingId : ID!
                holdingClose : HoldingClose
            }`
        },
        format : `(
            user : Int
            holdingId : ID!
            holdingCloseInput : HoldingCloseInput!
        ) : AddHoldingCloseResponse!`,
        mutator : async (_, { user, holdingId, holdingCloseInput }) => {
            
            const { quantity, sellUnitPrice, sellTotalPrice, sellDate }
                = holdingCloseInput

            const holdingClose = {
                quantity,
                sellUnitPrice,
                sellTotalPrice,
                sellDate
            }

            //console.log("saving holding close graphql", holdingId, holdingClose)
        
            try {
                const updatedHolding = await Holding.findOneAndUpdate(
                    { _id : holdingId },
                    { "$push" : { closes : holdingClose } },
                    { new: true }
                )
        
                const newHoldingClose = updatedHolding.closes.pop()

                //console.log("Holding updated", updatedHolding)
                return {
                    status : "OK",
                    holdingId,
                    holdingClose : newHoldingClose
                }
            } catch(e) {
                //console.log(3)
                return {
                    status : "ERROR",
                    reason : "Could not save close info"
                }
            }
        }
    }
}