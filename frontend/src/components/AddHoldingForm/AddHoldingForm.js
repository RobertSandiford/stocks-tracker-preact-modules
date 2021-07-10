
import { h, Component, createRef } from 'preact'
import { connect as reduxConnect } from 'react-redux'
import { dispatchFunction as reduxDispatchFunction, getStoreItems } from '../../redux/functions'
import { DateTime as Luxon, Settings as LuxonSettings } from 'luxon'
//cloneDeep = require('lodash.clonedeep')

import cloneDeep from 'lodash/cloneDeep'

LuxonSettings.defaultLocale = "en-GB"
const stDateFormat = Object.assign(Luxon.DATE_MED, { })
const luxonLocalFormat = "yyyy-MM-dd'T'HH:mm"

import { roundDp } from '../functions'
import { runBindings } from '../bindings'


export default reduxConnect(
    getStoreItems(['groups']),
    reduxDispatchFunction
)(class AddHoldingForm extends Component {

    constructor(props) {
        super(props)

        console.log("AddHoldingForm props", props)
    }

    state = {
        type : ""
    }

    formDefault = {
        name : "",
        type : "",
        ticker : "",
        priceCurrency : "GBX",
        group : "",
        newGroup : "",
        quantity : "",
        buyDate : Luxon.local().toFormat(luxonLocalFormat),
        buyUnitPrice : "",
        buyTotalPrice : "",
        buyCurrency : "GBP",
        fees : ""
    }

    form = cloneDeep(this.formDefault)

    stockTicker = createRef()
    cryptoTicker = createRef()
    currencyTicker = createRef()
    fundTicker = createRef()
    customTicker = createRef()
    potTicker = createRef()
    tickers = {
        stock : this.stockTicker,
        crypto : this.cryptoTicker,
        currency : this.currencyTicker,
        fund : this.fundTicker,
        custom : this.customTicker,
        pot : this.potTicker,
    }

    quantity = createRef()
    buyUnitPrice = createRef()
    buyTotalPrice = createRef()
    buyUnitCurrency = createRef()
    buyTotalCurrency = createRef()
    group = createRef()
    newGroup = createRef()

    applyProps = props => {
        if (typeof this.state === "undefined") this.state = {}
        this.state.groups = props.groups
    }

    typeChanged = (event) => {
        const el = event.target
        const type = el.value
        console.log(type)
        this.form.type = type
        this.setState({type})
        console.log(type)
        for (const k in this.tickers) {
            //console.log(k)
            if (type != k) {
                this.tickers[k].current.value = ""
            }
        }
    }

    tickerChanged = (event) =>{
        const el = event.target
        const type = el.attributes['data-type'].value
        const ticker = el.value
        this.form.type = type
        this.setState({type})
        this.form.ticker = ticker
        console.log("ticker", this.form.ticker)
        event.target.parentNode.children["asset-type"].checked = true
        for (const k in this.tickers) {
            if (type != k) {
                this.tickers[k].current.value = ""
            }
        }
    }

    inputChanged = (event) => {
        const el = event.target
        //console.log("input changed")
        switch (el.type) {
            case "checkbox":
                this.form[event.target.name] = event.target.checked
                console.log(event.target.name, this.form[event.target.name])
                break
            default:
                this.form[event.target.name] = event.target.value
                console.log(event.target.name, this.form[event.target.name])
                break
        }
    }

    quantityChanged = (event) => {
        const el = event.target
        const q = el.value
        this.form["quantity"] = q
        console.log("quantity", this.form["quantity"])
    }

    buyUnitPriceChanged = (event) => {
        const el = event.target
        const v = el.value
        this.form["buyUnitPrice"] = v
        console.log("buyUnitPrice", this.form["buyUnitPrice"])
    }

    buyTotalPriceChanged = (event) => {
        const el = event.target
        const v = el.value
        this.form["buyTotalPrice"] = v
        console.log("buyTotalPrice", this.form["buyTotalPrice"])
    }

    buyCurrencyChanged = (event) => {
        const el = event.target
        const v = el.value
        this.form["buyCurrency"] = v
        this.buyUnitCurrency.current.value = v
        this.buyTotalCurrency.current.value = v
        console.log("buyCurrency", this.form["buyCurrency"])
    }

    numberBiggerThan0 = (num) => {
        if (num === "" || isNaN(num) || num === 0) return false
        return true
    }
    
    validateHolding = (holding) => {
        if ( holding.type === "" ) { console.log('no asset type'); return false }
        if ( holding.ticker === "" && ! holding.type == "custom" && ! holding.type == "pot" ) {
            console.log('no ticker')
            return false
        }
        if ( holding.priceCurrency === "" ) { console.log('no price currency'); return false }
        if ( ! this.numberBiggerThan0(holding.quantity) ) { console.log('no quantity'); return false }
        if ( ! this.numberBiggerThan0(holding.buyUnitPrice) ) { console.log('no unit price'); return false }
        if ( holding.buyCurrency === "" ) { console.log('no buy currency'); return false }
        if ( holding.buyDate === "" ) { console.log('no buy date'); return false }
        return true
    }

    createGroup = (event) => {
        event.preventDefault()
        const ng = this.newGroup.current.value
        console.log("new group", ng)
        if ( ng !== "" && ! this.state.groups.includes(ng) ) {

            this.form.group = ng
            this.newGroup.current.value = ""

            this.props.updateStore({ groups : [...this.groups, ng] })

            console.log("yes", this.form.group)
        }

    }

    addHolding = (event) => {
        event.preventDefault()
        const holding = cloneDeep(this.form)
        if (holding.type === "") { console.log("setting type to custom"); holding.type = "custom" }
        holding.buyDate += ":00.000+00:00"
        //holding.buyDate += ":00"
        console.log(typeof holding.buyDate, holding.buyDate.name)
        if (this.validateHolding(holding)) {
            this.uploadHolding(holding)
            this.setState({
                form : this.formDefault
            })
        } else {
            console.log("Holding did not pass validation (in React)")
        }
    }

    uploadHolding = (holding) => {
        const data = holding
        data.user = 1
        //data.buyDate += ":00.000+00:00" // fix the date format

        this.props.holdingsComponent.post(
            "http://localhost:4000/holdings/add",
            data,
            (response) => {
                console.log(response)
                this.props.updateStore( "addHolding", response.holding )
            },
            (error) => {
                console.log(error)
            })
    }
    
    standardBindings = {
        prices : {
            items : {

                quantity : {
                    ref : this.quantity,
                    value : (items) => {
                        console.log(items)
                        return roundDp(items.buyTotalPrice.ref.current.value / items.buyUnitPrice.ref.current.value, 4)
                    },
                    saveToObj : this.form
                },

                buyUnitPrice : {
                    ref : this.buyUnitPrice,
                    value : (items) => {
                        return roundDp(items.buyTotalPrice.ref.current.value / items.quantity.ref.current.value, 4)
                    },
                    saveToObj : this.form,
                    lastUpdated : 1
                },

                buyTotalPrice : {
                    ref : this.buyTotalPrice,
                    value : (items) => {
                        return roundDp(items.quantity.ref.current.value * items.buyUnitPrice.ref.current.value, 2)
                    },
                    saveToObj : this.form
                }

            },
        }
    }

    runBindings = runBindings

    componentDidMount() {
        if (this.state.type != "pot") {
            this.bindings = this.standardBindings
            this.runBindings()
        } else {
            //
        }
    }

    componentDidUpdate() {
        if (this.state.type != "pot") {
            this.bindings = this.standardBindings
            this.runBindings()
        } else {
            //
        }
    }

    render() {
        this.applyProps(this.props)

        return (
            <div id="add-holdings">
                <h3>Add Holdings</h3>

                <form>

                    <div>
                        <span>Holding Name: </span>
                        <input id="name" name="name" key="name"
                            defaultValue={this.form.name} onChange={this.inputChanged} />
                    </div>

                    <div>
                        <input type="radio" name="asset-type" value="stock" onChange={this.typeChanged} />
                        <span>Stock Ticker: </span>
                        <input id="stock-ticker" name="ticker" ref={this.stockTicker} placeholder="e.g. TSLA"
                            defaultValue={this.form.ticker} data-type="stock"
                            onFocus={this.tickerFocused} onChange={this.tickerChanged} />
                    </div>

                    <div>
                        <input type="radio" name="asset-type" value="crypto" onChange={this.typeChanged} />
                        <span>Crypto Symbol: </span>
                        <input id="crypto-ticker" name="ticker" ref={this.cryptoTicker} placeholder="e.g. BTC"
                            defaultValue={this.form.ticker} data-type="crypto"
                            onFocus={this.tickerFocused} onChange={this.tickerChanged} />
                    </div>

                    <div>
                        <input type="radio" name="asset-type" value="currency" onChange={this.typeChanged} />
                        <span>Currency Symbol: </span>
                        <input id="currency-ticker" name="ticker" ref={this.currencyTicker} placeholder="e.g. USD"
                            defaultValue={this.form.ticker} data-type="currency"
                            onFocus={this.tickerFocused} onChange={this.tickerChanged} />
                    </div>

                    <div>
                        <input type="radio" name="asset-type" value="fund" onChange={this.typeChanged} />
                        <span>Fund ISIN: </span>
                        <input id="fund-ticker" name="ticker" ref={this.fundTicker} placeholder="e.g. US0004026250"
                            defaultValue={this.form.ticker} data-type="fund"
                            onFocus={this.tickerFocused} onChange={this.tickerChanged} />
                    </div>

                    <div>
                        <input type="radio" name="asset-type" value="custom" onChange={this.typeChanged} />
                        <span>Custom - Tag (optional): </span>
                        <input id="custom-ticker" name="ticker" ref={this.customTicker} placeholder="e.g. Anything"
                            defaultValue={this.form.ticker} data-type="custom"
                            onFocus={this.tickerFocused} onChange={this.tickerChanged} />
                    </div>

                    <div>
                        <input type="radio" name="asset-type" value="pot" onChange={this.typeChanged} />
                        <span>Pot - Tag (optional): </span>
                        <input id="pot-ticker" name="ticker" ref={this.potTicker} placeholder="e.g. Anything"
                            defaultValue={this.form.ticker} data-type="pot"
                            onFocus={this.tickerFocused} onChange={this.tickerChanged} />
                    </div>

                    <div>
                        <span>Priced in: </span>
                        <input name="priceCurrency" defaultValue={this.form.priceCurrency} onChange={this.inputChanged} />
                    </div>

                    <div>
                        <span>Group: </span>
                        <select id="id" name="group" ref={this.group} defaultValue={this.form.group} onChange={this.inputChanged}>
                            <option value="" />
                            { this.state.groups.map( x => {
                                return <option key={x} value={x}>{x}</option>
                            } ) }
                        </select>
                        <input id="newGroup" name="newGroup" ref={this.newGroup}
                            defaultValue={this.form.newGroup} onChange={this.inputChanged} />
                        <button onClick={this.createGroup}>Create</button>
                    </div>

                    { (this.state.type != "pot")

                        ? <div>
                            <div>
                                <span>Quantity: </span>
                                <input id="number" name="quantity" ref={this.quantity} type="number" min="1" step="any"
                                    defaultValue={this.form.quantity} onChange={this.quantityChanged} />
                            </div>

                            <div>
                                <span>Buy Price (Unit): </span>
                                <input id="buyUnitPrice" name="buyUnitPrice" ref={this.buyUnitPrice} type="number" min="1" step="any"
                                    defaultValue={this.form.buyUnitPrice} onChange={this.buyUnitPriceChanged} />
                                <span> Currency: </span>
                                <input type="text" name="buyUnitCurrency" ref={this.buyUnitCurrency}
                                    defaultValue={this.form.buyCurrency} onChange={this.buyCurrencyChanged} />
                            </div>

                            <div>
                                <span>Buy Price (Total): </span>
                                <input id="buyTotalPrice" name="buyTotalPrice" ref={this.buyTotalPrice} type="number" min="1" step="any"
                                    defaultValue={this.form.buyTotalPrice} onChange={this.buyTotalPriceChanged} />
                                <span> Currency: </span>
                                <input type="text" name="buyTotalCurrency" ref={this.buyTotalCurrency}
                                    defaultValue={this.form.buyCurrency} onChange={this.buyCurrencyChanged} />
                            </div>
                        </div>

                        : <div>
                            <span>Buy Price (Total): </span>
                            <input id="buyTotalPrice" name="buyTotalPrice" ref={this.buyTotalPrice} type="number" min="1" step="any"
                                defaultValue={this.form.buyTotalPrice} onChange={this.buyTotalPriceChanged} />
                            <span> Currency: </span>
                            <input type="text" name="buyTotalCurrency" ref={this.buyTotalCurrency}
                                defaultValue={this.form.buyCurrency} onChange={this.buyCurrencyChanged} />
                        </div>
                    }

                    <div>
                        <span>Buy Date: </span>
                        <input id="buyDate" name="buyDate" type="datetime-local"
                            defaultValue={this.form.buyDate} onChange={this.inputChanged} />
                    </div>

                    <div>
                        <span>Annual fes: </span>
                        <input id="fees" name="fees"
                            defaultValue={this.form.fees} type="number" onChange={this.inputChanged} />%
                    </div>

                    <div>
                        <input type="submit" name="submit" value="Add" onClick={this.addHolding} />
                    </div>

                </form>
            </div>
        )
    }
})
