import { h, Component } from 'preact'
import { Link } from 'preact-router/match'
import { connect as reduxConnect } from 'react-redux'
const dispatchFunction = require('../../redux/dispatcher')
import _ from 'lodash/core'
_.cloneDeep = require('lodash.clonedeep')
import global from '../global'

import CurrentHoldings from '../CurrentHoldings/CurrentHoldings'
import AddHoldingForm from '../AddHoldingForm/AddHoldingForm'

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
        if ( qs.length > 0 && qs.charAt(0) !== "?" ) qs = `?${ qs}`


        console.log("make a get request")
        fetch(url + qs, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            }
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            success(data)
        })
        .catch((error) => {
            failure(error)
        })
    }

    post = (url, data, success, failure) => {
        fetch(url, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            success(data)
        })
        .catch((error) => {
            failure(error)
        })
    }
    

    removeHolding = (_id, event) => {
        event.preventDefault()
        console.log(_id)

        const data = { _id }
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
        )
    }
    
})
