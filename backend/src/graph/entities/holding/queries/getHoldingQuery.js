const Holding = require('../../../../models/Holding')

module.exports = {
    getHolding : {
        types : {
            GetHoldingReponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
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