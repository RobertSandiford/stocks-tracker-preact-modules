
import { h, Component } from 'preact'

export default class CurrentHoldingCloseForm extends Component {
    constructor(props) {
        super(props)
        this.holdingComponent = this.props.holdingComponent
        this.holding = this.props.holding

        let sellUnitPrice = roundDp(this.holding.currentUnitPrice,2)

        this.formDefault = {
            quantity : "",
            sellDate : Luxon.local().toFormat(luxonLocalFormat),
            sellUnitPrice : sellUnitPrice,
            sellTotalPrice : "",
            sellCurrency : "USD",
            fees : ""
        }
        this.form = this.formDefault
        //this.form.sellUnitPrice = sellUnitPrice // can do this here instead of in defaults if needed

        this.quantity = createRef()
        this.sellUnitPrice = createRef()
        this.sellTotalPrice = createRef()

        
        this.bindings = {
            prices : {
                items : {
                    quantity : {
                        ref : createRef(),
                        value : (items) => {
                            console.log(items)
                            return roundDp(items.sellTotalPrice.ref.current.value / items.sellUnitPrice.ref.current.value,4)
                        },
                        saveToObj : this.form
                    },
                    sellUnitPrice : {
                        ref : createRef(),
                        value : (items) => {
                            return roundDp(items.sellTotalPrice.ref.current.value / items.quantity.ref.current.value,4)
                        },
                        saveToObj : this.form,
                        lastUpdated : 1
                    },
                    sellTotalPrice : {
                        ref : createRef(),
                        value : (items) => {
                            return roundDp(items.quantity.ref.current.value * items.sellUnitPrice.ref.current.value,2)
                        },
                        saveToObj : this.form
                    }
                },

                //quantity : this.quantity,
                //sellUnitPrice : this.sellUnitPrice,
                //sellTotalPrice : this.sellTotalPrice,

                    /*
        quantity {
            ref : createRef(),
            access : "current.value",
            value : "sellTotalPrice / sellUnitPrice",
        }
        sellUnitPrice {
            ref : createRef(),
            access : "current.value",
            value : "sellTotalPrice / quantity",
        }
        sellTotalPrice {
            ref : createRef(),
            access : "current.value",
            value : "quantity * sellUnitPrice",
        }
            
            sellUnitPrice : createRef(),
            sellTotalPrice : createRef()
        }


        quantity : this.quantity

    }
    sellTotalPrice = quantity * sellUnitPrice

    if one is empty, update when the other 2 are set
    keep updating the one that wasn't set manually

    */

                
                relationship : "sellTotalPrice = quantity * sellUnitPrice"
            }
        }

        
        this.quantityChanged = (event) => {
            console.log("quantity changed")
            let el = event.target
            this.form[el.name] = Number(el.value)
            console.log(this.form)
        }
        this.sellUnitPriceChanged = (event) => {
            console.log("sell unit price changed changed")
            let el = event.target
            this.form[el.name] = Number(el.value)
            console.log(this.form)
        }
        this.sellTotalPriceChanged = (event) => {
            console.log("sell total price changed")
            let el = event.target
            this.form[el.name] = Number(el.value)
            console.log(this.form)
        }
        this.sellDateChanged = (event) => {
            console.log("sell total price changed")
            let el = event.target
            this.form[el.name] = el.value
            console.log(this.form)
        }

        this.saveClose = (event) => {
            event.preventDefault()
            this.uploadClose()
        }
        this.uploadClose = function() {
            let data = {
                _id : this.holding._id,
                ticker : this.holding.ticker,
                close : this.form
            }
            console.log(data)
            this.holdingComponent.holdingsComponent.post(
                "http://localhost:4000/holdings/close/save",
                data,
                (response) => {
                    console.log(response)
                    if (response.status === "OK") {
                        //
                    }
                },
                (error) => {
                    console.log(error)
                })
        }.bind(this)

    }
    componentDidMount() {
        this.runBindings()
    }
    componentDidUpdate() {
        this.runBindings()
    }
    runBindings() {
        console.log("run bindings")

        const understandRelationship = function(relationship) {
            let sides = relationship.split("=")
            sides.map( x => {
                return x.trim()
            })
            let leftSide = sides[0]
            let rightSide = sides[1]
            let rightSideParts = rightSide.split(" ")
        }

        const enoughItemsHaveValues = function(items, activeItemName) {
            let nUnset = 0
            let ret = { }
            for (const [name, item] of Object.entries(items)) {
                if (name != activeItemName) {
                    if (item.ref.current.value === "") {
                        if (++nUnset > 1) return false
                        item.name = name
                        ret.emptyItem = item
                    } else {
                        console.log(ret.oldestItem)
                        if ( ! ret.oldestItem || ! ("lastChanged" in item) || item.lastChanged < ret.oldestItem.lastChanged) {
                            item.name = name
                            ret.oldestItem = item
                        }
                    }
                }
            }
            if (ret.emptyItem) delete ret.oldestItem
            return ret
        }

        for (const [bindingName, binding] of Object.entries(this.bindings)) {
            let items = binding.items
            for (const [itemName, item] of Object.entries(items)) {
                item.ref.current.addEventListener("change", (event) => {
                    let el = event.target
                    item.lastChanged = new Date().getTime();

                    let i = enoughItemsHaveValues(items, itemName)
                     if ( i ) {
                        
                        i = (i.emptyItem || i.oldestItem)
                        let v = i.value(items)
                        i.ref.current.value = v
                        //i.lastChanged = new Date().getTime();
                        //binding.items[i.name].lastChanged = new Date().getTime();

                        // save to other variables
                        if (i.saveTo) i.saveTo = v
                        if (i.saveToObj) i.saveToObj[i.name] = v
                        
                        console.log("ss", this.form, i.saveToObj[i.name])

                    }
                });
            }
        }

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
            <div class="holding-close">
                    <h3>Close</h3>

                    <form>

                        <div>
                            <span>Quantity: </span>
                            <input id="number" name="quantity" ref={this.bindings.prices.items.quantity.ref} type="number" min="0" step="any"
                                defaultValue={this.form.quantity} onChange={this.quantityChanged} />
                        </div>

                        <div>
                            <span>Sell Price (Unit): </span>
                            <input id="sellUnitPrice" name="sellUnitPrice" ref={this.bindings.prices.items.sellUnitPrice.ref} type="number" min="1" step="any"
                                defaultValue={roundDp(this.holding.currentUnitPrice,2)} onChange={this.sellUnitPriceChanged} />
                            <span> Currency: </span>
                            <input type="text" name="sellUnitCurrency"
                                value={this.holding.buyCurrency} disabled />
                        </div>

                        <div>
                            <span>Sell Price (Total): </span>
                            <input id="sellTotalPrice" name="sellTotalPrice" ref={this.bindings.prices.items.sellTotalPrice.ref} type="number" min="1" step="any"
                                defaultValue={this.form.sellTotalPrice} onChange={this.sellTotalPriceChanged} />
                            <span> Currency: </span>
                            <input type="text" name="sellTotalCurrency"
                                value={this.holding.buyCurrency} disabled />
                        </div>

                        <div>
                            <span>Sell Date: </span>
                            <input id="sellyDate" name="sellDate" type="datetime-local"
                                defaultValue={this.form.sellDate} onChange={this.sellDateChanged} />
                        </div>

                        {/*<div>
                            <span>Fee: </span>
                            <input id="fees" name="fees"
                                defaultValue={this.form.fees} type="number" onChange={this.inputChanged} />%
                        </div>*/}

                        <div>
                            <input type="submit" name="submit" value="Save" onClick={this.saveClose} />
                        </div>

                    </form>
                </div>
        )
    }
}