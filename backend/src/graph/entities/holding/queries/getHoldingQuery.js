const Holding = require('../../../../models/Holding')

module.exports = {
    getHolding : {
        format : "(holdingId : ID!) : GetHoldingReponse!",
        resolver : async (parentEntity, {holdingId}) => {
            const filter = { _id : holdingId }
            const holding = await Holding.findOne(filter)
            const status = (holding !== null)
                ? "OK"
                : "Not Found"
            const response = {
                status,
                holding
            }
            //console.log("getHolding response", response)
            return response
        },
    }
}