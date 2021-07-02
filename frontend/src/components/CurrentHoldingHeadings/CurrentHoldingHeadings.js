
import { h, Component } from 'preact'

import { HoldingStyle } from '../styles'

export default class CurrentHoldingHeadings extends Component {
    render() {
        return (
            <div style={HoldingStyle.holdingsTitles}>
                <span style={HoldingStyle.controls}></span>
                <span style={HoldingStyle.titleName}>Title</span>
                <span style={HoldingStyle.titleTicker}>Symbol</span>
                <span style={HoldingStyle.type}>Type</span>
                <span style={HoldingStyle.type}>Group</span>
                <span style={HoldingStyle.type}>Region</span>
                <span style={HoldingStyle.span}>Quantity</span>
                <span style={HoldingStyle.span}>Buy Price</span>
                <span style={HoldingStyle.span}>Buy Value</span>
                <span style={HoldingStyle.date}>Buy Date</span>
                <span style={HoldingStyle.fees}>Fees</span>
                <span style={HoldingStyle.span}>Curr Price</span>
                <span style={HoldingStyle.span}>Curr Value</span>
                <span style={HoldingStyle.span}>Price Date</span>
                <span style={HoldingStyle.span}>Change</span>
                <span style={HoldingStyle.span}>% Chg.</span>
                <span style={HoldingStyle.percentAnnumWidth}>% / Year</span>
                <span style={HoldingStyle.timeHeld}>Time Held</span>
                <span style={HoldingStyle.deleteSpan}>Del</span>
            </div>
        )
    }
}

