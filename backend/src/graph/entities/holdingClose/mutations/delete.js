
const Holding = require('../../../../models/Holding')

module.exports = {
    removeHoldingClose : {
        types : {
            RemoveHoldingCloseResponse : `{
                status : String!
                reason : String
                holdingId : ID!
                holdingCloseId : ID!
            }`
        },
        format : "(holdingId : ID!, holdingCloseId : ID!) : RemoveHoldingCloseResponse",
        mutator : (parentEntity, { holdingId, holdingCloseId }) => {

            console.log("removing close")
        
            // save model to database
            Holding.updateOne(
                { _id : holdingId },
                { '$pull': {
                    closes : { _id : holdingCloseId }
                } },
                (err) => {
                    if (err) {
                        console.error(err)
        
                        const response = {
                            status : "ERROR",
                            reason : "Could not delete close record"
                        }
                        return response
        
                    }
        
                    console.log(
                        `Close record deleted Holding: ${holdingId} Close: ${holdingCloseId}`
                    )
        
                    const response = {
                        status : "OK",
                        holdingId,
                        holdingCloseId,
                    }
                    return response
        
                }
            )
        
        }
    }
}
