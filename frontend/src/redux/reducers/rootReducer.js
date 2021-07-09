
const baseReducer = (state = {}, {type, payload}) => {
    const s = {...state}

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
        const holding_id = payload
        s.holdings = s.holdings.filter( x => x._id != holding_id )
    }

    //// Update a specific holding
    //// Receives: Holding
    if (type == "updateHolding") {
        const holdings = [...s.holdings]
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
        const holding = payload.holding
        const open = payload.open

        const holdings = [...s.holdings]
        for (const [k, h] of holdings.entries()) {
            if (h._id == holding._id) {
                const newHolding = {...h}
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
        const holding = payload.holding
        const close = payload.close

        const holdings = [...s.holdings]
        for (const [k, h] of holdings.entries()) {
            if (h._id == holding._id) {
                const newHolding = {...h}
                newHolding.closes = newHolding.closes.filter(
                    x => x._id != close._id
                )
                holdings[k] = newHolding
                break
            }
        }
        s.holdings = holdings
    }

    console.log(s)

    return s
}

export default baseReducer