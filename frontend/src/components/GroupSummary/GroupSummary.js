
import { h, Component } from 'preact'

export default class GroupSummary extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let identity = this.props.identity
        let title = this.props.title
        let totals = _.cloneDeep(this.props.totals)

        let displayTitle = Object.values(title).join(" ")
        

        for (let i = 1; i <= 3 && typeof identity[i] !== "undefined"; i++) {
            totals = totals[identity[i]]
        }
        
        
        let percentageChange = getPercentageChange(totals.buyValue, totals.currentValue)
        let changeType = ( (roundDp(totals.currentValue,2) > roundDp(totals.buyValue,2)) ? "change-grown" : (roundDp(totals.currentValue,2) < roundDp(totals.buyValue,2)) ? 'change-shrunk' : 'change-neutral' )

        let d = {
            buyValue : formatMoney(totals.buyValue),
            currentValue : formatMoney(totals.currentValue),
            change : formatMoney(totals.change),
            percentageChange : formatPercentage(percentageChange),
        }

        let titleStyle = "T" + Object.keys(identity).length

        return (
            <div style={HoldingStyle.holding}>
                <span style={HoldingStyle.controls}>{totals.count}</span>
                <span style={ {...HoldingStyle.title, ...HoldingStyle[titleStyle]} }>{displayTitle} Summary</span>

                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.type}></span>
                <span style={HoldingStyle.span}></span>
                <span style={HoldingStyle.span}></span>

                <span style={HoldingStyle.span}>{d.buyValue}</span>

                <span style={HoldingStyle.date}></span>
                <span style={HoldingStyle.fees}></span>
                <span style={HoldingStyle.span}></span>

                <span style={ {...HoldingStyle.span, ...HoldingStyle[titleStyle]} } className={changeType}>{d.currentValue}</span>

                <span style={HoldingStyle.span}></span>

                <span style={ {...HoldingStyle.span, ...HoldingStyle[titleStyle]} } className={changeType}>{d.change}</span>
                <span style={ {...HoldingStyle.span, ...HoldingStyle[titleStyle]} } className={changeType}>{d.percentageChange}</span>
            </div>
        )
    }
}