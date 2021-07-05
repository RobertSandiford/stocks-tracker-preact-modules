
const Holding = require('../../../../models/Holding')


module.exports = {
    updateHoldingClose : {
        types : {
            UpdateHoldingCloseResponse : `{
                status : String!
                reason : String
                holdingId : ID!
                holdingClose : ID!
            }`
        },
        format : "(holdingId : ID!, holdingCloseInput : HoldingCloseInput) : UpdateHoldingCloseResponse",
        mutator : (parentObject, {holdingId, holdingCloseInput}) => {
        
            console.log("saving holding close", holdingId, holdingCloseInput)
        
            Holding.updateOne(
                { _id : holdingId },
                { "$push" : { closes : holdingCloseInput } },
                (err, holding) => {
        
                    if (err) {
                        console.error(err)
        
                        const response = {
                            status : "ERROR",
                            reason : "Could not save close info"
                        }
                        return response
                    }
        
                    console.log("Holding updated", holding)
                    
                    // respond
                    const response = {
                        status : "OK",
                        holdin : holding
                    }
                    return response
        
                }
            )
        
        }
    }
}