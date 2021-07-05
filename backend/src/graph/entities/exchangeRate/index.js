const assets = require('../../../lib/assets')
const { Luxon } = require('../../../lib/luxon')

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
            exchangeRate : {
                format : "(toCurr : String!, fromCurr : String!) : ExchangeRate",
                resolver : async (parentObject, {toCurr, fromCurr}) => {
                    const rateData = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
                        toCurr, fromCurr, Luxon.local()
                    )
                
                    return rateData
                }
            }
        }
    }
}