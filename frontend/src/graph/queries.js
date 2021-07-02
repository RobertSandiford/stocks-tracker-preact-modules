
import types from './types'

// experimental, not in use

export default {

    getHoldings : function(userId, displayCurrency, secondCurrency) {
        return `query GetHoldings {
            getHoldings(
                user: ${userId}
                displayCurrency : "${displayCurrency}"
                secondCurrency : "${secondCurrency}"
            ) {
                status
                holdings ${types.Holding}
                groups
                fx ${types.Fx}
            }
        }`
    }

}

/*
The returned type:

HoldingsPackage : `{
    status : String
    reason : String
    holdings : [Holding]
    groups : [String]
    fx : Fx
}`,
*/