import { Luxon } from '../../../../lib/luxon'
import * as assets from '../../../../lib/assets'

export default {
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