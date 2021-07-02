
import { toPercentage as toPercentage } from './functions'

const spanWidth = 8, controlsWidth = 4, titleWidth = 20, typeWidth = 6, feesWidth = 5, dateWidth = 10, percentAnnumWidth = 10, timeHeldWidth = 10, deleteWidth = 10
const titleNameWidth = 10, titleTickerWidth = 10
const totalWidth = 8* spanWidth + controlsWidth + titleWidth + 3* typeWidth + feesWidth + dateWidth + percentAnnumWidth + timeHeldWidth + deleteWidth
const tablePadding = "0.6vmin"
const totalsPadding = "1vmin"


const inputSize6 = "6vw"
const inputSize8 = "8vw"
const inputSize10 = "10vw"
const inputSize12 = "12vw"
const inputSize20 = "20vw"
const inputSizeFactor = 0.57

export const EditLineStyles = {
    input : {
        boxSizing : "border-box",
        width : (spanWidth * inputSizeFactor) + "vw"
    },
    inputTitle : {
        boxSizing : "border-box",
        width : (titleWidth * inputSizeFactor) + "vw"
    },
    inputTicker : {
        boxSizing : "border-box",
        width : (titleWidth * inputSizeFactor) + "vw"
    },
    inputType : {
        boxSizing : "border-box",
        width : (typeWidth * inputSizeFactor) + "vw"
    },
    inputDate : {
        boxSizing : "border-box",
        width : (dateWidth * inputSizeFactor) + "vw"
    },
    inputFees : {
        boxSizing : "border-box",
        width : (feesWidth * inputSizeFactor) + "vw"
    }
}

export const HoldingStyle = {
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