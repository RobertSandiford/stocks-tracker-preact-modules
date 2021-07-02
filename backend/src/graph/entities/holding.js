
//const addHoldingMutation = require('./mutations/addHolding.js')
//const addHoldingOpenMutation = require('../mutations/addHoldingOpen.js')
//const addHoldingCloseMutation = require('../mutations/addHoldingClose.js')

const Holding = require('../../models/Holding')

const entityName = "Holding"


const addHoldingMutation = {
    addHolding : {
        types : {
            AddHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
        format : "(newHolding : Holding!) : AddHoldingResponse!",
        mutator : (parentEntity, {_id}) => { 
            //const filter = { _id : _id }
            //return Holding.findOne(filter)
        },
    }
}
const updateHoldingMutation = {
    updateHolding : {
        types : {
            RemoveHoldingResponse : `{
                status : String!
                reason : String
                holding : Holding
            }`
        },
        format : "(updatedHolding : Holding!) : UpdateHoldingResponse!",
        mutator : (parentEntity, {_id}) => { 
            //const filter = { _id : _id }
            //return Holding.findOne(filter)
        },
    }
}
const removeHoldingMutation = {
    removeHolding : {
        types : {
            RemoveHoldingResponse : `{
                status : String!
                reason : String
                holdingId : Number
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

        },
    }
}

module.exports = {
    [entityName] : {
        type : `{
            _id : ID!
            name : String
            ticker : String
            exchangeName : String
            exchangeTicker : String
            type : String
            group : String
            region : String
            quantity : Float
            buyUnitPrice : Float
            buyTotalPrice : Float
            buyCurrency : String
            buyDate : Date
            buyRate : Float
            fees : Float
            currentUnitPrice : Float
            currentTotalPrice : Float
            priceCurrency : String
            currentPriceDate : Date
            currentRate : Float
            opens : [Open]
            closes : [Close]
        }`,
        query : {
            format : "(_id : ID!) : Holding!",
            resolver : (parentEntity, {_id}) => { 
                const filter = { _id : _id }
                return Holding.findOne(filter)
            },
        }
        /*
        ,
        mutations : {
            ...addHoldingMutation,
            ...updateHoldingMutation,
            ...removeHoldingMutation
        }
        */
    }
}