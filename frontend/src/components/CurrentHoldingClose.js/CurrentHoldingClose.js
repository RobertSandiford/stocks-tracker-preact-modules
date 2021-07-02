
import { h, Component } from 'preact'

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
    
            let data = { 
                holding_id : this.holding._id,
                close_id : this.close._id
            }
            this.holdingComponent.holdingsComponent.post(
                "http://localhost:4000/holdings/close/remove",
                data,
                (response) => {
                    console.log(response)
                    if (response.status === "OK") {
                        let closes = this.holding.closes.filter((close) => { 
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
        let holding = this.holding
        let close = this.close

        let displayCurrency = "USD"
        let buyCurrency = holding.buyCurrency
        let fxc = (holding.priceCurrency != displayCurrency)
        let convert = (fxc && holding.buyRate && close.sellRate)
        
        let sellRate = close.sellRate

        
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
        let buyUnitPriceLocal = holding.buyUnitPrice
        let buyDate = Luxon.fromISO(holding.buyDate)

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

        let closedQuantity = close.quantity
        let closedBuyTotalPriceLocal = buyUnitPriceLocal * closedQuantity
        let closedSellUnitPriceLocal = close.sellUnitPrice
        let closedSellTotalPriceLocal = close.sellTotalPrice
        let lastClosedDate = Luxon.fromISO(close.sellDate)


        let buyUnitPrice = (convert) ? buyUnitPriceLocal * holding.buyRate : buyUnitPriceLocal
        let closedBuyTotalPrice = (convert) ? closedBuyTotalPriceLocal * holding.buyRate : closedBuyTotalPriceLocal
        /////// Currrent Rate needs to change to time specific rate *****
        let closedSellUnitPrice = (convert) ? closedSellUnitPriceLocal * sellRate : closedSellUnitPriceLocal
        let closedSellTotalPrice = (convert) ? closedSellTotalPriceLocal * sellRate : closedSellTotalPriceLocal

        //console.log(buyUnitPriceLocal, buyUnitPrice)


        let valueChange = closedSellTotalPrice - closedBuyTotalPrice
        let percentageChange = ((closedSellTotalPrice / closedBuyTotalPrice) - 1) * 100

        // annum
        let dateDiff = lastClosedDate.diff(buyDate, 'years').toObject().years
        let percentageChangeAnnum = (Math.pow(closedSellUnitPrice / buyUnitPrice, 1 / dateDiff) -1) * 100 //// annual rate calculated as exponential
        //let percentageChangeAnnumRounded = roundDp(percentageChangeAnnum, 1)

        //// Fees need to be incorporated ********
        let percentageChangeAnnumAfterFees = percentageChangeAnnum // percentageChangeAnnum - fees


        let changeSign = ( (percentageChange > 0) ? "+" : (percentageChange < 0) ? '-' : '' )
        let changeType = ( (changeSign === "+") ? "change-grown" : (changeSign === "-") ? 'change-shrunk' : 'change-neutral' )

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

        let d = {
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

            timeHeld : (typeof dateDiff === "number") ? dateDiff.toFixed(2) + " years" : "" ,
            
            changeSign : changeSign,
            changeType : changeType
        }



        //console.log("render", this.state.edit)
        return (
             <div class="closed-summary">
                <span style={HoldingStyle.controls}></span>
                <span style={HoldingStyle.title}>Closed: </span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.span} title={'-' + d.closedQuantity}>-{d.closedQuantity}</span>
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

                { (fees !== 0)
                    ? <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.valueChangeAfterFeesDisplay}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.valueChange}
                    </span>
                }

                { (fees !== 0)
                    ? <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChangeAfterFees}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.lastClosedDate}>
                        {d.percentageChange}
                    </span>
                }

                { (fees !== 0)
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
