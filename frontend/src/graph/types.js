
let types = {}

types.Open = `{
    _id
    name
    quantity
    buyUnitPrice
    buyTotalPrice
    buyDate
    buyRate
    fees
}`

types.Close = `{
    _id
    name
    quantity
    sellUnitPrice
    sellTotalPrice
    sellDate
    sellRate
    fees
}`

types.Holding = `{
    _id
    name
    ticker
    type
    group
    region
    quantity
    buyUnitPrice
    buyTotalPrice
    buyCurrency
    buyDate
    buyRate
    currentUnitPrice
    currentTotalPrice
    priceCurrency
    currentPriceDate
    currentRate
    fees
    opens ${types.Open}
    closes ${types.Close}
}`

types.Fx = `{
    toCurr
    fromCurr
    date
    rate
}`

export default types