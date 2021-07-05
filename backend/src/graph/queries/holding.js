
//const addHoldingMutation = require('./mutations/addHolding.js')
const addHoldingOpenMutation = require('../mutations/addHoldingOpen.js')
const addHoldingCloseMutation = require('../mutations/addHoldingClose.js')

const Holding = require('../../models/Holding')

module.exports = {
    holding : {
        query : "(_id : ID!) : Holding!",
        resolver : (parentEntity, {_id}) => {
            const filter = { _id }
            return Holding.findOne(filter)
        },
        mutations : {
            ...addHoldingOpenMutation,
            ...addHoldingCloseMutation
        }
    }
}