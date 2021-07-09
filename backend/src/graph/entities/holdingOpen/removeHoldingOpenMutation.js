import Holding from '../../../models/Holding'

export default {
    removeHoldingOpen : {
        types : {
            RemoveHoldingIdResponse : `{
                status : String!
                reason : String
                holdingId : ID!
                holdingOpenId : ID!
            }`
        },
        format : "(holdingId : ID!, holdingOpenId : ID!) : RemoveHoldingIdResponse!",
        mutator : (parentObject, {holdingId, holdingOpenId}) => {

            console.log("removing open", holdingId, holdingOpenId)
  
            
            // save model to database
            Holding.findOneAndUpdate(
                { _id : holdingId },
                { '$pull': {
                    opens : { _id : holdingOpenId }
                } },
                { new : true },
                (err, holding) => {
                    if (err) {
                        console.log(err)
                        const result = {
                            status : "ERROR",
                            reason : "Could not delete open record"
                        }
                        return result
                    }
                    console.log("Open record deleted Holding: " + holdingId + " Open: " + holdingOpenId)
                    const result = {
                        status : "OK",
                        holdingId,
                        holdingOpenId
                    }
                    return result
                }
            )

        }
    }
}