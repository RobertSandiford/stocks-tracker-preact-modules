
import { h, Component } from 'preact'
import { connect as reduxConnect } from 'react-redux'

import { getPercentageChange, roundDp, formatMoney, formatPercentage } from '../functions'
import { HoldingStyle } from '../styles'

export default reduxConnect(
    state => ({
        holdings : state.holdings,
        exchangeRates : state.exchangeRates
    })
)
(class CurrentHoldingTotals extends Component {
    render() {
        console.log("rendering Current Holdings Totals")
        let totals = this.props.totals

        if (totals.buyValue === 0) return // exit if no totals to show

        let displayCurrency = "USD"

        let secondCurrency = "GBP"

        //console.log("CurrentHoldingTotals props", this.props)
        //this.props.holdings)

        //let secondCurrencyFx = this.props.holdingsComponent.state.fx[secondCurrency]
        let secondCurrencyFx = this.props.exchangeRates[secondCurrency].rate
        //console.log(secondCurrencyFx)

        let buyValue = totals.buyValue
        let currentValue = totals.currentValue
        let change = totals.change
        let percentageChange = getPercentageChange(buyValue, currentValue)
        //let percentageAnnum = annualisedPercentageChange(buyValue, currentValue)

        let changeType = ( (roundDp(currentValue,2) > roundDp(buyValue,2)) ? "change-grown" : (roundDp(currentValue,2) < roundDp(buyValue,2)) ? 'change-shrunk' : 'change-neutral' )

        let d = {
            buyValue : formatMoney(buyValue, displayCurrency),
            currentValue : formatMoney(currentValue, displayCurrency),
            change : formatMoney(change, displayCurrency),
            percentageChange : formatPercentage(percentageChange),
        }

        if (secondCurrency) {

            var buyValueSecond = buyValue * secondCurrencyFx
            var currentValueSecond = currentValue * secondCurrencyFx
            var changeSecond = change * secondCurrencyFx

            d = {
                ...d,
                buyValueSecond : formatMoney(buyValueSecond, secondCurrency),
                currentValueSecond : formatMoney(currentValueSecond, secondCurrency),
                changeSecond : formatMoney(changeSecond, secondCurrency),
            }

        }

       

        return (
            <div style={HoldingStyle.div} style={HoldingStyle.holdingsTotals}>
                <span style={HoldingStyle.controls}></span>
                <span style={HoldingStyle.title}>Total:</span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.span}></span>
                <span style={HoldingStyle.span}></span>
                <span style={HoldingStyle.span} title={ (secondCurrency !== "") ? d.buyValueSecond : "" }>{d.buyValue}</span>
                <span style={HoldingStyle.date}></span>
                <span style={HoldingStyle.fees}></span>
                <span style={HoldingStyle.span}></span>
                <span style={HoldingStyle.span} className={changeType} title={ (secondCurrency !== "") ? d.currentValueSecond : "" }>{d.currentValue}</span>
                <span style={HoldingStyle.span}></span>
                <span style={HoldingStyle.span} className={changeType} title={ (secondCurrency !== "") ? d.changeSecond : "" }>{d.change}</span>
                {/*<span style={HoldingStyle.span} className={changeType}>{percentageChange}</span>*/}
                <span style={HoldingStyle.span} className={changeType}>{d.percentageChange}</span>
                {/*<span style={HoldingStyle.percentAnnumWidth}></span>*/}
                <span style={HoldingStyle.percentAnnumWidth}></span>
                <span style={HoldingStyle.timeHeld}></span>
                <span style={HoldingStyle.deleteSpan}></span>
            </div>
        )
    }
})
