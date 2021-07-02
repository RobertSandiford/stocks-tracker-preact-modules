
const Holding = require('../../models/Holding')

const entityName = "HoldingClose"

const type = `{
    _id : ID!
    name : String
    quantity : Float
    sellUnitPrice : Float
    sellTotalPrice : Float
    sellDate : Date
    sellRate : Float
    fees : Float
}`

const mutations =  {
    addHoldingClose : {
        format : `(
            user : Int
            holding_id : ID!
            quantity : Float!
            sellUnitPrice : Float!
            sellTotalPrice : Float
            sellDate : Date!
        ) : HoldingMutationResponse!`,

        resolver : (parentObject, {user, _id, quantity, sellUnitPrice, sellTotalPrice, sellDate}) => { 

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

module.exports = {
    [entityName] : {
        type,
        mutations
    }
}