
import { h, Component } from 'preact'

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