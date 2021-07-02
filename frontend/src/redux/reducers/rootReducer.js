/*
import { combineReducers } from 'redux'

import apolloClientReducer from './apolloClient'
import holdingsReducer from './holdings'
import groupsReducer from './groups'
*/

const baseReducer = (state = {}, {type, payload}) => {
    let s = {...state}

    //console.log("Root reducer", message)
    console.log("Root reducer", type, payload)

    
    //// Standard Generic Update
    //// Receives: { Key1 : Value1, Key2 : Value2... }
    if (type == "update") {
        for (const k in payload) {
            s[k] = payload[k]
        }
    }

    //// Add a holding
    //// Receives: Holding
    if (type == "addHolding") {
        s.holdings = [...s.holdings, payload]
    }

    //// Remove a holding
    //// Receives: holding_
    if (type == "removeHoldingById") {
        let holding_id = payload
        s.holdings = s.holdings.filter( x => x._id != holding_id )
    }

    //// Update a specific holding
    //// Receives: Holding
    if (type == "updateHolding") {
        let holdings = [...s.holdings]
        for (const [k, h] of holdings.entries()) {
            if (h._id == payload._id) {
                holdings[k] = payload
                break
            }
        }
        s.holdings = holdings
    }

    //// Remove a specific holding open
    //// Receives: { holidng : Holding, open : Open }
    if (type == "removeHoldingOpen") {
        let holding = payload.holding
        let open = payload.open

        let holdings = [...s.holdings]
        for (let [k, h] of holdings.entries()) {
            if (h._id == holding._id) {
                let newHolding = {...h}
                newHolding.opens = newHolding.opens.filter( x => x._id != open._id )
                holdings[k] = newHolding
                break
            }
        }
        s.holdings = holdings
    }

    //// Remove a specific holding close
    //// Receives: { holidng : Holding, close : Close }
    if (type == "removeHoldingOpen") {
        let holding = payload.holding
        let close = payload.close

        let holdings = [...s.holdings]
        for (let [k, h] of holdings.entries()) {
            if (h._id == holding._id) {
                let newHolding = {...h}
                newHolding.closes = newHolding.closes.filter( x => x._id != closes._id )
                holdings[k] = newHolding
                break
            }
        }
        s.holdings = holdings
    }


    console.log(s)

    return s
}

/*
const rootReducer = combineReducers({
    //baseReducer,
    apolloClient : apolloClientReducer,
    holdings : holdingsReducer,
    groups : groupsReducer,
})
*/

export default baseReducer