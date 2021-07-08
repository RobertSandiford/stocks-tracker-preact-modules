const { Luxon } = require('../../../../lib/luxon')
const assets = require('../../../../lib/assets')

module.exports = {
    getExchangeRate : {
        types : {
            GetExchangeRateResponse : `{
                status : String!
                reason : String
                exchangeRate : ExchangeRate
            }`
        },
        format : "(toCurr : String!, fromCurr : String!) : GetExchangeRateResponse!",
        resolver : async (_, {toCurr, fromCurr}) => {
            try {
                const exchangeRate = await assets.getCurrencyExchangeRateUpdateIfNeededPromise(
                    toCurr, fromCurr, Luxon.local()
                )
                return {
                    status : "OK",
                    exchangeRate
                }
            } catch(e) {
                return {
                    status : "Error",
                    reason : "Unkown error getting exchange rate"
                }
            }
        }
    }
}