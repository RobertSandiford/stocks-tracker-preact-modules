
const holdingQuery = require('./holding.js')
const getHoldingQuery = require('./getHolding.js')
const getHoldingsQuery = require('./getHoldings.js')

// queries
module.exports = queries = {
    ...holdingQuery,
    ...getHoldingQuery,
    ...getHoldingsQuery
}
