
import { h, Component } from 'preact'
import { connect as reduxConnect } from 'react-redux'

export default reduxConnect(
    state => ({
        holdings : state.holdings,
        fx : state.fx
    })
)
(class CurrentHoldingTotals extends Component {
    render() {
        let totals = this.props.totals

        if (totals.buyValue === 0) return // exit if no totals to show

        let displayCurrency = "USD"

        let secondCurrency = "GBP"

        //console.log("CurrentHoldingTotals props", this.props)
        //this.props.holdings)

        //let secondCurrencyFx = this.props.holdingsComponent.state.fx[secondCurrency]
        let secondCurrencyFx = this.props.fx.rate
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

const HoldingStyle = {
    holdingsTitles : {
        padding : tablePadding + " 0"
    },
    holding : {
        borderTop : "solid 0.1vmin dodgerblue",
        padding : tablePadding + " 0"
    },
    holdingsTotals : {
        borderTop : "solid 0.1vmin black",
        fontWeight : 'bold',
        padding : totalsPadding + " 0"
    },
    T1 : {
        fontWeight : "bold",
        fontSize : "calc(2.2vmin)"
    },
    T2 : {
        fontWeight : "bold"
    },
    T3 : {

    },
    span : {
        /*flex : 8*/
        display : "inline-block",
        width : toPercentage(spanWidth / totalWidth)
    },
    controls : {
        /*flex : 12*/
        display : "inline-block",
        width : toPercentage(controlsWidth / totalWidth)
    },
    title : {
        /*flex : 12*/
        display : "inline-block",
        width : toPercentage(titleWidth / totalWidth)
    },
    titleName : {
        /*flex : 12*/
        display : "inline-block",
        width : toPercentage(titleNameWidth / totalWidth)
    },
    titleTicker : {
        /*flex : 12*/
        display : "inline-block",
        width : toPercentage(titleTickerWidth / totalWidth)
    },
    type : {
        /*flex : 12*/
        display : "inline-block",
        width : toPercentage(typeWidth / totalWidth)
    },
    date : {
        /*flex : 12*/
        display : "inline-block",
        width : toPercentage(dateWidth / totalWidth)
    },
    fees : {
        display : "inline-block",
        width : toPercentage(feesWidth / totalWidth)
    },
    percentAnnumWidth : {
        display : "inline-block",
        width : toPercentage(percentAnnumWidth / totalWidth)
    },
    timeHeld : {
        display : "inline-block",
        width : toPercentage(timeHeldWidth / totalWidth)
    },
    deleteSpan : {
        /*flex : 4*/
        display : "inline-block",
        width : toPercentage(deleteWidth / totalWidth)
    },
    shortTimeHeld : {
        color : "orange"
    },
    editBox : {
        width : "80%"
    },
    openButton : {
        /*backgroundColor : 'lightgrey'*/
    },
    closeButton : {
        /*backgroundColor : 'lightgrey'*/
    },
    deleteButton : {
        /*backgroundColor : 'lightgrey'*/
    },

}