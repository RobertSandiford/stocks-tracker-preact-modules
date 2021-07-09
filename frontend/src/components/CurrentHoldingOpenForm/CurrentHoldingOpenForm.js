
import { h, Component, createRef } from 'preact'
import { connect as reduxConnect, useSelector, useDispatch } from 'react-redux'
import { gql } from '@apollo/client'
import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'

import { runBindings } from '../bindings'
import { dispatchFunction as reduxDispatchFunction, getStoreItems } from '../../redux/functions'
import graph from '../../graph'
import { roundDp } from '../functions'

LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { })
const luxonLocalFormat = "yyyy-MM-dd'T'HH:mm"

export default reduxConnect(
    state => ({
        apolloClient : state.apolloClient
    }),
    reduxDispatchFunction
)(class CurrentHoldingOpenForm extends Component {
    constructor(props) {
        super(props)
        this.holdingComponent = this.props.holdingComponent
        this.holding = this.props.holding

        //let sellUnitPrice = roundDp(this.holding.currentUnitPrice, 2)

        this.formDefault = {
            quantity : "",
            buyDate : Luxon.local().toFormat(luxonLocalFormat),
            buyUnitPrice : "",
            buyTotalPrice : "",
            buyCurrency : "USD",
            fees : ""
        }
        this.form = this.formDefault
        //this.form.buyUnitPrice = buyUnitPrice // can do this here instead of in defaults if needed

        this.quantity = createRef()
        this.buyUnitPrice = createRef()
        this.buyTotalPrice = createRef()

        
        this.bindings = {
            prices : {
                items : {
                    quantity : {
                        ref : createRef(),
                        value : (items) => {
                            console.log(items)
                            return roundDp(items.buyTotalPrice.ref.current.value / items.buyUnitPrice.ref.current.value, 4)
                        },
                        saveToObj : this.form
                    },
                    buyUnitPrice : {
                        ref : createRef(),
                        value : (items) => {
                            return roundDp(items.buyTotalPrice.ref.current.value / items.quantity.ref.current.value, 4)
                        },
                        saveToObj : this.form,
                        lastUpdated : 1
                    },
                    buyTotalPrice : {
                        ref : createRef(),
                        value : (items) => {
                            return roundDp(items.quantity.ref.current.value * items.buyUnitPrice.ref.current.value, 2)
                        },
                        saveToObj : this.form
                    }
                },

                //relationship : "buyTotalPrice = quantity * buyUnitPrice"
            }
        }

        
        this.quantityChanged = (event) => {
            //console.log("quantity changed")
            const el = event.target
            this.form[el.name] = Number(el.value)
            //console.log(this.form)
        }
        this.buyUnitPriceChanged = (event) => {
            //console.log("buy unit price changed changed")
            const el = event.target
            this.form[el.name] = Number(el.value)
            //console.log(this.form)
        }
        this.buyTotalPriceChanged = (event) => {
            //console.log("buy total price changed")
            const el = event.target
            this.form[el.name] = Number(el.value)
            //console.log(this.form)
        }
        this.buyDateChanged = (event) => {
            //console.log("buy total price changed")
            const el = event.target
            this.form[el.name] = el.value
            //console.log(this.form)
        }

        this.saveOpen = (event) => {
            event.preventDefault()
            this.upload()
        }
        this.upload = function() {
            const data = {
                _id : this.holding._id,
                ticker : this.holding.ticker,
                close : this.form
            }
            //console.log(data)

            const mutation =`mutation AddHoldingOpen {
                addHoldingOpen(
                    user: 1
                    holding_id : "${this.holding._id}"
                    quantity : ${this.form.quantity}
                    buyUnitPrice : ${this.form.buyUnitPrice}
                    buyTotalPrice : ${this.form.buyTotalPrice} 
                    buyDate : "${this.form.buyDate}"
                ) {
                    status
                    reason
                    holding ${graph.Holding}
                }
            }`

            console.log(mutation)

            // load holdings
            this.props.apolloClient.mutate({ mutation: gql(mutation) })
            .then( result => {
                //console.log("graphql", result)
                //console.log("graphql add holding open result", result.data)

                //let r2 = result.data.getHoldings
                //delete r2.status

                // refit this
                //let s = objectWithTheseFields(result.data.addHoldingOpen.holding, ["holdings", "groups", "fx"])

                const holding = result.data.addHoldingOpen.holding

                console.log("update store 2")
                this.props.updateStore('updateHolding', holding)

                //this.props.updateStore(s)
                //this.props.updateStore({ holdings : r.holdings, groups : r.groups, fx : r.fx })
            })


            /*this.holdingComponent.holdingsComponent.post(
                "http://localhost:4000/holdings/open/save",
                data,
                (response) => {
                    console.log(response)
                    if (response.status === "OK") {
                        //
                    }
                },
                (error) => {
                    console.log(error)
                })*/

        }.bind(this)

        this.runBindings = runBindings.bind(this)
    }
    componentDidMount() {
        this.runBindings()
        //runBindings.bind(this)
    }
    componentDidUpdate() {
        this.runBindings()
        //runBindings.bind(this)
    }

    render() {

        /*
        let totals = this.props.totals
        let displayCurrency = "USD"

        let buyValue = totals.buyValue
        let currentValue = totals.currentValue
        let change = totals.change
        let percentageChange = getPercentageChange(buyValue, currentValue)
        //let percentageAnnum = annualisedPercentageChange(buyValue, currentValue)

        let changeType = ( (roundDp(currentValue,2) > roundDp(buyValue,2)) ? "change-grown" : (roundDp(currentValue,2) < roundDp(buyValue,2)) ? 'change-shrunk' : 'change-neutral' )

        buyValue = formatMoney(buyValue)
        currentValue = formatMoney(currentValue)
        change = formatMoney(change)
        percentageChange = formatPercentage(percentageChange)
        */

        return (
            <div class="holding-open">
                <h3>Open</h3>

                <form>

                    <div>
                        <span>Quantity: </span>
                        <input id="number" name="quantity" ref={this.bindings.prices.items.quantity.ref} type="number" min="0" step="any"
                            defaultValue={this.form.quantity} onChange={this.quantityChanged} />
                    </div>

                    <div>
                        <span>Buy Price (Unit): </span>
                        <input id="buyUnitPrice" name="buyUnitPrice" ref={this.bindings.prices.items.buyUnitPrice.ref} type="number" min="1" step="any"
                            defaultValue={this.form.buyUnitPrice} onChange={this.buyUnitPriceChanged} />
                        <span> Currency: </span>
                        <input type="text" name="buyUnitCurrency"
                            value={this.holding.buyCurrency} disabled />
                    </div>

                    <div>
                        <span>Buy Price (Total): </span>
                        <input id="buyTotalPrice" name="buyTotalPrice" ref={this.bindings.prices.items.buyTotalPrice.ref} type="number" min="1" step="any"
                            defaultValue={this.form.buyTotalPrice} onChange={this.buyTotalPriceChanged} />
                        <span> Currency: </span>
                        <input type="text" name="buyTotalCurrency"
                            value={this.holding.buyCurrency} disabled />
                    </div>

                    <div>
                        <span>Buy Date: </span>
                        <input id="buyyDate" name="buyDate" type="datetime-local"
                            defaultValue={this.form.buyDate} onChange={this.buyDateChanged} />
                    </div>

                    {/*<div>
                            <span>Fee: </span>
                            <input id="fees" name="fees"
                                defaultValue={this.form.fees} type="number" onChange={this.inputChanged} />%
                        </div>*/}

                    <div>
                        <input type="submit" name="submit" value="Save" onClick={this.saveOpen} />
                    </div>

                </form>
            </div>
        )
    }
})