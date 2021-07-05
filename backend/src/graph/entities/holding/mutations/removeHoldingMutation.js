
const assets = require('../../../../lib/assets')
const Holding = require('../../../../models/Holding')

// removeHoldingMutation

module.exports = {
    removeHolding : {
        types : {
            RemoveHoldingResponse : `{
                status : String!
                reason : String
                holdingId : ID
            }`
        },
        format : "(holdingId : ID!) : RemoveHoldingResponse!",
        mutator : async (parentEntity, {holdingId}) => {
        
            //console.log("removing holding with id ", holdingId)

            if ( ! holdingId ) { console.log("exiting remove holding because _id is not set/valid"); return }
           
            // delete holding
            try {
                const filter = { _id : holdingId }
                const result = await Holding.deleteOne(filter)

                if (result.deletedCount === 0) {
                    const response = {
                        status : "NOOP",
                        reason : "No records deleted"
                    }
                    //console.log("removeHolding response: ", response)
                    return response
                }

                //console.log("Holding deleted with id: " + holdingId)
                //console.log("result: ", result)
                const response = {
                    status : "OK",
                    _id : holdingId
                }
                //console.log("removeHolding response: ", response)
                return response

            } catch (e) {
                console.log("Error trying to delete Holding: " + e)
                const response = {
                    status : "ERROR",
                    reason : "Could not delete record",
                    holdingId
                }
                //console.log("removeHolding response:" + response)
                return response
            }

        }
    }
}
