
const { Luxon, LuxonSettings, stDateFormat } = require('../../../lib/luxon')
const assets = require('../../../lib/assets')
const Holding = require('../../../models/Holding')

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
        format : "(holdingData : HoldingInput!) : UpdateHoldingResponse!",
        mutator : async (parentEntity, updatedHolding) => { 

            console.log("updating holding")

            let currTime = Luxon.local().toISO();
            console.log("currTime", currTime)
            updatedHolding.currentPriceDate = currTime

            console.log("try update", updatedHolding)

            try {

                const holdingDocument = await Holding.findOneAndUpdate(
                    { _id : holding._id },
                    holding,
                    { new : true }
                ).lean()

                console.log(holdingDocument)
                    
                //respond
                const response = {
                    status : "OK",
                    holding : holdingDocument
                }
                console.log(response)
                return response

            } catch (e) {
                console.log("error: ", e)
                const response = {
                    status : "ERROR",
                    reason : "Could not update record"
                }
                console.log(response)
                return response
            }

        },
    }
}
