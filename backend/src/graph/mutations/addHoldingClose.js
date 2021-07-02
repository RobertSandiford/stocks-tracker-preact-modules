
module.exports = {
    addHoldingClose : {

        mutation : `(
            user : Int
            holding_id : ID!
            quantity : Float!
            sellUnitPrice : Float!
            sellTotalPrice : Float
            sellDate : Date!
        ) : HoldingMutationResponse!`,

        resolver : (u, {user, _id, quantity, sellUnitPrice, sellTotalPrice, sellDate}) => { 
            const Holding = require('./models/Holding')

            let close = {
                quantity,
                sellUnitPrice,
                sellTotalPrice,
                sellDate
            }

            console.log("saving holding close graphql", _id, close)
        
            Holding.updateOne(
                { _id : _id },
                { "$push" : { closes : close } },
                (err, holding) => {
                    if (err) {
                        console.log(err)
                        return {
                            status : "ERROR",
                            reason : "Could not save close info"
                        }
                    }
        
                    console.log("Holding updated", holding);
                    return {
                        status : "OK",
                        holding : holding
                    }
                }
            )
        }
    }
}