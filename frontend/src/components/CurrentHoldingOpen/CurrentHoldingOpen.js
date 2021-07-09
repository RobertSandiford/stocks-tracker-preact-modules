
import { h, Component } from 'preact'
import { connect as reduxConnect } from 'react-redux'
import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
import { numToXChars, formatMoney, formatPercentage } from '../functions'


LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { })
const luxonLocalFormat = "yyyy-MM-dd'T'HH:mm"

import { dispatchFunction as reduxDispatchFunction } from '../../redux/functions'
import { HoldingStyle } from '../styles'


export default reduxConnect(
    null,
    reduxDispatchFunction
)(class CurrentHoldingOpen extends Component {

    //static reduxContext = ReactReduxContext

    constructor(props) {
        super(props)


        this.holdingComponent = this.props.holdingComponent
        this.holding = this.holdingComponent.holding
        this.open = this.props.open

        this.remove = (event) => {
            event.preventDefault()
    
            const data = {
                holding_id : this.holding._id,
                open_id : this.open._id
            }
            console.log("open remove data", this.holding, this.open, data)
            this.holdingComponent.holdingsComponent.post(
                "http://localhost:4000/holdings/open/remove",
                data,
                (response) => {
                    console.log(response)
                    if (response.status === "OK") {

                        this.props.updateStore("removeHoldingOpen", { holding : this.holding, open : this.open } )
                        /*let opens = this.holding.opens.filter((close) => {
                            return open._id  !== response.open_id
                        })
                        console.log("new opens", opens)
                        this.holding.opens = opens*/

                    }
                },
                (error) => {
                    console.log(error)
                })
        }

    }
    
    render() {
        console.log("current holding open render", this.holding._id, this.holding.opens.length)
        
        const holding = this.holding
        const open = this.open


        const displayCurrency = "USD"
        const buyCurrency = holding.buyCurrency

        const fxc = (holding.priceCurrency != displayCurrency)
        const convert = (fxc && holding.buyRate && open.buyRate)

        console.log("holding.priceCurrency", holding.priceCurrency)
        console.log("fxc", fxc)
        console.log("holding.buyRate", holding.buyRate)
        console.log("open.buyRate", open.buyRate)
        console.log("convert", convert)
        
        const buyRate = open.buyRate
        const currentRate = holding.currentRate

        const quantity = open.quantity

        const buyUnitPriceLocal = open.buyUnitPrice
        const buyTotalPriceLocal = buyUnitPriceLocal * quantity
        const buyDate = Luxon.fromISO(open.buyDate)

        const currentUnitPriceLocal = holding.currentUnitPrice
        const currentTotalPriceLocal = currentUnitPriceLocal * quantity
        const currentPriceDate = Luxon.fromISO(holding.currentPriceDate)
        const currentDate = Luxon.local()


        const buyUnitPrice = (convert) ? buyUnitPriceLocal * buyRate : buyUnitPriceLocal
        const buyTotalPrice = (convert) ? buyTotalPriceLocal * buyRate : buyTotalPriceLocal

        /////// Currrent Rate needs to change to time specific rate *****
        const currentUnitPrice = (convert) ? currentUnitPriceLocal * currentRate : currentUnitPriceLocal
        const currentTotalPrice = (convert) ? currentTotalPriceLocal * currentRate : currentTotalPriceLocal

        //console.log(buyUnitPriceLocal, buyUnitPrice)


        const valueChange = currentTotalPrice - buyTotalPrice
        const percentageChange = ((currentTotalPrice / buyTotalPrice) - 1) * 100

        // annum
        const dateDiff = currentDate.diff(buyDate, 'years').toObject().years
        const percentageChangeAnnum = (Math.pow(currentUnitPrice / buyUnitPrice, 1 / dateDiff) -1) * 100 //// annual rate calculated as exponential
        //let percentageChangeAnnumRounded = roundDp(percentageChangeAnnum, 1)

        //// Fees need to be incorporated ********
        const percentageChangeAnnumAfterFees = percentageChangeAnnum // percentageChangeAnnum - fees


        const changeSign = ( (percentageChange > 0) ? "+" : (percentageChange < 0) ? '-' : '' )
        const changeType = ( (changeSign === "+") ? "change-grown" : (changeSign === "-") ? 'change-shrunk' : 'change-neutral' )

        console.log("open info", holding, open, valueChange, currentTotalPrice, buyTotalPrice)

        //// Values formatted for display
        const d = {
            quantity : numToXChars(quantity, 7), //roundDp(closedQuantity, 4)
            buyUnitPriceLocal : formatMoney(buyUnitPriceLocal, holding.buyCurrency),
            buyUnitPrice : formatMoney(buyUnitPrice, displayCurrency),
            buyTotalPriceLocal : formatMoney(buyTotalPriceLocal, holding.buyCurrency),
            buyTotalPrice : formatMoney(buyTotalPrice, displayCurrency),
            buyDate : buyDate.toLocaleString(stDateFormat),

            currentUnitPriceLocal : formatMoney(currentUnitPriceLocal, holding.buyCurrency),
            currentUnitPrice : formatMoney(currentUnitPrice, displayCurrency),
            currentTotalPriceLocal : formatMoney(currentTotalPriceLocal, holding.buyCurrency),
            currentTotalPrice : formatMoney(currentTotalPrice, displayCurrency),
            currentDate : currentDate.toLocaleString(stDateFormat),

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


        console.log("open info 2", valueChange, d.valueChange, d.valueChangeAfterFees)

        //console.log("render", this.state.edit)
        return (
            <div class="closed-summary">
                <span style={HoldingStyle.controls} />
                <span style={HoldingStyle.title}>Open: </span>
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.span} title={quantity}>{d.quantity}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.buyUnitPriceLocal : '' }>{d.buyUnitPrice}</span>
                <span style={HoldingStyle.span} title={ (fxc) ? d.buyTotalPriceLocal : '' }>{d.buyTotalPriceLocal}</span>
                <span style={HoldingStyle.date}>{d.buyDate}</span>
                <span style={HoldingStyle.fees}>{}</span>
                <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? d.currentUnitPriceLocal : "" }>{d.currentUnitPrice}</span>

                <span style={HoldingStyle.span} className={changeType} title={ (fxc) ? d.currentTotalPriceLocal : "" }>
                    {d.currentTotalPrice}
                </span>

                <span style={HoldingStyle.span}>
                    {d.currentDate}
                </span>

                { (holding.fees !== 0) // not sure holding.fees is correct, was just fees, showed error
                    ? <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.valueChangeAfterFees}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.valueChange}
                    </span>
                }

        
                { (holding.fees !== 0) // not sure holding.fees is correct, was just fees, showed error
                    ? <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.percentageChangeAfterFees}
                    </span>
                    : <span style={HoldingStyle.span} className={changeType} title={d.currentDate}>
                        {d.percentageChange}
                    </span>
                }

                { (holding.fees !== 0) // not sure that holding.fees is correct, was just fees, showed error
                    ? <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.currentDate}>
                        { (dateDiff > 0.1) ? d.percentageChangeAnnumAfterFees : <span>-</span> }
                    </span>
                    : <span style={HoldingStyle.percentAnnumWidth} className={changeType} title={d.currentDate}>
                        { (dateDiff > 0.1) ? d.percentageChangeAnnum : <span>-</span> }
                    </span>
                }

                <span style={HoldingStyle.timeHeld}>{d.timeHeld}</span>
                
                <span style={HoldingStyle.deleteSpan}>
                    <button style={HoldingStyle.editButton} title="Edit" onClick={this.edit}>e</button>
                    <button style={HoldingStyle.deleteButton} title="Delete Completely" onClick={this.remove}>x</button>
                </span>
            </div>
        )
    }
})