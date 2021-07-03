
const assets = require('../../../lib/assets')
const Holding = require('../../../models/Holding')

// removeHoldingMutation

module.exports = {
    removeHolding : {
        types : {
            RemoveHoldingResponse : `{
                status : String!
                reason : String
                _id : ID
            }`
        },
        format : "(_id : ID!) : RemoveHoldingResponse!",
        mutator : async (parentEntity, {_id}) => { 
        
            console.log("removing holding with id ", _id)

            if ( ! _id ) { console.log("exiting remove holding because _id is not set/valid"); return }
           
            // delete holding
            try {
                const filter = { _id : _id }
                const result = await Holding.deleteOne(filter)

                if (result.deletedCount === 0) {
                    const response = {
                        status : "NOOP",
                        reason : "No records deleted"
                    }
                    console.log("response: ", response)
                    return response
                }

                console.log("Holding deleted with id: " + _id);
                console.log("result: ", result)
                const response = {
                    status : "OK",
                    _id : _id
                }
                console.log("response: ", response)
                return response

            } catch (e) {
                console.log("Error trying to delete Holding: " + e)
                const response = {
                    status : "ERROR",
                    reason : "Could not delete record",
                    holdingId : _id
                }
                console.log("response:" + response)
                return response
            }

        }
    }
}
