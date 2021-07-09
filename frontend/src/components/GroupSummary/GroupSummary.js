
import { h, Component } from 'preact'

import lodashClonedeep from 'lodash.clonedeep'

import { getPercentageChange, roundDp, formatMoney, formatPercentage } from '../functions'
import { HoldingStyle } from '../styles'

export default class GroupSummary extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const identity = this.props.identity
        const title = this.props.title
        let totals = lodashClonedeep(this.props.totals)

        const displayTitle = Object.values(title).join(" ")
        

        for (let i = 1; i <= 3 && typeof identity[i] !== "undefined"; i++) {
            totals = totals[identity[i]]
        }
        
        
        const percentageChange = getPercentageChange(totals.buyValue, totals.currentValue)
        const changeType = ( (roundDp(totals.currentValue, 2) > roundDp(totals.buyValue, 2)) ? "change-grown" : (roundDp(totals.currentValue, 2) < roundDp(totals.buyValue, 2)) ? 'change-shrunk' : 'change-neutral' )

        const d = {
            buyValue : formatMoney(totals.buyValue),
            currentValue : formatMoney(totals.currentValue),
            change : formatMoney(totals.change),
            percentageChange : formatPercentage(percentageChange),
        }

        const titleStyle = `T${ Object.keys(identity).length}`

        return (
            <div style={HoldingStyle.holding}>
                <span style={HoldingStyle.controls}>{totals.count}</span>
                <span style={ {...HoldingStyle.title, ...HoldingStyle[titleStyle]} }>{displayTitle} Summary</span>

                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.type} />
                <span style={HoldingStyle.span} />
                <span style={HoldingStyle.span} />

                <span style={HoldingStyle.span}>{d.buyValue}</span>

                <span style={HoldingStyle.date} />
                <span style={HoldingStyle.fees} />
                <span style={HoldingStyle.span} />

                <span style={ {...HoldingStyle.span, ...HoldingStyle[titleStyle]} } className={changeType}>{d.currentValue}</span>

                <span style={HoldingStyle.span} />

                <span style={ {...HoldingStyle.span, ...HoldingStyle[titleStyle]} } className={changeType}>{d.change}</span>
                <span style={ {...HoldingStyle.span, ...HoldingStyle[titleStyle]} } className={changeType}>{d.percentageChange}</span>
            </div>
        )
    }
}