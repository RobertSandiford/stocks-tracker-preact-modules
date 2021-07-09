
import getExchangeRateQuery from './queries/getExchangeRate'

const entityName = "ExchangeRate"

export default {
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