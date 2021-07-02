
module.exports = {
    addHoldingOpen : {

        mutation : `(
            user : Int
            holding_id : ID!
            quantity : Float!
            buyUnitPrice : Float!
            buyTotalPrice : Float
            buyDate : Date!
        ) : HoldingMutationResponse!`,

        resolver : async (u, {user, holding_id, quantity, buyUnitPrice, buyTotalPrice, buyDate}) => {

            const Holding = require('../../models/Holding')

            let open = {
                quantity,
                buyUnitPrice,
                buyTotalPrice,
                buyDate
            }

            console.log("saving holding open graphql", holding_id, open)
        


            /*
            Holding.findOneAndUpdate(
                { _id : id },
                { "$push" : { opens : open } },
                { new : true },
                (err, holding) => {
                    if (err) {
                        console.log(err)
                        return {
                            status : "ERROR",
                            reason : "Could not save open info"
                        }
                    }
        
                    console.log("Holding updated", holding);
                    return {
                        status : "OK",
                        holding : holding
                    }
                }
            )
*/
            
            let p = Holding.findOneAndUpdate(
                { _id : holding_id },
                { "$push" : { opens : open } },
                { new : true }
            )
            .then( (holding) => {
                console.log("Holding updated", holding);
                return {
                    status : "OK",
                    holding : holding
                }
            })
            .catch( err => {
                console.log(err)
                return {
                    status : "ERROR",
                    reason : "Could not save open info"
                }
            })

            return p

        }
    }
}