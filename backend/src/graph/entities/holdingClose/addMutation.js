
const Holding = require('../../../models/Holding')

module.exports = {
    addHoldingClose : {
        format : `(
            user : Int
            holding_id : ID!
            quantity : Float!
            sellUnitPrice : Float!
            sellTotalPrice : Float
            sellDate : Date!
        ) : UpdateHoldingResponse!`,

        mutator : (parentObject, { user, _id, quantity, sellUnitPrice, sellTotalPrice, sellDate }) => {

            const close = {
                quantity,
                sellUnitPrice,
                sellTotalPrice,
                sellDate
            }

            console.log("saving holding close graphql", _id, close)
        
            Holding.updateOne(
                { _id },
                { "$push" : { closes : close } },
                (err, holding) => {
                    if (err) {
                        console.log(err)
                        return {
                            status : "ERROR",
                            reason : "Could not save close info"
                        }
                    }
        
                    console.log("Holding updated", holding)
                    return {
                        status : "OK",
                        holding
                    }
                }
            )
        }
    }
}