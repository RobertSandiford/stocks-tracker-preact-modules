
module.exports = types = {
    Holding : `{
        _id : ID!
        name : String
        ticker : String
        exchangeName : String
        exchangeTicker : String
        type : String
        group : String
        region : String
        quantity : Float
        buyUnitPrice : Float
        buyTotalPrice : Float
        buyCurrency : String
        buyDate : Date
        buyRate : Float
        fees : Float
        currentUnitPrice : Float
        currentTotalPrice : Float
        priceCurrency : String
        currentPriceDate : Date
        currentRate : Float
        opens : [Open]
        closes : [Close]
    }`,
    Open : `{
        _id : ID!
        name : String
        quantity : Float
        buyUnitPrice : Float
        buyTotalPrice : Float
        buyDate : Date
        buyRate : Float
        fees : Float
    }`,
    Close : `{
        _id : ID!
        name : String
        quantity : Float
        sellUnitPrice : Float
        sellTotalPrice : Float
        sellDate : Date
        sellRate : Float
        fees : Float
    }`,
    HoldingMutationResponse : `{
        status : String!
        reason : String
        holding : Holding
    }`
}

