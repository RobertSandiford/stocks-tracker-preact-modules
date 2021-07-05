
const Holding = require('../../../models/Holding')


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
        format : "(holdingId : ID!, holdingClose : HoldingClose) : UpdateHoldingCloseResponse",
        mutator : (parentObject, {holdingId, holdingClose}) => {
        
            console.log("saving holding close", holdingId, holdingClose)
        
            Holding.updateOne(
                { _id : holdingId },
                { "$push" : { closes : holdingClose } },
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