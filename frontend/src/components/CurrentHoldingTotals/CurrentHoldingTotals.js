
import { h, Component } from 'preact'
import { connect as reduxConnect } from 'react-redux'

import { getPercentageChange, roundDp, formatMoney, formatPercentage } from '../functions'
import { HoldingStyle } from '../styles'

export default reduxConnect(
    state => ({
        holdings : state.holdings,
        exchangeRates : state.exchangeRates
    })
)(class CurrentHoldingTotals extends Component {
    render() {
        console.log("rendering Current Holdings Totals")
        const totals = this.props.totals

        if (totals.buyValue === 0) return // exit if no totals to show

        const displayCurrency = "USD"

        const secondCurrency = "GBP"

        //console.log("CurrentHoldingTotals props", this.props)
        //this.props.holdings)

        //let secondCurrencyFx = this.props.holdingsComponent.state.fx[secondCurrency]
        const secondCurrencyFx = this.props.exchangeRates[secondCurrency].rate
        //console.log(secondCurrencyFx)

        const buyValue = totals.buyValue
        const currentValue = totals.currentValue
        const change = totals.change
        const percentageChange = getPercentageChange(buyValue, currentValue)
        //let percentageAnnum = annualisedPercentageChange(buyValue, currentValue)

        const changeType = ( (roundDp(currentValue, 2) > roundDp(buyValue, 2)) ? "change-grown" : (roundDp(currentValue, 2) < roundDp(buyValue, 2)) ? 'change-shrunk' : 'change-neutral' )

        let d = {
            buyValue : formatMoney(buyValue, displayCurrency),
            currentValue : formatMoney(currentValue, displayCurrency),
            change : formatMoney(change, displayCurrency),
            percentageChange : formatPercentage(percentageChange),
        }

        if (secondCurrency) {

            const buyValueSecond = buyValue * secondCurrencyFx
            const currentValueSecond = currentValue * secondCurrencyFx
            const changeSecond = change * secondCurrencyFx

            d = {
                ...d,
                buyValueSecond : formatMoney(buyValueSecond, secondCurrency),
                currentValueSecond : formatMoney(currentValueSecond, secondCurrency),
                changeSecond : formatMoney(changeSecond, secondCurrency),
            }

        }

       

        return (
            <div style={{...HoldingStyle.div, ...HoldingStyle.holdingsTotals}}>
                <span style={HoldingStyle.controls} />
                <span style={HoldingStyle.title}>Total:</span>
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.span} />
                <span style={HoldingStyle.span} />
                <span style={HoldingStyle.span} title={ (secondCurrency !== "") ? d.buyValueSecond : "" }>{d.buyValue}</span>
                <span style={HoldingStyle.date} />
                <span style={HoldingStyle.fees} />
                <span style={HoldingStyle.span} />
                <span style={HoldingStyle.span} className={changeType} title={ (secondCurrency !== "") ? d.currentValueSecond : "" }>{d.currentValue}</span>
                <span style={HoldingStyle.span} />
                <span style={HoldingStyle.span} className={changeType} title={ (secondCurrency !== "") ? d.changeSecond : "" }>{d.change}</span>
                {/*<span style={HoldingStyle.span} className={changeType}>{percentageChange}</span>*/}
                <span style={HoldingStyle.span} className={changeType}>{d.percentageChange}</span>
                {/*<span style={HoldingStyle.percentAnnumWidth}></span>*/}
                <span style={HoldingStyle.percentAnnumWidth} />
                <span style={HoldingStyle.timeHeld} />
                <span style={HoldingStyle.deleteSpan} />
            </div>
        )
    }
})
