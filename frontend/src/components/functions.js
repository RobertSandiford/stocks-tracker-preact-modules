
// return a string with the path to the requested
// component, to streamline importing components
export function component(c) {
    return `../${c}/${c}`
}
export function addCurrencySign(num, curr = "USD") {
    num = num.toString()
    let minus;
    if (minus = (num.charAt(0) == "-") ) num = num.substring(1)
    switch (curr) {
        case "USD":
            num = "$" + num
            break
        case "GBP":
            num = "£" + num
            break
        default:
            break
    }
    if (minus) num = "-" + num
    return num
}

export function roundDp(n, m) {
    let o = Math.pow(10, m)
    return Math.round( n * o + Number.EPSILON ) / o;
}

/*
function addZeros(n, m) {
    n = n.toString()
    let after = n.split(".")[1]
    let toAdd = m - after.length
    if (toAdd > 0) {
        n += 
    }
}
*/

//export { addCurrencySign, roundDp }

const currencySignList = ["$", "£"]
export function getPriceWithoutCurrency(n) {
    let f = n.charAt(0)
    if (currencySignList.includes(f)) return n.substring(1)
    return n
}

export function parseMoney(m) {
    m = getPriceWithoutCurrency(m)
    m = m.replace(",", "")
    return m
}

// !!! Only for nums with decimals
// Need to manage large nums / num without decimals ??
export function numToXChars(n, m) {
    if (typeof n !== "number") return n
    n = n.toString().substring(0, m+1)
    if (n.length === m+1) {
        if (n.indexOf(".") !== -1) {
            let l = n.split(".")[1]
            n = Number(n).toFixed(l.toString().length -1)
        }
    }
    return n
}

export function addCommasToNum(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export function limitToXDp(n, m) {
    //console.log(typeof n, n)
    if ( (n % 0) !== 0 ) return n.toFixed(m)
    else return n
}

export function formatMoney(n, currency = "USD") {
    if (n === "" || n === null) return n
    //console.log(1, n)
    n = limitToXDp(n, 2)
    //console.log(2, n)
    //if ( (n % 1) !== 0 ) n = n.toFixed(2)
    n = addCommasToNum(n)
    //console.log(3, n)
    n = addCurrencySign(n, currency)
    //console.log(4, n)
    return n
}

export function percentageFormat(p, changeSign) {
    if (p === "") return p

    if ( (p % 1) !== 0 ) p = p.toFixed(1)
    if ( p.toString().length >= 6 ) p = parseFloat(p).toFixed(0)
    p = addCommasToNum(p)
    p += "%"
    if (changeSign === "+") p = '+' + p
    return p
}

export function formatPercentage(p) {
    if (p === "") return p

    let changeSign = (p > 0) ? '+' : ''

    //console.log(p)

    if ( (p % 1) !== 0 ) p = p.toFixed(1)
    if ( p.toString().length >= 6 ) p = parseFloat(p).toFixed(0)
    p = addCommasToNum(p)
    p += "%"
    if (changeSign === "+") p = '+' + p
    return p
}

export function objectWithTheseFields(object, fields) {
    let r = {}
    for (const field of fields) {
        r[field] = object[field]
    }
    return r
}