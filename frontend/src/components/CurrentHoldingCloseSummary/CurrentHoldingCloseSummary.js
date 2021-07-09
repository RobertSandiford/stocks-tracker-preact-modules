
import { h, Component } from 'preact'

import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
import { formatMoney, formatPercentage, numToXChars } from '../../../../backend/src/lib/functions'
import { HoldingStyle } from '../styles'



LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { })
const luxonLocalFormat = "yyyy-MM-dd'T'HH:mm"

export default class CurrentHoldingCloseSummary extends Component {
    constructor(props) {
        super(props)
        this.holdingComponent = this.props.holdingComponent

        //this.editCurrentUnitPrice = createRef()
        //this.editCurrentTotalPrice = createRef()

        this.holding = this.holdingComponent.holding
        //this.holding = this.props.holding

    }
    
    render() {
        //console.log("render", this.holding)
        const holding = this.holding

        const displayCurrency = "USD"
        const buyCurrency = holding.buyCurrency
        const fxc = (holding.priceCurrency != displayCurrency)
        const convert = (fxc && holding.buyRate && holding.currentRate)

        
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

        let closedQuantity = 0
        let closedBuyTotalPriceLocal = 0
        let closedSellTotalPriceLocal = 0
        let lastClosedDate = Luxon.local(0, 1, 1, 0, 0, 0)
        //console.log("lastClosedDate", lastClosedDate)
        if (holding.closes) {
            for (const c of holding.closes) {
                closedQuantity += c.quantity
                closedBuyTotalPriceLocal += buyUnitPriceLocal * c.quantity
                closedSellTotalPriceLocal += c.sellTotalPrice
                const d = Luxon.fromISO(c.sellDate)
                if (d > lastClosedDate) lastClosedDate = d
            }
        }
        //console.log("flcp", lastClosedDate)

        const buyUnitPrice = (convert) ? buyUnitPriceLocal * holding.buyRate : buyUnitPriceLocal
        const closedBuyTotalPrice = (convert) ? closedBuyTotalPriceLocal * holding.buyRate : closedBuyTotalPriceLocal
        /////// Currrent Rate needs to change to time specific rate *****
        const closedSellTotalPrice = (convert) ? closedSellTotalPriceLocal * holding.currentRate[displayCurrency] : closedSellTotalPriceLocal

        //console.log(buyUnitPriceLocal, buyUnitPrice)


        const valueChange = closedSellTotalPrice - closedBuyTotalPrice
        const percentageChange = ((closedSellTotalPrice / closedBuyTotalPrice) - 1) * 100

        // annum

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


        const totals = this.props.totals
        totals.buyValue += closedBuyTotalPrice // currentValueAfterFees
        totals.currentValue += closedSellTotalPrice // currentValueAfterFees
        totals.change += valueChange //valueChangeAfterFees
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

        //console.log(this.holding)
        //console.log(formatMoney(buyUnitPrice, displayCurrency))

        const d = {
            buyUnitPriceLocal : formatMoney(buyUnitPriceLocal, holding.buyCurrency),
            buyUnitPrice : formatMoney(buyUnitPrice, displayCurrency),
            closedQuantity : numToXChars(closedQuantity, 7), //roundDp(closedQuantity, 4)
            closedBuyTotalPriceLocal : formatMoney(closedBuyTotalPriceLocal, holding.buyCurrency),
            closedBuyTotalPrice : formatMoney(closedBuyTotalPrice, displayCurrency),
            buyDate : Luxon.fromISO(holding.buyDate).toLocaleString(stDateFormat),
            closedSellTotalPriceLocal : formatMoney(closedSellTotalPriceLocal, holding.buyCurrency),
            closedSellTotalPrice : formatMoney(closedSellTotalPrice, displayCurrency),
            lastClosedDate : lastClosedDate.toLocaleString(stDateFormat),

            valueChange : formatMoney(valueChange, displayCurrency),
            percentageChange : formatPercentage(percentageChange),

            valueChangeAfterFees : formatMoney(valueChange, displayCurrency),
            percentageChangeAfterFees : formatPercentage(percentageChange),

            changeSign,
            changeType
        }



        //console.log("render", this.state.edit)
        return (
            <div class="closed-summary">
                <span style={HoldingStyle.controls}><button style={HoldingStyle.expandButton} title="Expand" onClick={this.expand}>+</button></span>
                <span style={HoldingStyle.title}>Closed Summary: </span>
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.span} title={`-${ d.closedQuantity}`}>-{d.closedQuantity}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.buyUnitPriceLocal : '' }>{d.buyUnitPrice}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.closedBuyTotalPriceLocal : '' }>{d.closedBuyTotalPrice}</span>
                <span style={HoldingStyle.date}>{d.buyDate}</span>
                <span style={HoldingStyle.fees}>{}</span>
                <span style={HoldingStyle.span} className={changeType} />

                <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? d.closedSellTotalPriceLocal : "" }>
                    {d.closedSellTotalPrice}
                </span>

                <span style={HoldingStyle.span}>
                    {d.lastClosedDate}
                </span>

                { (holding.fees !== 0) // check this
                    ? <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.valueChangeAfterFeesDisplay}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.valueChange}
                    </span>
                }

                { (holding.fees !== 0) // check this
                    ? <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChangeAfterFees}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChange}
                    </span>
                }

                { (holding.fees !== 0) // check this
                    ? <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.lastClosedDate}>
                        { (dateDiff > 0.1) ? d.percentageChangeAnnumAfterFees : <span>-</span> }
                    </span>
                    : <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.lastClosedDate}>
                        { (dateDiff > 0.1) ? d.percentageChangeAnnum : <span>-</span> }
                    </span>
                }

                <span style={HoldingStyle.timeHeld} />
                
                <span style={HoldingStyle.deleteSpan}>
                    <button style={HoldingStyle.editButton} title="Edit" onClick={this.edit}>e</button>
                    <button style={HoldingStyle.deleteButton} title="Delete Completely" onClick={ (event) => {} }>x</button>
                </span>
            </div>
        )
    }
}