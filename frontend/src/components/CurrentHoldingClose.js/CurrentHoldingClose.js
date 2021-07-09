
import { h, Component } from 'preact'
import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
import { formatMoney, formatPercentage, numToXChars } from '../functions'

import { HoldingStyle } from '../../routes/holdings/style.css'



LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { })
const luxonLocalFormat = "yyyy-MM-dd'T'HH:mm"

export default class CurrentHoldingClose extends Component {
    constructor(props) {
        super(props)
        this.holdingComponent = this.props.holdingComponent

        //this.editCurrentUnitPrice = createRef()
        //this.editCurrentTotalPrice = createRef()

        this.holding = this.holdingComponent.holding
        this.close = this.props.close
        //this.holding = this.props.holding


        this.removeClose = (event) => {
            event.preventDefault()
    
            const data = {
                holding_id : this.holding._id,
                close_id : this.close._id
            }
            this.holdingComponent.holdingsComponent.post(
                "http://localhost:4000/holdings/close/remove",
                data,
                (response) => {
                    console.log(response)
                    if (response.status === "OK") {
                        const closes = this.holding.closes.filter((close) => {
                            return close._id !== response.close_id
                        })
                        console.log("new closes", closes)
                        this.holding.closes = closes
                    }
                },
                (error) => {
                    console.log(error)
                })
        }
    }
    
