
const getExchangeRateQuery = require('./queries/getExchangeRate')

const entityName = "ExchangeRate"

module.exports = {
    [entityName] : {
        type : `{
            toCurr : String!
            fromCurr : String!
            date : Date!
            rate : Float!
        }`,
        queries : {
            ...getExchangeRateQuery
        }
    }
}