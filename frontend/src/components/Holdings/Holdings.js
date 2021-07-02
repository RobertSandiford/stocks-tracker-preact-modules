import { h, Component, createRef } from 'preact'
import { Link } from 'preact-router/match'
import { connect as reduxConnect, useSelector, useDispatch } from 'react-redux'
const dispatchFunction = require('../../redux/dispatcher')
import { useQuery, gql, ApolloConsumer } from '@apollo/client';
import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
import _ from 'lodash/core';
_.cloneDeep = require('lodash.clonedeep')
import { addCurrencySign, roundDp } from '../functions';
import * as functions from '../functions'
import global from '../global'

import CurrentHoldings from '../CurrentHoldings/CurrentHoldings'
import HoldingsSorter from '../HoldingsSorter/HoldingsSorter'
import AddHoldingForm from '../AddHoldingForm/AddHoldingForm'

LuxonSettings.defaultLocale = "en-GB"
let stDateFormat = Object.assign(Luxon.DATE_MED, { });
let luxonLocalFormat = "yyyy-MM-dd'T'HH:mm"


export default reduxConnect(
    state => ({
        apolloClient : state.apolloClient,
        groups : state.groups
    }),
    dispatchFunction
)(class Holdings extends Component {

    applyProps = props => {
        if (typeof this.state === "undefined") this.state = {}
        this.state.groups = props.groups
    }

    constructor(props) {
        super(props)
    }

    get = (url, data, success, failure) => {

        // turn data into query string if needed
        let qs = data
        if (typeof data == "object") {
            qs = new URLSearchParams(data).toString()
        }
        // prepend '?' if needed
        if ( qs.length > 0 && qs.charAt(0) !== "?" ) qs = "?" + qs


        console.log("make a get request")
        fetch(url + qs, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(function(response){ 
            return response.json();   
        })
        .then(function(data){ 
            success(data)
        })
        .catch(function(error){
            failure(error)
        })
    }

    post = (url, data, success, failure) => {
        fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(function(response){ 
            return response.json();   
        })
        .then(function(data){ 
            success(data)
        })
        .catch(function(error){
            failure(error)
        })
    }
    

    removeHolding = (_id, event) => {
        event.preventDefault()
        console.log(_id)

        let data = { _id : _id }
        this.post(
            "http://localhost:4000/holdings/remove",
            data,
            (response) => {
                console.log(response)
                if (response.status === "OK") {
                    this.props.updateStore( "removeHoldingById", _id )
                }
            },
            (error) => {
                console.log(error)
            })
    }

    render() {
        console.log("holdings render")

        return (
            <div id="holdings">
                <CurrentHoldings holdingsComponent={this} />
                <AddHoldingForm holdingsComponent={this} />
            </div>
        );
    }
    
})









//import { ReactReduxContext } from 'react-redux'







function getPercentageChange(start, now) {
    return ((now / start) - 1) * 100
}
function annualisedPercentageChange(start, now, y) {
    return (Math.pow(now / start, 1 / y) -1) * 100 //// annual rate calculated as exponential
}





let spanWidth = 8, controlsWidth = 4, titleWidth = 20, typeWidth = 6, feesWidth = 5, dateWidth = 10, percentAnnumWidth = 10, timeHeldWidth = 10, deleteWidth = 10
let titleNameWidth = 10, titleTickerWidth = 10
let totalWidth = 8* spanWidth + controlsWidth + titleWidth + 3* typeWidth + feesWidth + dateWidth + percentAnnumWidth + timeHeldWidth + deleteWidth
function toPercentage(n) {
    return ((n * 100).toFixed(6) + '%')
}


let inputSize6 = "6vw"
let inputSize8 = "8vw"
let inputSize10 = "10vw"
let inputSize12 = "12vw"
let inputSize20 = "20vw"
let inputSizeFactor = 0.57
const editLineStyles = {
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


let tablePadding = "0.6vmin"
let totalsPadding = "1vmin"
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