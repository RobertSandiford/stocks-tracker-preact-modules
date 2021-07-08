
const { Luxon } = require('../../../../lib/luxon')
const Holding = require('../../../../models/Holding')

// updateHoldingMutation

module.exports = {
    updateHolding : {

        types : {
            UpdateHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },

        format : "(holdingWithIdInput : HoldingWithIdInput!) : UpdateHoldingResponse!",

        mutator : async (parentEntity, {holdingWithIdInput}) => {

            const updatedHolding = holdingWithIdInput

            //console.log("updating holding", updatedHolding)

            const currTime = Luxon.local().toISO()
            //console.log("currTime", currTime)
            updatedHolding.currentPriceDate = currTime

            //console.log("try update", updatedHolding)

            try {

                const holdingDocument = await Holding.findOneAndUpdate(
                    { _id : updatedHolding._id },
                    updatedHolding,
                    {
                        returnNewDocument : true,
                        lean : true
                    }
                )

                    
                //respond
                const response = {
                    status : "OK",
                    holding : holdingDocument
                }
                //console.log("response", response)
                return response

            } catch(e) {
                console.log("error: ", e)
                const response = {
                    status : "ERROR",
                    reason : "Could not update record"
                }
                //console.log("response", response)
                return response
            }

        },
        
    }
}