    render() {
        //console.log("render", this.holding)
        const holding = this.holding
        const close = this.close

        const displayCurrency = "USD"
        const buyCurrency = holding.buyCurrency
        const fxc = (holding.priceCurrency != displayCurrency)
        const convert = (fxc && holding.buyRate && close.sellRate)
        
        const sellRate = close.sellRate

        
/*
        //let buyPrice = holding.buyPrice ? holding.buyPrice : ""
        let buyPriceLocal = holding.buyUnitPrice ? holding.buyUnitPrice : (holding.buyPrice ? holding.buyPrice : "")
        let buyValueLocal = ( ! isNaN(buyPriceLocal) ) ? quantity * buyPriceLocal : ""

        let buyPrice = ""
        let buyValue = ""
        if (convert) {
            buyPrice = buyPriceLocal * holding.buyRate[displayCurrency]
            buyValue = buyValueLocal * holding.buyRate[displayCurrency]
        }  else {
            buyPrice = buyPriceLocal
            buyValue = buyValueLocal
        }
*/
        //console.log(holding.buyUnitPrice)
        const buyUnitPriceLocal = holding.buyUnitPrice
        const buyDate = Luxon.fromISO(holding.buyDate)

/*
        let closedQuantity = 0
        let closedBuyTotalPriceLocal = 0
        let closedSellTotalPriceLocal = 0
        let lastClosedDate = Luxon.local(0,1,1,0,0,0)
        console.log(lastClosedDate)
        if (holding.closes) {
            for (const c of holding.closes) {
                closedQuantity += c.quantity
                closedBuyTotalPriceLocal += buyUnitPriceLocal * c.quantity
                closedSellTotalPriceLocal += c.sellTotalPrice
                let d = Luxon.fromISO(c.sellDate)
                if (d > lastClosedDate) lastClosedDate = d
            }
        }
        console.log("flcp", lastClosedDate)
*/

        const closedQuantity = close.quantity
        const closedBuyTotalPriceLocal = buyUnitPriceLocal * closedQuantity
        const closedSellUnitPriceLocal = close.sellUnitPrice
        const closedSellTotalPriceLocal = close.sellTotalPrice
        const lastClosedDate = Luxon.fromISO(close.sellDate)


        const buyUnitPrice = (convert) ? buyUnitPriceLocal * holding.buyRate : buyUnitPriceLocal
        const closedBuyTotalPrice = (convert) ? closedBuyTotalPriceLocal * holding.buyRate : closedBuyTotalPriceLocal
        /////// Currrent Rate needs to change to time specific rate *****
        const closedSellUnitPrice = (convert) ? closedSellUnitPriceLocal * sellRate : closedSellUnitPriceLocal
        const closedSellTotalPrice = (convert) ? closedSellTotalPriceLocal * sellRate : closedSellTotalPriceLocal

        //console.log(buyUnitPriceLocal, buyUnitPrice)


        const valueChange = closedSellTotalPrice - closedBuyTotalPrice
        const percentageChange = ((closedSellTotalPrice / closedBuyTotalPrice) - 1) * 100

        // annum
        const dateDiff = lastClosedDate.diff(buyDate, 'years').toObject().years
        const percentageChangeAnnum = (Math.pow(closedSellUnitPrice / buyUnitPrice, 1 / dateDiff) -1) * 100 //// annual rate calculated as exponential
        //let percentageChangeAnnumRounded = roundDp(percentageChangeAnnum, 1)

        //// Fees need to be incorporated ********
        const percentageChangeAnnumAfterFees = percentageChangeAnnum // percentageChangeAnnum - fees


        const changeSign = ( (percentageChange > 0) ? "+" : (percentageChange < 0) ? '-' : '' )
        const changeType = ( (changeSign === "+") ? "change-grown" : (changeSign === "-") ? 'change-shrunk' : 'change-neutral' )

        //let timeHeld = dateDiff

        /*
        let percentageChangeAnnumAfterFees = percentageChangeAnnum - fees
        let percentageChangeAfterFees = (Math.pow( 1 + percentageChangeAnnumAfterFees/100, timeHeld ) -1) * 100
        let currentValueAfterFees = buyValue * Math.pow( 1 + percentageChangeAnnumAfterFees/100, timeHeld )
        let currentUnitPriceAfterFees = currentValueAfterFees / quantity
        let valueChangeAfterFees = currentValueAfterFees - buyValue

        //// redoing change after fees here
        changeSign = ( (percentageChangeAfterFees > 0) ? "+" : (percentageChangeAfterFees < 0) ? '-' : '' )
        changeType = ( (changeSign === "+") ? "change-grown" : (changeSign === "-") ? 'change-shrunk' : 'change-neutral' )
*/


        //let totals = this.props.totals
        //totals.currentValue += closedSellTotalPrice // currentValueAfterFees
        //totals.change       += valueChange //valueChangeAfterFees
        //console.log(totals.buyValue, totals.currentValue, totals.change)


        ////////////////////////////////////
        // display formatting
        ////////////////////////////////////
        //closedQuantity = numToXChars(closedQuantity, 7) //roundDp(closedQuantity, 4)
        //closedBuyTotalPrice = formatMoney(closedBuyTotalPrice, displayCurrency)
        //closedSellTotalPrice = formatMoney(closedSellTotalPrice, displayCurrency)
        //lastClosedDate = lastClosedDate.toLocaleString(stDateFormat)

        //valueChange = formatMoney(valueChange, displayCurrency)
        //percentageChange = formatPercentage(percentageChange)

        //let valueChangeAfterFees = valueChange
        //let percentageChangeAfterFees = percentageChange

        //console.log(formatMoney(buyUnitPrice, displayCurrency))

        const d = {
            buyUnitPriceLocal : formatMoney(buyUnitPriceLocal, holding.buyCurrency),
            buyUnitPrice : formatMoney(buyUnitPrice, displayCurrency),
            closedQuantity : numToXChars(closedQuantity, 7), //roundDp(closedQuantity, 4)
            closedBuyTotalPriceLocal : formatMoney(closedBuyTotalPriceLocal, holding.buyCurrency),
            closedBuyTotalPrice : formatMoney(closedBuyTotalPrice, displayCurrency),
            buyDate : buyDate.toLocaleString(stDateFormat),
            closedSellUnitPriceLocal : formatMoney(closedSellUnitPriceLocal, holding.buyCurrency),
            closedSellUnitPrice : formatMoney(closedSellUnitPrice, displayCurrency),
            closedSellTotalPriceLocal : formatMoney(closedSellTotalPriceLocal, holding.buyCurrency),
            closedSellTotalPrice : formatMoney(closedSellTotalPrice, displayCurrency),
            lastClosedDate : lastClosedDate.toLocaleString(stDateFormat),

            valueChange : formatMoney(valueChange, displayCurrency),
            percentageChange : formatPercentage(percentageChange),
            percentageChangeAnnum : formatPercentage(percentageChangeAnnum),

            valueChangeAfterFees : formatMoney(valueChange, displayCurrency),
            percentageChangeAfterFees : formatPercentage(percentageChange),
            percentageChangeAnnumAfterFees : formatPercentage(percentageChangeAnnumAfterFees),

            timeHeld : (typeof dateDiff === "number") ? `${dateDiff.toFixed(2) } years` : "",
            
            changeSign,
            changeType
        }



        //console.log("render", this.state.edit)
        return (
            <div class="closed-summary">
                <span style={HoldingStyle.controls} />
                <span style={HoldingStyle.title}>Closed: </span>
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.span} title={`-${ d.closedQuantity}`}>-{d.closedQuantity}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.buyUnitPriceLocal : '' }>{d.buyUnitPrice}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.closedBuyTotalPriceLocal : '' }>{d.closedBuyTotalPrice}</span>
                <span style={HoldingStyle.date}>{d.buyDate}</span>
                <span style={HoldingStyle.fees}>{}</span>
                <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? d.closedSellUnitPriceLocal : "" }>{d.closedSellUnitPrice}</span>

                <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? d.closedSellTotalPriceLocal : "" }>
                    {d.closedSellTotalPrice}
                </span>

                <span style={HoldingStyle.span}>
                    {d.lastClosedDate}
                </span>

                { (holding.fees !== 0) // not sure about this
                    ? <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.valueChangeAfterFeesDisplay}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.valueChange}
                    </span>
                }

                { (holding.fees !== 0)
                    ? <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChangeAfterFees}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChange}
                    </span>
                }

                { (holding.fees !== 0)
                    ? <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChangeAnnumAfterFees}
                    </span>
                    : <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChangeAnnum}
                    </span>
                }

                <span style={HoldingStyle.timeHeld}>{d.timeHeld}</span>
                
                <span style={HoldingStyle.deleteSpan}>
                    <button style={HoldingStyle.editButton} title="Edit" onClick={this.edit}>e</button>
                    <button style={HoldingStyle.deleteButton} title="Delete Completely" onClick={this.removeClose}>x</button>
                </span>
            </div>
        )
    }
}
